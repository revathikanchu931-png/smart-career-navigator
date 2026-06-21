import React, { useState } from "react";
import { GraduationCap, AlertCircle, CheckCircle, HelpCircle, Activity, Play, Calendar } from "lucide-react";
import { SkillGapData } from "../types";

interface SkillGapProps {
  currentSkills: string[];
}

export default function SkillGap({ currentSkills }: SkillGapProps) {
  const [desiredRole, setDesiredRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [analysis, setAnalysis] = useState<SkillGapData | null>(null);

  const popularRoles = [
    "Frontend Developer",
    "Data Scientist",
    "Cloud Solutions Architect",
    "Product Manager",
    "Cybersecurity Compliance Officer"
  ];

  const handleRunAnalysis = async (roleSelection: string) => {
    const roleToQuery = roleSelection || desiredRole;
    if (!roleToQuery.trim()) {
      setErrorMsg("Please specify or click a desired role below.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills,
          desiredRole: roleToQuery
        })
      });

      if (!response.ok) {
        throw new Error("Gap analytical parser timed out. Try again!");
      }

      const json = await response.json();
      if (json && Array.isArray(json.possessedSkills)) {
        setAnalysis({
          role: roleToQuery,
          possessedSkills: json.possessedSkills || [],
          missingSkills: json.missingSkills || [],
          learningPath: json.learningPath || [],
          preparationTimeline: json.preparationTimeline || "N/A"
        });
      } else {
        throw new Error("Invalid structure returned.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to parse skills matrix. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans" id="skillgap-container">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
          Skill Gap Analysis Engine
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select or enter your desired professional role. Our analysis engine will evaluate your existing abilities against key market requirements to suggest a personalized learning roadmap.
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 flex gap-2.5 items-start text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input panel setup */}
      <div className="mt-6 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={desiredRole}
            onChange={(e) => setDesiredRole(e.target.value)}
            placeholder="E.g., Junior Devops Engineer / ML Researcher"
            className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
            id="input-desired-role"
          />
          <button
            onClick={() => handleRunAnalysis("")}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold px-5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
            id="btn-trigger-gap-analysis"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Activity className="w-4 h-4" />
            )}
            Analyze Gaps
          </button>
        </div>

        {/* Popular chips list */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block">Popular Target Positions:</span>
          <div className="flex flex-wrap gap-1.5">
            {popularRoles.map((role, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDesiredRole(role);
                  handleRunAnalysis(role);
                }}
                className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer transition-all hover:scale-101"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results panel setup */}
      {analysis && (
        <div className="mt-8 space-y-6 animate-fade-in" id="gap-analysis-results">
          
          {/* Timeline and details block */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">ANALYSIS TARGET</span>
              <p className="font-extrabold text-slate-900 dark:text-white text-base">{analysis.role}</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-slate-850 py-2.5 px-4 rounded-xl border border-slate-205 dark:border-slate-800/80">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div className="text-left">
                <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Prep Timeline</span>
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">{analysis.preparationTimeline}</span>
              </div>
            </div>
          </div>

          {/* Side-by-side matching matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Possessed matched skills */}
            <div className="bg-green-50/45 dark:bg-green-950/15 border border-green-250 dark:border-green-900 p-5 rounded-2xl space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-400 uppercase border-b border-green-100 dark:border-green-900/40 pb-2">
                <CheckCircle className="w-4 h-4" />
                Your Matching Capabilities
              </h4>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Skills you already possess that are highly relevant to becoming a {analysis.role}:
              </p>
              {analysis.possessedSkills.length === 0 ? (
                <p className="text-xs italic text-slate-400 pt-1">No matches found in your profile skills.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysis.possessedSkills.map((sk, idx) => (
                    <span key={idx} className="bg-white dark:bg-slate-850 text-green-700 dark:text-green-300 text-xs px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800/60 font-semibold shadow-sm">
                      ● {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Critical missing skills */}
            <div className="bg-amber-50/45 dark:bg-amber-950/15 border border-amber-250 dark:border-amber-900 p-5 rounded-2xl space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase border-b border-amber-100 dark:border-amber-900/40 pb-2">
                <AlertCircle className="w-4 h-4 animate-bounce" />
                Missing Critical Gaps Identified
              </h4>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Prerequisites and technical proficiencies suggested to study as soon as possible:
              </p>
              {analysis.missingSkills.length === 0 ? (
                <p className="text-xs italic text-slate-400 pt-1">0 gaps identified! Excellent preparation.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysis.missingSkills.map((sk, idx) => (
                    <span key={idx} className="bg-white dark:bg-slate-850 text-amber-700 dark:text-amber-350 text-xs px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 font-semibold shadow-sm">
                      ⚠ {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Learning path milestone step roadmap */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-indigo-600" />
              Tailored learning Pathway Directions
            </h4>
            
            <div className="relative border-l border-indigo-150 dark:border-indigo-950 ml-4 pl-6 space-y-6">
              {analysis.learningPath.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Circle locator handle */}
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 border border-white dark:border-indigo-950 flex items-center justify-center font-bold text-[8px] text-white">
                    {idx + 1}
                  </span>
                  
                  <div className="space-y-1">
                    <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{item.step}</span>
                    <p className="text-sm font-bold text-slate-950 dark:text-white leading-snug">{item.topic}</p>
                    <div className="flex items-center gap-3.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">TYPE: {item.resourceType}</span>
                      <span className="text-[10px] text-slate-400 font-medium">EST. TIME: {item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Seeding guide helper */}
      {!analysis && !loading && (
        <div className="text-center py-10 text-slate-400 text-xs space-y-1">
          <GraduationCap className="w-10 h-10 mx-auto opacity-30 text-slate-450 mb-2" />
          <span>Enter or click any job listing above to extract gaps.</span>
          <p className="text-[10px] text-slate-400 max-w-sm mx-auto mt-2 italic">
            Make sure to save skills in the assessment tab first, to run targeted comparative audits of your profile.
          </p>
        </div>
      )}
    </div>
  );
}
