import React from 'react';
import { Workflow, ArrowRight, Play, Square, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';

export const PipelineStatus = ({ pipelines = [] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between h-full backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-cyan-400" />
              Rule Pipelines Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active streaming evaluation pipelines, nodes & execution state
            </p>
          </div>
          <Link
            to="/pipelines"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/60"
          >
            Manage Pipelines <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {pipelines.slice(0, 4).map((pipe) => {
            const nodesCount = pipe.nodes?.length || 0;
            const nodeTitles = pipe.nodes?.map(n => n.data?.title || n.type) || [];
            const flowPath = nodeTitles.join(' → ');
            const isRunning = pipe.status === 'Running';

            return (
              <div
                key={pipe.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-100">{pipe.name}</span>
                      <Badge status={pipe.status}>{pipe.status}</Badge>
                    </div>
                    {pipe.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {pipe.description}
                      </p>
                    )}
                  </div>

                  <Link
                    to={`/pipelines/${pipe.id}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors shrink-0"
                  >
                    Open Editor
                  </Link>
                </div>

                {/* Nodes Breakdown & Flow Path */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 overflow-hidden truncate">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[10px] font-bold shrink-0 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {nodesCount} Nodes
                    </span>
                    <span className="truncate text-slate-300 text-[11px]">
                      {flowPath || 'Sensor → Moving Avg → Threshold → SMS Alert'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 shrink-0">
                    Last execution: <span className="text-slate-300">{pipe.lastRun || '2 min ago'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
