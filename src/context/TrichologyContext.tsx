import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntakeData, ScanSession } from '../types/trichology';
import { runTrichologyAIAnalysis, INITIAL_MOCK_HISTORY, PRESET_SCALP_SAMPLES } from '../utils/analysisEngine';

export type ActiveTab = 'intake' | 'report' | 'history';

interface TrichologyContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  intakeForm: IntakeData;
  updateIntake: (fields: Partial<IntakeData>) => void;
  loadPreset: (presetId: string) => void;
  activeScan: ScanSession | null;
  scanHistory: ScanSession[];
  isAnalyzing: boolean;
  runAnalysis: () => Promise<void>;
  selectScanFromHistory: (scanId: string) => void;
  deleteScanFromHistory: (scanId: string) => void;
  resetForm: () => void;
}

const DEFAULT_INTAKE: IntakeData = {
  age: 29,
  gender: 'Female',
  diet: 'Vegetarian',
  stressLevel: 6,
  sleepHours: 6.5,
  waterQuality: 'Hard Water (pH 8.2)',
  waterPh: 8.2,
  climate: 'Hot & Humid',
  hairChanges: 'Experiencing increased breakage and thinning near hairline',
  imageUrl: PRESET_SCALP_SAMPLES[0].url,
  imageName: 'scalp_scan_demo.jpg',
  validation: {
    lighting: true,
    focus: true,
    scalpVisibility: true
  }
};

const TrichologyContext = createContext<TrichologyContextType | undefined>(undefined);

export const TrichologyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('intake');
  const [intakeForm, setIntakeForm] = useState<IntakeData>(DEFAULT_INTAKE);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<ScanSession[]>(() => {
    const saved = localStorage.getItem('trichology_scans_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved scans', e);
      }
    }
    return INITIAL_MOCK_HISTORY;
  });

  const [activeScan, setActiveScan] = useState<ScanSession | null>(() => {
    return scanHistory.length > 0 ? scanHistory[0] : null;
  });

  useEffect(() => {
    localStorage.setItem('trichology_scans_v1', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const updateIntake = (fields: Partial<IntakeData>) => {
    setIntakeForm((prev) => ({ ...prev, ...fields }));
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_SCALP_SAMPLES.find((p) => p.id === presetId);
    if (preset) {
      setIntakeForm((prev) => ({
        ...prev,
        ...preset.presetData,
        imageUrl: preset.url,
        imageName: `${preset.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
      }));
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate real AI scanning computation delay
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const newScan = runTrichologyAIAnalysis(intakeForm);
    setActiveScan(newScan);
    setScanHistory((prev) => [newScan, ...prev]);
    setIsAnalyzing(false);
    setActiveTab('report');
  };

  const selectScanFromHistory = (scanId: string) => {
    const scan = scanHistory.find((s) => s.id === scanId);
    if (scan) {
      setActiveScan(scan);
      setActiveTab('report');
    }
  };

  const deleteScanFromHistory = (scanId: string) => {
    setScanHistory((prev) => prev.filter((s) => s.id !== scanId));
    if (activeScan?.id === scanId) {
      setActiveScan(scanHistory.find((s) => s.id !== scanId) || null);
    }
  };

  const resetForm = () => {
    setIntakeForm(DEFAULT_INTAKE);
    setActiveTab('intake');
  };

  return (
    <TrichologyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        intakeForm,
        updateIntake,
        loadPreset,
        activeScan,
        scanHistory,
        isAnalyzing,
        runAnalysis,
        selectScanFromHistory,
        deleteScanFromHistory,
        resetForm,
      }}
    >
      {children}
    </TrichologyContext.Provider>
  );
};

export const useTrichology = () => {
  const context = useContext(TrichologyContext);
  if (!context) {
    throw new Error('useTrichology must be used within a TrichologyProvider');
  }
  return context;
};
