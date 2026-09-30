const pipelineService = require('../services/pipelines/pipelineService');
const { NotFoundError, PipelineValidationError } = require('../utils/errors');

const getPipelines = async (req, res, next) => {
  try {
    const pipelines = await pipelineService.getPipelines();
    res.json({ success: true, data: pipelines });
  } catch (err) {
    next(err);
  }
};

const getPipelineById = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.getPipelineById(req.params.id);
    if (!pipeline) throw new NotFoundError('Pipeline not found');
    res.json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const createPipeline = async (req, res, next) => {
  try {
    const newPipeline = await pipelineService.createPipeline(req.body);
    res.status(201).json({ success: true, data: newPipeline });
  } catch (err) {
    next(err);
  }
};

const updatePipeline = async (req, res, next) => {
  try {
    const updated = await pipelineService.updatePipeline(req.params.id, req.body);
    if (!updated) throw new NotFoundError('Pipeline not found');
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

const deletePipeline = async (req, res, next) => {
  try {
    await pipelineService.deletePipeline(req.params.id);
    res.json({ success: true, message: 'Pipeline deleted' });
  } catch (err) {
    next(err);
  }
};

const validatePipeline = async (req, res, next) => {
  try {
    const pipelineDoc = req.body.nodes ? req.body : await pipelineService.getPipelineById(req.params.id);
    if (!pipelineDoc) throw new NotFoundError('Pipeline not found for validation');

    const result = pipelineService.validatePipelineGraph(pipelineDoc);
    res.json({
      success: true,
      data: {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings
      }
    });
  } catch (err) {
    next(err);
  }
};

const runPipeline = async (req, res, next) => {
  try {
    const result = await pipelineService.runPipeline(req.params.id);
    res.json({
      success: true,
      message: 'Pipeline started successfully in RxJS engine.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const stopPipeline = async (req, res, next) => {
  try {
    const result = await pipelineService.stopPipeline(req.params.id);
    res.json({
      success: true,
      message: 'Pipeline stopped successfully.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
  validatePipeline,
  runPipeline,
  stopPipeline
};
