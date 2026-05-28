import React, { useState } from "react";
import { GitFork, Lightbulb, RefreshCw, Sparkles, BookOpen } from "lucide-react";
import { useApp } from "../AppContext";

export const MindMap: React.FC = () => {
  const { mindMapNodes, currentTopic, triggerGenerateMindMap, isLoading } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("root");

  const selectedNode = mindMapNodes.find(row => row.id === selectedNodeId) || mindMapNodes[0];

  // Group nodes by root level and branches for clear layout representation
  const mainNodes = mindMapNodes.filter(n => !n.parentId || n.parentId === "root");
  const subNodes = (parentId: string) => mindMapNodes.filter(n => n.parentId === parentId);

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col gap-5 justify-between w-full h-full relative overflow-hidden backdrop-blur-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitFork className="text-cyan-400 rotate-90" size={20} />
            AI Mind Map
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual concept mapping of {currentTopic || "Course Basics"}
          </p>
        </div>
        
        <button
          onClick={triggerGenerateMindMap}
          disabled={isLoading.mindMap}
          className="bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition-all disabled:opacity-50"
          title="Regenerate Mind Map"
          aria-label="Regenerate Mind Map"
        >
          <RefreshCw size={14} className={isLoading.mindMap ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Structured interactive conceptual map */}
      <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-5 flex flex-col gap-4">
        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block">
          Concepts Hierarchy
        </span>

        {mindMapNodes.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No mind map nodes generated. Click generate/sync to build.
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
            {mainNodes.map((main) => (
              <div key={main.id} className="border-l-2 border-slate-800 pl-4 py-1 flex flex-col gap-2">
                {/* Parent Node */}
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(main.id)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between border ${
                    selectedNodeId === main.id
                      ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400"
                      : "bg-slate-900/40 border-transparent hover:border-slate-800 text-slate-200"
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <BookOpen size={12} className={selectedNodeId === main.id ? "text-cyan-400 animate-pulse" : "text-slate-500"} />
                    {main.label}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Node</span>
                </button>

                {/* Sub-node branches */}
                <div className="ml-4 gap-1.5 flex flex-wrap">
                  {subNodes(main.id).map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedNodeId(sub.id)}
                      className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                        selectedNodeId === sub.id
                          ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300"
                          : "bg-slate-900/60 border-slate-800/50 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      → {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Node Details Pane */}
      {selectedNode && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wide">
            <Lightbulb size={13} />
            <span>Definition Hub</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">{selectedNode.label}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {selectedNode.notes || "This represents an important concept path. Revise detail patterns during core study time modules."}
          </p>
        </div>
      )}
    </div>
  );
};
