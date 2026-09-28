import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Bell, Globe, FileText, Send } from 'lucide-react';

export const ActionNode = memo(({ data, selected }) => {
  const actionType = data?.actionType || 'SMS';
  const phone = data?.config?.phone || '+91 98765 43210';
  const message = data?.config?.message || 'High turbine temperature detected';
  const url = data?.config?.url || 'https://hooks.factory.com/alert';

  const icons = {
    SMS: <MessageSquare className="w-4 h-4 text-rose-400" />,
    Email: <Send className="w-4 h-4 text-rose-400" />,
    Webhook: <Globe className="w-4 h-4 text-rose-400" />,
    Notification: <Bell className="w-4 h-4 text-rose-400" />,
    Log: <FileText className="w-4 h-4 text-rose-400" />
  };

  return (
    <div className={`w-60 bg-slate-950/90 border-2 ${
      selected ? 'border-rose-500 shadow-xl shadow-rose-500/30' : 'border-rose-500/40'
    } rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all relative`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 bg-rose-500 border-2 border-slate-950 !left-[-7px] shadow-md shadow-rose-500"
      />

      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-400 shadow-sm shadow-rose-500/20">
            {icons[actionType] || icons.SMS}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 block">{data?.title || 'SMS Alert'}</span>
            <span className="text-[9px] font-mono text-rose-400 uppercase tracking-wider">ACTION TRIGGER</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        {actionType === 'SMS' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px]">RECIPIENT:</span>
              <span className="text-rose-300 font-extrabold truncate max-w-[110px]">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px]">TEMPLATE:</span>
              <span className="text-slate-300 truncate max-w-[110px]">{message}</span>
            </div>
          </>
        )}

        {actionType === 'Webhook' && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-[10px]">ENDPOINT:</span>
            <span className="text-rose-300 font-extrabold truncate max-w-[120px]">{url}</span>
          </div>
        )}

        {(actionType === 'Notification' || actionType === 'Email' || actionType === 'Log') && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-[10px]">CHANNEL:</span>
            <span className="text-rose-300 font-bold">{actionType} Dispatch</span>
          </div>
        )}
      </div>
    </div>
  );
});

ActionNode.displayName = 'ActionNode';
