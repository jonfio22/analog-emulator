import { AudioPair } from "./types";

export const REQUIRED_PAIRS: AudioPair[] = [
  { id: '1', name: 'Sine Sweep -18dBFS (20Hz-20kHz)', type: 'sine_sweep', status: 'pending' },
  { id: '2', name: 'Sine Sweep -6dBFS (Saturation)', type: 'sine_sweep', status: 'pending' },
  { id: '3', name: 'Pink Noise -12dBFS (30s)', type: 'noise', status: 'pending' },
  { id: '4', name: '1kHz Square Wave', type: 'transient', status: 'pending' },
  { id: '5', name: 'Multi-tone Test', type: 'sine_sweep', status: 'pending' },
  { id: '6', name: 'Full Mix - Pop/Rock (Low Gain)', type: 'program_material', status: 'pending', gainSetting: 'Low' },
  { id: '7', name: 'Full Mix - Pop/Rock (High Gain)', type: 'program_material', status: 'pending', gainSetting: 'High' },
  { id: '8', name: 'Bass Heavy Material', type: 'program_material', status: 'pending' },
  { id: '9', name: 'Vocal Forward Track', type: 'program_material', status: 'pending' },
  { id: '10', name: 'Drum Bus (Transient Heavy)', type: 'program_material', status: 'pending' },
];

export const MOCK_FREQ_DATA = [
  { frequency: '20Hz', db: -0.5, original: 0 },
  { frequency: '50Hz', db: 0.2, original: 0 },
  { frequency: '100Hz', db: 0.5, original: 0 },
  { frequency: '200Hz', db: 0.4, original: 0 },
  { frequency: '500Hz', db: 0.1, original: 0 },
  { frequency: '1kHz', db: 0, original: 0 },
  { frequency: '2kHz', db: -0.1, original: 0 },
  { frequency: '5kHz', db: 1.2, original: 0 },
  { frequency: '10kHz', db: 2.5, original: 0 },
  { frequency: '15kHz', db: 3.0, original: 0 },
  { frequency: '20kHz', db: 1.5, original: 0 },
];
