"use client";

import { useState } from "react";
import type { AnalyzeTextInput } from "../../types";

interface InputFormProps {
  onAnalyze: (input: AnalyzeTextInput) => Promise<void>;
  isLoading: boolean;
}

export function InputForm({ onAnalyze, isLoading }: InputFormProps) {
  const [text, setText] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze({ text, context });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          The Message
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text, screenshot text, or conversation here..."
          className="glass-input w-full h-48 resize-none text-lg leading-relaxed"
          maxLength={5000}
          disabled={isLoading}
        />
        <div className="text-right text-xs text-gray-500">
          {text.length}/5000
        </div>
      </div>

      {/* Optional Context - Hidden behind a toggle or just minimal? Keeping strict MVP: Just a field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Context (Optional)
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. First date was yesterday, matched on hinge..."
          className="glass-input w-full"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className={`
          w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300
          ${isLoading || !text.trim()
            ? "opacity-50 cursor-not-allowed bg-gray-800"
            : "bg-white text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing Signals...
          </span>
        ) : (
          "DECODE SIGNALS"
        )}
      </button>
    </form>
  );
}
