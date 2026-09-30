const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');

router.get('/', pipelineController.getPipelines);
router.get('/:id', pipelineController.getPipelineById);
router.post('/', pipelineController.createPipeline);
router.put('/:id', pipelineController.updatePipeline);
router.delete('/:id', pipelineController.deletePipeline);
router.post('/:id/validate', pipelineController.validatePipeline);
router.post('/validate', pipelineController.validatePipeline); // For validating drafts before creation
router.post('/:id/run', pipelineController.runPipeline);
router.post('/:id/stop', pipelineController.stopPipeline);

module.exports = router;
