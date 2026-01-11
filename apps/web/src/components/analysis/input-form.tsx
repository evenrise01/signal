"use client";

import { useState, useRef } from "react";
import type { AnalyzeTextInput, AnalyzeScreenshotInput } from "../../types";

interface InputFormProps {
  onAnalyze: (input: AnalyzeTextInput | AnalyzeScreenshotInput) => Promise<void>;
  isLoading: boolean;
}

export function InputForm({ onAnalyze, isLoading }: InputFormProps) {
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        // Extract the base64 part only
        setImage(base64String.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      onAnalyze({ image, context });
    } else if (text.trim()) {
      onAnalyze({ text, context });
    }
  };

  const isSubmitDisabled = isLoading || (!text.trim() && !image);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Communication Input
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Screenshot
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative group rounded-xl overflow-hidden border border-white/10 glass-card aspect-video flex items-center justify-center bg-black/20">
            <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the text or conversation here..."
            className="glass-input w-full h-48 resize-none text-lg leading-relaxed"
            maxLength={5000}
            disabled={isLoading}
          />
        )}
        
        {!imagePreview && (
          <div className="text-right text-xs text-gray-500">
            {text.length}/5000
          </div>
        )}
      </div>

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
        disabled={isSubmitDisabled}
        className={`
          w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300
          ${isSubmitDisabled
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

