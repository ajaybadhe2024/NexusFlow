const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');
const Device = require('../models/Device');
const Pipeline = require('../models/Pipeline');
const Alert = require('../models/Alert');
const logger = require('./logger');

const seedData = async () => {
  await connectDB();

  logger.info('Seeding demo data into MongoDB...');

  // 1. Admin User
  await User.deleteMany({ email: { $in: ['admin@nexusflow.com', 'ajaybadhe2105@gmail.com'] } });
  await User.create({
    name: 'Ajay Badhe',
    email: 'ajaybadhe2105@gmail.com',
    password: '12345678',
    company: 'NexusFlow Automation Ltd.',
    role: 'System Administrator'
  });

  // 2. Demo Devices
  await Device.deleteMany({});
  await Device.insertMany([
    { name: 'Turbine Sensor #01', deviceId: 'TRB-001', type: 'Temperature Sensor', location: 'Factory Floor A', status: 'Online', temperature: 78.4, pressure: 45.2, vibration: 2.1, rpm: 3450 },
    { name: 'Turbine Sensor #02', deviceId: 'TRB-002', type: 'Temperature Sensor', location: 'Factory Floor B', status: 'Warning', temperature: 84.1, pressure: 48.0, vibration: 6.8, rpm: 3620 },
    { name: 'Turbine Sensor #03', deviceId: 'TRB-003', type: 'Vibration Sensor', location: 'Turbine Room 1', status: 'Online', temperature: 72.8, pressure: 41.5, vibration: 4.2, rpm: 3390 },
    { name: 'Pressure Sensor #01', deviceId: 'PRS-001', type: 'Pressure Sensor', location: 'Hydraulic Unit', status: 'Online', temperature: 68.0, pressure: 42.5, vibration: 1.2, rpm: 2900 },
    { name: 'Vibration Sensor #01', deviceId: 'VIB-001', type: 'Vibration Sensor', location: 'Gearbox Alpha', status: 'Online', temperature: 75.1, pressure: 39.8, vibration: 1.8, rpm: 3100 }
  ]);

  // 3. Demo Pipelines
  await Pipeline.deleteMany({});
  await Pipeline.create({
    name: 'Turbine Temperature Monitor',
    description: 'Monitors turbine sensor temperature, calculates 10-sample moving average, checks >80°C threshold, and sends SMS alert.',
    status: 'running',
    nodes: [
      { id: 'node-sensor-1', type: 'sensorNode', data: { title: 'Turbine Sensor', category: 'DATA SOURCES', device: 'TRB-001', metric: 'Temperature' } },
      { id: 'node-moving-avg-1', type: 'movingAverageNode', data: { title: 'Moving Average', category: 'PROCESSING', config: { windowSize: 10 } } },
      { id: 'node-threshold-1', type: 'thresholdNode', data: { title: 'Threshold', category: 'PROCESSING', config: { operator: '>', value: 80 } } },
      { id: 'node-sms-alert-1', type: 'actionNode', data: { title: 'SMS Alert', category: 'ACTIONS', actionType: 'SMS', config: { phone: '+91 98765 43210', message: 'High turbine temperature detected!' } } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-sensor-1', target: 'node-moving-avg-1' },
      { id: 'e2-3', source: 'node-moving-avg-1', target: 'node-threshold-1' },
      { id: 'e3-4', source: 'node-threshold-1', target: 'node-sms-alert-1' }
    ]
  });

  // 4. Demo Alerts
  await Alert.deleteMany({});
  await Alert.create([
    { deviceId: 'TRB-001', device: 'Turbine Sensor #01', severity: 'critical', title: 'HIGH TEMPERATURE', message: 'Temperature reached 86.4°C exceeding safety limit (80°C)', status: 'active' },
    { deviceId: 'TRB-003', device: 'Turbine Sensor #03', severity: 'warning', title: 'VIBRATION ANOMALY', message: 'High vibration amplitude 6.8 mm/s detected', status: 'active' }
  ]);

  logger.info('Database seeded successfully!');
  await disconnectDB();
  process.exit(0);
};

seedData();
