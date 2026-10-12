import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-slate-400">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-sm font-medium text-slate-300">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
