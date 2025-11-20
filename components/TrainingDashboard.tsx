import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Upload, CheckCircle2, PlayCircle, AlertCircle, Cpu, Activity } from 'lucide-react';
import { MOCK_FREQ_DATA } from '../constants';
import { generateTrainingInsight } from '../services/geminiService';
import { GearSchematic } from '../types';

interface TrainingDashboardProps {
  schematic: GearSchematic | null;
  onComplete: () => void;
}

export const TrainingDashboard: React.FC<TrainingDashboardProps> = ({ schematic, onComplete }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentInsight, setCurrentInsight] = useState("Initializing generic models...");
  const [lossData, setLossData] = useState<{ epoch: number, loss: number }[]>([]);
  
  // Simulate file upload state
  const [filesUploaded, setFilesUploaded] = useState(false);

  const startTraining = useCallback(() => {
    setIsTraining(true);
    setProgress(0);
    setLossData([]);
  }, []);

  useEffect(() => {
    if (isTraining && progress < 100) {
      const interval = setInterval(async () => {
        setProgress(prev => {
          const next = prev + 1;
          if (next % 20 === 0 && schematic) {
            generateTrainingInsight(schematic.modelName, next).then(setCurrentInsight);
          }
          return next;
        });

        // Add random loss data for chart
        setLossData(prev => [
            ...prev, 
            { 
                epoch: prev.length + 1, 
                loss: Math.max(0.01, 1.0 * Math.exp(-0.05 * prev.length) + (Math.random() * 0.05)) 
            }
        ]);

      }, 150); // Simulated speed

      return () => clearInterval(interval);
    } else if (progress >= 100) {
      setIsTraining(false);
      onComplete();
    }
  }, [isTraining, progress, onComplete, schematic]);

  if (!filesUploaded) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center animate-in fade-in zoom-in duration-300">
        <div 
          className="border-2 border-dashed border-slate-700 rounded-2xl p-12 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/50 transition-all cursor-pointer group"
          onClick={() => setTimeout(() => setFilesUploaded(true), 800)}
        >
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upload Matched Pairs</h3>
          <p className="text-slate-400 mb-8">Drag & drop your recorded folders here, or click to browse.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs text-slate-500">
            <InfoIcon /> Supports WAV, AIFF (24/32-bit)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Left Col: Status & Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="text-indigo-400" /> Model Status
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Architecture</span>
              <span className="text-slate-200 font-mono">Hybrid (FIR + LSTM)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sample Rate</span>
              <span className="text-slate-200 font-mono">96kHz</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pairs Loaded</span>
              <span className="text-emerald-400 font-mono">25/25</span>
            </div>
          </div>

          {!isTraining && progress === 0 ? (
            <button 
              onClick={startTraining}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
            >
              Start Training
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 uppercase">
                <span>Training Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-indigo-300 mt-2 italic animate-pulse">
                AI: "{currentInsight}"
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
             <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Validation Targets</h3>
             <div className="space-y-3">
                 <TargetItem label="Freq Response" value="±0.2 dB" passed={progress > 20} />
                 <TargetItem label="THD Match" value="0.008%" passed={progress > 50} />
                 <TargetItem label="Phase Coherence" value="99.9%" passed={progress > 80} />
             </div>
        </div>
      </div>

      {/* Right Col: Visualization */}
      <div className="lg:col-span-2 space-y-6">
        {/* Frequency Response Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 h-80 relative overflow-hidden">
           <h3 className="text-sm font-bold text-slate-400 mb-4 absolute top-6 left-6">Real-time Frequency Analysis (Delta)</h3>
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_FREQ_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="frequency" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} unit="dB" domain={[-5, 5]} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="original" 
                    stroke="#334155" 
                    strokeWidth={2} 
                    dot={false} 
                    strokeDasharray="5 5"
                />
                {/* The "Learned" line animates in as progress increases */}
                <Line 
                    type="monotone" 
                    dataKey="db" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#1e1b4b', strokeWidth: 2 }} 
                    isAnimationActive={true}
                    strokeOpacity={Math.max(0.2, progress / 100)}
                />
              </LineChart>
           </ResponsiveContainer>
        </div>

        {/* Loss Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 h-64 relative">
             <h3 className="text-sm font-bold text-slate-400 mb-4 absolute top-6 left-6">Neural Network Loss</h3>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lossData}>
                    <defs>
                        <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="epoch" hide />
                    <YAxis hide domain={[0, 1.5]} />
                    <Area 
                        type="monotone" 
                        dataKey="loss" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorLoss)" 
                        isAnimationActive={false}
                    />
                </AreaChart>
             </ResponsiveContainer>
             {lossData.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                     Waiting for training to start...
                 </div>
             )}
        </div>
      </div>

    </div>
  );
};

const TargetItem = ({ label, value, passed }: { label: string, value: string, passed: boolean }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${passed ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
        <span className={`font-mono text-sm ${passed ? 'text-emerald-400' : 'text-slate-600'}`}>{value}</span>
    </div>
);

const InfoIcon = () => <AlertCircle size={14} className="inline mr-1"/>
