const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const { validateRequest, telemetryPayloadSchema } = require('../middleware/validationMiddleware');

router.post('/', validateRequest(telemetryPayloadSchema), telemetryController.ingestTelemetry);
router.get('/', telemetryController.getTelemetryHistory);

module.exports = router;
