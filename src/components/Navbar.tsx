import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, HelpCircle, Layout, User, Clock, ShieldAlert } from "lucide-react";
import { useApp } from "../AppContext";

export const Navbar: React.FC = () => {
  const { studentName } = useApp();
  const location = useLocation();

  const getActiveCls = (path: string) => {
    return location.pathname === path
      ? "text-cyan-400 bg-cyan-950/40 border-b-2 border-cyan-400"
      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 animate-pulse">
            <BookOpen size={22} id="brand-logo" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              AI Exam Assistant
              <span className="hidden sm:inline-block rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-400/20">
                v2.5
              </span>
            </h1>
            <p className="text-xs text-slate-400">High-Yield Exam Cram companion</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/40">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${getActiveCls("/")}`}
            id="nav-home"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${getActiveCls("/dashboard")}`}
            id="nav-dashboard"
          >
            <Layout size={16} />
            Study Board
          </Link>
          <Link
            to="/chat"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${getActiveCls("/chat")}`}
            id="nav-chat"
          >
            <HelpCircle size={16} />
            AI Doubt Solver
          </Link>
        </nav>

        {/* User Stats / Profile Info */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-sm font-medium text-slate-200">{studentName}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 justify-end">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Active learning session
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
            <User className="text-cyan-400" size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};
