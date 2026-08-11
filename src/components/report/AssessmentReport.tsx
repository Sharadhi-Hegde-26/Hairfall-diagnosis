import React from 'react';
import { useTrichology } from '../../context/TrichologyContext';
import { ScoreGauge } from './ScoreGauge';
import { VisionMetrics } from './VisionMetrics';
import { XAIInsightPanel } from './XAIInsightPanel';
import { HeatmapViewer } from './HeatmapViewer';
import { ActionPlan } from './ActionPlan';
import { Download, RefreshCw, Sparkles } from 'lucide-react';

export const AssessmentReport: React.FC = () => {
  const { activeScan, resetForm } = useTrichology();

  if (!activeScan) {
    return (
      <div className="text-center py-20 glass-panel max-w-xl mx-auto rounded-3xl p-8 space-y-4">
        <Sparkles className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-white">No Active Analysis Report</h3>
        <p className="text-sm text-slate-400">
          Please complete the diagnostic intake form to generate your Trichology AI risk assessment.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition"
        >
          Start New Intake Scan
        </button>
      </div>
    );
  }

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Clinical Analysis Report Session #{activeScan.id.slice(-6)}
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Scalp & Follicle Diagnostic Assessment
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={resetForm}
            className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Scan</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Clinical PDF Report</span>
          </button>
        </div>
      </div>

      {/* 1. Hair Health Score Gauge */}
      <ScoreGauge
        score={activeScan.score}
        riskLevel={activeScan.riskLevel}
        dateFormatted={activeScan.dateFormatted}
      />

      {/* 2. Computer Vision Metrics Visualizer */}
      <VisionMetrics metrics={activeScan.visionMetrics} />

      {/* 3. Grad-CAM Interactive Heatmap Simulation */}
      <HeatmapViewer imageUrl={activeScan.intake.imageUrl} />

      {/* 4. Explainable AI (XAI) Insight Attribution Panel */}
      <XAIInsightPanel factors={activeScan.xaiFactors} />

      {/* 5. Evidence-Based Personalized Action Plan */}
      <ActionPlan actionPlan={activeScan.actionPlan} riskLevel={activeScan.riskLevel} />

    </div>
  );
};
