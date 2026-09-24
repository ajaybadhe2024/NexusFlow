// Utility to serialize React Flow canvas state to JSON format and deserialize back

export const serializePipeline = (name, nodes, edges, id = null, description = '') => {
  const cleanNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data
  }));

  const cleanEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || null,
    animated: edge.animated || false
  }));

  return {
    id: id || `pipe_${Date.now()}`,
    name: name || 'Untitled Pipeline',
    description: description || 'Visual IoT processing pipeline',
    version: 1,
    createdAt: new Date().toISOString(),
    nodes: cleanNodes,
    edges: cleanEdges
  };
};

export const deserializePipeline = (pipelineJson) => {
  if (!pipelineJson || !pipelineJson.nodes) {
    return { nodes: [], edges: [] };
  }

  const nodes = pipelineJson.nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position || { x: 100, y: 100 },
    data: n.data || {}
  }));

  const edges = pipelineJson.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    animated: e.animated || false
  }));

  return {
    id: pipelineJson.id,
    name: pipelineJson.name,
    description: pipelineJson.description,
    nodes,
    edges
  };
};
