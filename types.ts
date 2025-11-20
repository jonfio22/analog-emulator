import { Type } from "@google/genai";

export enum AppStep {
  GEAR_REGISTRATION = 0,
  TRAINING_GUIDE = 1,
  UPLOAD_ANALYSIS = 2,
  TRAINING_PROCESS = 3,
  VALIDATION_AB = 4,
  STEREO_PROCESSING = 5,
}

export interface GearSchematic {
  modelName: string;
  circuitTopology: string;
  keyComponents: string[];
  expectedHarmonics: string;
  powerSupplyNotes: string;
  estimatedHeadroom: string;
}

export interface AudioPair {
  id: string;
  name: string;
  type: 'sine_sweep' | 'program_material' | 'transient' | 'noise';
  status: 'pending' | 'uploading' | 'analyzed';
  gainSetting?: string;
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  progress: number; // 0-100
  status: 'initializing' | 'training' | 'validating' | 'complete';
}

export interface FrequencyPoint {
  frequency: string;
  db: number;
  original: number;
}

export interface ValidationResult {
  thd: number;
  frequencyDeviation: number; // +/- dB
  phaseShift: number; // degrees
  qualityScore: number; // 0-100
}
