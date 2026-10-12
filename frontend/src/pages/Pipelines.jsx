import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Workflow, Plus, Play, Square, Copy, Trash2, Edit, Search } from 'lucide-react';
import { usePipeline } from '../context/PipelineContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export const Pipelines = () => {
  const { pipelines, runPipeline, stopPipeline, deletePipeline, duplicatePipeline } = usePipeline();
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();

  const handleRun = (id) => {
    runPipeline(id);
    setToastMessage('Pipeline status changed to Running.');
  };

  const handleStop = (id) => {
    stopPipeline(id);
    setToastMessage('Pipeline status changed to Stopped.');
  };

  const handleDelete = (id) => {
    deletePipeline(id);
    setToastMessage('Pipeline deleted.');
  };

  const handleDuplicate = (id) => {
    const dup = duplicatePipeline(id);
    if (dup) {
      setToastMessage(`Duplicated pipeline as "${dup.name}".`);
    }
  };

  const filteredPipelines = pipelines.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Workflow className="w-7 h-7 text-cyan-400" /> Visual Rule Pipelines
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Construct no-code IoT processing graphs, threshold monitors, and automated action triggers.
          </p>
        </div>

        <Link to="/pipelines/new">
          <Button variant="primary" size="md" icon={Plus}>
            Create Pipeline
          </Button>
        </Link>
      </div>

      {/* Toolbar Search */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pipelines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">{filteredPipelines.length} Total Pipelines</span>
      </div>

      {/* Pipelines List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPipelines.map((pipe) => {
          const nodeCount = pipe.nodes?.length || 0;

          return (
            <div
              key={pipe.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-100 truncate">{pipe.name}</h3>
                      <span className="text-[11px] font-mono text-slate-500">{nodeCount} nodes</span>
                    </div>
                  </div>
                  <Badge status={pipe.status}>{pipe.status}</Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 my-3">
                  {pipe.description || 'Visual IoT telemetry rule pipeline.'}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800/80">
                  <span>Last run: {pipe.lastRun || '2 min ago'}</span>
                  <span>Ver. {pipe.version || 1}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link to={`/pipelines/${pipe.id}`}>
                  <Button variant="outline" size="sm" icon={Edit}>
                    Open Graph
                  </Button>
                </Link>

                <div className="flex items-center gap-1">
                  {pipe.status === 'Running' ? (
                    <button
                      onClick={() => handleStop(pipe.id)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                      title="Stop pipeline"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRun(pipe.id)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-400 transition-colors"
                      title="Run pipeline"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDuplicate(pipe.id)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    title="Duplicate pipeline"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(pipe.id)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                    title="Delete pipeline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
