import React from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { UploadNotes } from "../components/UploadNotes";
import { MindMap } from "../components/MindMap";
import { FormulaReminder } from "../components/FormulaReminder";
import { KeyPoints } from "../components/KeyPoints";
import { OneNightMode } from "../components/OneNightMode";
import { useApp } from "../AppContext";
import { AlertTriangle, BookOpen, Sparkles } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { currentTopic, errorMsg, setErrorMsg } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col gap-0 text-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 flex flex-col gap-6">
        {/* Course Core Header Hero Banner/Alert */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-48 bg-cyan-500/5 rotate-12 translate-x-12 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 text-cyan-400 bg-cyan-950/40 rounded-xl flex items-center justify-center border border-cyan-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Class Active Syllabus</span>
              <h2 className="text-lg font-extrabold text-white tracking-tight">{currentTopic || "Course General Guide"}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 p-2 px-3 rounded-xl max-w-xs shrink-0 self-start sm:self-auto">
            <Sparkles size={16} className="text-cyan-400 animate-spin" />
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Dynamic Material Compiler</span>
          </div>
        </div>

        {/* Global Error Notice Handler */}
        {errorMsg && (
          <div className="bg-amber-950/20 text-amber-300 border border-amber-950 px-4 py-3 rounded-2xl flex items-start gap-2.5 transition-all">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-semibold block text-amber-200">AI Service Status Notice</span>
              <p className="mt-0.5 leading-normal text-amber-400">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs hover:text-white font-bold p-1 leading-none uppercase shrink-0"
              title="Close notification"
            >
              ×
            </button>
          </div>
        )}

        {/* Responsive Body Grid arranged as a pristine Bento Grid */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Sidebar Left Pane */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <Sidebar />
          </div>

          {/* Interactive Study Grid Area structured as Bento tiles */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-6 gap-6 items-stretch">
            {/* Upload Notes (col-span-3, row-span-2 equivalent) */}
            <div className="md:col-span-3 flex flex-col">
              <UploadNotes />
            </div>

            {/* AI Mind Map (col-span-3, row-span-4 equivalent height) */}
            <div className="md:col-span-3 md:row-span-2 flex flex-col">
              <MindMap />
            </div>

            {/* KeyPoints (col-span-3, row-span-4 equivalent) */}
            <div className="md:col-span-3 flex flex-col">
              <KeyPoints />
            </div>

            {/* FormulaReminder (col-span-3, row-span-2 equivalent) */}
            <div className="md:col-span-3 flex flex-col">
              <FormulaReminder />
            </div>

            {/* OneNightMode (col-span-6) */}
            <div className="md:col-span-6 flex flex-col">
              <OneNightMode />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
