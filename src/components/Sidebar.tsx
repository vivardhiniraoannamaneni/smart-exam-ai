import React, { useState, useEffect } from "react";
import { BookOpen, Award, CheckCircle, Terminal, RefreshCw, Calendar, Sparkles } from "lucide-react";
import { useApp } from "../AppContext";

export const Sidebar: React.FC = () => {
  const { currentTopic, setCurrentTopic, studentName, setStudentName } = useApp();
  const [examHoursLeft, setExamHoursLeft] = useState<number>(36);
  const [topicInput, setTopicInput] = useState<string>("");

  const popularTopics = [
    "Computer Science Foundations",
    "Artificial Intelligence & ML",
    "Linear Algebra & Matrices",
    "Organic Chemistry Mechanics",
    "Thermodynamics & Heat",
  ];

  // Simple simulated ticking timer
  useEffect(() => {
    const interval = setInterval(() => {
      setExamHoursLeft(prev => (prev > 1 ? prev - 1 : 36));
    }, 600000); // Decrase every 10 mins
    return () => clearInterval(interval);
  }, []);

  const handleCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      setCurrentTopic(topicInput.trim());
      setTopicInput("");
    }
  };

  return (
    <aside className="w-full bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 flex flex-col gap-6 backdrop-blur-sm self-stretch">
      {/* Student Card */}
      <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800/60 relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 h-24 w-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all duration-500" />
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-400/20">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Academic Profile</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="font-bold text-slate-200 bg-transparent border-0 border-b border-transparent hover:border-slate-800 focus:border-cyan-500 focus:outline-none py-0.5 text-sm w-full transition-all"
              placeholder="Your name"
              id="student-name-input"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 p-2.5 rounded-lg">
          <CheckCircle size={14} className="shrink-0" />
          <span>Profile automatically synchronized locally</span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-5 border border-slate-800/60 relative">
        <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block mb-2">Simulated Exam Countdown</span>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl font-extrabold text-white tracking-tight animate-pulse">{examHoursLeft}</span>
          <span className="text-sm font-semibold text-slate-400 font-sans">hours remaining</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${(examHoursLeft / 48) * 100}%` }}></div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
          <Calendar size={12} />
          <span>Cram pace active — optimize materials below</span>
        </div>
      </div>

      {/* Topics List & Switcher */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={12} className="text-cyan-400" />
          General Course Syllabus
        </h3>

        <form onSubmit={handleCustomTopicSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type custom subject theme..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            id="sidebar-custom-topic"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 font-medium text-xs px-3 rounded-xl text-slate-950 transition-colors"
          >
            Go
          </button>
        </form>

        <div className="flex flex-col gap-1.5 mt-2">
          {popularTopics.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentTopic(item)}
              aria-label={`Switch to topic ${item}`}
              className={`text-left text-xs px-3 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                currentTopic === item
                  ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/30 font-semibold"
                  : "bg-slate-950/20 text-slate-300 border-transparent hover:bg-slate-800/40"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${currentTopic === item ? "bg-cyan-400" : "bg-slate-700"}`}></div>
              <span className="truncate">{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dev Terminal Style Info */}
      <div className="mt-auto bg-slate-950/50 rounded-2xl p-4 border border-slate-800/40 text-[10px] font-mono text-slate-500 flex items-center gap-2">
        <Terminal size={14} className="text-emerald-500 shrink-0" />
        <div className="truncate">
          <span>HOST: ai-exam-system // active_channel_secured</span>
        </div>
      </div>
    </aside>
  );
};
