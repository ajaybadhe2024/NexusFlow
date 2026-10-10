import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Search, Trash2 } from 'lucide-react';
import { alertService } from '../services/alertService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { Modal } from '../components/common/Modal';

export const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const loadAlerts = () => {
    setAlerts(alertService.getAlerts());
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = (id) => {
    alertService.resolveAlert(id);
    loadAlerts();
    setToastMessage('Alert marked as resolved.');
  };

  const handleConfirmClearAll = () => {
    alertService.clearAll();
    loadAlerts();
    setIsClearModalOpen(false);
    setToastMessage('Cleared all telemetry alert history.');
  };

  const filteredAlerts = alerts.filter(a => {
    // 1. Severity / Status Tab Filter
    let matchesTab = true;
    if (filterSeverity === 'resolved') {
      matchesTab = a.status.toLowerCase() === 'resolved';
    } else if (filterSeverity !== 'all') {
      matchesTab = a.severity.toLowerCase() === filterSeverity.toLowerCase();
    }

    // 2. Search Query Filter (title, device, deviceId, message)
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.device && a.device.toLowerCase().includes(q)) ||
      (a.deviceId && a.deviceId.toLowerCase().includes(q)) ||
      (a.message && a.message.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-amber-400" /> System & Telemetry Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time rule engine notifications, threshold violations, and device health warnings.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={Trash2} onClick={() => setIsClearModalOpen(true)}>
          Clear History
        </Button>
      </div>

      {/* Toolbar: Search Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        {/* Requirement 2: Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by title, device, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Requirement 1: Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {['all', 'critical', 'warning', 'info', 'resolved'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement 5 & 6: Alerts Table & Empty State */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Title / Event</th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Message</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 px-4">
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <Bell className="w-8 h-8 opacity-40" />
                      <p className="text-xs font-mono font-bold text-slate-400">
                        No alerts match the selected filter criteria.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Try adjusting your search query or selecting a different severity filter tab.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => {
                  const isCritical = a.severity === 'Critical';
                  const isWarning = a.severity === 'Warning';
                  const isActive = a.status === 'Active';

                  return (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isCritical ? (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                          <Badge status={a.severity}>{a.severity}</Badge>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-100">{a.title}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">{a.device}</td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{a.message}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{a.timestamp}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isActive 
                            ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isActive && (
                          <button
                            onClick={() => handleResolve(a.id)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 ml-auto"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement 4: Clear History Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Confirm Clear Alert History"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to clear all telemetry alert records? This will permanently delete active and resolved alert logs.
          </p>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleConfirmClearAll}>
              Confirm Clear
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
