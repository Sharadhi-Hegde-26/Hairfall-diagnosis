import { IntakeData, ScanSession, RiskLevel, PresetSampleImage } from '../types/trichology';

// Preset Scalp Images for easy user testing
export const PRESET_SCALP_SAMPLES: PresetSampleImage[] = [
  {
    id: 'sample-1',
    name: 'Sample A: Temporal Thinning & Hard Water',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    description: 'Male 32y | Hard Water (pH 8.2) | High Work Stress',
    presetData: {
      age: 32,
      gender: 'Male',
      diet: 'Non-Vegetarian',
      stressLevel: 8,
      sleepHours: 5.5,
      waterQuality: 'Hard Water (pH 8.2)',
      waterPh: 8.2,
      climate: 'Hot & Humid',
      hairChanges: 'Increased shedding during morning shower over last 3 months',
    }
  },
  {
    id: 'sample-2',
    name: 'Sample B: Diffuse Scalp Visibility',
    url: 'https://images.unsplash.com/photo-1584297091622-af8e5cb87869?auto=format&fit=crop&q=80&w=800',
    description: 'Female 28y | Vegan Diet | Hard Water & Low Sleep',
    presetData: {
      age: 28,
      gender: 'Female',
      diet: 'Vegan',
      stressLevel: 7,
      sleepHours: 6.0,
      waterQuality: 'Hard Water (pH 8.0)',
      waterPh: 8.0,
      climate: 'Dry & Arid',
      hairChanges: 'Noticed widening parting line and reduced pony diameter',
    }
  },
  {
    id: 'sample-3',
    name: 'Sample C: Healthy Scalp Baseline',
    url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=800',
    description: 'Female 25y | Soft Water | Low Stress & Balanced Sleep',
    presetData: {
      age: 25,
      gender: 'Female',
      diet: 'Vegetarian',
      stressLevel: 3,
      sleepHours: 8.0,
      waterQuality: 'Soft / Filtered Water (pH 6.5)',
      waterPh: 6.5,
      climate: 'Moderate / Indoor AC',
      hairChanges: 'Routine maintenance checkup',
    }
  }
];

