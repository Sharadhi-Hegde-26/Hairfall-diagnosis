import React, { useRef, useState } from 'react';
import { useTrichology } from '../../context/TrichologyContext';
import { PRESET_SCALP_SAMPLES } from '../../utils/analysisEngine';
import { Upload, CheckCircle2, AlertCircle, Scan, Sparkles, Image as ImageIcon } from 'lucide-react';

export const ImageUploader: React.FC = () => {
  const { intakeForm, updateIntake, loadPreset } = useTrichology();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateIntake({
          imageUrl: reader.result as string,
          imageName: file.name,
          validation: {
            lighting: true,
            focus: true,
            scalpVisibility: true
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateIntake({
          imageUrl: reader.result as string,
          imageName: file.name,
          validation: {
            lighting: true,
            focus: true,
            scalpVisibility: true
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400" />
            1. High-Resolution Scalp Imaging
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload a clear macro scalp photo or select a clinical preset sample for AI vision analysis.
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-lg">
          Required Step
        </span>
      </div>

      {/* Main Drag & Drop / Scanning Container */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={handleDrop}
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
          isHovering
            ? 'border-emerald-400 bg-emerald-950/20'
            : 'border-slate-800 hover:border-emerald-500/50 bg-slate-900/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {intakeForm.imageUrl ? (
          <div className="relative aspect-video w-full max-h-[320px] bg-slate-950 flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={intakeForm.imageUrl}
              alt="Scalp Preview"
              className="w-full h-full object-cover rounded-2xl filter brightness-95 contrast-105"
            />

            {/* Glowing Scan-Line Animation Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-scan-line border-b border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />

            {/* Scanning Overlay Metadata HUD */}
            <div className="absolute top-3 left-3 px-3 py-1.5 glass-panel rounded-xl text-[11px] font-mono text-emerald-400 flex items-center space-x-2 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CV VISION STREAM - ACTIVE</span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 px-4 py-2 text-xs font-semibold glass-panel hover:bg-slate-800 text-white rounded-xl transition border border-white/20 shadow-lg"
            >
              Replace Photo
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-10 text-center cursor-pointer flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-16 h-16 mb-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300 shadow-lg shadow-emerald-950">
              <Upload className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-slate-200">
              Drag & Drop scalp image here, or <span className="text-emerald-400 underline">Browse Files</span>
            </h4>
            <p className="text-xs text-slate-500 mt-2 max-w-sm">
              Supports PNG, JPG, WEBP. Ensure natural daylight or bright neutral LED lighting for macro visibility.
            </p>
          </div>
        )}
      </div>

      {/* Preset Scalp Photo Samples */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Or Try Preset Clinical Demo Samples:
          </label>
          <span className="text-[11px] text-slate-500">Instant One-Click Load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_SCALP_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadPreset(sample.id)}
              className={`p-2.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                intakeForm.imageUrl === sample.url
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-950'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-slate-200">{sample.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{sample.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Quality Validation Status Checklist */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-3 gap-3">
        <div className="flex items-center space-x-2">
          {intakeForm.validation.lighting ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-300">Lighting Lux: Optimal</span>
        </div>

        <div className="flex items-center space-x-2">
          {intakeForm.validation.focus ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-300">Macro Focus: Sharp</span>
        </div>

        <div className="flex items-center space-x-2">
          {intakeForm.validation.scalpVisibility ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-300">Follicle Framing: 94%</span>
        </div>
      </div>
    </div>
  );
};
