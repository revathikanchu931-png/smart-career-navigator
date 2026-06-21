// App main component
// Suppress missing react type/module errors in some setups
// @ts-ignore
import React, { useState, useEffect } from "react";
import { 
  auth, 
  db, 
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc
} from "./firebase";
// Avoid importing firebase/auth types directly to prevent module resolution errors in some setups.
// Use a lightweight local User type alias. Adjust if you have firebase types available.
type User = any;

// Provide a minimal JSX IntrinsicElements declaration to avoid TS errors in
// environments missing React type declarations or the new jsx-runtime.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
// In some environments TypeScript complains the module 'react/jsx-runtime' is missing.
// Provide a lightweight ambient module declaration to avoid build errors when
// the automatic JSX runtime types are not available.
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any): any;
}
import { CareerRecommendation, ResumeAnalysisResult, SavedJob, LearningProgress } from "./types";
import { Resource } from "./data/learningResources";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import DashboardOverview from "./components/DashboardOverview";
import AssessmentForm from "./components/AssessmentForm";
import CareerAdvisor from "./components/CareerAdvisor";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import SkillGap from "./components/SkillGap";
import JobSearch from "./components/JobSearch";
import LearningResources from "./components/LearningResources";
import AuthModal from "./components/AuthModal";
import DailyTipWidget from "./components/DailyTipWidget";
import DevPracticeLab from "./components/DevPracticeLab";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [authOpen, setAuthOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Database / Profile States
  const [savedCareers, setSavedCareers] = useState<CareerRecommendation[]>([]);
  const [resumeHistory, setResumeHistory] = useState<ResumeAnalysisResult[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<string[]>([]);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        setActiveTab("dashboard");
        loadUserData(currentUser.uid);
      } else {
        setActiveTab("landing");
        // Clear user states on logout
        setSavedCareers([]);
        setResumeHistory([]);
        setSavedJobs([]);
        setLearningProgress([]);
        setBookmarkedResourceIds([]);
      }
    });
    return unsubscribe;
  }, []);

  // Sync dark mode HTML class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Load User Data from Cloud Firestore
  const loadUserData = async (uid: string) => {
    try {
      // 1. Fetch saved careers/assessments
      const qCareers = query(collection(db, "career_assessments"), where("uid", "==", uid));
      const snapCareers = await getDocs(qCareers);
      if (!snapCareers.empty) {
        const sorted = snapCareers.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // Load careers from latest assessment
        const latest = sorted[0] as any;
        if (latest && latest.careers) {
          setSavedCareers(latest.careers);
        }
      }

      // 2. Fetch resume history
      const qResumes = query(collection(db, "resume_analyses"), where("uid", "==", uid));
      const snapResumes = await getDocs(qResumes);
      if (!snapResumes.empty) {
        const sortedRes = snapResumes.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setResumeHistory(sortedRes as any);
      }

      // 3. Fetch saved jobs
      const qJobs = query(collection(db, "saved_jobs"), where("uid", "==", uid));
      const snapJobs = await getDocs(qJobs);
      const jobsList = snapJobs.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as SavedJob[];
      setSavedJobs(jobsList);

      // 4. Fetch learning progress
      const qProgress = query(collection(db, "learning_progress"), where("uid", "==", uid));
      const snapProgress = await getDocs(qProgress);
      const progressList = snapProgress.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as LearningProgress[];
      setLearningProgress(progressList);

      // 5. Fetch bookmarked resources
      const qResources = query(collection(db, "bookmarked_resources"), where("uid", "==", uid));
      const snapResources = await getDocs(qResources);
      const resIds = snapResources.docs.map((doc: any) => (doc.data() as any).resourceId) as string[];
      setBookmarkedResourceIds(resIds);

    } catch (error) {
      console.error("Error loading secure student parameters from Firestore:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 1. Save career assessment recommendations
  const handleSaveAssessment = async (careers: CareerRecommendation[], responses: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "career_assessments"), {
        uid: user.uid,
        timestamp: new Date().toISOString(),
        interests: responses.interests,
        strengths: responses.strengths,
        skills: responses.skills,
        workStyle: responses.workStyle,
        analyticalProblemSolving: responses.analyticalProblemSolving || "",
        leadershipStyle: responses.leadershipStyle || "",
        careers
      });
      setSavedCareers(careers);
    } catch (err) {
      console.error("Failed to persist assessments list in Firestore:", err);
      throw err;
    }
  };

  // 2. Save resume analysis
  const handleSaveResumeAnalysis = async (analysis: ResumeAnalysisResult) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "resume_analyses"), {
        ...analysis,
        uid: user.uid,
        timestamp: new Date().toISOString()
      });
      setResumeHistory((prev: ResumeAnalysisResult[]) => [{ id: docRef.id, ...analysis }, ...prev]);
    } catch (err) {
      console.error("Failed to save resume audit:", err);
      throw err;
    }
  };

  // 3. Bookmark jobs
  const handleToggleBookmarkJob = async (jobItem: any): Promise<boolean> => {
    if (!user) {
      setAuthOpen(true);
      return false;
    }

    const existingId = savedJobs.find((j: SavedJob) => j.jobId === jobItem.id.toString());
    if (existingId) {
      // Discard bookmark
      try {
        await deleteDoc(doc(db, "saved_jobs", existingId.id || ""));
        setSavedJobs((prev: SavedJob[]) => prev.filter((j: SavedJob) => j.jobId !== jobItem.id.toString()));
        return false;
      } catch (err) {
        console.error(err);
        return true;
      }
    } else {
      // Create bookmark
      try {
        const newJob: Omit<SavedJob, "id"> = {
          uid: user.uid,
          timestamp: new Date().toISOString(),
          jobId: jobItem.id.toString(),
          title: jobItem.title,
          companyName: jobItem.company_name,
          location: jobItem.candidate_required_location || "Remote",
          applyUrl: jobItem.url,
          description: jobItem.description || ""
        };
        const docRef = await addDoc(collection(db, "saved_jobs"), newJob);
        setSavedJobs((prev: SavedJob[]) => [...prev, { id: docRef.id, ...newJob }]);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  };

  const handleDeleteSavedJob = async (jobId: string) => {
    try {
      await deleteDoc(doc(db, "saved_jobs", jobId));
      setSavedJobs((prev: SavedJob[]) => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Toggle bookmark for resources
  const handleToggleBookmarkResource = async (resource: Resource) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    const isBookmarked = bookmarkedResourceIds.includes(resource.id);
    if (isBookmarked) {
      try {
        // Query locate doc ID
        const q = query(
          collection(db, "bookmarked_resources"), 
          where("uid", "==", user.uid), 
          where("resourceId", "==", resource.id)
        );
        const snap = await getDocs(q);
        snap.forEach(async (d: any) => {
          await deleteDoc(doc(db, "bookmarked_resources", d.id));
        });
        setBookmarkedResourceIds((prev: string[]) => prev.filter(id => id !== resource.id));
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await addDoc(collection(db, "bookmarked_resources"), {
          uid: user.uid,
          resourceId: resource.id,
          title: resource.title,
          category: resource.category,
          url: resource.url,
          timestamp: new Date().toISOString()
        });
        setBookmarkedResourceIds((prev: string[]) => [...prev, resource.id]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 5. Toggle Course/Certification Completed progress checkbox
  const handleToggleCourseProgress = async (resource: Resource, status: "completed" | "not_started") => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    const existingProgress = learningProgress.find((p: LearningProgress) => p.resourceId === resource.id);
    if (existingProgress) {
      try {
        await setDoc(doc(db, "learning_progress", existingProgress.id || ""), {
          ...existingProgress,
          status,
          updatedAt: new Date().toISOString()
        });
        setLearningProgress((prev: LearningProgress[]) => 
          prev.map((p: LearningProgress) => p.resourceId === resource.id ? { ...p, status } : p)
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const newProg: Omit<LearningProgress, "id"> = {
          uid: user.uid,
          resourceId: resource.id,
          title: resource.title,
          category: resource.category,
          status,
          updatedAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, "learning_progress"), newProg);
        setLearningProgress((prev: LearningProgress[]) => [...prev, { id: docRef.id, ...newProg }]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleToggleLearningProgressDirectObj = async (prog: LearningProgress) => {
    const nextStatus = prog.status === "completed" ? "not_started" as const : "completed" as const;
    try {
      await setDoc(doc(db, "learning_progress", prog.id || ""), {
        ...prog,
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      setLearningProgress((prev: LearningProgress[]) => 
        prev.map(p => p.id === prog.id ? { ...p, status: nextStatus } : p)
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Printable Career PDF reports downloader
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Navigation section */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        
        {/* Dynamic Tip Banner on key dashboards */}
        {activeTab !== "landing" && activeTab !== "advisor" && (
          <DailyTipWidget />
        )}

        <div className="transition-all duration-300">
          {activeTab === "landing" && (
            <LandingPage
              onOpenAuth={() => setAuthOpen(true)}
              onExploreCareers={() => {
                setActiveTab("assessment");
              }}
              onExploreAdvisor={() => {
                setActiveTab("advisor");
              }}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardOverview
              user={user}
              savedCareers={savedCareers}
              resumeHistory={resumeHistory}
              savedJobs={savedJobs}
              learningProgress={learningProgress}
              onToggleLearningProgress={handleToggleLearningProgressDirectObj}
              onDeleteSavedJob={handleDeleteSavedJob}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onPrintReport={handlePrintReport}
            />
          )}

          {activeTab === "assessment" && (
            <AssessmentForm
              onSaveAssessment={handleSaveAssessment}
              userLoggedIn={user !== null}
            />
          )}

          {activeTab === "advisor" && (
            <CareerAdvisor />
          )}

          {activeTab === "resume" && (
            <ResumeAnalyzer
              onSaveAnalysis={handleSaveResumeAnalysis}
              userLoggedIn={user !== null}
            />
          )}

          {activeTab === "skillgap" && (
            <SkillGap
              currentSkills={savedCareers.length > 0 ? savedCareers.flatMap((c: CareerRecommendation) => c.keySkills) : ["React", "JavaScript", "SQL", "Python"]}
            />
          )}

          {activeTab === "jobs" && (
            <JobSearch
              onToggleBookmarkJob={handleToggleBookmarkJob}
              savedJobIds={savedJobs.map((j: SavedJob) => j.jobId)}
            />
          )}

          {activeTab === "resources" && (
            <LearningResources
              onToggleBookmark={handleToggleBookmarkResource}
              bookmarkedIds={bookmarkedResourceIds}
              learningProgress={learningProgress}
              onToggleProgress={handleToggleCourseProgress}
            />
          )}

          {activeTab === "sandbox" && (
            <DevPracticeLab />
          )}
        </div>
      </main>

      {/* Auth Modal overlay registration */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          // Authentication successfully synced, state auto-loads
        }}
      />
    </div>
  );
}
