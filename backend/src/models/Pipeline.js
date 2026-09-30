const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: 'Visual IoT processing pipeline' },
  nodes: { type: Array, required: true, default: [] },
  edges: { type: Array, required: true, default: [] },
  status: { type: String, enum: ['draft', 'running', 'stopped', 'error', 'Draft', 'Running', 'Stopped'], default: 'draft' },
  version: { type: Number, default: 1 },
  lastRun: { type: String, default: 'Never' },
  createdBy: { type: String, default: 'usr_admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pipelineSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Pipeline', pipelineSchema);
