import React, { useState, useEffect } from 'react';
import { Settings2, X, Check, Trash2, Copy } from 'lucide-react';
import { Button } from '../common/Button';

export const NodeConfigPanel = ({ selectedNode, onUpdateNode, onDeleteNode, onDuplicateNode, onClose }) => {
  const [title, setTitle] = useState('');
  
  // Turbine / Sensor fields
  const [device, setDevice] = useState('TRB-001');
  const [metric, setMetric] = useState('Temperature');
  const [samplingRate, setSamplingRate] = useState('1s');

  // Moving Average fields
  const [windowSize, setWindowSize] = useState(10);
  const [algorithm, setAlgorithm] = useState('Simple Moving Average (SMA)');

  // Threshold fields
  const [operator, setOperator] = useState('>');
  const [thresholdValue, setThresholdValue] = useState(80);
  const [hysteresis, setHysteresis] = useState(0.5);

  // SMS Alert / Action fields
  const [phone, setPhone] = useState('+91 98765 43210');
  const [message, setMessage] = useState('High turbine temperature detected exceeding 80°C!');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.factory-iot.com/alert');

  // Logic & Math fields
  const [logicType, setLogicType] = useState('AND');
  const [mathOp, setMathOp] = useState('Multiply (*)');
  const [mathFactor, setMathFactor] = useState(1.8);

  useEffect(() => {
    if (selectedNode) {
      const d = selectedNode.data || {};
      setTitle(d.title || '');
      setDevice(d.device || 'TRB-001');
      setMetric(d.metric || 'Temperature');
      setSamplingRate(d.samplingRate || '1s');
      
      setWindowSize(d.config?.windowSize ?? 10);
      setAlgorithm(d.config?.algorithm || 'Simple Moving Average (SMA)');
      
      setOperator(d.config?.operator || '>');
      setThresholdValue(d.config?.value ?? 80);
      setHysteresis(d.config?.hysteresis ?? 0.5);

      setPhone(d.config?.phone || '+91 98765 43210');
      setMessage(d.config?.message || 'High turbine temperature detected exceeding 80°C!');
      setWebhookUrl(d.config?.url || 'https://hooks.factory-iot.com/alert');

      setLogicType(d.config?.logicType || 'AND');
      setMathOp(d.config?.operation || 'Multiply (*)');
      setMathFactor(d.config?.factor ?? 1.8);
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const type = selectedNode.type;
  const isSensor = type === 'sensorNode';
  const isMovingAverage = type === 'movingAverageNode';
  const isThreshold = type === 'thresholdNode';
  const isAction = type === 'actionNode';
  const isMath = type === 'mathNode';
  const isCondition = type === 'conditionNode';

  const handleApply = (e) => {
    e.preventDefault();

    const updatedData = {
      ...selectedNode.data,
      title,
      device,
      metric,
      samplingRate,
      config: {
        ...(selectedNode.data?.config || {}),
        windowSize: Number(windowSize),
        algorithm,
        operator,
        value: Number(thresholdValue),
        hysteresis: Number(hysteresis),
        phone,
        message,
        url: webhookUrl,
        logicType,
        operation: mathOp,
        factor: Number(mathFactor)
      }
    };

    onUpdateNode(selectedNode.id, updatedData);
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl select-none z-10">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Configure Node
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Node Label</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-semibold"
          />
        </div>

        {/* 1. Turbine Sensor / Data Source Configuration */}
        {isSensor && (
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Sensor Configuration
            </h4>
            
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Device ID</label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              >
                <option value="TRB-001">TRB-001 (Turbine Sensor #01)</option>
                <option value="TRB-002">TRB-002 (Turbine Sensor #02)</option>
                <option value="TRB-003">TRB-003 (Turbine Sensor #03)</option>
                <option value="PRS-001">PRS-001 (Pressure Sensor #01)</option>
                <option value="VIB-001">VIB-001 (Vibration Sensor #01)</option>
                <option value="RPM-001">RPM-001 (Main Shaft Tachometer)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Telemetry Metric</label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="Temperature">Temperature (°C)</option>
                <option value="Pressure">Pressure (PSI)</option>
                <option value="Vibration">Vibration (mm/s)</option>
                <option value="RPM">Rotational Speed (RPM)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Sampling Rate</label>
              <input
                type="text"
                value={samplingRate}
                onChange={(e) => setSamplingRate(e.target.value)}
                placeholder="e.g. 1s, 500ms"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>
        )}

        {/* 2. Moving Average Configuration */}
        {isMovingAverage && (
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Moving Average Configuration
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Window Size (Samples)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={windowSize}
                onChange={(e) => setWindowSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Smoothing Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="Simple Moving Average (SMA)">Simple Moving Average (SMA)</option>
                <option value="Exponential Moving Average (EMA)">Exponential Moving Average (EMA)</option>
                <option value="Weighted Moving Average (WMA)">Weighted Moving Average (WMA)</option>
              </select>
            </div>
          </div>
        )}

        {/* 3. Threshold Configuration */}
        {isThreshold && (
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Threshold Condition Configuration
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Comparison Operator</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              >
                <option value=">">Greater than (&gt;)</option>
                <option value=">=">Greater than or equal (&gt;=)</option>
                <option value="<">Less than (&lt;)</option>
                <option value="<=">Less than or equal (&lt;=)</option>
                <option value="==">Equal to (==)</option>
                <option value="!=">Not equal to (!=)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Threshold Value</label>
              <input
                type="number"
                step="0.1"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hysteresis Buffer Tolerance</label>
              <input
                type="number"
                step="0.1"
                value={hysteresis}
                onChange={(e) => setHysteresis(e.target.value)}
                placeholder="e.g. 0.5"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Prevents alert chatter around limit boundary.
              </span>
            </div>
          </div>
        )}

        {/* 4. Action / SMS Alert Configuration */}
        {isAction && (
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider">
              Action / Trigger Configuration
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Recipient Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Message Template</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Webhook URL (Optional)</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.factory-iot.com/alert"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {/* Math Node Configuration */}
        {isMath && (
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Math Calculation Configuration
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Math Operator</label>
              <select
                value={mathOp}
                onChange={(e) => setMathOp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="Multiply (*)">Multiply (*)</option>
                <option value="Add (+)">Add (+)</option>
                <option value="Subtract (-)">Subtract (-)</option>
                <option value="Divide (/)">Divide (/)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Scaling Factor</label>
              <input
                type="number"
                step="0.1"
                value={mathFactor}
                onChange={(e) => setMathFactor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>
        )}

        {/* Condition Node Configuration */}
        {isCondition && (
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Logic Gate Configuration
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Logic Gate Type</label>
              <select
                value={logicType}
                onChange={(e) => setLogicType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none font-mono"
              >
                <option value="AND">AND (All true)</option>
                <option value="OR">OR (Any true)</option>
                <option value="NOT">NOT (Invert boolean)</option>
                <option value="IF-ELSE">IF-ELSE Branch</option>
              </select>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Button type="submit" variant="primary" size="md" className="w-full" icon={Check}>
            Apply Configuration
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              icon={Copy}
              onClick={() => onDuplicateNode && onDuplicateNode(selectedNode.id)}
            >
              Duplicate
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="flex-1"
              icon={Trash2}
              onClick={() => onDeleteNode && onDeleteNode(selectedNode.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
