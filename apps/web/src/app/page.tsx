"use client";

import { useState } from "react";
import { InputForm } from "@/components/analysis/input-form";
import { Dashboard } from "@/components/analysis/dashboard";
import { ApiClient } from "@/lib/api";
import type { AnalysisResult, AnalyzeTextInput } from "@/types";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: AnalyzeTextInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiClient.analyzeText(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-white relative overflow-hidden flex flex-col items-center p-6 md:p-12">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="z-10 w-full max-w-4xl flex justify-between items-center mb-16">
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 cursor-pointer" onClick={handleReset}>
          SIGNAL
        </h1>
        {result && (
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            New Analysis
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="z-10 w-full max-w-4xl relative">
        
        {!result ? (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                Decode the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Hidden Meaning</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
                Paste a text, email, or conversation. AI detects the subtext, emotional signals, and potential risks.
              </p>
            </div>
            
            <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            
            {error && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-center">
                {error}
              </div>
            )}
          </div>
        ) : (
          <Dashboard result={result} />
        )}

      </div>
      
      {/* Footer / Trust */}
      {!result && (
        <footer className="mt-auto pt-20 text-center z-10 opacity-50">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Privacy First • No Data Storage • AI Analysis</p>
        </footer>
      )}

    </main>
  );
}
