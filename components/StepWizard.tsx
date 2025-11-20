import React from 'react';
import { AppStep } from '../types';
import { CheckCircle, Circle, AudioWaveform, Cpu, Sliders, Save } from 'lucide-react';

interface StepWizardProps {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.GEAR_REGISTRATION, label: 'Gear Setup', icon: Sliders },
  { id: AppStep.TRAINING_GUIDE, label: 'Guide', icon: Circle },
  { id: AppStep.UPLOAD_ANALYSIS, label: 'Analyze', icon: AudioWaveform },
  { id: AppStep.TRAINING_PROCESS, label: 'Train Model', icon: Cpu },
  { id: AppStep.VALIDATION_AB, label: 'Validate', icon: CheckCircle },
  { id: AppStep.STEREO_PROCESSING, label: 'Export', icon: Save },
];

export const StepWizard: React.FC<StepWizardProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-0"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                  ${isActive 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                    : isCompleted 
                      ? 'bg-emerald-900 border-emerald-500 text-emerald-400' 
                      : 'bg-slate-950 border-slate-700 text-slate-500'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className={`mt-2 text-xs font-medium uppercase tracking-wider transition-colors duration-300
                  ${isActive ? 'text-indigo-400' : isCompleted ? 'text-emerald-500' : 'text-slate-600'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
