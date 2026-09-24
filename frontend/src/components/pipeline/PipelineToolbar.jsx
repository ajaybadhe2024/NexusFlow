import React from 'react';
import { 
  Save, 
  Play, 
  Square, 
  CheckCircle2, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Workflow, 
  FileJson
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const PipelineToolbar = ({
  pipelineName,
  setPipelineName,
  status,
  onSave,
  onRun,
  onStop,
  onValidate,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onExportJson
}) => {
  return (
    <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-4 select-none z-10">
      {/* Left: Pipeline Name & Status Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0">
          <Workflow className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={pipelineName}
          onChange={(e) => setPipelineName(e.target.value)}
          placeholder="Pipeline Name..."
          className="bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1 text-sm font-bold text-slate-100 focus:outline-none transition-all w-48 sm:w-64 truncate"
        />

        <Badge status={status}>{status}</Badge>
      </div>

      {/* Middle: Canvas Controls (Zoom / Undo / Redo) */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          onClick={onUndo}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-800 mx-1" />
        <button
          onClick={onZoomIn}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onFitView}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Fit Canvas View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Primary Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={CheckCircle2}
          onClick={onValidate}
          title="Validate graph connections"
        >
          Validate
        </Button>

        <Button
          variant="outline"
          size="sm"
          icon={FileJson}
          onClick={onExportJson}
          title="Export graph as JSON"
        >
          JSON
        </Button>

        {status === 'Running' ? (
          <Button
            variant="danger"
            size="sm"
            icon={Square}
            onClick={onStop}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            icon={Play}
            onClick={onRun}
          >
            Run
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          icon={Save}
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
