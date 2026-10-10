const alertService = require('../services/alerts/alertService');
const { NotFoundError } = require('../utils/errors');

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getAlerts(req.query);
    res.json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
};

const resolveAlert = async (req, res, next) => {
  try {
    const resolved = await alertService.resolveAlert(req.params.id);
    if (!resolved) throw new NotFoundError('Alert not found');
    res.json({ success: true, data: resolved });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAlerts,
  resolveAlert
};
