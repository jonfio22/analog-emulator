import React, { useState } from 'react';
import { Search, Cpu, Activity, Zap, Info } from 'lucide-react';
import { analyzeSchematic } from '../services/geminiService';
import { GearSchematic } from '../types';

interface GearRegistrationProps {
  onComplete: (schematic: GearSchematic) => void;
}

export const GearRegistration: React.FC<GearRegistrationProps> = ({ onComplete }) => {
  const [modelName, setModelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [schematic, setSchematic] = useState<GearSchematic | null>(null);

  const handleAnalyze = async () => {
    if (!modelName) return;
    setLoading(true);
    const data = await analyzeSchematic(modelName);
    setSchematic(data);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Profile Your Analog Gear</h2>
        <p className="text-slate-400">
          Enter the exact make and model of your hardware. Our AI will search technical schematics 
          to initialize the neural network topology.
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-slate-700 rounded-lg leading-5 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="e.g. Neve 1073, SSL G-Comp, Manley Vari-Mu"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !modelName}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          {loading ? <Activity className="animate-spin" /> : <Cpu />}
          {loading ? 'Analyzing...' : 'Analyze Circuit'}
        </button>
      </div>

      {schematic && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">{schematic.modelName}</h3>
              <p className="text-indigo-400 text-sm font-mono mt-1">{schematic.circuitTopology}</p>
            </div>
            <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-800 rounded-full text-xs font-medium">
              Schematic Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-slate-500 mt-1" />
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wider">Expected Harmonics</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{schematic.expectedHarmonics}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-slate-500 mt-1" />
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wider">Power / Headroom</span>
                  <p className="text-slate-300 text-sm">{schematic.estimatedHeadroom} ({schematic.powerSupplyNotes})</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
              <span className="block text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info size={12} /> Key Components Detected
              </span>
              <ul className="space-y-2">
                {schematic.keyComponents.map((comp, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    {comp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => onComplete(schematic)}
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-lg transition-colors"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
