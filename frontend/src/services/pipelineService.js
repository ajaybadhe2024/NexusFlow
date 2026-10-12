// Pipeline management service using localStorage and sample demo pipelines

const STORAGE_KEY = 'nexusflow_pipelines';

// Preloaded sample pipeline as described in section 16 & 30
export const DEMO_SAMPLE_PIPELINE = {
  id: 'pipe_demo_01',
  name: 'Turbine Temperature Monitor',
  description: 'Monitors turbine sensor temperature, calculates 10-sample moving average, checks >80°C threshold, and sends SMS alert.',
  status: 'Running',
  version: 1,
  lastRun: '2 min ago',
  createdAt: '2026-09-10T10:00:00.000Z',
  nodes: [
    {
      id: 'node-sensor-1',
      type: 'sensorNode',
      position: { x: 80, y: 150 },
      data: {
        title: 'Turbine Sensor',
        category: 'DATA SOURCES',
        device: 'TRB-001',
        metric: 'Temperature',
        samplingRate: '1s'
      }
    },
    {
      id: 'node-moving-avg-1',
      type: 'movingAverageNode',
      position: { x: 380, y: 150 },
      data: {
        title: 'Moving Average',
        category: 'PROCESSING',
        config: {
          windowSize: 10
        }
      }
    },
    {
      id: 'node-threshold-1',
      type: 'thresholdNode',
      position: { x: 680, y: 150 },
      data: {
        title: 'Threshold',
        category: 'PROCESSING',
        config: {
          operator: '>',
          value: 80
        }
      }
    },
    {
      id: 'node-sms-alert-1',
      type: 'actionNode',
      position: { x: 980, y: 150 },
      data: {
        title: 'SMS Alert',
        category: 'ACTIONS',
        actionType: 'SMS',
        config: {
          phone: '+91 98765 43210',
          message: 'High turbine temperature detected above 80°C!'
        }
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'node-sensor-1', target: 'node-moving-avg-1', animated: true },
    { id: 'e2-3', source: 'node-moving-avg-1', target: 'node-threshold-1', animated: true },
    { id: 'e3-4', source: 'node-threshold-1', target: 'node-sms-alert-1', animated: true }
  ]
};

const INITIAL_PIPELINES = [
  DEMO_SAMPLE_PIPELINE,
  {
    id: 'pipe_demo_02',
    name: 'Vibration Anomaly Detector',
    description: 'Evaluates vibration amplitude spikes from Gearbox Alpha and triggers webhook notification.',
    status: 'Stopped',
    version: 1,
    lastRun: '1 hour ago',
    createdAt: '2026-09-12T14:30:00.000Z',
    nodes: [
      {
        id: 'node-vib-sensor',
        type: 'sensorNode',
        position: { x: 80, y: 150 },
        data: { title: 'Vibration Sensor', category: 'DATA SOURCES', device: 'VIB-001', metric: 'Vibration', samplingRate: '500ms' }
      },
      {
        id: 'node-filter-1',
        type: 'filterNode',
        position: { x: 380, y: 150 },
        data: { title: 'High-Pass Filter', category: 'PROCESSING', config: { cutoff: 5.0, mode: 'High-Pass' } }
      },
      {
        id: 'node-thresh-vib',
        type: 'thresholdNode',
        position: { x: 680, y: 150 },
        data: { title: 'Spike Threshold', category: 'PROCESSING', config: { operator: '>', value: 6.0 } }
      },
      {
        id: 'node-webhook-1',
        type: 'actionNode',
        position: { x: 980, y: 150 },
        data: { title: 'Webhook Alert', category: 'ACTIONS', actionType: 'Webhook', config: { url: 'https://hooks.factory-iot.com/alert' } }
      }
    ],
    edges: [
      { id: 'ev1-2', source: 'node-vib-sensor', target: 'node-filter-1', animated: false },
      { id: 'ev2-3', source: 'node-filter-1', target: 'node-thresh-vib', animated: false },
      { id: 'ev3-4', source: 'node-thresh-vib', target: 'node-webhook-1', animated: false }
    ]
  },
  {
    id: 'pipe_demo_03',
    name: 'Pressure Monitoring System',
    description: 'Hydraulic unit pressure guard with automatic log event.',
    status: 'Running',
    version: 1,
    lastRun: '30 min ago',
    createdAt: '2026-09-14T09:15:00.000Z',
    nodes: [
      {
        id: 'node-press-sensor',
        type: 'sensorNode',
        position: { x: 80, y: 150 },
        data: { title: 'Pressure Sensor', category: 'DATA SOURCES', device: 'PRS-001', metric: 'Pressure', samplingRate: '2s' }
      },
      {
        id: 'node-thresh-press',
        type: 'thresholdNode',
        position: { x: 420, y: 150 },
        data: { title: 'Min Pressure Check', category: 'PROCESSING', config: { operator: '<', value: 30.0 } }
      },
      {
        id: 'node-log-1',
        type: 'actionNode',
        position: { x: 760, y: 150 },
        data: { title: 'System Notification', category: 'ACTIONS', actionType: 'Notification', config: { channel: 'In-App' } }
      }
    ],
    edges: [
      { id: 'ep1-2', source: 'node-press-sensor', target: 'node-thresh-press', animated: true },
      { id: 'ep2-3', source: 'node-thresh-press', target: 'node-log-1', animated: true }
    ]
  }
];

export const pipelineService = {
  getPipelines: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PIPELINES));
      return INITIAL_PIPELINES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PIPELINES;
    }
  },

  getPipelineById: (id) => {
    const pipelines = pipelineService.getPipelines();
    return pipelines.find(p => p.id === id);
  },

  savePipeline: (pipelineData) => {
    const pipelines = pipelineService.getPipelines();
    const existingIndex = pipelines.findIndex(p => p.id === pipelineData.id);

    let updatedList;
    let savedPipeline;

    if (existingIndex >= 0) {
      savedPipeline = {
        ...pipelines[existingIndex],
        ...pipelineData,
        lastRun: 'Just now'
      };
      updatedList = [...pipelines];
      updatedList[existingIndex] = savedPipeline;
    } else {
      savedPipeline = {
        ...pipelineData,
        id: pipelineData.id || `pipe_${Date.now()}`,
        status: pipelineData.status || 'Draft',
        lastRun: 'Never',
        createdAt: new Date().toISOString()
      };
      updatedList = [savedPipeline, ...pipelines];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return savedPipeline;
  },

  updatePipelineStatus: (id, status) => {
    const pipelines = pipelineService.getPipelines();
    const updatedList = pipelines.map(p => {
      if (p.id === id) {
        const animated = status === 'Running';
        const updatedEdges = p.edges.map(e => ({ ...e, animated }));
        return { ...p, status, edges: updatedEdges, lastRun: status === 'Running' ? 'Just now' : p.lastRun };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList.find(p => p.id === id);
  },

  duplicatePipeline: (id) => {
    const pipeline = pipelineService.getPipelineById(id);
    if (!pipeline) return null;

    const dup = {
      ...pipeline,
      id: `pipe_${Date.now()}`,
      name: `${pipeline.name} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString()
    };

    const pipelines = pipelineService.getPipelines();
    const updated = [dup, ...pipelines];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return dup;
  },

  deletePipeline: (id) => {
    const pipelines = pipelineService.getPipelines();
    const filtered = pipelines.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
