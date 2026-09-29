// Pipeline Graph Validation Utility

export const validatePipelineGraph = (nodes = [], edges = []) => {
  const errors = [];

  if (!nodes || nodes.length === 0) {
    return {
      isValid: false,
      errors: ['Pipeline is empty. Drag and drop nodes onto the canvas to construct a pipeline.']
    };
  }

  // 1. Check for presence of at least one Data Source
  const sourceNodes = nodes.filter(n => 
    n.type === 'sensorNode' || 
    n.data?.category === 'DATA SOURCES'
  );

  if (sourceNodes.length === 0) {
    errors.push('Pipeline must contain at least one Data Source (e.g., Turbine Sensor).');
  }

  // Map incoming and outgoing connections for each node
  const incoming = {};
  const outgoing = {};

  nodes.forEach(n => {
    incoming[n.id] = [];
    outgoing[n.id] = [];
  });

  edges.forEach(e => {
    if (outgoing[e.source]) outgoing[e.source].push(e.target);
    if (incoming[e.target]) incoming[e.target].push(e.source);
  });

  // 2. Connectivity & Node Configuration Inspection
  nodes.forEach(node => {
    const title = node.data?.title || node.type || node.id;
    const category = node.data?.category;

    // Check Data Source connection (must have output connection)
    if (category === 'DATA SOURCES' || node.type === 'sensorNode') {
      if (outgoing[node.id].length === 0) {
        errors.push(`Data Source node "${title}" (${node.id}) is disconnected (missing output connection).`);
      }
      if (!node.data?.device) {
        errors.push(`Data Source node "${title}" requires a valid Device ID.`);
      }
    }

    // Check Processing & Logic nodes (must have both input and output connections)
    if (category === 'PROCESSING' || category === 'RULE / CONDITION' || category === 'LOGIC' || 
        ['movingAverageNode', 'thresholdNode', 'filterNode', 'mathNode', 'conditionNode'].includes(node.type)) {
      if (incoming[node.id].length === 0) {
        errors.push(`Node "${title}" (${node.id}) is missing an incoming input connection.`);
      }
      if (outgoing[node.id].length === 0) {
        errors.push(`Node "${title}" (${node.id}) is missing an outgoing output connection.`);
      }
    }

    // Check Action / Trigger nodes (must have input connection)
    if (category === 'ACTION / TRIGGER' || category === 'ACTIONS' || node.type === 'actionNode') {
      if (incoming[node.id].length === 0) {
        errors.push(`Action node "${title}" (${node.id}) is missing an incoming input connection.`);
      }
    }

    // Node-specific configuration validation rules
    if (node.type === 'thresholdNode' || title.toLowerCase().includes('threshold')) {
      if (node.data?.config?.value === undefined || node.data?.config?.value === null || isNaN(node.data?.config?.value)) {
        errors.push(`Threshold node "${title}" requires a valid numerical boundary value.`);
      }
      if (!node.data?.config?.operator) {
        errors.push(`Threshold node "${title}" requires a comparison operator (e.g. >).`);
      }
    }

    if (node.type === 'movingAverageNode' || title.toLowerCase().includes('moving average')) {
      if (!node.data?.config?.windowSize || node.data?.config?.windowSize <= 0) {
        errors.push(`Moving Average node "${title}" requires a window size greater than 0.`);
      }
      if (!node.data?.config?.algorithm) {
        errors.push(`Moving Average node "${title}" requires a smoothing algorithm selected.`);
      }
    }

    if (node.type === 'actionNode' && (node.data?.actionType === 'SMS' || title.toLowerCase().includes('sms'))) {
      if (!node.data?.config?.phone) {
        errors.push(`SMS Alert node "${title}" requires a recipient phone number.`);
      }
      if (!node.data?.config?.message) {
        errors.push(`SMS Alert node "${title}" requires an alert message template.`);
      }
    }
  });

  // 3. Detect invalid connections (e.g., Data Source directly connecting to another Data Source)
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (sourceNode && targetNode) {
      if ((sourceNode.data?.category === 'DATA SOURCES' || sourceNode.type === 'sensorNode') &&
          (targetNode.data?.category === 'DATA SOURCES' || targetNode.type === 'sensorNode')) {
        errors.push(`Invalid connection: Cannot connect Data Source "${sourceNode.data?.title}" directly to another Data Source "${targetNode.data?.title}".`);
      }

      if ((sourceNode.data?.category === 'ACTION / TRIGGER' || sourceNode.type === 'actionNode') &&
          targetNode) {
        errors.push(`Invalid connection: Action node "${sourceNode.data?.title}" cannot produce outputs to "${targetNode.data?.title}".`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
