import React from 'react';
import { useTrichology } from '../../context/TrichologyContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { History, Calendar, Trash2, ChevronRight, Activity, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export const HistoryTracker: React.FC = () => {
  const { scanHistory, selectScanFromHistory, deleteScanFromHistory, resetForm } = useTrichology();

  // Prepare chart data in chronological order (oldest to newest)
  const chartData = [...scanHistory]
    .reverse()
    .map((scan) => ({
      date: scan.dateFormatted,
      score: scan.score,
      risk: scan.riskLevel,
      waterPh: scan.intake.waterPh,
      stress: scan.intake.stressLevel,
      scanId: scan.id
    }));

  const getBadgeStyle = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'Moderate':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      default:
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80 uppercase tracking-widest inline-flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Longitudinal Progress Analytics
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Historical Scan Timeline & Trends
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track Hair Health Score recovery over time following water filter installation, stress management, and nutrition protocols.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition self-start sm:self-auto"
        >
          Perform New Scan
        </button>
      </div>

      {/* Interactive Trend Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-900/30">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Hair Health Index Score Progression Timeline
          </h3>
          <span className="text-xs font-mono text-slate-400">{scanHistory.length} Scan Sessions Recorded</span>
        </div>

        <div className="h-[280px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{data.date}</p>
                          <p className="font-mono font-bold text-emerald-400">
                            Hair Health Score: {data.score}/100
                          </p>
                          <p className="text-slate-400">Risk Level: {data.risk}</p>
                          <p className="text-slate-400">Tap pH: {data.waterPh} | Stress: {data.stress}/10</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
              No historical data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Historical Sessions List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Past Scan Sessions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scanHistory.map((scan) => (
            <div
              key={scan.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 hover:border-emerald-500/50 transition duration-300"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={scan.intake.imageUrl}
                  alt="Scan thumbnail"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-white font-mono">
                      Score: {scan.score}/100
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getBadgeStyle(scan.riskLevel)}`}>
                      {scan.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {scan.dateFormatted}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">
                    Water: pH {scan.intake.waterPh} | Stress: {scan.intake.stressLevel}/10
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => selectScanFromHistory(scan.id)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500 transition"
                  title="View Report"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteScanFromHistory(scan.id)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
