const { getNodeDefinition } = require('./nodeRegistry');
const { PipelineValidationError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Validates graph nodes and directed edges
 */
const validateGraph = (nodes, edges) => {
  const errors = [];
  const warnings = [];

  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return { valid: false, errors: ['Pipeline graph contains no nodes.'], warnings: [] };
  }

  // 1. Check node types
  nodes.forEach(node => {
    const def = getNodeDefinition(node.type);
    if (!def) {
      errors.push(`Invalid or unregistered node type "${node.type}" on node "${node.id}".`);
    } else {
      const err = def.validate(node.data);
      if (err) errors.push(`Node "${node.data?.title || node.id}": ${err}`);
    }
  });

  // Map incoming and outgoing connections
  const incoming = {};
  const outgoing = {};
  nodes.forEach(n => {
    incoming[n.id] = [];
    outgoing[n.id] = [];
  });

  if (edges && Array.isArray(edges)) {
    edges.forEach(e => {
      if (outgoing[e.source]) outgoing[e.source].push(e.target);
      if (incoming[e.target]) incoming[e.target].push(e.source);
    });
  }

  // 2. Structural connectivity rules
  nodes.forEach(node => {
    const def = getNodeDefinition(node.type);
    const category = def?.category || node.data?.category;

    if (category === 'DATA SOURCES' || node.type === 'sensorNode' || node.type === 'sensor') {
      if (outgoing[node.id].length === 0) {
        errors.push(`Data Source node "${node.data?.title || node.id}" is not connected to any downstream processing node.`);
      }
    } else if (category === 'ACTIONS' || node.type === 'actionNode' || node.type === 'smsAlert') {
      if (incoming[node.id].length === 0) {
        errors.push(`Action node "${node.data?.title || node.id}" is missing an incoming trigger connection.`);
      }
    } else {
      if (incoming[node.id].length === 0) {
        errors.push(`Processing node "${node.data?.title || node.id}" is missing an input connection.`);
      }
      if (outgoing[node.id].length === 0) {
        errors.push(`Processing node "${node.data?.title || node.id}" is missing an output connection.`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Topologically sorts graph nodes to establish deterministic execution order
 */
const sortNodesTopologically = (nodes, edges) => {
  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const inDegree = new Map();
  const adjList = new Map();

  nodes.forEach(n => {
    inDegree.set(n.id, 0);
    adjList.set(n.id, []);
  });

  edges.forEach(e => {
    if (adjList.has(e.source) && inDegree.has(e.target)) {
      adjList.get(e.source).push(e.target);
      inDegree.set(e.target, inDegree.get(e.target) + 1);
    }
  });

  const queue = [];
  inDegree.forEach((degree, id) => {
    if (degree === 0) queue.push(id);
  });

  const sortedNodes = [];
  while (queue.length > 0) {
    const currentId = queue.shift();
    const node = nodeMap.get(currentId);
    if (node) sortedNodes.push(node);

    const neighbors = adjList.get(currentId) || [];
    neighbors.forEach(neighborId => {
      inDegree.set(neighborId, inDegree.get(neighborId) - 1);
      if (inDegree.get(neighborId) === 0) {
        queue.push(neighborId);
      }
    });
  }

  // Fallback to original nodes list if cycle detected
  return sortedNodes.length === nodes.length ? sortedNodes : nodes;
};

/**
 * Compiles a JSON React Flow graph into an executable RxJS pipeline function
 */
const compileGraph = (pipelineJson, actionHandlers = {}) => {
  const { nodes, edges } = pipelineJson;

  const validation = validateGraph(nodes, edges);
  if (!validation.valid) {
    throw new PipelineValidationError('Failed to compile pipeline graph.', validation.errors);
  }

  const sortedNodes = sortNodesTopologically(nodes, edges || []);
  logger.info({ pipelineName: pipelineJson.name, nodeCount: sortedNodes.length }, 'Compiling pipeline graph into RxJS stream handlers...');

  // Map each sorted node to an RxJS operator
  const operators = sortedNodes.map(node => {
    const def = getNodeDefinition(node.type);
    return def.transform(node.data, actionHandlers);
  });

  return (inputStream$) => {
    // Chain operators onto inputStream$
    let current$ = inputStream$;
    operators.forEach(op => {
      current$ = current$.pipe(op);
    });
    return current$;
  };
};

module.exports = {
  validateGraph,
  sortNodesTopologically,
  compileGraph
};
