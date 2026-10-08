import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';

export const RecentAlerts = ({ alerts = [], onResolveAlert }) => {
  // Show latest 4-5 alerts
  const recentAlertsList = alerts.slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Recent Telemetry Alerts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest threshold violations and rule engine notifications
            </p>
          </div>
          <Link
            to="/alerts"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/60"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentAlertsList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">
              No recent alerts recorded.
            </div>
          ) : (
            recentAlertsList.map((alert) => {
              const isCritical = alert.severity === 'Critical';
              const isWarning = alert.severity === 'Warning';
              const isActive = alert.status === 'Active';

              return (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="mt-0.5 shrink-0">
                      {isCritical ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Info className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                          {alert.title}
                        </span>
                        <Badge status={alert.severity}>{alert.severity}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-500">
                        <span className="text-cyan-400 font-medium">{alert.device}</span>
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0 self-stretch">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isActive 
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {alert.status}
                    </span>

                    {isActive && onResolveAlert && (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="mt-2 text-[11px] font-medium text-slate-400 hover:text-emerald-400 bg-slate-900 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-800 transition-colors flex items-center gap-1"
                        title="Mark alert as resolved"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
