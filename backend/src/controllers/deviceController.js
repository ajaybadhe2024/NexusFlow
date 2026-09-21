const deviceService = require('../services/devices/deviceService');
const { NotFoundError } = require('../utils/errors');

const getDevices = async (req, res, next) => {
  try {
    const devices = await deviceService.getDevices();
    res.json({ success: true, data: devices });
  } catch (err) {
    next(err);
  }
};

const getDeviceById = async (req, res, next) => {
  try {
    const device = await deviceService.getDeviceById(req.params.id);
    if (!device) throw new NotFoundError('Device not found');
    res.json({ success: true, data: device });
  } catch (err) {
    next(err);
  }
};

const createDevice = async (req, res, next) => {
  try {
    const newDevice = await deviceService.createDevice(req.body);
    res.status(201).json({ success: true, data: newDevice });
  } catch (err) {
    next(err);
  }
};

const updateDevice = async (req, res, next) => {
  try {
    const updated = await deviceService.updateDevice(req.params.id, req.body);
    if (!updated) throw new NotFoundError('Device not found');
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteDevice = async (req, res, next) => {
  try {
    await deviceService.deleteDevice(req.params.id);
    res.json({ success: true, message: 'Device deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
};
