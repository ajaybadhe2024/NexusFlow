import React, { createContext, useContext, useState, useEffect } from 'react';
import { pipelineService } from '../services/pipelineService';
import { validatePipelineGraph } from '../utils/validation';

const PipelineContext = createContext(null);

export const PipelineProvider = ({ children }) => {
  const [pipelines, setPipelines] = useState([]);
  const [currentPipeline, setCurrentPipeline] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshPipelines = () => {
    const list = pipelineService.getPipelines();
    setPipelines(list);
  };

  useEffect(() => {
    refreshPipelines();
    setLoading(false);
  }, []);

  const savePipeline = (pipelineData) => {
    const saved = pipelineService.savePipeline(pipelineData);
    refreshPipelines();
    if (currentPipeline && currentPipeline.id === saved.id) {
      setCurrentPipeline(saved);
    }
    return saved;
  };

  const runPipeline = (id) => {
    const updated = pipelineService.updatePipelineStatus(id, 'Running');
    refreshPipelines();
    if (currentPipeline && currentPipeline.id === id) {
      setCurrentPipeline(updated);
    }
    return updated;
  };

  const stopPipeline = (id) => {
    const updated = pipelineService.updatePipelineStatus(id, 'Stopped');
    refreshPipelines();
    if (currentPipeline && currentPipeline.id === id) {
      setCurrentPipeline(updated);
    }
    return updated;
  };

  const deletePipeline = (id) => {
    const res = pipelineService.deletePipeline(id);
    refreshPipelines();
    if (currentPipeline && currentPipeline.id === id) {
      setCurrentPipeline(null);
    }
    return res;
  };

  const duplicatePipeline = (id) => {
    const dup = pipelineService.duplicatePipeline(id);
    refreshPipelines();
    return dup;
  };

  const validatePipeline = (nodes, edges) => {
    return validatePipelineGraph(nodes, edges);
  };

  return (
    <PipelineContext.Provider
      value={{
        pipelines,
        currentPipeline,
        setCurrentPipeline,
        loading,
        refreshPipelines,
        savePipeline,
        runPipeline,
        stopPipeline,
        deletePipeline,
        duplicatePipeline,
        validatePipeline
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
