import React, { useState } from "react";
import { TableProperties, RefreshCw, Copy, Check, Search, Hash } from "lucide-react";
import { useApp } from "../AppContext";

export const FormulaReminder: React.FC = () => {
  const { formulas, triggerGenerateFormulas, isLoading } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterStr, setFilterStr] = useState<string>("");

  const handleCopy = (id: string, expression: string) => {
    navigator.clipboard.writeText(expression);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredFormulas = formulas.filter(f => 
    f.name.toLowerCase().includes(filterStr.toLowerCase()) ||
    f.expression.toLowerCase().includes(filterStr.toLowerCase())
  );

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col gap-5 justify-between w-full h-full relative overflow-hidden backdrop-blur-sm">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Hash className="text-cyan-400" size={20} />
            Formula & Laws Reminder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quick reference sheet for formulas, bounds & constants
          </p>
        </div>

        <button
          onClick={triggerGenerateFormulas}
          disabled={isLoading.formulas}
          className="bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition-all disabled:opacity-50"
          title="Regenerate Formulas"
          aria-label="Regenerate formulas list"
        >
          <RefreshCw size={14} className={isLoading.formulas ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-850/60">
        <Search size={14} className="text-slate-500" />
        <input
          type="text"
          placeholder="Filter equations..."
          value={filterStr}
          onChange={(e) => setFilterStr(e.target.value)}
          className="bg-transparent text-xs text-slate-200 focus:outline-none w-full"
          id="formulas-search"
        />
      </div>

      {/* Equations Stack */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {filteredFormulas.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No formulas found. Try resetting custom notes or typing keywords above.
          </div>
        ) : (
          filteredFormulas.map((f) => (
            <div
              key={f.id}
              className="bg-slate-950/60 hover:bg-slate-950 border border-slate-900 hover:border-slate-850 p-4.5 rounded-2xl flex flex-col gap-2.5 relative group transition-all"
            >
              {/* Copy control overlay hover */}
              <button
                type="button"
                onClick={() => handleCopy(f.id, f.expression)}
                className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 bg-slate-900/40 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy Formula Syntax"
                aria-label={`Copy formula ${f.name}`}
              >
                {copiedId === f.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">{f.name}</span>
              </div>

              {/* Formula Core Visual Rendering */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-850/60 font-mono text-xs text-cyan-300 overflow-x-auto select-all flex justify-between items-center">
                <span>{f.expression}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans hidden md:inline ml-2 select-none">
                  LaTeX Syntax
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                {f.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
