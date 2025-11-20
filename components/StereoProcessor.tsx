import React, { useState } from 'react';
import { Sliders, Power, Save, Download, Share2 } from 'lucide-react';
import { GearSchematic } from '../types';

interface StereoProcessorProps {
  schematic: GearSchematic | null;
}

export const StereoProcessor: React.FC<StereoProcessorProps> = ({ schematic }) => {
  const [bypass, setBypass] = useState(false);
  const [inputGain, setInputGain] = useState(0);
  const [outputGain, setOutputGain] = useState(0);
  const [mix, setMix] = useState(100);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Device Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{schematic?.modelName || 'Analog Unit'}</h2>
              <p className="text-indigo-400 text-xs font-mono uppercase tracking-widest">AI Neural Model • 96kHz</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors" title="Share Profile">
                <Share2 size={20} />
             </button>
             <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors" title="Download Preset">
                <Save size={20} />
             </button>
             <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm flex items-center gap-2">
                <Download size={16} /> Export Audio
             </button>
          </div>
        </div>

        {/* Rack Interface */}
        <div className="p-10 bg-gradient-to-b from-slate-800 to-slate-900 relative">
           {/* Screw holes for realism */}
           <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-slate-950 border border-slate-700"></div>
           <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-slate-950 border border-slate-700"></div>
           <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-slate-950 border border-slate-700"></div>
           <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-slate-950 border border-slate-700"></div>

           <div className="grid grid-cols-4 gap-8 max-w-3xl mx-auto">
              
              {/* Input Knob */}
              <Knob 
                label="Input Drive" 
                value={inputGain} 
                min={-12} max={12} 
                onChange={setInputGain} 
                unit="dB" 
              />

              {/* Mix Knob */}
              <Knob 
                label="Dry/Wet" 
                value={mix} 
                min={0} max={100} 
                onChange={setMix} 
                unit="%" 
              />

              {/* Output Knob */}
              <Knob 
                label="Output Trim" 
                value={outputGain} 
                min={-12} max={12} 
                onChange={setOutputGain} 
                unit="dB" 
              />
              
              {/* Bypass Switch */}
              <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 h-24 flex items-center">
                     <button 
                        onClick={() => setBypass(!bypass)}
                        className={`w-16 h-24 rounded bg-slate-950 border-2 transition-all shadow-inner flex items-center justify-center
                            ${bypass 
                                ? 'border-slate-700 shadow-none' 
                                : 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                            }`}
                     >
                        <Power size={24} className={bypass ? 'text-slate-700' : 'text-indigo-400'} />
                     </button>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bypass</span>
              </div>

           </div>

           {/* VU Meter Simulation */}
           <div className="mt-12 max-w-xl mx-auto bg-slate-950 p-4 rounded-lg border border-slate-800 shadow-inner">
               <div className="flex justify-between text-xs text-slate-500 font-mono mb-1">
                   <span>L</span>
                   <span>R</span>
               </div>
               <div className="space-y-2">
                   <div className="h-3 bg-slate-900 rounded-full overflow-hidden w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-20"></div>
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-75"
                            style={{ width: bypass ? '0%' : '65%' }}
                        ></div>
                   </div>
                   <div className="h-3 bg-slate-900 rounded-full overflow-hidden w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-20"></div>
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-75"
                            style={{ width: bypass ? '0%' : '62%' }}
                        ></div>
                   </div>
               </div>
           </div>

        </div>
      </div>

      <div className="text-center mt-8 text-slate-500 text-sm">
        Processing active on master bus. Latency: 0.8ms.
      </div>
    </div>
  );
};

const Knob = ({ label, value, min, max, onChange, unit }: any) => {
    // Calculate rotation: -135deg to 135deg
    const percent = (value - min) / (max - min);
    const deg = -135 + (percent * 270);

    return (
        <div className="flex flex-col items-center group">
            <div 
                className="w-24 h-24 rounded-full bg-slate-800 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-slate-700 relative flex items-center justify-center cursor-ns-resize"
                title="Drag to adjust (simulated)"
                onClick={() => {
                    // Simple click simulation for demo
                    const newVal = value >= max ? min : value + (max-min)/10;
                    onChange(Math.round(newVal * 10) / 10);
                }}
            >
                {/* Marker */}
                <div 
                    className="absolute w-1 h-10 bg-white rounded-full top-2 origin-bottom transition-transform duration-100 ease-out shadow-[0_0_5px_white]"
                    style={{ transform: `rotate(${deg}deg) translateY(-50%)`, transformOrigin: '50% 100%' }}
                ></div>
                
                {/* Tick marks ring (visual only) */}
                <div className="absolute inset-0 rounded-full border border-slate-600/30 m-2"></div>
            </div>
            <div className="mt-4 text-center">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <span className="block text-indigo-400 font-mono text-xs mt-1">{value}{unit}</span>
            </div>
        </div>
    )
}
