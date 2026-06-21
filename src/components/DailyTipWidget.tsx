import React, { useEffect, useState } from "react";
import { Lightbulb, Quote, RefreshCw } from "lucide-react";

interface DailyTip {
  tip: string;
  quote: string;
  author: string;
  category: string;
}

export default function DailyTipWidget() {
  const [data, setData] = useState<DailyTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTip = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/daily-tips");
      if (!response.ok) {
        throw new Error("Failed to load daily advice");
      }
      const json = await response.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setError(true);
      // Fallback
      setData({
        tip: "Build deep skills in one specific field before branching out. Recruiters value specialized knowledge over shallow multi-disciplinary listings.",
        quote: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
        author: "Steve Jobs",
        category: "Work Ethic"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="daily-tip-container">
      {/* Actionable tip widget */}
      <div className="md:col-span-2 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
            <Lightbulb className="w-5 h-5 animate-pulse text-yellow-500" />
            <span>Smart Career Tip of the Day</span>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-sans font-medium">
              "{data?.tip}"
            </p>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-mono pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <span>CATEGORY: {data?.category || "Career Success"}</span>
          <button 
            onClick={fetchTip} 
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Refresh tip"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Advice
          </button>
        </div>
      </div>

      {/* Motivational widget */}
      <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
        <Quote className="absolute top-4 right-4 w-12 h-12 text-slate-200 dark:text-slate-800/40 pointer-events-none" />
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            Inspiration
          </span>
          {loading ? (
            <div className="animate-pulse space-y-2 col-span-1">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 text-sm italic font-serif leading-relaxed mb-4">
              "{data?.quote}"
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-300 font-sans">
            — {data?.author || "Anonymous"}
          </p>
          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
            CAREER MOTIVATOR
          </p>
        </div>
      </div>
    </div>
  );
}
