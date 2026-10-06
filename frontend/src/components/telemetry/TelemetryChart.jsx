import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

export const TelemetryChart = ({ title, data, dataKey, color = '#06b6d4', threshold = null, unit = '°C', isLive = true }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          {title} Stream
        </h3>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[10px] bg-cyan-950 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-800 font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            LIVE STREAM
          </span>
        ) : (
          <span className="text-[10px] bg-amber-950 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-800 font-mono font-bold">
            STREAM PAUSED
          </span>
        )}
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: color,
                borderRadius: '12px',
                fontSize: '11px',
                color: '#f8fafc',
                fontFamily: 'monospace'
              }}
              formatter={(val) => [`${val} ${unit}`, title]}
            />
            {threshold && (
              <ReferenceLine
                y={threshold}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ 
                  value: `Limit ${threshold} ${unit}`, 
                  fill: '#f43f5e', 
                  fontSize: 10, 
                  position: 'insideTopRight',
                  fontFamily: 'monospace' 
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
