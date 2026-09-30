const Pipeline = require('../../models/Pipeline');
const pipelineExecutor = require('../compiler/pipelineExecutor');
const connectionManager = require('../websocket/connectionManager');
const { validateGraph } = require('../compiler/graphCompiler');

const DEMO_SEED_PIPELINE = {
  _id: '65b8a5fe20f2491b9639e4b1',
  id: '65b8a5fe20f2491b9639e4b1',
  name: 'Turbine Temperature Monitor',
  description: 'Monitors turbine sensor temperature, calculates 10-sample moving average, checks >80°C threshold, and sends SMS alert.',
  status: 'running',
  version: 1,
  lastRun: '2 min ago',
  nodes: [
    {
      id: 'node-sensor-1',
      type: 'sensorNode',
      position: { x: 80, y: 150 },
      data: { title: 'Turbine Sensor', category: 'DATA SOURCES', device: 'TRB-001', metric: 'Temperature', samplingRate: '1s' }
    },
    {
      id: 'node-moving-avg-1',
      type: 'movingAverageNode',
      position: { x: 380, y: 150 },
      data: { title: 'Moving Average', category: 'PROCESSING', config: { windowSize: 10 } }
    },
    {
      id: 'node-threshold-1',
      type: 'thresholdNode',
      position: { x: 680, y: 150 },
      data: { title: 'Threshold', category: 'PROCESSING', config: { operator: '>', value: 80 } }
    },
    {
      id: 'node-sms-alert-1',
      type: 'actionNode',
      position: { x: 980, y: 150 },
      data: { title: 'SMS Alert', category: 'ACTIONS', actionType: 'SMS', config: { phone: '+91 98765 43210', message: 'High turbine temperature detected above 80°C!' } }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'node-sensor-1', target: 'node-moving-avg-1', animated: true },
    { id: 'e2-3', source: 'node-moving-avg-1', target: 'node-threshold-1', animated: true },
    { id: 'e3-4', source: 'node-threshold-1', target: 'node-sms-alert-1', animated: true }
  ]
};

let memoryPipelines = [DEMO_SEED_PIPELINE];

const pipelineService = {
  getPipelines: async () => {
    try {
      const dbPipelines = await Pipeline.find();
      if (dbPipelines.length > 0) return dbPipelines;
    } catch (err) {}
    return memoryPipelines;
  },

  getPipelineById: async (id) => {
    try {
      const p = await Pipeline.findById(id);
      if (p) return p;
    } catch (err) {}
    return memoryPipelines.find(p => String(p._id) === String(id) || String(p.id) === String(id));
  },

  createPipeline: async (pipelineData) => {
    try {
      return await Pipeline.create(pipelineData);
    } catch (err) {
      const newP = {
        ...pipelineData,
        _id: `pipe_${Date.now()}`,
        id: `pipe_${Date.now()}`,
        status: pipelineData.status || 'draft',
        createdAt: new Date()
      };
      memoryPipelines.push(newP);
      return newP;
    }
  },

  updatePipeline: async (id, updates) => {
    try {
      const updated = await Pipeline.findByIdAndUpdate(id, updates, { new: true });
      if (updated) return updated;
    } catch (err) {}

    const idx = memoryPipelines.findIndex(p => String(p._id) === String(id) || String(p.id) === String(id));
    if (idx >= 0) {
      memoryPipelines[idx] = { ...memoryPipelines[idx], ...updates, updatedAt: new Date() };
      return memoryPipelines[idx];
    }
    return null;
  },

  deletePipeline: async (id) => {
    pipelineExecutor.stopPipeline(id, connectionManager);
    try {
      await Pipeline.findByIdAndDelete(id);
    } catch (err) {
      memoryPipelines = memoryPipelines.filter(p => String(p._id) === String(id) || String(p.id) === String(id));
    }
    return true;
  },

  validatePipelineGraph: (pipelineDoc) => {
    return validateGraph(pipelineDoc.nodes || [], pipelineDoc.edges || []);
  },

  runPipeline: async (id) => {
    const pipelineDoc = await pipelineService.getPipelineById(id);
    if (!pipelineDoc) throw new Error('Pipeline not found');

    const validation = pipelineService.validatePipelineGraph(pipelineDoc);
    if (!validation.valid) {
      throw new Error(`Pipeline validation failed: ${validation.errors.join(' ')}`);
    }

    pipelineExecutor.startPipeline(pipelineDoc, connectionManager);
    await pipelineService.updatePipeline(id, { status: 'running', lastRun: 'Just now' });

    return { ...pipelineDoc, status: 'running' };
  },

  stopPipeline: async (id) => {
    const pipelineDoc = await pipelineService.getPipelineById(id);
    if (!pipelineDoc) throw new Error('Pipeline not found');

    pipelineExecutor.stopPipeline(id, connectionManager);
    await pipelineService.updatePipeline(id, { status: 'stopped' });

    return { ...pipelineDoc, status: 'stopped' };
  }
};

module.exports = pipelineService;
