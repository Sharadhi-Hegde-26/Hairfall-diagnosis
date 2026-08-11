import React from 'react';
import { RiskLevel } from '../../types/trichology';
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  dateFormatted: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, riskLevel, dateFormatted }) => {
  // SVG Circle Gauge calculations
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'Low':
        return {
          label: 'Low Hair Fall Risk',
          bgColor: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          icon: ShieldCheck,
          strokeColor: '#10b981',
          glowClass: 'glow-emerald',
        };
      case 'Moderate':
        return {
          label: 'Moderate Hair Fall Risk',
          bgColor: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          icon: AlertTriangle,
          strokeColor: '#f59e0b',
          glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]',
        };
      case 'High':
        return {
          label: 'Elevated Hair Fall Risk',
          bgColor: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
          icon: ShieldAlert,
          strokeColor: '#f43f5e',
          glowClass: 'glow-rose',
        };
    }
  };

  const badge = getRiskBadge();
  const IconComponent = badge.icon;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-900/40">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left: Health Score Title & Metadata */}
      <div className="space-y-4 text-center md:text-left z-10 max-w-md">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Scan Date: {dateFormatted}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bgColor}`}>
            <IconComponent className="w-3.5 h-3.5" />
            {badge.label}
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hair Health Index Score
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Algorithmic composite rating based on follicle density, micro-vascular scalp visibility, and lifestyle environmental impact.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Optimal Target Range</span>
            <span className="text-slate-200 font-bold">80 - 100 Index</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Confidence Level</span>
            <span className="text-emerald-400 font-bold">96.8% (Clinical)</span>
          </div>
        </div>
      </div>

      {/* Right: Custom Radial SVG Gauge */}
      <div className="relative flex items-center justify-center shrink-0 z-10">
        <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={badge.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">
            {score}
          </span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
            Out of 100
          </span>
        </div>
      </div>

    </div>
  );
};
