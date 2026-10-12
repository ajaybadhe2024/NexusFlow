# NexusFlow Backend – Visual IoT Telemetry & Rule Engine

The backend for **NexusFlow**, an enterprise-grade, no-code IoT telemetry platform and real-time rule engine built with Node.js, Express, MongoDB (Native Time-Series Collections), RxJS, and WebSockets.

---

## 🏗 System Architecture

```
┌───────────────┐
│ IoT Telemetry │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Express API   │
└───────┬───────┘
        │
        ├─────────────────────────┐
        ▼                         ▼
MongoDB Time-Series           RxJS Stream
(telemetries)                     │
                                  ▼
                          Active Pipelines
                                  │
                                  ▼
                            Graph Compiler
                                  │
                  ┌───────────────┼───────────────┐
                  ▼               ▼               ▼
              Processing      Conditions       Actions
                  │               │               │
                  └───────────────┴───────────────┘
                                  │
                                  ▼
                               Alerts
                                  │
                                  ▼
                          WebSocket Server
                                  │
                                  ▼
                            React Frontend
```

---

## 🛠 Technology Stack

- **Runtime & Server**: Node.js, Express.js
- **Database**: MongoDB & Mongoose (Native MongoDB 5.0+ Time-Series Collections for Telemetry)
- **Reactive Engine**: RxJS (Subject, Observables, Pipe operators)
- **Real-Time Messaging**: WebSocket (`ws`)
- **Security & Validation**: JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, `zod`
- **Logging**: Pino structured logging (`pino`, `pino-pretty`)

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection & Time-Series collection setup
│   │   └── env.js               # Centralized environment variable loader
│   ├── controllers/
│   │   ├── alertController.js    # Alert listing & resolution handlers
│   │   ├── authController.js     # User registration, login, & session endpoints
│   │   ├── deviceController.js   # IoT device CRUD handlers
│   │   ├── pipelineController.js # Rule pipeline CRUD, validation & execution triggers
│   │   └── telemetryController.js# Telemetry ingestion & time-series queries
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT bearer authentication
│   │   ├── errorMiddleware.js    # Central JSON error response handler
│   │   ├── rateLimiter.js        # IP rate limiting protection
│   │   └── validationMiddleware.js# Zod schema request validation
│   ├── models/
│   │   ├── Alert.js              # Mongoose Alert schema
│   │   ├── Device.js             # Mongoose Device schema
│   │   ├── Pipeline.js           # Mongoose Pipeline JSON graph schema
│   │   ├── Telemetry.js          # Native Time-Series schema
│   │   └── User.js               # Mongoose User schema with bcrypt
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   ├── authRoutes.js
│   │   ├── deviceRoutes.js
│   │   ├── pipelineRoutes.js
│   │   └── telemetryRoutes.js
│   ├── services/
│   │   ├── actions/
│   │   │   ├── notificationAction.js
│   │   │   ├── smsAction.js      # Mock SMS dispatcher
│   │   │   └── webhookAction.js  # Axios HTTP POST webhook dispatcher
│   │   ├── alerts/
│   │   │   └── alertService.js   # Alert creation & WebSocket broadcaster
│   │   ├── compiler/
│   │   │   ├── graphCompiler.js  # Topo-sort & RxJS pipeline compiler (eval-free)
│   │   │   ├── nodeRegistry.js   # Safe node definitions & RxJS operators
│   │   │   └── pipelineExecutor.js# Active pipeline subscription manager
│   │   ├── devices/
│   │   │   └── deviceService.js
│   │   ├── ingestion/
│   │   │   └── telemetryIngestionService.js # High-throughput batch writer
│   │   ├── mock/
│   │   │   └── telemetrySimulator.js # IoT telemetry & anomaly generator
│   │   ├── pipelines/
│   │   │   └── pipelineService.js
│   │   ├── telemetry/
│   │   │   └── telemetryStream.js    # RxJS Subject stream
│   │   └── websocket/
│   │       ├── connectionManager.js # Client management & ping-pong heartbeat
│   │       └── websocketServer.js   # WS server setup (/ws)
│   ├── utils/
│   │   ├── constants.js
│   │   ├── errors.js
│   │   ├── logger.js
│   │   └── seedDemo.js
│   ├── app.js                   # Express application setup
│   └── server.js                # Server entry point & graceful shutdown
├── tests/
│   ├── compiler.test.js         # Automated graph compiler unit tests
│   └── load/
│       └── telemetry-load-test.js # Benchmark load test script
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexusflow
JWT_SECRET=nexusflow_super_secret_jwt_key_2026_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
TELEMETRY_BATCH_SIZE=500
MAX_PIPELINE_NODES=100
LOG_LEVEL=info
```

---

## 🚀 Quick Start Commands

```bash
# 1. Install Dependencies
npm install

# 2. Seed Demo Data (Admin, Devices, Demo Pipeline, Alerts)
npm run seed

# 3. Start Development Server (REST API + WebSockets + Telemetry Simulator)
npm run dev

# 4. Run Automated Unit Tests
npm test

# 5. Run Benchmark Load Test
npm run load-test
```

---

## 📡 REST API Reference

### Health Check
- `GET /api/health` -> `{ "success": true, "status": "healthy", "database": "connected" }`

### Authentication
- `POST /api/auth/register` -> Register user (`name`, `email`, `password`, `company`)
- `POST /api/auth/login` -> Authenticate user (`email`, `password`)
  - **Demo Credentials**: `admin@nexusflow.com` / `admin123`
- `GET /api/auth/me` -> Get current user profile

### Telemetry Ingestion & Query
- `POST /api/telemetry` -> Ingest high-frequency telemetry JSON:
  ```json
  {
    "deviceId": "TRB-001",
    "timestamp": "2026-09-16T15:00:00.000Z",
    "temperature": 84.5,
    "pressure": 45.2,
    "vibration": 2.1,
    "rpm": 3450
  }
  ```
- `GET /api/telemetry?deviceId=TRB-001&from=...&to=...&limit=100` -> Query time-series telemetry.

### Visual Rule Pipelines
- `GET /api/pipelines` -> List all pipelines
- `POST /api/pipelines` -> Create new visual graph pipeline
- `POST /api/pipelines/:id/validate` -> Validate graph connectivity and parameter rules
- `POST /api/pipelines/:id/run` -> Compile graph into RxJS engine and start running stream
- `POST /api/pipelines/:id/stop` -> Stop RxJS stream and dispose subscription

---

## 🔌 WebSocket Server (`ws://localhost:5000/ws`)

Broadcasts real-time events to connected clients:
- **Live Telemetry**: `{ "type": "telemetry", "data": { "deviceId": "TRB-001", "temperature": 84.5, ... } }`
- **Critical Alerts**: `{ "type": "alert", "data": { "severity": "critical", "message": "...", ... } }`
- **Pipeline Status**: `{ "type": "pipeline_status", "data": { "pipelineId": "...", "status": "running" } }`

---

## 🧩 Graph Compiler & Security Note

The compiler parses React Flow graph JSON into a directed acyclic graph, sorts nodes topologically, and chains pre-defined RxJS operators from the safe `nodeRegistry.js`. **Zero `eval()` or `new Function()` operations are used**, ensuring complete isolation against arbitrary code execution vulnerabilities.