export function runTrichologyAIAnalysis(intake: IntakeData): ScanSession {
  // Base calculation starting at 90
  let score = 90;

  // Impact calculations
  const stressPenalty = (intake.stressLevel - 3) * 3.5; // up to ~25 pt loss
  const sleepPenalty = intake.sleepHours < 7 ? (7 - intake.sleepHours) * 4 : 0; // up to ~16 pt loss
  const waterPenalty = intake.waterPh > 7.5 ? (intake.waterPh - 7.0) * 12 : 0; // up to ~15 pt loss
  const dietPenalty = intake.diet === 'Vegan' ? 6 : intake.diet === 'Keto/Low-Carb' ? 4 : 0;
  
  score = Math.max(28, Math.min(98, Math.round(score - stressPenalty - sleepPenalty - waterPenalty - dietPenalty)));

  let riskLevel: RiskLevel = 'Low';
  if (score < 60) {
    riskLevel = 'High';
  } else if (score < 78) {
    riskLevel = 'Moderate';
  }

  // Vision metrics computed derived from score
  const hairDensity = Math.round(110 + (score / 100) * 65); // 110 - 175 hairs/cm2
  const scalpVisibility = Number((32 - (score / 100) * 22).toFixed(1)); // 10% - 32%
  const strandThickness = Math.round(45 + (score / 100) * 30); // 45 - 75 µm

  const thinningRegions: string[] = [];
  if (score < 65) {
    thinningRegions.push('Vertex / Crown Region', 'Temporal Recession');
  } else if (score < 78) {
    thinningRegions.push('Mid-Scalp Parting Line');
  } else {
    thinningRegions.push('Uniform Density (No Focal Thinning)');
  }

  // XAI Breakdown Percentages (Summing up risk weights)
  const totalPenalty = Math.max(1, stressPenalty + sleepPenalty + waterPenalty + dietPenalty + 5);
  const xaiFactors = [
    {
      id: 'xai-1',
      factor: 'Hard Water Mineral Calcification (pH ' + intake.waterPh + ')',
      percentage: Math.round((Math.max(waterPenalty, 2) / totalPenalty) * 100),
      type: (waterPenalty > 6 ? 'risk' : 'protective') as 'risk' | 'protective',
      description: 'High calcium & magnesium deposits disrupt hair cuticle elasticity and block follicle respiration.',
      icon: 'Droplets'
    },
    {
      id: 'xai-2',
      factor: 'Cortisol Stress Elevation (Level ' + intake.stressLevel + '/10)',
      percentage: Math.round((Math.max(stressPenalty, 3) / totalPenalty) * 100),
      type: (intake.stressLevel >= 6 ? 'risk' : 'protective') as 'risk' | 'protective',
      description: 'Elevated cortisol triggers micro-inflammation around the dermal papilla, accelerating Telogen phase entry.',
      icon: 'Zap'
    },
    {
      id: 'xai-3',
      factor: 'Circadian Sleep Repair Deficit (' + intake.sleepHours + 'h)',
      percentage: Math.round((Math.max(sleepPenalty, 2) / totalPenalty) * 100),
      type: (intake.sleepHours < 7 ? 'risk' : 'protective') as 'risk' | 'protective',
      description: 'Sub-7 hour sleep cycles reduce growth hormone pulses required for nocturnal follicular protein synthesis.',
      icon: 'Moon'
    },
    {
      id: 'xai-4',
      factor: 'Nutritional Micronutrient Matrix (' + intake.diet + ')',
      percentage: Math.round((Math.max(dietPenalty, 3) / totalPenalty) * 100),
      type: (dietPenalty > 2 ? 'risk' : 'protective') as 'risk' | 'protective',
      description: 'Protein & bio-available Iron/Zinc levels affect keratin structural integrity and follicle anchoring.',
      icon: 'Apple'
    }
  ];

  // Evidence-Based Action Plan
  const actionPlan = [
    {
      id: 'act-1',
      category: 'Water Quality' as const,
      title: 'Install 15-Stage KDF-55 Shower Filtration',
      description: 'Neutralize heavy metals, chlorine, and calcium carbonate to prevent mineral crust buildup on hair shafts.',
      impactLevel: (intake.waterPh > 7.5 ? 'Critical' : 'Recommended') as 'Critical' | 'Recommended' | 'Maintenance',
      icon: 'Filter'
    },
    {
      id: 'act-2',
      category: 'Lifestyle & Stress' as const,
      title: 'Implement 15-Min Daily HRV Cortisol Reset',
      description: 'Targeted physiological sighing breathwork and non-sleep deep rest (NSDR) to reduce Telogen effluvium progression.',
      impactLevel: (intake.stressLevel >= 7 ? 'Critical' : 'Recommended') as 'Critical' | 'Recommended' | 'Maintenance',
      icon: 'HeartPulse'
    },
    {
      id: 'act-3',
      category: 'Nutrition & Supplements' as const,
      title: 'Targeted Micronutrient & Amino Acid Therapy',
      description: 'Incorporate Hydrolyzed Marine Collagen, Biotin (5000mcg), Zinc Picolinate, and Vitamin D3 (4000 IU) daily.',
      impactLevel: (intake.diet === 'Vegan' || score < 70 ? 'Critical' : 'Recommended') as 'Critical' | 'Recommended' | 'Maintenance',
      icon: 'Pill'
    },
    {
      id: 'act-4',
      category: 'Hair Care Habits' as const,
      title: 'Scalp Micro-Circulation & pH-Balanced Wash',
      description: 'Use a pH 5.5 peptide scalp serum twice daily and perform 4-minute manual scalp myofascial release massage.',
      impactLevel: 'Maintenance' as const,
      icon: 'Sparkles'
    }
  ];

  // Generated Heatmap Data Points (Normalized 0-100 coordinates for scan visualization)
  const heatmapData = {
    visibilityPoints: [
      { x: 48, y: 35, r: 24, val: 0.85 },
      { x: 35, y: 42, r: 18, val: 0.65 },
      { x: 62, y: 40, r: 20, val: 0.72 },
      { x: 50, y: 55, r: 22, val: 0.58 },
    ],
    densityPoints: [
      { x: 25, y: 65, r: 28, val: 0.90 },
      { x: 75, y: 65, r: 28, val: 0.88 },
      { x: 50, y: 78, r: 30, val: 0.94 },
    ]
  };

  const timestamp = new Date().toISOString();
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    id: 'scan-' + Date.now(),
    timestamp,
    dateFormatted,
    score,
    riskLevel,
    intake,
    visionMetrics: {
      hairDensity,
      scalpVisibility,
      strandThickness,
      texture: intake.age > 40 ? 'Fine' : 'Medium',
      thinningRegions,
      follicleHealthIndex: Math.round(score * 0.95),
      sebumBalanceScore: Math.round(70 + (Math.sin(score) * 20)),
    },
    xaiFactors,
    actionPlan,
    heatmapData
  };
}

// Initial Sample Scans for Historical Tracker Demo
export const INITIAL_MOCK_HISTORY: ScanSession[] = [
  runTrichologyAIAnalysis({
    age: 30,
    gender: 'Male',
    diet: 'Non-Vegetarian',
    stressLevel: 8,
    sleepHours: 5.5,
    waterQuality: 'Hard Water (pH 8.2)',
    waterPh: 8.2,
    climate: 'Hot & Humid',
    hairChanges: 'High hair fall in shower',
    imageUrl: PRESET_SCALP_SAMPLES[0].url,
    imageName: 'scalp_scan_baseline.jpg',
    validation: { lighting: true, focus: true, scalpVisibility: true }
  }),
  {
    ...runTrichologyAIAnalysis({
      age: 30,
      gender: 'Male',
      diet: 'Non-Vegetarian',
      stressLevel: 5,
      sleepHours: 7.0,
      waterQuality: 'Soft / Filtered Water (pH 6.8)',
      waterPh: 6.8,
      climate: 'Hot & Humid',
      hairChanges: 'Shedding reduced after using filter',
      imageUrl: PRESET_SCALP_SAMPLES[0].url,
      imageName: 'scalp_scan_followup.jpg',
      validation: { lighting: true, focus: true, scalpVisibility: true }
    }),
    id: 'scan-prev-1',
    dateFormatted: 'May 14, 2026',
    timestamp: '2026-05-14T10:30:00Z',
    score: 81,
    riskLevel: 'Low'
  }
];
