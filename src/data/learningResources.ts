export interface Resource {
  id: string;
  title: string;
  provider: string;
  type: "Course" | "Certification" | "YouTube Playlist" | "Documentation";
  category: "Software Development" | "Data Science & Analytics" | "Advanced Automation & Systems" | "UX/UI Design" | "Cybersecurity";
  url: string;
  isFree: boolean;
  duration: string;
}

export const LEARNING_RESOURCES: Resource[] = [
  // Software Development
  {
    id: "softdev-1",
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard University / edX",
    type: "Course",
    category: "Software Development",
    url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
    isFree: true,
    duration: "12 weeks"
  },
  {
    id: "softdev-2",
    title: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    type: "Certification",
    category: "Software Development",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    isFree: true,
    duration: "300 hours"
  },
  {
    id: "softdev-3",
    title: "JavaScript Programming Tutorial",
    provider: "Scrimba (YouTube / Platform)",
    type: "YouTube Playlist",
    category: "Software Development",
    url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    isFree: true,
    duration: "7 hours"
  },
  {
    id: "softdev-4",
    title: "Full Stack Open (React, Node, Express, DBs)",
    provider: "University of Helsinki",
    type: "Course",
    category: "Software Development",
    url: "https://fullstackopen.com/en/",
    isFree: true,
    duration: "14 weeks"
  },

  // Data Science & Analytics
  {
    id: "datasci-1",
    title: "Google Data Analytics Professional Certificate",
    provider: "Google (via Coursera - Free Audit Option)",
    type: "Certification",
    category: "Data Science & Analytics",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    isFree: true,
    duration: "6 months"
  },
  {
    id: "datasci-2",
    title: "Python for Data Science and Machine Learning",
    provider: "freeCodeCamp (YouTube)",
    type: "YouTube Playlist",
    category: "Data Science & Analytics",
    url: "https://www.youtube.com/watch?v=LHBEWDJCg9Y",
    isFree: true,
    duration: "12 hours"
  },
  {
    id: "datasci-3",
    title: "SQL for Data Analysis Tutorial",
    provider: "Mode Analytics",
    type: "Course",
    category: "Data Science & Analytics",
    url: "https://mode.com/sql-tutorial/",
    isFree: true,
    duration: "3 weeks"
  },

  // Advanced Automation & Systems
  {
    id: "ai-1",
    title: "Automation and Systems for Everyone",
    provider: "DeepLearning Platform (Andrew Ng)",
    type: "Course",
    category: "Advanced Automation & Systems",
    url: "https://www.coursera.org",
    isFree: true,
    duration: "4 weeks"
  },
  {
    id: "ai-2",
    title: "Smart API Technical Documentation",
    provider: "Google Tech",
    type: "Documentation",
    category: "Advanced Automation & Systems",
    url: "https://developers.google.com",
    isFree: true,
    duration: "Self-paced"
  },
  {
    id: "ai-3",
    title: "Generative Systems Fundamentals Course",
    provider: "Google Cloud Skill Boost",
    type: "Certification",
    category: "Advanced Automation & Systems",
    url: "https://www.cloudskillsboost.google",
    isFree: true,
    duration: "1 day"
  },

  // UX/UI Design
  {
    id: "ux-1",
    title: "Google UX Design Professional Certificate",
    provider: "Google (via Coursera - Free Audit)",
    type: "Certification",
    category: "UX/UI Design",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    isFree: true,
    duration: "6 months"
  },
  {
    id: "ux-2",
    title: "Figma UI/UX Complete Tutorial",
    provider: "DesignCourse (YouTube)",
    type: "YouTube Playlist",
    category: "UX/UI Design",
    url: "https://www.youtube.com/watch?v=FTFaQWZBqA8",
    isFree: true,
    duration: "4 hours"
  },

  // Cybersecurity
  {
    id: "cyber-1",
    title: "Google Cybersecurity Professional Certificate",
    provider: "Google (via Coursera - Free Audit)",
    type: "Certification",
    category: "Cybersecurity",
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    isFree: true,
    duration: "6 months"
  },
  {
    id: "cyber-2",
    title: "Introduction to IT & Cybersecurity",
    provider: "Cybrary",
    type: "Course",
    category: "Cybersecurity",
    url: "https://www.cybrary.it/course/introduction-to-it-and-cybersecurity",
    isFree: true,
    duration: "4 hours"
  }
];
