import React, { useState } from "react";
import { ShieldAlert, Zap, BookOpen, Clock, RefreshCw, ChevronRight, Check } from "lucide-react";
import { useApp } from "../AppContext";

export const OneNightMode: React.FC = () => {
  let appState;
  try {
    appState = useApp();
  } catch {
    appState = { oneNightData: null, triggerGenerateOneNight: async () => {}, isLoading: { oneNight: false, mindMap: false, keyPoints: false, formulas: false, chat: false }, currentTopic: "" };
  }
  const { oneNightData, triggerGenerateOneNight, isLoading, currentTopic } = appState;

  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"questions" | "formulas" | "revision">("questions");
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  const toggleEmergency = async () => {
    if (!emergencyActive) {
      setEmergencyActive(true);
      if (!oneNightData) {
        await triggerGenerateOneNight();
      }
    } else {
      setEmergencyActive(false);
    }
  };

  return (
    <div className={`rounded-3xl border p-6 w-full h-full relative overflow-hidden transition-all duration-500 backdrop-blur-sm ${
      emergencyActive
        ? "bg-slate-950/80 border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.06)]"
        : "bg-slate-900/40 border-slate-800/80 shadow-md"
    }`}>
      {/* Background ambient light spikes */}
      {emergencyActive && (
        <div className="absolute right-0 top-0 h-48 w-48 bg-rose-500/5 rounded-full blur-3xl animate-pulse" />
      )}

      {/* Main Header / Trigger */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            emergencyActive ? "bg-rose-950/80 text-rose-400 border border-rose-500/40" : "bg-yellow-950/30 text-yellow-500 border border-yellow-500/20"
          }`}>
            <ShieldAlert size={22} className={emergencyActive ? "animate-bounce" : ""} />
          </div>
          <div>
            <h2 className={`text-2xl font-black tracking-tight transition-colors ${
              emergencyActive ? "text-rose-400" : "text-slate-100"
            }`}>
              One Night Before Exam Mode
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-intensity study survival guide covering dynamic predictions
            </p>
          </div>
        </div>

        {/* Master Toggle Trigger */}
        <button
          onClick={toggleEmergency}
          disabled={isLoading.oneNight}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
            emergencyActive
              ? "bg-slate-900 text-rose-400 hover:bg-slate-850 border border-rose-500/30"
              : "bg-rose-500 hover:bg-rose-600 text-slate-950 shadow-lg shadow-rose-500/10"
          }`}
          id="toggle-emergency-btn"
        >
          <Zap size={13} className={emergencyActive ? "fill-rose-400" : ""} />
          {emergencyActive ? "Deactivate Cram Suite" : "Activate One-Night Mode"}
        </button>
      </div>

      {/* Conditional Active Layout */}
      {!emergencyActive ? (
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 text-center flex flex-col items-center gap-4 py-8">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-slate-200">
              Is your exam coming up tomorrow?
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Activate One-Night Before Exam Mode to condense your dynamic syllabus into immediate survival cheat sheets, high-probability exam question predictions, and core concepts revision guides.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full max-w-lg mt-2">
            {["Predictions", "Dynamic Cards", "Revision Tip lines"].map((t, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-850 py-2 px-3 rounded-lg text-[10px] text-slate-400 font-mono tracking-wider">
                ✓ {t}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Active Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            {[
              { id: "questions", label: "Predicted Questions", count: oneNightData?.importantQuestions?.length },
              { id: "formulas", label: "Speed Formulas", count: oneNightData?.formulaSheet?.length },
              { id: "revision", label: "Night Notes Line", count: oneNightData?.quickRevision?.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all relative ${
                  activeTab === tab.id
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
                aria-label={`Show ${tab.label}`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 bg-slate-900 text-[9px] px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}

            {/* Refresh action */}
            <button
              onClick={triggerGenerateOneNight}
              disabled={isLoading.oneNight}
              className="ml-auto p-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition-all"
              title="Recalculate predictions"
              aria-label="Refresh list"
            >
              <RefreshCw size={11} className={isLoading.oneNight ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Tab Views content */}
          <div className="min-h-52">
            {/* 1. Questions Panel */}
            {activeTab === "questions" && (
              <div className="flex flex-col gap-2.5">
                {(!oneNightData || oneNightData.importantQuestions.length === 0) ? (
                  <div className="text-center py-10 text-xs text-slate-500">
                    Sync materials to generate predictions.
                  </div>
                ) : (
                  oneNightData.importantQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-900 hover:border-slate-850/80 rounded-xl transition-all overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedQuestionIdx(expandedQuestionIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-900/20"
                        aria-expanded={expandedQuestionIdx === idx}
                        aria-label={`Toggle expansion for question ${idx + 1}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-[10px] bg-rose-500/10 text-rose-400 font-mono px-2 py-0.5 rounded border border-rose-500/15">
                            Q0{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 leading-snug">{item.question}</span>
                        </div>
                        <ChevronRight
                          size={14}
                          className={`text-slate-500 transition-transform ${expandedQuestionIdx === idx ? "rotate-90" : ""}`}
                        />
                      </button>

                      {expandedQuestionIdx === idx && (
                        <div className="px-4 pb-4 pt-1.5 border-t border-slate-900 bg-slate-950/40">
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                            Suggested survival answer:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. Formulas Panel */}
            {activeTab === "formulas" && (
              <div className="grid sm:grid-cols-2 gap-3">
                {(!oneNightData || oneNightData.formulaSheet.length === 0) ? (
                  <div className="col-span-full text-center py-10 text-xs text-slate-500">
                    No intense math mappings.
                  </div>
                ) : (
                  oneNightData.formulaSheet.map((formula) => (
                    <div key={formula.id} className="bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-900 hover:border-slate-850 flex flex-col gap-2 transition-all">
                      <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">{formula.name}</div>
                      <code className="text-xs font-mono text-cyan-300 bg-slate-900 p-2.5 rounded border border-slate-850/60 block">{formula.expression}</code>
                      <p className="text-[11px] text-slate-400 leading-normal">{formula.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. Quick Revision Notes lines */}
            {activeTab === "revision" && (
              <ul className="flex flex-col gap-2">
                {(!oneNightData || oneNightData.quickRevision.length === 0) ? (
                  <div className="text-center py-10 text-xs text-slate-500">
                    Generating cram tips...
                  </div>
                ) : (
                  oneNightData.quickRevision.map((point, index) => (
                    <li key={index} className="flex gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-900/60">
                      <Zap size={14} className="text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-relaxed">{point}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
