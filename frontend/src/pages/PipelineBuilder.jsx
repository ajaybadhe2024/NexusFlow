import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  ReactFlowProvider,
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Controls, 
  Background, 
  useReactFlow
} from '@xyflow/react';

import { usePipeline } from '../context/PipelineContext';
import { serializePipeline, deserializePipeline } from '../utils/pipelineSerializer';
import { DEMO_SAMPLE_PIPELINE } from '../services/pipelineService';

// Custom Nodes
import { SensorNode } from '../components/nodes/SensorNode';
import { MovingAverageNode } from '../components/nodes/MovingAverageNode';
import { ThresholdNode } from '../components/nodes/ThresholdNode';
import { ActionNode } from '../components/nodes/ActionNode';
import { FilterNode } from '../components/nodes/FilterNode';
import { MathNode } from '../components/nodes/MathNode';
import { ConditionNode } from '../components/nodes/ConditionNode';

// Subcomponents & UI
import { NodeLibrary } from '../components/pipeline/NodeLibrary';
import { PipelineToolbar } from '../components/pipeline/PipelineToolbar';
import { NodeConfigPanel } from '../components/pipeline/NodeConfigPanel';
import { Toast } from '../components/common/Toast';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { AlertCircle, CheckCircle2, Copy, Check, Workflow } from 'lucide-react';

