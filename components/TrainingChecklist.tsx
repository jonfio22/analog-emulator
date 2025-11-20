import React from 'react';
import { REQUIRED_PAIRS } from '../constants';
import { Download, ArrowRight, FileAudio } from 'lucide-react';

interface TrainingChecklistProps {
  onNext: () => void;
}

export const TrainingChecklist: React.FC<TrainingChecklistProps> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Generate Training Data</h2>
          <p className="text-slate-400 max-w-xl">
            To achieve professional mastering-grade accuracy (±0.3dB, 0.01% THD match), 
            you must record the following test signals through your hardware.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-indigo-400 font-medium transition-colors text-sm">
          <Download size={16} />
          Download Test Pack (.zip)
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8">
        <div className="grid grid-cols-12 bg-slate-950 p-4 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-800">
          <div className="col-span-1">ID</div>
          <div className="col-span-6">Test Signal Name</div>
          <div className="col-span-3">Signal Type</div>
          <div className="col-span-2">Gain Staging</div>
        </div>
        <div className="divide-y divide-slate-800/50 max-h-[400px] overflow-y-auto">
          {REQUIRED_PAIRS.map((pair) => (
            <div key={pair.id} className="grid grid-cols-12 p-4 hover:bg-slate-800/30 transition-colors items-center">
              <div className="col-span-1 text-slate-600 font-mono">#{pair.id}</div>
              <div className="col-span-6 text-slate-200 font-medium flex items-center gap-3">
                <FileAudio size={16} className="text-indigo-500/50" />
                {pair.name}
              </div>
              <div className="col-span-3">
                <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs border border-slate-700">
                  {pair.type.replace('_', ' ')}
                </span>
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                {pair.gainSetting || 'Unity / Nominal'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          I Have My Recordings
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
