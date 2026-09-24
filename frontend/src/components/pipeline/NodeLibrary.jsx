import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  MessageSquare, 
  Globe, 
  Bell, 
  FileText, 
  Sliders, 
  Calculator, 
  GitFork, 
  Radio, 
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const NODE_CATEGORIES = [
  {
    name: 'DATA SOURCES',
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/30',
    nodes: [
      { type: 'sensorNode', title: 'Turbine Sensor', desc: 'TRB-001 temperature & vibration telemetry', icon: Activity, defaultData: { device: 'TRB-001', metric: 'Temperature', samplingRate: '1s' } },
      { type: 'sensorNode', title: 'Temperature Sensor', desc: 'Industrial floor thermocouple stream', icon: Cpu, defaultData: { device: 'TRB-002', metric: 'Temperature', samplingRate: '2s' } },
      { type: 'sensorNode', title: 'Pressure Sensor', desc: 'Hydraulic unit PSI transmitter', icon: Activity, defaultData: { device: 'PRS-001', metric: 'Pressure', samplingRate: '500ms' } },
      { type: 'sensorNode', title: 'Vibration Sensor', desc: 'Gearbox tri-axial accelerometer', icon: Activity, defaultData: { device: 'VIB-001', metric: 'Vibration', samplingRate: '200ms' } },
      { type: 'sensorNode', title: 'MQTT Source', desc: 'External MQTT broker topic subscriber', icon: Radio, defaultData: { device: 'MQTT-Broker', metric: 'Payload', samplingRate: 'Event-driven' } },
      { type: 'sensorNode', title: 'WebSocket Source', desc: 'Real-time WebSocket data stream', icon: Radio, defaultData: { device: 'WS-Gateway', metric: 'JSON Stream', samplingRate: 'Streaming' } }
    ]
  },
  {
    name: 'PROCESSING',
    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/30',
    nodes: [
      { type: 'movingAverageNode', title: 'Moving Average', desc: 'Calculates rolling window average', icon: TrendingUp, defaultData: { config: { windowSize: 10, algorithm: 'Simple Moving Average (SMA)' } } },
      { type: 'filterNode', title: 'Filter', desc: 'High-pass / Low-pass signal noise filter', icon: Sliders, defaultData: { config: { mode: 'High-Pass', cutoff: 5.0 } } },
      { type: 'mathNode', title: 'Mathematical Operation', desc: 'Scaling, multiplication & offsets', icon: Calculator, defaultData: { config: { operation: 'Multiply (*)', factor: 1.8 } } },
      { type: 'movingAverageNode', title: 'Aggregate', desc: 'Min / Max / Mean sliding window', icon: TrendingUp, defaultData: { config: { windowSize: 5, algorithm: 'Exponential Moving Average (EMA)' } } },
      { type: 'movingAverageNode', title: 'Normalize', desc: 'Scales raw values to 0.0 - 1.0 range', icon: Sliders, defaultData: { config: { min: 0, max: 100 } } }
    ]
  },
  {
    name: 'RULE / CONDITION',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/30',
    nodes: [
      { type: 'thresholdNode', title: 'Threshold', desc: 'Numerical boundary comparison check', icon: ShieldAlert, defaultData: { config: { operator: '>', value: 80, hysteresis: 0.5 } } },
      { type: 'conditionNode', title: 'Condition IF-ELSE', desc: 'Evaluates conditional boolean rules', icon: GitFork, defaultData: { config: { logicType: 'IF-ELSE' } } },
      { type: 'conditionNode', title: 'AND Logic', desc: 'Logical AND for multiple streams', icon: GitFork, defaultData: { config: { logicType: 'AND' } } },
      { type: 'conditionNode', title: 'OR Logic', desc: 'Logical OR trigger evaluation', icon: GitFork, defaultData: { config: { logicType: 'OR' } } },
      { type: 'conditionNode', title: 'NOT Invert', desc: 'Inverts incoming boolean state', icon: GitFork, defaultData: { config: { logicType: 'NOT' } } }
    ]
  },
  {
    name: 'ACTION / TRIGGER',
    color: 'border-rose-500/30 text-rose-400 bg-rose-950/30',
    nodes: [
      { type: 'actionNode', title: 'SMS Alert', desc: 'Sends immediate SMS notification', icon: MessageSquare, defaultData: { actionType: 'SMS', config: { phone: '+91 98765 43210', message: 'High turbine temperature detected exceeding limit!' } } },
      { type: 'actionNode', title: 'Email Alert', desc: 'Dispatches HTML email report', icon: FileText, defaultData: { actionType: 'Email', config: { recipient: 'maintenance@factory.com', subject: 'IoT Telemetry Warning' } } },
      { type: 'actionNode', title: 'Webhook', desc: 'HTTP POST JSON to REST endpoint', icon: Globe, defaultData: { actionType: 'Webhook', config: { url: 'https://hooks.factory-iot.com/alert' } } },
      { type: 'actionNode', title: 'Notification', desc: 'Triggers in-app system alert banner', icon: Bell, defaultData: { actionType: 'Notification', config: { channel: 'In-App' } } },
      { type: 'actionNode', title: 'Log Event', desc: 'Writes timestamped entry to audit log', icon: FileText, defaultData: { actionType: 'Log', config: { logLevel: 'WARN' } } }
    ]
  }
];

export const NodeLibrary = () => {
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategory = (catName) => {
    setCollapsedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const handleDragStart = (e, nodeItem, categoryName) => {
    const payload = {
      type: nodeItem.type,
      title: nodeItem.title,
      category: categoryName,
      ...nodeItem.defaultData
    };
    e.dataTransfer.setData('application/reactflow', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-2">
          Node Library
        </h3>
        <p className="text-[11px] text-slate-400 mb-3">
          Drag nodes onto the canvas to construct rule pipelines.
        </p>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {NODE_CATEGORIES.map((cat) => {
          const isCollapsed = collapsedCategories[cat.name];
          const filteredNodes = cat.nodes.filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.desc.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredNodes.length === 0 && search) return null;

          return (
            <div key={cat.name} className="space-y-1.5">
              <button
                onClick={() => toggleCategory(cat.name)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${cat.color}`}
              >
                <span>{cat.name} ({filteredNodes.length})</span>
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {!isCollapsed && (
                <div className="space-y-1.5 pl-1">
                  {filteredNodes.map((n, idx) => {
                    const NodeIcon = n.icon;
                    return (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, n, cat.name)}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-grab active:cursor-grabbing transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-slate-900 border border-slate-700 group-hover:border-cyan-500/40 text-slate-300 group-hover:text-cyan-400 transition-colors">
                            <NodeIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                            {n.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          {n.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