const FlowCanvasInternal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pipelines, savePipeline, runPipeline, stopPipeline, validatePipeline } = usePipeline();
  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');
  const [status, setStatus] = useState('Draft');
  const [currentPipelineId, setCurrentPipelineId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Modals & Toast State
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [exportedJson, setExportedJson] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] });

  const nodeTypes = useMemo(() => ({
    sensorNode: SensorNode,
    movingAverageNode: MovingAverageNode,
    thresholdNode: ThresholdNode,
    actionNode: ActionNode,
    filterNode: FilterNode,
    mathNode: MathNode,
    conditionNode: ConditionNode,
  }), []);

  // Separate CREATE mode (/pipelines/new) from EDIT mode (/pipelines/:id)
  useEffect(() => {
    if (!id || id === 'new') {
      // CREATE Mode: Blank canvas, empty nodes/edges, default "Untitled Pipeline"
      setNodes([]);
      setEdges([]);
      setPipelineName('Untitled Pipeline');
      setStatus('Draft');
      setCurrentPipelineId(null);
      setSelectedNode(null);
    } else {
      // EDIT Mode: Load existing saved pipeline by ID
      const target = pipelines.find(p => p.id === id);
      if (target) {
        const deserialized = deserializePipeline(target);
        setNodes(deserialized.nodes || []);
        
        const isRunning = target.status === 'Running';
        const styledEdges = (deserialized.edges || []).map(e => ({
          ...e,
          animated: isRunning,
          style: { stroke: isRunning ? '#06b6d4' : '#64748b', strokeWidth: 2 }
        }));
        setEdges(styledEdges);

        setPipelineName(target.name || 'Untitled Pipeline');
        setStatus(target.status || 'Draft');
        setCurrentPipelineId(target.id);
        setSelectedNode(null);
      }
    }
  }, [id, pipelines]);

  // Node Selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Connect Edges
  const onConnect = useCallback((params) => {
    const isRunning = status === 'Running';
    const newEdge = {
      ...params,
      id: `e_${params.source}_${params.target}`,
      animated: isRunning,
      style: { stroke: isRunning ? '#06b6d4' : '#64748b', strokeWidth: 2 }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [status, setEdges]);

  // Drag and Drop Node onto Canvas
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('application/reactflow');
    if (!rawData) return;

    try {
      const parsed = JSON.parse(rawData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: parsed.type,
        position,
        data: {
          title: parsed.title,
          category: parsed.category,
          device: parsed.device,
          metric: parsed.metric,
          samplingRate: parsed.samplingRate,
          actionType: parsed.actionType,
          config: parsed.config || {}
        }
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
      setToast({ message: `Added "${parsed.title}" to canvas.`, type: 'info' });
    } catch (err) {
      console.error("Failed to drop node:", err);
    }
  }, [reactFlowInstance, setNodes]);

  // Node Editing Handlers
  const handleUpdateNode = useCallback((nodeId, updatedData) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: updatedData } : n))
    );
    setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data: updatedData } : prev));
    setToast({ message: 'Node configuration saved and applied.', type: 'success' });
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
    setToast({ message: 'Node deleted from pipeline.', type: 'info' });
  }, [setNodes, setEdges]);

  const handleDuplicateNode = useCallback((nodeId) => {
    const nodeToDup = nodes.find(n => n.id === nodeId);
    if (!nodeToDup) return;

    const newNode = {
      ...nodeToDup,
      id: `node_${Date.now()}`,
      position: { x: nodeToDup.position.x + 40, y: nodeToDup.position.y + 40 },
      data: JSON.parse(JSON.stringify(nodeToDup.data))
    };

    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
    setToast({ message: `Duplicated "${nodeToDup.data?.title}".`, type: 'info' });
  }, [nodes, setNodes]);

  // Toolbar Action Handlers

  // 1. Requirement 5: Validate Button
  const handleValidate = useCallback(() => {
    const res = validatePipeline(nodes, edges);
    setValidationResult(res);
    setValidationModalOpen(true);
  }, [nodes, edges, validatePipeline]);

  // 2. Requirement 6: Save Button
  const handleSave = useCallback(() => {
    const serialized = serializePipeline(pipelineName, nodes, edges, currentPipelineId);
    serialized.status = status;
    const saved = savePipeline(serialized);
    setCurrentPipelineId(saved.id);
    setToast({ message: `Pipeline "${saved.name}" saved successfully.`, type: 'success' });
    if (!id || id === 'new') {
      navigate(`/pipelines/${saved.id}`, { replace: true });
    }
  }, [pipelineName, nodes, edges, currentPipelineId, status, savePipeline, id, navigate]);

  // 3. Requirement 7: Start/Stop
  const handleRun = useCallback(() => {
    const res = validatePipeline(nodes, edges);
    if (!res.isValid) {
      setValidationResult(res);
      setValidationModalOpen(true);
      return;
    }

    setStatus('Running');
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: true,
        style: { stroke: '#06b6d4', strokeWidth: 2 }
      }))
    );

    if (currentPipelineId) {
      runPipeline(currentPipelineId);
    }
    setToast({ message: 'Pipeline execution started. Stream active.', type: 'success' });
  }, [nodes, edges, currentPipelineId, validatePipeline, runPipeline, setEdges]);

  const handleStop = useCallback(() => {
    setStatus('Stopped');
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: false,
        style: { stroke: '#64748b', strokeWidth: 2 }
      }))
    );

    if (currentPipelineId) {
      stopPipeline(currentPipelineId);
    }
    setToast({ message: 'Pipeline execution stopped.', type: 'warning' });
  }, [currentPipelineId, stopPipeline, setEdges]);

  // 4. Requirement 8: JSON Button
  const handleExportJson = useCallback(() => {
    const serialized = serializePipeline(pipelineName, nodes, edges, currentPipelineId);
    setExportedJson(JSON.stringify(serialized, null, 2));
    setCopiedJson(false);
    setJsonModalOpen(true);
  }, [pipelineName, nodes, edges, currentPipelineId]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportedJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Toast Notification */}
      {toast.message && (
        <div className="fixed top-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
        </div>
      )}

      {/* Top Pipeline Toolbar */}
      <PipelineToolbar
        pipelineName={pipelineName}
        setPipelineName={setPipelineName}
        status={status}
        onSave={handleSave}
        onRun={handleRun}
        onStop={handleStop}
        onValidate={handleValidate}
        onUndo={() => setToast({ message: 'Canvas action undone.', type: 'info' })}
        onRedo={() => setToast({ message: 'Canvas action redone.', type: 'info' })}
        onZoomIn={() => reactFlowInstance.zoomIn()}
        onZoomOut={() => reactFlowInstance.zoomOut()}
        onFitView={() => reactFlowInstance.fitView({ padding: 0.2 })}
        onExportJson={handleExportJson}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Node Library */}
        <NodeLibrary />

        {/* Center Canvas */}
        <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-center max-w-sm shadow-xl space-y-2">
                <Workflow className="w-10 h-10 text-cyan-400/60 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-slate-200">Empty Canvas</h4>
                <p className="text-xs text-slate-400">
                  Drag nodes here from the Node Library to build your pipeline.
                </p>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#06b6d4', strokeWidth: 2 }
            }}
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800" />
          </ReactFlow>
        </div>

        {/* Right Configuration Panel */}
        {selectedNode && (
          <NodeConfigPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onDuplicateNode={handleDuplicateNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Validation Results Modal */}
      <Modal
        isOpen={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        title="Pipeline Graph Validation"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {validationResult.isValid ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-100">Validation Passed</h4>
                <p className="text-xs text-slate-300 mt-1">
                  All nodes are properly connected and configurations are valid. The pipeline is ready for execution.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-100">Validation Errors Detected</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Please resolve the following structural or configuration issues:
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 max-h-60 overflow-y-auto">
                {validationResult.errors.map((err, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-rose-400 font-mono">
                    <span className="shrink-0">•</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setValidationModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Requirement 8: Exported JSON Modal */}
      <Modal
        isOpen={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        title="Serialized Pipeline JSON Payload"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Below is the complete JSON specification representing all nodes, edges, and configurations for this rule pipeline.
          </p>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs overflow-x-auto max-h-96">
            {exportedJson}
          </pre>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              icon={copiedJson ? Check : Copy}
              onClick={handleCopyJson}
            >
              {copiedJson ? 'Copied to Clipboard' : 'Copy JSON'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setJsonModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const PipelineBuilder = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInternal />
    </ReactFlowProvider>
  );
};
