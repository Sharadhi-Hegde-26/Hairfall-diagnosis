import React from 'react';
import { useTrichology } from '../../context/TrichologyContext';
import { Dna, Activity, History, PlusCircle, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, activeScan, scanHistory, resetForm } = useTrichology();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-900/30 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Clinical Brand */}
          <div 
            onClick={() => setActiveTab('intake')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-900/40 group-hover:shadow-emerald-500/30 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Dna className="w-6 h-6 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  TRICHOLOGY<span className="text-gradient-emerald ml-1">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-full">
                  Clinical v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Hair Health & Risk Intelligence Platform</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('intake')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'intake'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Intake & Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              disabled={!activeScan}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                !activeScan ? 'opacity-40 cursor-not-allowed text-slate-500' :
                activeTab === 'report'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Analysis Report</span>
              {activeScan && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Progress History</span>
              <span className="ml-1.5 px-2 py-0.2 text-xs font-mono bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                {scanHistory.length}
              </span>
            </button>
          </nav>

          {/* Quick Actions & Security */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant & Privacy Ensured</span>
            </div>

            <button
              onClick={resetForm}
              className="px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-xl transition-all hover:border-emerald-500"
            >
              New Scan
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
