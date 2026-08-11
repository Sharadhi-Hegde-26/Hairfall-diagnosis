import React, { useState } from 'react';
import { useTrichology } from '../../context/TrichologyContext';
import { ImageUploader } from './ImageUploader';
import { 
  Zap, Moon, Droplets, Utensils, Thermometer, UserCheck, Sparkles, Cpu, Loader2, ArrowRight
} from 'lucide-react';

export const IntakeForm: React.FC = () => {
  const { intakeForm, updateIntake, runAnalysis, isAnalyzing } = useTrichology();
  const [analysisStepText, setAnalysisStepText] = useState('Initializing Trichology Vision AI...');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Animate loader steps for high-tech feeling
    const stepTexts = [
      'Segmenting Scalp & Follicular Units...',
      'Measuring Hair Density & Visibility Index...',
      'Evaluating Hard Water pH & Mineral Coating Impact...',
      'Computing Cortisol & Circadian Stress Factors...',
      'Generating XAI Explainable Risk Matrix...'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < stepTexts.length) {
        setAnalysisStepText(stepTexts[stepIndex]);
        stepIndex++;
      }
    }, 400);

    await runAnalysis();
    clearInterval(interval);
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    if (level <= 6) return 'text-amber-400 bg-amber-950/60 border-amber-800';
    return 'text-rose-400 bg-rose-950/60 border-rose-800';
  };

  const getStressLabel = (level: number) => {
    if (level <= 3) return 'Low Cortisol / Relaxed';
    if (level <= 6) return 'Moderate Daily Stress';
    if (level <= 8) return 'High Work/Physical Stress';
    return 'Severe / Chronic Stress';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80 uppercase tracking-widest inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Intake & Biomarker Assessment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Hair Health & Risk Intake
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Combine macro scalp computer vision analysis with contextual biometric factors for personalized trichology risk prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Module 1: Image Acquisition */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <ImageUploader />
        </div>

        {/* Module 2: Contextual Questionnaire */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                2. Biometric & Environmental Questionnaire
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Clinical factors directly influencing follicle vascularity and hair cycle Telogen phase transitions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Age & Gender */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Age (Years)</label>
              <input
                type="number"
                min={12}
                max={99}
                value={intakeForm.age}
                onChange={(e) => updateIntake({ age: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Gender Identity</label>
              <select
                value={intakeForm.gender}
                onChange={(e) => updateIntake({ gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-slate-900"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Diet Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                Dietary Pattern
              </label>
              <select
                value={intakeForm.diet}
                onChange={(e) => updateIntake({ diet: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-slate-900"
              >
                <option value="Vegetarian">Vegetarian (Dairy / Eggs)</option>
                <option value="Non-Vegetarian">Non-Vegetarian (High Protein)</option>
                <option value="Vegan">Vegan (Plant-Based)</option>
                <option value="Keto/Low-Carb">Keto / Low-Carb</option>
              </select>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  Nightly Sleep Duration
                </label>
                <span className="text-xs font-mono font-bold text-indigo-300">
                  {intakeForm.sleepHours} Hours / Night
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={10}
                step={0.5}
                value={intakeForm.sleepHours}
                onChange={(e) => updateIntake({ sleepHours: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3h (Severe Deficit)</span>
                <span>7-8h (Optimal)</span>
                <span>10h</span>
              </div>
            </div>

            {/* Water Quality & pH Indicator */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Tap Water Hardness & pH Quality Indicator
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Hard Water (pH 8.2+)', ph: 8.2, desc: 'High Mineral Calcium/Magnesium Crust' },
                  { label: 'Moderate Water (pH 7.2)', ph: 7.2, desc: 'Standard City Tap Water' },
                  { label: 'Soft / Filtered (pH 6.5)', ph: 6.5, desc: 'Reverse Osmosis or Filtered' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateIntake({ waterQuality: item.label, waterPh: item.ph })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      intakeForm.waterPh === item.ph
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-950'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-200">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level 1-10 Slider */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Perceived Stress Level (1-10 Scale)
                </label>
                <div className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold ${getStressColor(intakeForm.stressLevel)}`}>
                  Level {intakeForm.stressLevel}/10 — {getStressLabel(intakeForm.stressLevel)}
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intakeForm.stressLevel}
                onChange={(e) => updateIntake({ stressLevel: Number(e.target.value) })}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 (Zen / Minimal)</span>
                <span>5 (Moderate Workload)</span>
                <span>10 (Extreme Exhaustion)</span>
              </div>
            </div>

            {/* Climate Environment */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Primary Environment & Climate
              </label>
              <select
                value={intakeForm.climate}
                onChange={(e) => updateIntake({ climate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-slate-900"
              >
                <option value="Hot & Humid">Hot & Humid (High Sebum Production)</option>
                <option value="Dry & Arid">Dry & Arid (Scalp Dehydration)</option>
                <option value="Cold & Seasonal">Cold & Seasonal (Thermal Shock)</option>
                <option value="Moderate / Indoor AC">Moderate / Continuous Indoor AC</option>
              </select>
            </div>

            {/* Recent Hair Care Changes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Recent Hair Treatments / Chemical Changes
              </label>
              <input
                type="text"
                value={intakeForm.hairChanges}
                onChange={(e) => updateIntake({ hairChanges: e.target.value })}
                placeholder="e.g. Started coloring, new sulfate shampoo, heat styling..."
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
              />
            </div>

          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Trichology AI...</span>
              </>
            ) : (
              <>
                <Cpu className="w-5 h-5" />
                <span>Generate Comprehensive Diagnostic Report</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>

      {/* Futuristic Processing Modal Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl text-center space-y-6 border border-emerald-500/30 shadow-2xl">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-cyan-500/20 border-b-cyan-400 animate-spin [animation-duration:1.5s]" />
              <Cpu className="w-10 h-10 text-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Trichology AI Neural Scan</h3>
              <p className="text-xs font-mono text-emerald-400 animate-pulse">{analysisStepText}</p>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full w-4/5 animate-pulse" />
            </div>

            <p className="text-[11px] text-slate-500">
              Cross-referencing 14,000+ clinical dermoscopy patterns with bio-questionnaire data.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
