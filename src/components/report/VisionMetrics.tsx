import React from 'react';
import { VisionMetrics as VisionMetricsType } from '../../types/trichology';
import { Grid, Eye, Layers, Disc, MapPin, Sparkles } from 'lucide-react';

interface VisionMetricsProps {
  metrics: VisionMetricsType;
}

export const VisionMetrics: React.FC<VisionMetricsProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Computer Vision Scalp Metrics
        </h3>
        <span className="text-xs font-mono text-slate-400">Extracted from Macro Scalp Scan</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Hair Density */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Hair Follicle Density</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <Grid className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {metrics.hairDensity} <span className="text-xs font-normal text-slate-400">hairs/cm²</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Normal range: 140 - 210 hairs/cm²
            </p>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full" 
              style={{ width: `${Math.min(100, (metrics.hairDensity / 200) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: Scalp Visibility */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Scalp Exposure Index</span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {metrics.scalpVisibility}% <span className="text-xs font-normal text-slate-400">surface ratio</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Lower is denser (Optimal &lt; 18%)
            </p>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full" 
              style={{ width: `${Math.min(100, metrics.scalpVisibility * 2.5)}%` }} 
            />
          </div>
        </div>

        {/* Metric 3: Strand Thickness */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Shaft Thickness</span>
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/60">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {metrics.strandThickness} <span className="text-xs font-normal text-slate-400">µm ({metrics.texture})</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Average terminal hair: 50-80 µm
            </p>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-400 h-full rounded-full" 
              style={{ width: `${Math.min(100, (metrics.strandThickness / 85) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: Thinning Regions */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Identified Thinning Regions</span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1.5">
            {metrics.thinningRegions.map((region, idx) => (
              <span 
                key={idx} 
                className="inline-block px-2.5 py-1 text-[11px] font-mono font-semibold bg-slate-900 text-amber-300 border border-amber-800/40 rounded-lg mr-1 mb-1"
              >
                {region}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
