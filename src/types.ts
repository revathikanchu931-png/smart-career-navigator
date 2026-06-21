export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  skills: string[];
  desiredRole?: string;
  bio?: string;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  matchPercentage: number;
  whyItMatches: string;
  keySkills: string[];
}

export interface CareerAssessmentResult {
  id?: string;
  uid: string;
  timestamp: any;
  interests: string;
  strengths: string;
  skills: string[];
  workStyle: string;
  analyticalProblemSolving: string;
  leadershipStyle: string;
  careers: CareerRecommendation[];
}

export interface ResumeAnalysisResult {
  id?: string;
  uid: string;
  timestamp: any;
  resumeText: string;
  targetJob?: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  improvements: string[];
  recommendedKeywords: string[];
}

export interface SavedJob {
  id?: string;
  uid: string;
  timestamp: any;
  jobId: string;
  title: string;
  companyName: string;
  location: string;
  applyUrl: string;
  description: string;
}

export interface LearningProgress {
  id?: string;
  uid: string;
  resourceId: string;
  title: string;
  category: string;
  status: "not_started" | "in_progress" | "completed";
  updatedAt: any;
}

export interface BookmarkedResource {
  id?: string;
  uid: string;
  resourceId: string;
  title: string;
  category: string;
  url: string;
  timestamp: any;
}

export interface SkillGapData {
  role: string;
  possessedSkills: string[];
  missingSkills: string[];
  learningPath: Array<{
    step: string;
    topic: string;
    resourceType: string;
    duration: string;
  }>;
  preparationTimeline: string;
}
