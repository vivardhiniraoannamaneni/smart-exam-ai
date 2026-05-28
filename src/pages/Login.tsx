import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, Lock, Mail, ChevronRight, CheckCircle2 } from "lucide-react";
import { useApp } from "../AppContext";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { studentName, setStudentName } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please complete email and password credentials.");
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      // Navigate to dashboard upon success
      navigate("/dashboard");
    }, 1200);
  };

  const handleQuickCredentialFill = (name: string, mail: string) => {
    setStudentName(name);
    setEmail(mail);
    setPassword("SecuredPass123!");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative">
      {/* Background radial highlight */}
      <div className="absolute h-96 w-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl w-full max-w-[400px] backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-cyan-400 to-emerald-400" />

        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8 text-center text-white">
          <div className="h-12 w-12 rounded-2xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-500/20">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Student Hub Gate</h2>
          <p className="text-xs text-slate-400 mt-1">Unlock your AI-curated study dashboard</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleMockLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="student-name-login" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Student Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                id="student-name-login"
                type="text"
                placeholder="e.g. Academic Champion"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-400 placeholder-slate-600 transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="student-email-login" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                id="student-email-login"
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-400 placeholder-slate-600 transition-all font-sans"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="student-pass-login" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Secure Credentials Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                id="student-pass-login"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-400 placeholder-slate-600 transition-all font-sans"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-[11px] text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-400/40 font-bold text-xs py-3.5 px-4 rounded-xl text-slate-950 hover:shadow-lg transition-all flex items-center justify-center gap-2 group tracking-wider uppercase mt-2 active:scale-[0.98]"
            id="login-btn-submit"
          >
            {isAuthenticating ? (
              <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
            ) : (
              <>
                Open Companion Workspace
                <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick presets for evaluation */}
        <div className="mt-8 border-t border-slate-800/60 pt-6">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
            Quick Sandbox Accounts:
          </span>
          <div className="flex flex-col gap-2">
            {[
              { name: "Annarao Vivardhini", email: "vivardhiniraoannamaneni@gmail.com" },
              { name: "Academic Champion", email: "student@university.edu" }
            ].map((usr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickCredentialFill(usr.name, usr.email)}
                className="flex items-center justify-between text-left text-[11px] bg-slate-950 hover:bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 hover:border-slate-850 transition-colors"
                aria-label={`Fill credentials for ${usr.name}`}
              >
                <div className="truncate pr-2">
                  <span className="font-semibold text-slate-300 block">{usr.name}</span>
                  <span className="text-slate-500 text-[10px]">{usr.email}</span>
                </div>
                <CheckCircle2 size={13} className="text-cyan-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
