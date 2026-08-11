import React from 'react';
import { XAIFactor } from '../../types/trichology';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BrainCircuit, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface XAIInsightPanelProps {
  factors: XAIFactor[];
}

export const XAIInsightPanel: React.FC<XAIInsightPanelProps> = ({ factors }) => {
  // Sort factors by impact percentage
  const sortedFactors = [...factors].sort((a, b) => b.percentage - a.percentage);

  const getBarColor = (type: 'risk' | 'protective', percentage: number) => {
    if (type === 'risk') {
      if (percentage >= 30) return '#f43f5e'; // rose-500
      if (percentage >= 20) return '#f59e0b'; // amber-500
      return '#38bdf8'; // sky-400
    }
    return '#10b981'; // emerald-500
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-900/30">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            Explainable AI (XAI) Risk Factor Attribution
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic feature-importance decomposition demonstrating exact weight contribution of each bio-factor.
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-mono bg-slate-900 text-emerald-400 border border-slate-700 rounded-full shrink-0">
          Shapley Value XAI Model
        </span>
      </div>

      {/* Grid: Bar Chart on Left, Detail Pills on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Recharts Bar Chart */}
        <div className="lg:col-span-7 h-[260px] w-full bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedFactors}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tickFormatter={(v) => `${v}%`} />
              <YAxis
                type="category"
                dataKey="factor"
                width={140}
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: '#cbd5e1' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as XAIFactor;
                    return (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 shadow-xl max-w-xs space-y-1">
                        <p className="text-xs font-bold text-white">{data.factor}</p>
                        <p className="text-xs font-mono font-bold text-emerald-400">
                          {data.percentage}% Impact Factor
                        </p>
                        <p className="text-[11px] text-slate-300">{data.description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                {sortedFactors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.type, entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: XAI Factor Detailed Cards */}
        <div className="lg:col-span-5 space-y-3">
          {sortedFactors.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition flex items-start space-x-3"
            >
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                item.type === 'risk' ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
              }`}>
                {item.type === 'risk' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{item.factor}</h4>
                  <span className={`text-xs font-mono font-extrabold ml-2 ${
                    item.type === 'risk' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    +{item.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
