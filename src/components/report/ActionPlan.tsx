import React from 'react';
import { ActionPlanItem, RiskLevel } from '../../types/trichology';
import { Filter, HeartPulse, Pill, Sparkles, Stethoscope, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

interface ActionPlanProps {
  actionPlan: ActionPlanItem[];
  riskLevel: RiskLevel;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ actionPlan, riskLevel }) => {

  const getCategoryIcon = (category: ActionPlanItem['category']) => {
    switch (category) {
      case 'Water Quality':
        return Filter;
      case 'Lifestyle & Stress':
        return HeartPulse;
      case 'Nutrition & Supplements':
        return Pill;
      case 'Hair Care Habits':
        return Sparkles;
    }
  };

  const getPriorityStyle = (impact: ActionPlanItem['impactLevel']) => {
    switch (impact) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
      case 'Recommended':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'Maintenance':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            3. Evidence-Based Personalized Action Plan
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Targeted clinical lifestyle, water quality, and nutritional interventions derived from your diagnostic intake.
          </p>
        </div>
      </div>

      {/* Conditional Professional Medical Consultation Alert Banner */}
      {(riskLevel === 'Moderate' || riskLevel === 'High') && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-700/60 text-amber-400 shrink-0">
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Professional Clinical Dermatological Guidance Notice
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                Because your assessment indicated <span className="font-bold text-amber-300 uppercase">{riskLevel} HAIR FALL RISK</span>, we strongly advise scheduling a trichoscopic examination with a board-certified dermatologist. This platform provides strictly non-commercial wellness analytics.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700 shrink-0">
            Non-Commercial Clinical Standard
          </span>
        </div>
      )}

      {/* Multi-Category Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actionPlan.map((item) => {
          const IconComp = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <IconComp className="w-4 h-4 text-emerald-400" />
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getPriorityStyle(item.impactLevel)}`}>
                    {item.impactLevel} Priority
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Clinical Protocol Ready
                </span>
                <span>Category: {item.category}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
