import React, { useState } from "react";
import { GraduationCap, ArrowUpRight, Bookmark, CheckSquare, Square, Globe } from "lucide-react";
import { LEARNING_RESOURCES, Resource } from "../data/learningResources";
import { BookmarkedResource, LearningProgress } from "../types";

interface LearningResourcesProps {
  onToggleBookmark: (resource: Resource) => void;
  bookmarkedIds: string[];
  learningProgress: LearningProgress[];
  onToggleProgress: (resource: Resource, status: "completed" | "not_started") => void;
}

export default function LearningResources({
  onToggleBookmark,
  bookmarkedIds,
  learningProgress,
  onToggleProgress,
}: LearningResourcesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Software Development", "Data Science & Analytics", "Advanced Automation & Systems", "UX/UI Design", "Cybersecurity"];

  const filteredResources = activeCategory === "All"
    ? LEARNING_RESOURCES
    : LEARNING_RESOURCES.filter(r => r.category === activeCategory);

  return (
    <div className="bg-white dark:bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans" id="resources-container">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
            Curated Free Learning Resources
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Carefully curated certified programs, Harvard computer science classes, active tech documentation, and comprehensive YouTube playlists for in-demand tracks.
          </p>
        </div>
        
        {/* Counter indicator */}
        <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-3.5 py-1.5 border border-green-200 rounded-xl text-xs font-mono font-semibold">
          <GraduationCap className="w-4 h-4 text-green-500 animate-bounce" />
          <span>REAL SYLLABUS PATHWAYS</span>
        </div>
      </div>

      {/* Categories tabs selector container */}
      <div className="flex flex-wrap gap-1.5 mt-6 border-b border-slate-100 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3.5 py-2 rounded-xl transition-all font-semibold font-sans cursor-pointer ${
              activeCategory === cat
                ? "bg-indigo-600 text-white text-[11px]"
                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid rendering courses card lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" id="learning-sources-grid">
        {filteredResources.map((res) => {
          const isBookmarked = bookmarkedIds.includes(res.id);
          const progressObj = learningProgress.find(p => p.resourceId === res.id);
          const isCompleted = progressObj?.status === "completed";

          return (
            <div 
              key={res.id} 
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between font-sans shadow-sm ${
                isCompleted 
                  ? "bg-green-50/15 border-green-200 dark:bg-green-950/5 dark:border-green-900"
                  : "bg-slate-50/45 border-slate-200 hover:bg-slate-50 dark:bg-slate-900/10 dark:border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 font-bold block">
                      {res.category}
                    </span>
                    <h4 className="font-extrabold text-slate-950 dark:text-white text-sm leading-snug">
                      {res.title}
                    </h4>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block">
                      Provided by: {res.provider}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onToggleBookmark(res)}
                    className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                      isBookmarked 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60" 
                        : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-705 border-slate-150"
                    }`}
                    title={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] font-mono tracking-wide text-slate-400">
                  <span className="bg-white dark:bg-slate-850 px-2 py-0.5 border border-slate-200 dark:border-slate-800 rounded">
                    TYPE: {res.type}
                  </span>
                  <span className="bg-white dark:bg-slate-850 px-2 py-0.5 border border-slate-200 dark:border-slate-800 rounded">
                    DURATION: {res.duration}
                  </span>
                  <span className="bg-green-100 dark:bg-green-950/60 dark:text-green-300 text-green-700 px-2 py-0.5 rounded font-extrabold">
                    {res.isFree ? "100% FREE" : "FREE AUDIT"}
                  </span>
                </div>
              </div>

              {/* Progress and click row */}
              <div className="flex items-center justify-between border-t border-slate-150/40 pt-4 mt-5">
                {/* Completion Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleProgress(res, isCompleted ? "not_started" : "completed")}
                  className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none ${
                    isCompleted 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-slate-500 dark:text-slate-400 hover:text-indigo-650"
                  }`}
                >
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-350" />
                  )}
                  <span>{isCompleted ? "Completed Lesson" : "Mark Complete"}</span>
                </button>

                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Syllabus link
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
