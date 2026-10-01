const { map, filter, scan, tap } = require('rxjs/operators');
const logger = require('../../utils/logger');

// Node Registry defining valid node operators and RxJS transformations
const nodeRegistry = {
  sensorNode: {
    type: 'sensorNode',
    category: 'DATA SOURCES',
    validate: (data) => {
      if (!data?.device && !data?.deviceId) return 'Sensor node requires a deviceId/device target.';
      return null;
    },
    transform: (data) => {
      const targetDevice = data.device || data.deviceId || 'TRB-001';
      const metricKey = (data.metric || 'temperature').toLowerCase();

      return filter(event => {
        if (!event || !event.deviceId) return false;
        return event.deviceId === targetDevice;
      });
    }
  },

  movingAverageNode: {
    type: 'movingAverageNode',
    category: 'PROCESSING',
    validate: (data) => {
      const size = data?.config?.windowSize ?? data?.windowSize;
      if (size !== undefined && (size <= 0 || isNaN(size))) return 'Moving Average requires windowSize > 0.';
      return null;
    },
    transform: (data) => {
      const windowSize = parseInt(data?.config?.windowSize ?? data?.windowSize ?? 10, 10);
      const buffer = [];

      return map(event => {
        const val = event.value !== undefined ? event.value : (event.temperature || 0);
        buffer.push(val);
        if (buffer.length > windowSize) {
          buffer.shift();
        }
        const avg = buffer.reduce((acc, curr) => acc + curr, 0) / buffer.length;
        return {
          ...event,
          value: parseFloat(avg.toFixed(2)),
          movingAverage: parseFloat(avg.toFixed(2)),
          windowSize
        };
      });
    }
  },

  filterNode: {
    type: 'filterNode',
    category: 'PROCESSING',
    validate: (data) => null,
    transform: (data) => {
      const mode = data?.config?.mode || 'High-Pass';
      const cutoff = parseFloat(data?.config?.cutoff ?? 5.0);

      return filter(event => {
        const val = event.value !== undefined ? event.value : (event.vibration || event.temperature || 0);
        if (mode === 'High-Pass') return val >= cutoff;
        if (mode === 'Low-Pass') return val <= cutoff;
        return true;
      });
    }
  },

  thresholdNode: {
    type: 'thresholdNode',
    category: 'PROCESSING',
    validate: (data) => {
      const val = data?.config?.value ?? data?.value;
      if (val === undefined || isNaN(val)) return 'Threshold node requires a numeric boundary value.';
      return null;
    },
    transform: (data) => {
      const operator = data?.config?.operator || data?.operator || '>';
      const thresholdVal = parseFloat(data?.config?.value ?? data?.value ?? 80);

      return filter(event => {
        const currentVal = event.value !== undefined ? event.value : (event.temperature || 0);
        let matched = false;

        switch (operator) {
          case '>': matched = currentVal > thresholdVal; break;
          case '>=': matched = currentVal >= thresholdVal; break;
          case '<': matched = currentVal < thresholdVal; break;
          case '<=': matched = currentVal <= thresholdVal; break;
          case '==': matched = currentVal === thresholdVal; break;
          case '!=': matched = currentVal !== thresholdVal; break;
          default: matched = currentVal > thresholdVal; break;
        }

        return matched;
      });
    }
  },

  mathNode: {
    type: 'mathNode',
    category: 'PROCESSING',
    validate: (data) => null,
    transform: (data) => {
      const op = data?.config?.operation || 'Multiply (*)';
      const factor = parseFloat(data?.config?.factor ?? 1.8);

      return map(event => {
        let val = event.value !== undefined ? event.value : (event.temperature || 0);
        if (op.includes('*')) val = val * factor;
        else if (op.includes('+')) val = val + factor;
        else if (op.includes('-')) val = val - factor;
        else if (op.includes('/') && factor !== 0) val = val / factor;

        return {
          ...event,
          value: parseFloat(val.toFixed(2))
        };
      });
    }
  },

  conditionNode: {
    type: 'conditionNode',
    category: 'LOGIC',
    validate: (data) => null,
    transform: (data) => {
      const logicType = data?.config?.logicType || 'AND';
      return map(event => ({
        ...event,
        conditionMatched: true,
        logicType
      }));
    }
  },

  actionNode: {
    type: 'actionNode',
    category: 'ACTIONS',
    validate: (data) => {
      if (data?.actionType === 'SMS' && !data?.config?.phone && !data?.phone) {
        return 'SMS Alert node requires a recipient phone number.';
      }
      return null;
    },
    transform: (data, actionHandlers = {}) => {
      const actionType = data?.actionType || 'SMS';

      return tap(async (event) => {
        logger.info({ actionType, event }, `Rule Pipeline Triggered Action: ${actionType}`);
        if (actionHandlers[actionType]) {
          await actionHandlers[actionType](data, event);
        }
      });
    }
  }
};

// Aliases mapping frontend shorthand type names to backend definitions
const ALIASES = {
  sensor: 'sensorNode',
  movingAverage: 'movingAverageNode',
  filter: 'filterNode',
  threshold: 'thresholdNode',
  math: 'mathNode',
  condition: 'conditionNode',
  smsAlert: 'actionNode',
  webhook: 'actionNode',
  notification: 'actionNode',
  logEvent: 'actionNode',
  emailAlert: 'actionNode'
};

const getNodeDefinition = (type) => {
  const resolvedType = ALIASES[type] || type;
  return nodeRegistry[resolvedType] || null;
};

module.exports = {
  nodeRegistry,
  getNodeDefinition
};
