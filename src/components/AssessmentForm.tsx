import React, { useState } from "react";
import { Compass, Sparkles, AlertCircle, ChevronLeft, ChevronRight, HelpCircle, ArrowUpRight, Save, Check } from "lucide-react";
import { CareerRecommendation } from "../types";

interface AssessmentFormProps {
  onSaveAssessment: (careers: CareerRecommendation[], responses: any) => Promise<void>;
  userLoggedIn: boolean;
}

export default function AssessmentForm({ onSaveAssessment, userLoggedIn }: AssessmentFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successSaved, setSuccessSaved] = useState(false);

  // Questionnaire States
  const [interests, setInterests] = useState("");
  const [strengths, setStrengths] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [workStyle, setWorkStyle] = useState("");
  const [analyticalStyle, setAnalyticalStyle] = useState("");
  const [leadershipStyle, setLeadershipStyle] = useState("");

  // Result State
  const [results, setResults] = useState<CareerRecommendation[] | null>(null);

  const presetSkills = [
    "HTML/CSS", "JavaScript", "React", "TypeScript", "Python", 
    "Java", "SQL", "Docker", "Figma Design", "Copywriting", 
    "Public Speaking", "Data Wrangling", "Machine Learning", 
    "Git/GitHub", "Excel", "Project Scoping"
  ];

  const handleTogglePresetSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFormSubmit = async () => {
    if (!interests.trim() || !strengths.trim() || !workStyle) {
      setErrorMsg("Please complete all required fields.");
      setStep(1);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessSaved(false);

    try {
      const responses = {
        interests,
        strengths,
        skills: selectedSkills,
        workStyle,
        analyticalProblemSolving: analyticalStyle || "Prefers general guidance",
        leadershipStyle: leadershipStyle || "Collaborative style"
      };

      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error("Assessment calculation timed out. Please try again!");
      }

      const json = await response.json();
      if (json && json.careers && Array.isArray(json.careers)) {
        setResults(json.careers);
        setStep(5); // Go to results view
      } else {
        throw new Error("Invalid structure returned from career advisor.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to generate recommended careers. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!results) return;
    try {
      const responses = { interests, strengths, skills: selectedSkills, workStyle, analyticalProblemSolving: analyticalStyle, leadershipStyle };
      await onSaveAssessment(results, responses);
      setSuccessSaved(true);
    } catch (error) {
       console.error(error);
       setErrorMsg("Failed to store assessment in your history.");
    }
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
    setInterests("");
    setStrengths("");
    setSelectedSkills([]);
    setWorkStyle("");
    setAnalyticalStyle("");
    setLeadershipStyle("");
    setSuccessSaved(false);
    setErrorMsg("");
  };

  return (
    <div className="bg-white dark:bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans relative" id="assessment-container">
      {/* Step counts header */}
      {step < 5 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="uppercase tracking-wider">CAREER APTITUDE ASSESSMENT</span>
            <span>STEP {step} OF 4</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex gap-2.5 items-start text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Interests & Strengths */}
      {step === 1 && (
        <div className="space-y-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              What excites you most?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tell us about fields, problems, topics, or subjects that grab your attention, or tell us how you like to spend your free time.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                My Interests & Passion (Required)
              </label>
              <textarea
                required
                rows={3}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="E.g., I love building interactive animations, designing graphics, writing articles, and working on open robotics hardware."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                What are your natural strengths? (Required)
              </label>
              <textarea
                required
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="E.g., I am highly persistent, have excellent visual perception, enjoy organizing complex sheets, and enjoy working collaboratively in dynamic environments."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Skills Selection */}
      {step === 2 && (
        <div className="space-y-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              What tools and skills do you possess?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select key technical skills, tools, frameworks or soft skills you have studied.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {presetSkills.map((sk) => {
                const selected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleTogglePresetSkill(sk)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                      selected 
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {sk}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddCustomSkill} className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add other manual/custom skill..."
                className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 rounded-xl cursor-pointer"
              >
                Add Skill
              </button>
            </form>

            <div className="pt-2">
              <span className="text-xs text-slate-400 block font-mono">SELECTED SKILLS ({selectedSkills.length}):</span>
              {selectedSkills.length === 0 ? (
                <span className="text-xs italic text-slate-450 mt-1 block">No skills added yet. Select preset buttons or add custom text above.</span>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSkills.map(sk => (
                    <span key={sk} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-750">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Work Style preference */}
      {step === 3 && (
        <div className="space-y-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              What is your ideal work style?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose the setting and structure where you produce your most creative and focused achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "structured_analytical",
                title: "Structured & Analytical",
                desc: "Highly logical rules, statistics, detailed documentation, databases, and structured operations."
              },
              {
                id: "creative_exploratory",
                title: "Creative & Design-Oriented",
                desc: "Visual design, prototyping UX layouts, copywriting, artistic exploration, and rapid brainstorming."
              },
              {
                id: "collaborative_leadership",
                title: "Fast-Paced & Social",
                desc: "Leading teams, business negotiations, user interactions, agile tasks, and verbal pitch presentations."
              }
            ].map(style => (
              <button
                key={style.id}
                onClick={() => setWorkStyle(style.title)}
                className={`p-4.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  workStyle === style.title
                    ? "bg-indigo-50/70 border-indigo-500 dark:bg-indigo-950/40"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800/80"
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">{style.title}</span>
                <span className="text-xs text-slate-500 leading-normal block">{style.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Analytical & Leadership Style */}
      {step === 4 && (
        <div className="space-y-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Problem-Solving & Leadership Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Almost finished! Answer briefly to fine-tune our smart alignment algorithm.
            </p>
          </div>

          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                How do you approach a complex problem with no guidance? (Optional)
              </label>
              <textarea
                rows={2}
                value={analyticalStyle}
                onChange={(e) => setAnalyticalStyle(e.target.value)}
                placeholder="E.g., I break it down into smaller, logical modules, verify documentation, write a quick test script, or draft a layout outline."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                What is your preferred role in a group work setup? (Optional)
              </label>
              <textarea
                rows={2}
                value={leadershipStyle}
                onChange={(e) => setLeadershipStyle(e.target.value)}
                placeholder="E.g., I usually coordinate milestone grids, pitch the visual concepts to reviewers, or silently structure the core algorithms."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Beautiful Career Results analysis layout */}
      {step === 5 && results && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center max-w-md mx-auto space-y-2 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-950/60 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Career Recommendations Info</h2>
            <p className="text-xs text-slate-500 leading-normal">
              Our career alignment engine analyzed your Interests, Strengths, Work style, and Technical skills. Here are the top 3 pathways optimized for your capabilities:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {results.map((c, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/85 shadow-sm hover:scale-102 transition-transform duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">{c.title}</span>
                    <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-mono px-2 py-0.5 rounded flex-shrink-0">
                      {c.matchPercentage}% Map
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {c.description}
                  </p>
                  <p className="text-xs text-indigo-650 dark:text-indigo-400 font-medium leading-relaxed bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100/30 mb-4">
                    <strong>Why It Matches:</strong> {c.whyItMatches}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 block">KEY ACQUISITIONS</span>
                  <div className="flex flex-wrap gap-1">
                    {c.keySkills.map((sk, sidx) => (
                      <span key={sidx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons footer for step 5 */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-4">
            <button
              onClick={handleReset}
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 text-sm font-semibold cursor-pointer"
            >
              Reset Assessments Answers
            </button>
            <div className="flex gap-2">
              {userLoggedIn ? (
                <button
                  onClick={handleSaveResult}
                  disabled={successSaved}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    successSaved 
                      ? "bg-green-150 text-green-700 border border-green-300"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {successSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved to History
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Recommendations
                    </>
                  )}
                </button>
              ) : (
                <div className="text-xs text-orange-500 bg-orange-50/50 p-2 rounded-lg border border-orange-100 font-semibold">
                  Sign In to save career history permanently!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation actions buttons (only for steps 1-4) */}
      {step < 5 && (
        <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800/80 pt-5 mt-6">
          <button
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 disabled:opacity-40 hover:text-indigo-600 text-sm font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
              id="btn-submit-assessment"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-bounce" />
                  Analyze Career Profile
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
