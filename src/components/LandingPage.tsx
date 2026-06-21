import React from "react";
import { Compass, Briefcase, FileText, GraduationCap, CheckCircle, Sparkles, MessageSquare, ArrowRight, Award, Trophy, Users } from "lucide-react";

interface LandingPageProps {
  onOpenAuth: () => void;
  onExploreCareers: () => void;
  onExploreAdvisor: () => void;
}

export default function LandingPage({ onOpenAuth, onExploreCareers, onExploreAdvisor }: LandingPageProps) {
  return (
    <div className="font-sans relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-fade-in" id="landing-page-container">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8" id="hero-section">

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white max-w-4xl leading-tight">
          Navigate Your Future <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
            with Smart Navigation
          </span>
        </h1>

        <p className="max-w-2xl text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Embark on a customized career journey. Smart Career Navigator provides real-time aptitude assessments, processes plain text resumes for recruiters, tracks study paths, and lists live internships.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 pt-4">
          <button
            onClick={onOpenAuth}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="hero-get-started"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onExploreCareers}
            className="bg-slate-50 border border-slate-205 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-bold text-sm px-8 py-3.5 rounded-2xl hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="hero-explore"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Explore Career Assessment</span>
          </button>
        </div>

        {/* Simple social validation stats */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 w-full max-w-3xl grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white block">1000+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 block">Students Guided</span>
          </div>
          <div>
            <span className="text-xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">100%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 block">Self-Audit Free</span>
          </div>
          <div>
            <span className="text-xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 block">85%+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 block">ATS Target Scores</span>
          </div>
        </div>
      </section>

      {/* Product Feature Bento Grid */}
      <section className="bg-slate-50/50 dark:bg-slate-900/10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-800/60 rounded-3xl" id="features">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <span className="text-[10px] font-mono tracking-widest font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-1.5 rounded-full border border-indigo-150 dark:border-indigo-900/30 uppercase">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-sans">
            Smart Career Architecting Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal.">
            No more guess work. Our precise machine models analyze your strengths, audit layouts, and optimize checklists to match recruiter requirements.
          </p>
        </div>

        {/* Features list */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Compass,
              title: "Career Assessment",
              desc: "Take custom aptitude interest questionnaires. Feed profiles to our analysis engine to suggest top-tier career alignment maps.",
              btn: "Start Questionnaire",
              action: onExploreCareers
            },
            {
              icon: MessageSquare,
              title: "Career Advisor Chat",
              desc: "Converse continuously with a professional counselor. Request roadmap directions, interview study briefs, or negotiation templates.",
              btn: "Consult Advisor",
              action: onExploreAdvisor
            },
            {
              icon: FileText,
              title: "ATS Resume Scan",
              desc: "Paste plain resume text to extract deep algorithmic scores, missing critical details, list formatting anomalies, and key terms.",
              btn: "Audit Resume",
              action: onExploreCareers // standard redirect to explore
            },
            {
              icon: GraduationCap,
              title: "Free Syllabus Maps",
              desc: "Explore structured courses compiled from leading tech platforms, Harvard Computer Classes, and certificate pathways.",
              btn: "Browse Course catalog",
              action: onExploreCareers // standard redirect
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-850 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:scale-[1.01] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans mb-5">
                    {feat.desc}
                  </p>
                </div>

                <button
                  onClick={feat.action}
                  className="w-full text-center bg-slate-50 hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Configure Now
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials blocks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="testimonials">
        <div className="text-center max-w-md mx-auto space-y-2 mb-12">
          <span className="text-[10px] font-mono tracking-widest font-bold text-purple-600 uppercase block">SUCCESS PATHWAY CASE STUDIES</span>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Real Student Achievements</h2>
          <p className="text-xs text-slate-500 font-sans">
            Hear from freshman graduates who optimized their profiles and scored top engineering posts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              text: "The Career Assessment predicted Solutions Architect. I was hesitant, but followed the free courses listed in the curriculum map. Just landed an internship with Amazon Web Services!",
              author: "Elena Rostov",
              title: "Graduate DevOps Engineer at AWS",
              initials: "ER"
            },
            {
              text: "My resume was stalling in automatic pre-screens. Smart Career Navigator helped identify my weak density of typescript keywords. Bumping my score from 62 to 90 landed me 4 interviews!",
              author: "Marcus Vance",
              title: "Frontend Intern at Stripe",
              initials: "MV"
            },
            {
              text: "I booked the fullstack curriculum syllabus, checked items completed, and used the dynamic Chat Advisor desk to review software engineering questions daily. The best free portal out there!",
              author: "Chloe Dubois",
              title: "Associate React Engineer at Vercel",
              initials: "CD"
            }
          ].map((test, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-450 italic leading-relaxed mb-6 font-sans">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase border border-indigo-200">
                  {test.initials}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-950 dark:text-white block">{test.author}</span>
                  <span className="text-[10px] text-slate-400 block">{test.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
