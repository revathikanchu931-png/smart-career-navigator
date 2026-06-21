import React, { useState, useRef, useEffect, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, ArrowUpRight, GraduationCap, Briefcase } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function CareerAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am your Career Advisor. I can help you evaluate what computer science certifications fit your skills, map a roadmap for dynamic roles like Data Scientist or Cloud Architect, and suggest actionable interview strategies. How can I help you navigate your future today?"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startermessages = [
    "What core skills are required to become a Data Analyst?",
    "How can I align my web development portfolio for interns?",
    "Suggest a learning path for Machine Learning engineering.",
    "Which soft skills are highly sought after by recruiters today?"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    setLoading(true);
    setInputVal("");
    
    // Add user message to history
    const updatedMessages = [...messages, { role: "user" as const, text: messageText }];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass complete chat history to maintain conversational context
        body: JSON.stringify({ 
          history: updatedMessages.slice(0, -1), 
          message: messageText 
        }),
      });

      if (!response.ok) {
        throw new Error("Chat session timed out. Please try refreshing or submit again.");
      }

      const json = await response.json();
      if (json && json.response) {
        setMessages(prev => [...prev, { role: "model" as const, text: json.response }]);
      } else {
        throw new Error("Invalid structure returned.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { 
          role: "model" as const, 
          text: `⚠️ **Connection Error**: ${err.message || "Failed to contact advisory server. Try again in a minute!"}` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputVal);
  };

  return (
    <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-3xl h-[600px] flex flex-col overflow-hidden font-sans shadow-sm" id="chat-container">
      
      {/* Advisor Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 p-4.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
            <GraduationCap className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">Career Advisor Desk</span>
            <span className="text-[10px] text-indigo-200 block font-mono">INTELLIGENT KNOWLEDGE GRAPH ENGINE</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono">
          <Briefcase className="w-4 h-4 text-purple-300" />
          <span>Real-time Guidance</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              id={`chat-msg-${idx}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}
              
              <div className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed border ${
                isUser 
                  ? "bg-indigo-600 text-white border-indigo-700 rounded-tr-none shadow-sm"
                  : "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-100 border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm"
              }`}>
                {isUser ? (
                  <p className="font-sans font-medium whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="markdown-body space-y-2 dark:prose-invert">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-850 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs flex-shrink-0">
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-start gap-3 justify-start" id="chat-loading-bubble">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-850 text-slate-500 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none shadow-sm text-sm">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></span>
                <span className="text-slate-400 text-xs font-semibold">Navigator advisor is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area & quick actions */}
      <div className="p-4 border-t border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
        {/* Quick query chips */}
        {messages.length === 1 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 block uppercase">Suggestion Chips:</span>
            <div className="flex flex-wrap gap-1.5">
              {startermessages.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium text-left flex items-center gap-1 cursor-pointer transition-all hover:scale-101"
                >
                  {q}
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            placeholder="Ask anything about interviews, profiles, salaries, or studies..."
            className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
            id="chat-input-val"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white p-3 rounded-xl transition-all shadow-md cursor-pointer"
            id="chat-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
