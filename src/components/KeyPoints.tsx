import React from "react";
import { Sparkles, RefreshCw, Pin } from "lucide-react";
import { useApp } from "../AppContext";

export const KeyPoints: React.FC = () => {
  const { keyPoints, triggerGenerateKeyPoints, isLoading } = useApp();

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col gap-5 justify-between w-full h-full relative overflow-hidden backdrop-blur-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={20} />
            Key Takeaway Extractor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            AI-extracted crucial point summaries to learn first
          </p>
        </div>

        <button
          onClick={triggerGenerateKeyPoints}
          disabled={isLoading.keyPoints}
          className="bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition-all disabled:opacity-50"
          title="Regenerate Key Points"
          aria-label="Regenerate key points list"
        >
          <RefreshCw size={14} className={isLoading.keyPoints ? "animate-spin" : ""} />
        </button>
      </div>

      {/* List items with elegant indexing */}
      <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1">
        {keyPoints.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No key takeaways compiled. Check study notes or click sync to generate values.
          </div>
        ) : (
          keyPoints.map((kp, idx) => (
            <div
              key={kp.id || idx}
              className="group bg-slate-950/40 hover:bg-slate-950 flex gap-4 p-4 rounded-2xl border border-slate-900/80 hover:border-slate-850 transition-all"
            >
              {/* Badge visual indicator */}
              <div className="h-10 w-10 shrink-0 text-cyan-400 font-mono text-sm font-bold bg-cyan-950/40 border border-cyan-500/20 rounded-xl flex items-center justify-center relative">
                <span className="z-10">0{idx + 1}</span>
                <Pin size={10} className="text-cyan-400/30 absolute top-1 right-1" />
              </div>

              {/* Takeaway content */}
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors leading-snug">
                  {kp.point}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {kp.explanation}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
