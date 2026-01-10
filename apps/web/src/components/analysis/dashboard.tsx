"use client";

import type { AnalysisResult } from "../../types";

interface DashboardProps {
  result: AnalysisResult;
}

export function Dashboard({ result }: DashboardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      
      {/* Top Row: Scores & Emotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Intent Score */}
        <div className="glass-card flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Intent Score</h3>
          <div className="relative">
             <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-white to-gray-400">
               {result.intent_score}
             </div>
             <div className="text-sm text-gray-500 mt-1">/ 100</div>
          </div>
          <div className="text-sm">
             Confidence: <span className="font-bold text-[var(--confidence-high)]">{result.confidence}%</span>
          </div>
        </div>

        {/* Emotions */}
        <div className="glass-card">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Detected Tones</h3>
          <div className="flex flex-wrap gap-2">
            {result.emotional_tones.map((tone) => (
              <span key={tone} className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-sm font-medium">
                {tone}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Subtext Analysis */}
      <div className="glass-card space-y-6">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Subtext Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-xs text-blue-400 font-bold uppercase">Explicit</div>
            <p className="text-sm text-gray-300 leading-relaxed">{result.subtext_summary.explicit}</p>
          </div>
          <div className="space-y-2">
             <div className="text-xs text-purple-400 font-bold uppercase">Implied</div>
             <p className="text-sm text-gray-300 leading-relaxed">{result.subtext_summary.implied}</p>
          </div>
          <div className="space-y-2">
             <div className="text-xs text-gray-500 font-bold uppercase">Avoided</div>
             <p className="text-sm text-gray-400 leading-relaxed italic">{result.subtext_summary.avoided}</p>
          </div>
        </div>
      </div>

      {/* Risk Flags */}
      {result.risk_flags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider px-2">Risk Signals</h3>
          <div className="grid gap-4">
             {result.risk_flags.map((risk, i) => (
               <div key={i} className="glass-card flex items-start gap-4 border-l-4" 
                    style={{ borderLeftColor: `var(--risk-${risk.level === 'green' ? 'low' : risk.level === 'yellow' ? 'medium' : 'high'})` }}>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white max-w-[290px]">{risk.type}</span>
                        <span className="text-xs font-mono opacity-50">{risk.probability}% Prob.</span>
                    </div>
                    <p className="text-sm text-gray-400">{risk.description}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Strategies */}
      <div className="space-y-6 pt-6">
        <h3 className="text-xl font-bold text-white text-center">Recommended Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {result.strategies.map((strategy, i) => (
             <div key={i} className="glass-card hover:translate-y-[-4px] transition-transform cursor-default">
                <div className="text-xs font-bold tracking-widest text-gray-500 mb-2">OPTION {i + 1}</div>
                <h4 className="text-lg font-bold text-white mb-2">{strategy.name}</h4>
                <div className="text-xs text-gray-400 mb-4">Goal: {strategy.optimization_goal}</div>
                
                <div className="space-y-2 mb-4">
                  {strategy.risks.map((r, ri) => (
                    <div key={ri} className="flex items-center gap-2 text-xs text-red-300/80">
                      <span>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {strategy.sample_reply && (
                   <div className="mt-4 p-3 rounded bg-black/40 border border-white/5 text-sm italic text-gray-300 font-serif">
                      "{strategy.sample_reply}"
                   </div>
                )}
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
