const axios = require('axios');

// Parse CLI parameters: e.g. --rate=5000 --duration=5
const args = process.argv.slice(2);
let targetRate = 1000;
let durationSec = 5;

args.forEach(arg => {
  if (arg.startsWith('--rate=')) targetRate = parseInt(arg.split('=')[1], 10);
  if (arg.startsWith('--duration=')) durationSec = parseInt(arg.split('=')[1], 10);
});

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000/api/telemetry';

console.log(`====================================================`);
console.log(` NexusFlow High-Throughput Telemetry Ingestion Benchmark `);
console.log(`====================================================`);
console.log(`Target Rate: ${targetRate} events/sec`);
console.log(`Test Duration: ${durationSec} seconds`);
console.log(`Endpoint: ${backendUrl}\n`);

let totalSent = 0;
let totalSuccess = 0;
let totalErrors = 0;
let latencies = [];

const deviceIds = ['TRB-001', 'TRB-002', 'TRB-003', 'PRS-001', 'VIB-001'];

const sendEvent = async () => {
  const startTime = Date.now();
  totalSent++;

  const devId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
  const payload = {
    deviceId: devId,
    timestamp: new Date().toISOString(),
    temperature: parseFloat((70 + Math.random() * 20).toFixed(1)),
    pressure: parseFloat((40 + Math.random() * 10).toFixed(1)),
    vibration: parseFloat((1 + Math.random() * 5).toFixed(2)),
    rpm: 3000 + Math.floor(Math.random() * 500)
  };

  try {
    await axios.post(backendUrl, payload, { timeout: 2000 });
    const latency = Date.now() - startTime;
    latencies.push(latency);
    totalSuccess++;
  } catch (err) {
    totalErrors++;
  }
};

const runBenchmark = async () => {
  const startTime = Date.now();
  const intervalMs = Math.max(1, Math.floor(1000 / (targetRate / 50))); // Send in concurrent mini-batches

  const interval = setInterval(() => {
    const elapsedSec = (Date.now() - startTime) / 1000;
    if (elapsedSec >= durationSec) {
      clearInterval(interval);
      setTimeout(printReport, 1000, startTime);
      return;
    }

    // Dispatch batch
    const batchSize = Math.ceil(targetRate / 50);
    for (let i = 0; i < batchSize; i++) {
      sendEvent();
    }
  }, intervalMs);
};

const printReport = (startTime) => {
  const totalDurationSec = (Date.now() - startTime) / 1000;
  const actualThroughput = (totalSuccess / totalDurationSec).toFixed(2);
  const avgLatency = latencies.length
    ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)
    : 0;

  console.log(`------------------- TEST REPORT -------------------`);
  console.log(`Total Time Elapsed : ${totalDurationSec.toFixed(2)} s`);
  console.log(`Total Events Sent  : ${totalSent}`);
  console.log(`Successful Ingests : ${totalSuccess}`);
  console.log(`Failed Ingests     : ${totalErrors}`);
  console.log(`Avg Request Latency: ${avgLatency} ms`);
  console.log(`Actual Throughput  : ${actualThroughput} events/sec`);
  console.log(`---------------------------------------------------\n`);
};

runBenchmark();
