import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StepWizard } from './components/StepWizard';
import { GearRegistration } from './components/GearRegistration';
import { TrainingChecklist } from './components/TrainingChecklist';
import { TrainingDashboard } from './components/TrainingDashboard';
import { StereoProcessor } from './components/StereoProcessor';
import { AppStep, GearSchematic } from './types';
import { AudioWaveform } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.GEAR_REGISTRATION);
  const [schematic, setSchematic] = useState<GearSchematic | null>(null);

  const handleSchematicFound = (data: GearSchematic) => {
    setSchematic(data);
    setCurrentStep(AppStep.TRAINING_GUIDE);
  };

  const handleTrainingComplete = () => {
      // In a real app, validation step would go here.
      // For demo, we jump to the fun part: Processing.
      setCurrentStep(AppStep.STEREO_PROCESSING);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <AudioWaveform size={20} />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">AnalogMirror <span className="text-indigo-400 font-light">AI</span></h1>
          </div>
          <div className="text-xs text-slate-500 font-mono">
             v1.0.4-beta • {schematic ? schematic.modelName : 'No Device'}
          </div>
        </div>
      </header>

      <StepWizard currentStep={currentStep} />

      <main className="min-h-[calc(100vh-140px)]">
        {currentStep === AppStep.GEAR_REGISTRATION && (
          <GearRegistration onComplete={handleSchematicFound} />
        )}
        
        {currentStep === AppStep.TRAINING_GUIDE && (
          <TrainingChecklist onNext={() => setCurrentStep(AppStep.UPLOAD_ANALYSIS)} />
        )}

        {(currentStep === AppStep.UPLOAD_ANALYSIS || currentStep === AppStep.TRAINING_PROCESS) && (
          <TrainingDashboard 
            schematic={schematic} 
            onComplete={handleTrainingComplete} 
          />
        )}
        
        {currentStep === AppStep.STEREO_PROCESSING && (
            <StereoProcessor schematic={schematic} />
        )}
      </main>
    </div>
  );
};

export default App;
