export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface ImageValidationStatus {
  lighting: boolean;
  focus: boolean;
  scalpVisibility: boolean;
}

export interface IntakeData {
  age: number;
  gender: string;
  diet: string;
  stressLevel: number; // 1 - 10
  sleepHours: number;
  waterQuality: string;
  waterPh: number;
  climate: string;
  hairChanges: string;
  imageUrl: string;
  imageName: string;
  validation: ImageValidationStatus;
}

export interface VisionMetrics {
  hairDensity: number; // hairs/cm2
  scalpVisibility: number; // percentage %
  strandThickness: number; // micrometers µm
  texture: string;
  thinningRegions: string[];
  follicleHealthIndex: number; // 0-100
  sebumBalanceScore: number; // 0-100
}

export interface XAIFactor {
  id: string;
  factor: string;
  percentage: number;
  type: 'risk' | 'protective';
  description: string;
  icon: string;
}

export interface ActionPlanItem {
  id: string;
  category: 'Water Quality' | 'Lifestyle & Stress' | 'Nutrition & Supplements' | 'Hair Care Habits';
  title: string;
  description: string;
  impactLevel: 'Critical' | 'Recommended' | 'Maintenance';
  icon: string;
}

export interface ScanSession {
  id: string;
  timestamp: string;
  dateFormatted: string;
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  intake: IntakeData;
  visionMetrics: VisionMetrics;
  xaiFactors: XAIFactor[];
  actionPlan: ActionPlanItem[];
  heatmapData: {
    visibilityPoints: { x: number; y: number; r: number; val: number }[];
    densityPoints: { x: number; y: number; r: number; val: number }[];
  };
}

export interface PresetSampleImage {
  id: string;
  name: string;
  url: string;
  description: string;
  presetData: Partial<IntakeData>;
}
