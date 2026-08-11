import React, { useState } from 'react';
import { Eye, Layers, Sliders, Maximize2, Sparkles, Activity } from 'lucide-react';

interface HeatmapViewerProps {
  imageUrl: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ imageUrl }) => {
  const [activeLayer, setActiveLayer] = useState<'gradcam' | 'density' | 'inflammation' | 'none'>('gradcam');
  const [opacity, setOpacity] = useState<number>(0.75);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-900/30">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Grad-CAM Scalp Density & Exposure Heatmap Simulation
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Toggle neural activation maps to visualize focal scalp visibility and follicular density zones.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
              isZoomed
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isZoomed ? 'Zoom 2.5x Active' : 'Fit View'}</span>
          </button>
        </div>
      </div>

      {/* Layer Toggles & Opacity Slider */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
        
        {/* Layer Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Layer:
          </span>

          {[
            { id: 'gradcam', label: 'Grad-CAM Scalp Visibility', color: 'from-amber-500 via-rose-500 to-indigo-600' },
            { id: 'density', label: 'Follicular Unit Density', color: 'from-emerald-400 via-teal-500 to-cyan-500' },
            { id: 'inflammation', label: 'Micro-Inflammation Map', color: 'from-rose-500 to-purple-600' },
            { id: 'none', label: 'Original Macro Photo', color: 'bg-slate-700' },
          ].map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeLayer === layer.id
                  ? 'bg-slate-800 text-white border-emerald-500 shadow-md shadow-emerald-950'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Opacity Control Slider */}
        {activeLayer !== 'none' && (
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Overlay Opacity: {Math.round(opacity * 100)}%</span>
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        )}
      </div>

      {/* Heatmap Visual Canvas Wrapper */}
      <div className="relative aspect-video w-full max-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        
        {/* Base Scalp Image */}
        <img
          src={imageUrl}
          alt="Scalp Scan Base"
          className={`w-full h-full object-cover transition-all duration-500 ${
            isZoomed ? 'scale-150 origin-center' : 'scale-100'
          }`}
        />

        {/* Grad-CAM Visibility Overlay Layer */}
        {activeLayer === 'gradcam' && (
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
              isZoomed ? 'scale-150 origin-center' : 'scale-100'
            }`}
            style={{
              opacity,
              background: `
                radial-gradient(circle at 45% 38%, rgba(244, 63, 94, 0.85) 0%, rgba(245, 158, 11, 0.65) 25%, rgba(16, 185, 129, 0.2) 50%, transparent 75%),
                radial-gradient(circle at 62% 50%, rgba(245, 158, 11, 0.75) 0%, rgba(16, 185, 129, 0.3) 40%, transparent 70%)
              `,
              mixBlendMode: 'color-dodge',
            }}
          />
        )}

        {/* Density Matrix Overlay Layer */}
        {activeLayer === 'density' && (
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
              isZoomed ? 'scale-150 origin-center' : 'scale-100'
            }`}
            style={{
              opacity,
              background: `
                radial-gradient(circle at 25% 65%, rgba(16, 185, 129, 0.9) 0%, rgba(34, 211, 238, 0.5) 30%, transparent 60%),
                radial-gradient(circle at 75% 65%, rgba(16, 185, 129, 0.9) 0%, rgba(34, 211, 238, 0.5) 30%, transparent 60%),
                radial-gradient(circle at 50% 35%, rgba(244, 63, 94, 0.6) 0%, transparent 45%)
              `,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Micro-Inflammation Overlay Layer */}
        {activeLayer === 'inflammation' && (
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
              isZoomed ? 'scale-150 origin-center' : 'scale-100'
            }`}
            style={{
              opacity,
              background: `
                radial-gradient(circle at 48% 40%, rgba(225, 29, 72, 0.9) 0%, rgba(168, 85, 247, 0.4) 35%, transparent 65%)
              `,
              mixBlendMode: 'hard-light',
            }}
          />
        )}

        {/* Heatmap Legend Bar */}
        {activeLayer !== 'none' && (
          <div className="absolute bottom-3 left-3 px-3 py-1.5 glass-panel rounded-xl text-[10px] font-mono text-slate-200 flex items-center space-x-2 border border-slate-700">
            <span>Low Activation</span>
            <div className="w-20 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
            <span>High Grad-CAM Peak</span>
          </div>
        )}
      </div>

    </div>
  );
};
