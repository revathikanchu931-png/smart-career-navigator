import React, { useState } from "react";
import { FileText, Sparkles, AlertTriangle, CheckCircle, Tag, RefreshCw, Save, HelpCircle } from "lucide-react";
import { ResumeAnalysisResult } from "../types";

interface ResumeAnalyzerProps {
  onSaveAnalysis: (result: ResumeAnalysisResult) => Promise<void>;
  userLoggedIn: boolean;
}

export default function ResumeAnalyzer({ onSaveAnalysis, userLoggedIn }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successSaved, setSuccessSaved] = useState(false);
  
  // Results State
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setErrorMsg("Please paste your resume text to begin.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessSaved(false);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetJob })
      });

      if (!response.ok) {
        throw new Error("Resume analysis failed or clocked out. Try shortening the text slightly.");
      }

      const json = await response.json();
      if (json && typeof json.score === "number") {
        setAnalysis({
          uid: "", // set on save
          timestamp: new Date().toISOString(),
          resumeText,
          targetJob,
          score: json.score,
          strengths: json.strengths || [],
          weaknesses: json.weaknesses || [],
          missingSections: json.missingSections || [],
          improvements: json.improvements || [],
          recommendedKeywords: json.recommendedKeywords || []
        });
      } else {
        throw new Error("Invalid format returned from recruiter analytics.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to scan resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!analysis) return;
    try {
      await onSaveAnalysis(analysis);
      setSuccessSaved(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to store resume analysis in your Cloud profiles.");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setResumeText("");
    setTargetJob("");
    setSuccessSaved(false);
    setErrorMsg("");
  };

  return (
    <div className="bg-white dark:bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans" id="resume-container">
      {!analysis ? (
        <form onSubmit={handleAnalyze} className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
              ATS Resume Optimizer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Paste your standard plain text CV details below. Optional target job selection enhances dynamic search keyword relevance scans.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 border border-red-200 dark:border-red-900 rounded-xl text-xs flex gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                Target Role / Industry (Optional)
              </label>
              <input
                type="text"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="E.g., Junior React Developer / Entry Level Data Analyst"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                Paste Resume Text Content (Required)
              </label>
              <textarea
                required
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the plain text of your resume here, including education, experience, and certifications details..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none font-mono focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            id="btn-trigger-resume-analysis"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Recruiter Engine Is Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-bounce" />
                Scan Resume against ATS Rules
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in" id="resume-analysis-results">
          {/* Header result row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-150 pb-5">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold font-mono tracking-wider block uppercase">ATS AUDIT RESULTS</span>
              <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
                Scores for Target: <span className="font-medium text-slate-500">{analysis.targetJob || "General CS Grade"}</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Scanned and audited using Generative Recruitment standards.</p>
            </div>
            
            {/* Score Ring indicator */}
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 border-slate-100 bg-slate-50 shadow-inner">
                <span className="text-2xl font-black text-indigo-700">{analysis.score}</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest absolute bottom-2 font-bold">PTS</span>
              </div>
              <div className="text-left font-sans">
                <span className="text-xs text-slate-400 font-semibold block uppercase">RATING SUMMARY</span>
                <span className={`text-sm font-bold block ${analysis.score >= 80 ? 'text-green-500' : analysis.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {analysis.score >= 80 ? "Pre-Screen Approved" : analysis.score >= 60 ? "Needs Refinement" : "Needs Rewrite"}
                </span>
              </div>
            </div>
          </div>

          {/* Core bento structure layout lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths & Weaknesses */}
            <div className="space-y-4">
              <div className="bg-green-50/45 dark:bg-green-950/15 p-5 border border-green-200 dark:border-green-900 rounded-2xl space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider border-b border-green-100/50 pb-2">
                  <CheckCircle className="w-4 h-4" />
                  ATS Strengths Identifiers
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/45 dark:bg-amber-950/15 p-5 border border-amber-200 dark:border-amber-900 rounded-2xl space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider border-b border-amber-100/50 pb-2">
                  <AlertTriangle className="w-4 h-4" />
                  ATS Deficiencies / Weaknesses
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">
                  {analysis.weaknesses.map((weak, idx) => (
                    <li key={idx}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Sections and Recommended Keywords */}
            <div className="space-y-4">
              <div className="bg-red-50/45 dark:bg-red-950/15 p-5 border border-red-200 dark:border-red-900 rounded-2xl space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider border-b border-red-100/50 pb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Essential Sections
                </h4>
                {analysis.missingSections.length === 0 ? (
                  <p className="text-xs italic text-slate-400">Prerequisites fully met! No critical sections are missing.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missingSections.map((sec, idx) => (
                      <span key={idx} className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs px-2.5 py-1 rounded-lg border border-red-250 font-semibold uppercase tracking-wide">
                        {sec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2">
                  <Tag className="w-4 h-4 text-indigo-505" />
                  Recommended ATS Keywords To Density Check
                </h4>
                <p className="text-[10px] text-slate-400 mb-1 leading-normal.">
                  High-yield terminology suggested for algorithmic pre-screen parsers:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysis.recommendedKeywords.map((kw, idx) => (
                    <span key={idx} className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1 rounded-lg border border-indigo-100/40 font-semibold">
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Improvements Checklist box */}
          <div className="bg-indigo-50/30 dark:bg-slate-900/50 p-6 border border-indigo-100/50 dark:border-indigo-950 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Step-by-Step Optimization Directions Checklist:
            </h4>
            <div className="space-y-2.5">
              {analysis.improvements.map((imp, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-slate-705 dark:text-slate-350 leading-relaxed font-sans font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-150 pt-5 mt-4">
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload New Resume Version
            </button>
            <div className="flex gap-2">
              {userLoggedIn ? (
                <button
                  onClick={handleSaveResult}
                  disabled={successSaved}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    successSaved 
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {successSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4 animate-bounce" />
                      Audits Saved to Profile
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Resume Analysis
                    </>
                  )}
                </button>
              ) : (
                <div className="text-xs text-slate-450 bg-slate-50 border border-slate-200. p-2 rounded-lg font-mono">
                  Sign in to save ATS audits permanently.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
