import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Cpu, MapPin, Tag, FileText } from 'lucide-react';

export const AddDeviceModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    type: 'Temperature Sensor',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    onAdd({
      ...formData,
      id: formData.id || `DEV-${Math.floor(100 + Math.random() * 900)}`,
      temperature: 75.0,
      pressure: 42.0,
      vibration: 2.0,
      rpm: 3200
    });

    setFormData({
      name: '',
      id: '',
      type: 'Temperature Sensor',
      location: '',
      description: ''
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New IoT Device" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Device Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Turbine Sensor #04"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Device ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. TRB-004"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Device Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none transition-all"
            >
              <option value="Temperature Sensor">Temperature Sensor</option>
              <option value="Vibration Sensor">Vibration Sensor</option>
              <option value="Pressure Sensor">Pressure Sensor</option>
              <option value="RPM Sensor">RPM Sensor</option>
              <option value="Multi-Metric Unit">Multi-Metric Unit</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Factory Location *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Factory Floor C - Line 2"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows="3"
            placeholder="Additional notes about telemetry parameters and maintenance schedule..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Register Device
          </Button>
        </div>
      </form>
    </Modal>
  );
};
