import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Send, HelpCircle, HelpCircle as HelpIcon, Sparkles, MessageSquare, Terminal, ChevronRight } from "lucide-react";
import { useApp } from "../AppContext";

export const ChatPage: React.FC = () => {
  const { chatHistory, askDoubt, isLoading, currentTopic } = useApp();
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "Explain Banker's Algorithm safety safety step simply",
    "Difference between Inner Join & Left Join with query blocks",
    "How does the TCP Three-way handshake guarantee connection states?",
    "Explain standard ACID properties on transacting databases"
  ];

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || isLoading.chat) return;

    const query = question;
    setQuestion("");
    await askDoubt(query);
  };

  const handlePresetClick = (q: string) => {
    setQuestion(q);
  };

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading.chat]);

  // Premium Custom Inline Markdown Highlighter
  const formatMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, keyIndex) => {
      // 1. Headings
      if (line.startsWith("### ")) {
        return <h4 key={keyIndex} className="text-sm font-bold text-cyan-400 mt-3 mb-1.5">{line.substring(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={keyIndex} className="text-base font-extrabold text-cyan-300 mt-4 mb-2">{line.substring(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={keyIndex} className="text-lg font-black text-white mt-5 mb-3">{line.substring(2)}</h2>;
      }

      // 2. Numeric / Unordered lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={keyIndex} className="list-disc ml-5 text-xs text-slate-300 my-1 leading-relaxed">
            {parseInlineMarkup(line.trim().substring(2))}
          </li>
        );
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        const cleanText = line.replace(/^\s*\d+\.\s+/, "");
        return (
          <li key={keyIndex} className="list-decimal ml-5 text-xs text-slate-300 my-1 leading-relaxed">
            {parseInlineMarkup(cleanText)}
          </li>
        );
      }

      // 3. Regular block
      return line.trim() === "" ? (
        <div key={keyIndex} className="h-2" />
      ) : (
        <p key={keyIndex} className="text-xs text-slate-300 leading-relaxed my-1.5">
          {parseInlineMarkup(line)}
        </p>
      );
    });
  };

  // Parses inline elements: bold (**), code (`), links
  const parseInlineMarkup = (text: string) => {
    let parts: (string | React.ReactNode)[] = [text];

    // Bold pattern (**something**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    let newParts: (string | React.ReactNode)[] = [];
    for (const part of parts) {
      if (typeof part === "string") {
        let match;
        let lastIndex = 0;
        boldRegex.lastIndex = 0;
        while ((match = boldRegex.exec(part)) !== null) {
          const before = part.substring(lastIndex, match.index);
          const boldText = match[1];
          newParts.push(before);
          newParts.push(<strong key={match.index} className="text-white font-bold">{boldText}</strong>);
          lastIndex = boldRegex.lastIndex;
        }
        newParts.push(part.substring(lastIndex));
      } else {
        newParts.push(part);
      }
    }
    parts = newParts;

    // Code blocks (`something`)
    const codeRegex = /`(.*?)`/g;
    newParts = [];
    for (const part of parts) {
      if (typeof part === "string") {
        let match;
        let lastIndex = 0;
        codeRegex.lastIndex = 0;
        while ((match = codeRegex.exec(part)) !== null) {
          const before = part.substring(lastIndex, match.index);
          const val = match[1];
          newParts.push(before);
          newParts.push(
            <code key={match.index} className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-900 font-mono text-[11px]">
              {val}
            </code>
          );
          lastIndex = codeRegex.lastIndex;
        }
        newParts.push(part.substring(lastIndex));
      } else {
        newParts.push(part);
      }
    }
    parts = newParts;

    return <>{parts}</>;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-6 w-full flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Active Header */}
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 text-cyan-400 bg-cyan-950/40 rounded-xl flex items-center justify-center border border-cyan-500/20">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">AI Doubt Solver & Instructor</h2>
              <p className="text-[11px] text-slate-400">Context aware: {currentTopic || "Course Syllabus Details"}</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-3 py-1 rounded-full font-bold">
            ⚡ Live Server Session
          </span>
        </div>

        {/* Chat Stream Panel */}
        <div className="flex-1 bg-slate-900/10 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4 overflow-y-auto max-h-[480px]">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] rounded-2xl p-4.5 relative ${
                msg.sender === "user"
                  ? "bg-cyan-950/40 border border-cyan-500/30 text-slate-200 self-end rounded-tr-none"
                  : "bg-slate-900/50 border border-slate-850 text-slate-300 self-start rounded-tl-none"
              }`}
            >
              {/* Sender Tag */}
              <span className={`text-[9px] uppercase tracking-widest font-extrabold mb-1.5 block ${
                msg.sender === "user" ? "text-cyan-400" : "text-slate-400"
              }`}>
                {msg.sender === "user" ? "You" : "AI EXAM COACH"}
              </span>

              {/* Text content formatted */}
              <div className="space-y-1.5 text-xs">
                {msg.sender === "user" ? msg.text : formatMarkdown(msg.text)}
              </div>

              {/* Timestamp */}
              <span className="text-[9px] text-slate-500 self-end mt-2 select-none">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Typing State Spinner */}
          {isLoading.chat && (
            <div className="bg-slate-900/30 border border-slate-850 p-4.5 rounded-2xl self-start rounded-tl-none flex items-center gap-2.5 max-w-[80%] animate-pulse">
              <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
              <span className="text-xs text-slate-400 font-medium">
                Gemini Coach compiling response guidelines...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested presets */}
        {chatHistory.length <= 1 && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={11} className="text-cyan-400 animate-pulse" />
              Frequently Asked Doubts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(sq)}
                  className="text-left text-[11px] bg-slate-900/50 hover:bg-slate-900 border border-slate-850 rounded-xl p-3 text-slate-300 transition-all hover:border-cyan-500/20 flex items-center justify-between"
                  aria-label={`Ask preset question: ${sq}`}
                >
                  <span className="truncate">{sq}</span>
                  <ChevronRight size={12} className="text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form Box */}
        <form onSubmit={handleAsk} className="flex gap-3 bg-slate-900/30 p-2.5 rounded-2xl border border-slate-800">
          <input
            type="text"
            placeholder="Type your exam-focused doubt (e.g. explain normal forms simply)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading.chat}
            className="flex-1 bg-transparent px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            id="chat-query-input"
            required
          />
          <button
            type="submit"
            disabled={isLoading.chat || !question.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold p-3 rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95"
            id="send-doubt-btn"
            title="Ask AI"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChatPage;
