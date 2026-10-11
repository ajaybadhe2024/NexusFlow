const test = require('node:test');
const assert = require('node:assert/strict');
const { Subject } = require('rxjs');
const { validateGraph, compileGraph, sortNodesTopologically } = require('../src/services/compiler/graphCompiler');

test('Graph Compiler - Validate graph connections', () => {
  const validNodes = [
    { id: '1', type: 'sensorNode', data: { device: 'TRB-001', metric: 'Temperature' } },
    { id: '2', type: 'thresholdNode', data: { config: { operator: '>', value: 80 } } },
    { id: '3', type: 'actionNode', data: { actionType: 'SMS', config: { phone: '+91 9876543210' } } }
  ];
  const validEdges = [
    { source: '1', target: '2' },
    { source: '2', target: '3' }
  ];

  const result = validateGraph(validNodes, validEdges);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('Graph Compiler - Catch disconnected nodes', () => {
  const invalidNodes = [
    { id: '1', type: 'sensorNode', data: { device: 'TRB-001' } },
    { id: '2', type: 'thresholdNode', data: { config: { operator: '>', value: 80 } } }
  ];
  const invalidEdges = []; // Disconnected

  const result = validateGraph(invalidNodes, invalidEdges);
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});

test('Graph Compiler - Compile & Execute RxJS Pipeline', (t, done) => {
  const nodes = [
    { id: 's1', type: 'sensorNode', data: { device: 'TRB-001', metric: 'Temperature' } },
    { id: 't1', type: 'thresholdNode', data: { config: { operator: '>', value: 80 } } },
    { id: 'a1', type: 'actionNode', data: { actionType: 'SMS', config: { phone: '+91 9876543210' } } }
  ];
  const edges = [
    { source: 's1', target: 't1' },
    { source: 't1', target: 'a1' }
  ];

  let actionTriggered = false;
  const actionHandlers = {
    SMS: (data, event) => {
      actionTriggered = true;
      assert.equal(event.deviceId, 'TRB-001');
      assert.equal(event.temperature, 85);
    }
  };

  const compiledFn = compileGraph({ name: 'Test Pipe', nodes, edges }, actionHandlers);
  const inputStream$ = new Subject();
  const output$ = compiledFn(inputStream$);

  output$.subscribe();

  // Non-matching event (75 <= 80)
  inputStream$.next({ deviceId: 'TRB-001', temperature: 75 });
  assert.equal(actionTriggered, false);

  // Matching event (85 > 80)
  inputStream$.next({ deviceId: 'TRB-001', temperature: 85 });
  assert.equal(actionTriggered, true);
});
