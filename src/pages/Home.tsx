import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, BookOpen, GitFork, Hash, ShieldAlert, Cpu } from "lucide-react";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Visual Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-[300px] w-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <header className="px-6 py-6 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-cyan-400" size={20} />
            <span className="font-extrabold text-sm tracking-widest text-white uppercase">AI Exam Assistant</span>
          </div>
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-300 hover:text-cyan-400 p-2 px-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all bg-slate-900/40"
          >
            Student Sign-In
          </Link>
        </div>
      </header>

      {/* Main Showcase Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 bg-slate-900 text-slate-400 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-semibold tracking-wide mb-6">
          <Cpu size={12} className="text-cyan-400 animate-spin" />
          <span>Generatively powered with Gemini 3.5 AI Engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
          Score Higher, Prep Faster with the{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Ultimate AI Exam Guide
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-sm md:text-base mt-6 leading-relaxed">
          Upload syllabus guidelines, parse coarse studying materials, and immediately generate interactive Mind Maps, key formulas, conceptual point sheets, and custom Night-Before Survival bundles.
        </p>

        {/* Buttons Pane */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-cyan-400/10 flex items-center justify-center gap-2 group text-sm"
          >
            Get Started Free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-slate-200 font-semibold px-8 py-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-sm block"
          >
            Enter Study Board directly
          </Link>
        </div>

        {/* Dynamic features highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mt-20">
          {[
            {
              icon: <GitFork className="rotate-90 text-cyan-400" size={18} />,
              title: "AI Mind Maps",
              desc: "Visual nested diagrams highlighting the spatial relationships of complex concepts."
            },
            {
              icon: <Sparkles className="text-emerald-400" size={18} />,
              title: "Key Takeaways",
              desc: "Surgical level summaries pulling direct facts and rules definitions out of your files."
            },
            {
              icon: <Hash className="text-cyan-500" size={18} />,
              title: "Formula Reminder",
              desc: "Instant cataloging of mathematics, rules and variables with raw LaTeX copying."
            },
            {
              icon: <ShieldAlert className="text-rose-400" size={18} />,
              title: "One Night Cram Mode",
              desc: "Ultra-condensed survivor predictions, mock target questions, and cheat bullet guides."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-900 rounded-2xl p-5 text-left transition-all hover:scale-[1.02] duration-300 backdrop-blur-sm"
            >
              <div className="h-9 w-9 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850 mb-4">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-200">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="px-6 py-6 border-t border-slate-900/80 bg-slate-950 text-slate-500 text-xs text-center">
        <p>© 2026 AI Exam Assistant Platform. Built to facilitate high performance scoring.</p>
      </footer>
    </div>
  );
};
export default Home;
