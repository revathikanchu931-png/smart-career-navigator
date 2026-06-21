import React, { useState, useEffect, useRef } from "react";
import { Code, Play, RefreshCw, Terminal, CheckCircle2, AlertCircle, FileCode, Layers, Server, Globe2, BookOpen } from "lucide-react";

type LabTechnology = "java" | "web" | "node_express";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export default function DevPracticeLab() {
  const [activeTech, setActiveTech] = useState<LabTechnology>("web");

  // Web (HTML/JS/CSS) Sandbox States
  const [htmlCode, setHtmlCode] = useState(`<!-- HTML elements structure -->
<div class="card">
  <h1>🚀 Welcome to Web Practice</h1>
  <p>Practice writing HTML, CSS, and modern JavaScript in real-time!</p>
  <button id="alertBtn">Interact with JS</button>
</div>`);

  const [cssCode, setCssCode] = useState(`/* CSS Styling overrides */
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #a855f7);
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  text-align: center;
  max-width: 400px;
}

h1 {
  color: #1e1b4b;
  font-size: 1.75rem;
  margin-top: 0;
}

p {
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.5;
}

button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}`);

  const [jsCode, setJsCode] = useState(`// JavaScript interactive behaviors
const button = document.getElementById("alertBtn");

button.addEventListener("click", () => {
  button.style.backgroundColor = "#10b981";
  button.innerText = "✨ Magic Applied!";
  
  // Custom temporary dynamic dynamic logs setup
  console.log("Button clicked and styles mutated!");
});`);

  const [webOutputHtml, setWebOutputHtml] = useState("");
  const [webLogs, setWebLogs] = useState<string[]>([]);

  // Java Playground & Compiler simulator status
  const javaChallenges = [
    {
      id: "java-1",
      title: "Array Reversal Algorithmic Method",
      description: "Complete the static method reverseArray(int[] arr) that reverses an array of integers in-place.",
      starterCode: `public class Solution {
    public static void reverseArray(int[] arr) {
        // TODO: Implement in-place reversal logic below
        
    }
}`,
      correctCodeContains: ["arr[", "temp", "arr[i]", "arr[arr.length"],
      quizQuestion: {
        question: "Which keyword in Java is used to prevent a class from being inherited or overridden?",
        options: ["static", "final", "abstract", "private"],
        correctIdx: 1,
        explanation: "The 'final' keyword in Java prevents classes from being subclassed and methods from being overridden."
      }
    },
    {
      id: "java-2",
      title: "String Palindrome Verification",
      description: "Implement a public method checking if a given string represents a valid palindrome (case insensitive).",
      starterCode: `public class Solution {
    public static boolean isPalindrome(String text) {
        // TODO: Write palindrome logic returning true/false
        return false;
    }
}`,
      correctCodeContains: ["toLowerCase()", "equals", "charAt"],
      quizQuestion: {
        question: "What is the size of the basic 'double' type in absolute Java memory allocations?",
        options: ["4 bytes", "8 bytes", "16 bytes", "32 bits"],
        correctIdx: 1,
        explanation: "Java double-precision floats ('double') are 64-bit IEEE 754 floating point numbers, occupying exactly 8 bytes of storage."
      }
    }
  ];

  const [activeJavaIdx, setActiveJavaIdx] = useState(0);
  const [javaCode, setJavaCode] = useState(javaChallenges[0].starterCode);
  const [javaOutput, setJavaOutput] = useState("");
  const [javaVerified, setJavaVerified] = useState<boolean | null>(null);
  const [javaQuizAnswered, setJavaQuizAnswered] = useState<number | null>(null);

  // Node.js & Express API Routes Router simulator States
  const [routeType, setRouteType] = useState<"GET" | "POST">("GET");
  const [routePath, setRoutePath] = useState("/api/careers");
  const [requestBodyJson, setRequestBodyJson] = useState(`{
  "skills": ["React", "CSS", "Express"],
  "experience": "junior"
}`);

  const [serverConsoleLogs, setServerConsoleLogs] = useState<string[]>(["Express server initialized on Port 3000.", "Middleware routing mounted successfully."]);
  const [responseHeaders, setResponseHeaders] = useState<string>("Content-Type: application/json\nAccess-Control-Allow-Origin: *");
  const [responseBody, setResponseBody] = useState<string>("{}");
  const [apiStatusCode, setApiStatusCode] = useState<number>(200);

  // Auto-run web playground when code changes
  useEffect(() => {
    if (activeTech === "web") {
      runWebCode();
    }
  }, [htmlCode, cssCode, jsCode, activeTech]);

  // Handle active java challenge swap
  useEffect(() => {
    setJavaCode(javaChallenges[activeJavaIdx].starterCode);
    setJavaOutput("");
    setJavaVerified(null);
    setJavaQuizAnswered(null);
  }, [activeJavaIdx]);

  // Synchronous HTML, CSS, and JS preview bundler setup
  const runWebCode = () => {
    setWebLogs([]);
    const compiled = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            // Redirect console logs to catch inside preview
            const _log = console.log;
            console.log = function(...args) {
              _log.apply(console, args);
              window.parent.postMessage({ type: 'LOG', content: args.join(' ') }, '*');
            };
            
            try {
              ${jsCode}
            } catch(e) {
              console.log("JavaScript ERROR: " + e.message);
            }
          </script>
        </body>
      </html>
    `;
    setWebOutputHtml(compiled);
  };

  // Log post messaging listener
  useEffect(() => {
    const handleLogMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "LOG") {
        setWebLogs((prev) => [...prev, `[client-console.log] ${event.data.content}`]);
      }
    };
    window.addEventListener("message", handleLogMessage);
    return () => window.removeEventListener("message", handleLogMessage);
  }, []);

  // Simulate execution of Java Code
  const runJavaSimulation = () => {
    setJavaOutput("");
    setJavaVerified(false);

    let outputLines = [
      `$ javac Solution.java`,
      `Solution.java: compiled successfully.`,
      `$ java SolutionTestRunner`,
      `Launching target Unit test array checks...`
    ];

    const containsPrereqs = javaChallenges[activeJavaIdx].correctCodeContains.every(sub => javaCode.includes(sub));

    setTimeout(() => {
      if (containsPrereqs) {
        outputLines.push(`[SUCCESS] Test Case 1 passed: Input matches standard arrays.`);
        outputLines.push(`[SUCCESS] Test Case 2 passed: Bound checks return matching outputs.`);
        outputLines.push(`\nAll checks terminated with status code 0 (Success).`);
        setJavaOutput(outputLines.join("\n"));
        setJavaVerified(true);
      } else {
        outputLines.push(`[FAIL] Test Case 1 failed: Syntax compiles, but logical assertions missed critical statements.`);
        outputLines.push(`[HINT] Ensure your code leverages correct temporary structural storage variables: [${javaChallenges[activeJavaIdx].correctCodeContains.join(", ")}]`);
        outputLines.push(`\nCompilation terminated with unit test status code 1.`);
        setJavaOutput(outputLines.join("\n"));
        setJavaVerified(false);
      }
    }, 850);
  };

  // Simulate Express API calls
  const handleSimulateExpressCall = () => {
    const timestamp = new Date().toLocaleTimeString();
    let logs = [...serverConsoleLogs];
    logs.push(`[${timestamp}] ${routeType} ${routePath} - processing dynamic routing handler`);

    let statusCode = 200;
    let respHeaders = "Content-Type: application/json; charset=utf-8\nConnection: keep-alive\nX-Powered-By: Express";
    let body = "{}";

    try {
      if (routePath === "/api/careers") {
        if (routeType === "GET") {
          body = JSON.stringify({
            status: "success",
            source: "Express Server",
            message: "Curated active developer paths",
            availableTracks: ["Java Engineer", "Full Stack Developer", "Express API Architect"]
          }, null, 2);
        } else {
          // POST
          const parsed = JSON.parse(requestBodyJson);
          logs.push(`[${timestamp}] POST /api/careers - Payload body extracted: ` + JSON.stringify(parsed));
          body = JSON.stringify({
            status: "success",
            received: true,
            analyzedSkills: parsed.skills || [],
            recommendedRole: (parsed.skills || []).includes("React") ? "Frontend Lead" : "Java Backend Architect",
            timestamp: new Date().toISOString()
          }, null, 2);
        }
      } else if (routePath === "/api/server-stats") {
        body = JSON.stringify({
          node_version: "v20.11.0",
          express_version: "v5.0.0",
          uptime_seconds: Math.floor(Math.random() * 5000) + 120,
          memory_rss_mb: 84.5
        }, null, 2);
      } else if (routePath === "/api/java-lesson") {
        body = JSON.stringify({
          title: "Introduction to OOP Java Classes",
          difficulty: "Beginner",
          topics: ["Constructors", "Inheritance", "Polymorphism", "Encapsulation"],
          sandboxEnabled: true
        }, null, 2);
      } else {
        statusCode = 404;
        body = JSON.stringify({
          status: "error",
          error: "Endpoint not found",
          suggestion: "Supported express endpoints: /api/careers, /api/server-stats, /api/java-lesson"
        }, null, 2);
      }
    } catch (e: any) {
      statusCode = 400;
      body = JSON.stringify({
        status: "error",
        error: "Bad JSON Request Payload Structure",
        description: e.message
      }, null, 2);
      logs.push(`[${timestamp}] Middleware exception: JSON validation failed!`);
    }

    setServerConsoleLogs(logs);
    setApiStatusCode(statusCode);
    setResponseHeaders(respHeaders);
    setResponseBody(body);
  };

  return (
    <div className="bg-white dark:bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm font-sans animate-fade-in" id="practice-lab-container">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
            Developer Code Practice Lab
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build hands-on expertise. Toggle the options below to interactively test and practice core patterns across <strong>Java, HTML, JS, CSS, Node.js, and Express</strong>.
          </p>
        </div>

        {/* Counter indicator */}
        <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-xs font-mono font-semibold">
          <Code className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>OFFLINE INTERACTIVE REFRESHER</span>
        </div>
      </div>

      {/* Select active technology tab row */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-150 dark:border-slate-800/80 mb-6 max-w-2xl">
        <button
          onClick={() => setActiveTech("web")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTech === "web"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Globe2 className="w-4 h-4 text-blue-500" />
          Web Setup (HTML/JS/CSS)
        </button>

        <button
          onClick={() => setActiveTech("java")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTech === "java"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <FileCode className="w-4 h-4 text-orange-500" />
          Java Algorithms Lab
        </button>

        <button
          onClick={() => setActiveTech("node_express")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTech === "node_express"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <Server className="w-4 h-4 text-green-500" />
          Node.js & Express API
        </button>
      </div>

      {/* Technology-specific container renders */}

      {/* 1. WEB SANDBOX ENVIRONMENT */}
      {activeTech === "web" && (
        <div className="space-y-6 animate-slide-in">
          {/* Bento grid editors */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* HTML Input card */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col h-72">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">HTML Markups Markup</span>
              </div>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full flex-grow bg-slate-900/90 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-auto outline-none border border-slate-750 resize-none"
              />
            </div>

            {/* CSS Input card */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col h-72">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Responsive CSS Styles</span>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full flex-grow bg-slate-900/90 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-auto outline-none border border-slate-750 resize-none"
              />
            </div>

            {/* Javascript Input card */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col h-72">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">JavaScript Action Logic</span>
              </div>
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full flex-grow bg-slate-900/90 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-auto outline-none border border-slate-750 resize-none"
              />
            </div>

          </div>

          {/* Quick controls row */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl">
            <span className="text-xs text-slate-500 font-medium font-sans">
              ✨ Instant compilation activated. Every keyboard stroke triggers hot iframe preview!
            </span>
            <button
              onClick={runWebCode}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Force Redraw Screen
            </button>
          </div>

          {/* Result visual layout frame */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Live sandbox iframe screen (Takes 3 columns) */}
            <div className="bg-slate-100 dark:bg-slate-920 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-3 lg:col-span-3 flex flex-col h-96 [color-scheme:light]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="text-xs font-semibold text-slate-550 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  Visual Live Render Window (Embedded sandbox page)
                </span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                </div>
              </div>
              
              {webOutputHtml ? (
                <iframe
                  title="Web Sandbox Preview Frame"
                  srcDoc={webOutputHtml}
                  sandbox="allow-scripts"
                  className="w-full flex-grow bg-white border-0 rounded-xl"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Write some markup above to render dynamic nodes!
                </div>
              )}
            </div>

            {/* Simulated browser logs window console */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col h-96 col-span-1">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 tracking-wide font-mono">
                <Terminal className="w-4 h-4 text-emerald-500" />
                REACTIVE CONSOLE.LOGS
              </span>
              <div className="flex-grow font-mono text-[10px] text-emerald-400 overflow-auto space-y-1.5 pr-2">
                {webLogs.length === 0 ? (
                  <p className="text-slate-500 italic">No console logs emitted. Use console.log() in your Javascript block above!</p>
                ) : (
                  webLogs.map((log, idx) => (
                    <div key={idx} className="border-b border-slate-800 pb-1.5 leading-snug break-all">{log}</div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. JAVA ALGORITHMIC PLAYGROUND */}
      {activeTech === "java" && (
        <div className="space-y-6 animate-slide-in">
          
          {/* Challenges selector tabs */}
          <div className="flex gap-2">
            {javaChallenges.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setActiveJavaIdx(idx)}
                className={`text-xs px-4 py-2.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeJavaIdx === idx
                    ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950/40 dark:border-orange-900 dark:text-orange-350"
                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <FileCode className="w-4 h-4 text-orange-500" />
                {ch.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Java Code panel editor */}
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80">
                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3.5 mb-4">
                  <div className="text-left">
                    <span className="text-[10px] font-mono tracking-wider font-bold text-orange-600 block">JAVA PRACTICE CHALLENGE</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{javaChallenges[activeJavaIdx].title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-350 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                      VERIFICATION REQUIRED
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-normal font-medium">
                  {javaChallenges[activeJavaIdx].description}
                </p>

                {/* Textarea editor style */}
                <div className="relative">
                  <textarea
                    value={javaCode}
                    onChange={(e) => setJavaCode(e.target.value)}
                    rows={12}
                    className="w-full bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-auto outline-none border border-slate-800 resize-none leading-relaxed"
                  />
                  <button
                    onClick={runJavaSimulation}
                    className="absolute right-3.5 bottom-4.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer shadow-md flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Run Compiler Tests
                  </button>
                </div>
              </div>
            </div>

            {/* Test results and quiz */}
            <div className="space-y-4">
              
              {/* Output log console */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 h-52 flex flex-col justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 block tracking-wider uppercase border-b border-slate-900 pb-2.5 mb-2 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-orange-400 animate-pulse" />
                  JVM compiler output simulation logs
                </span>
                <pre className="flex-grow font-mono text-[10px] text-orange-300 overflow-auto whitespace-pre-wrap leading-relaxed pr-2">
                  {javaOutput || "Status: Awaiting compilation execution. Modify the template logic and submit."}
                </pre>
                
                {javaVerified !== null && (
                  <div className={`mt-2 p-2.5 rounded-xl text-xs font-sans font-semibold flex items-center gap-2 ${
                    javaVerified 
                      ? "bg-green-950/40 text-green-400 border border-green-900" 
                      : "bg-red-950/40 text-red-400 border border-red-900"
                  }`}>
                    {javaVerified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>All checks successfully passed! Your reverse code satisfies requirements.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>Logic failed assertions checklist. Review the structural helpers!</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Theory Java conceptual quiz block */}
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 space-y-3">
                <span className="text-[10px] font-mono tracking-wider font-bold text-orange-600 uppercase block">CONCEPTUAL ASSESSMENT CHECKPOINT</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {javaChallenges[activeJavaIdx].quizQuestion.question}
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {javaChallenges[activeJavaIdx].quizQuestion.options.map((option, idx) => {
                    const isSelected = javaQuizAnswered === idx;
                    const isCorrect = idx === javaChallenges[activeJavaIdx].quizQuestion.correctIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setJavaQuizAnswered(idx)}
                        className={`text-left p-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          javaQuizAnswered === null 
                            ? "bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
                            : isSelected
                              ? isCorrect
                                ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800"
                                : "bg-red-100 border-red-400 text-red-800 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                              : isCorrect
                                ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800"
                                : "bg-white dark:bg-slate-850 opacity-40 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {idx + 1}. {option}
                      </button>
                    );
                  })}
                </div>

                {javaQuizAnswered !== null && (
                  <p className="text-[11px] bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100/40 text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                    <strong>{javaQuizAnswered === javaChallenges[activeJavaIdx].quizQuestion.correctIdx ? "🎉 Correct!" : "⚠ Incorrect!"}</strong> {javaChallenges[activeJavaIdx].quizQuestion.explanation}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. NODE JS & EXPRESS ROUTER SIMULATOR */}
      {activeTech === "node_express" && (
        <div className="space-y-6 animate-slide-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Express Config console */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl lg:col-span-1 space-y-4">
              <span className="text-[10px] font-mono tracking-wider font-bold text-green-600 uppercase block">SIMULATE EXPRESS CONTROLLER CLIENT</span>
              
              <div className="space-y-3.5 pt-1">
                {/* Method selector */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Request Method type</label>
                  <div className="flex gap-2">
                    {["GET", "POST"].map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setRouteType(method as "GET" | "POST");
                          if (method === "GET") {
                            setRoutePath("/api/careers");
                          }
                        }}
                        className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          routeType === method
                            ? method === "GET"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-500"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Path selection list */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Target Router Endpoint URI</label>
                  <select
                    value={routePath}
                    onChange={(e) => setRoutePath(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none text-slate-700 dark:text-slate-200"
                  >
                    {routeType === "GET" ? (
                      <>
                        <option value="/api/careers">/api/careers (Curriculum Tracks)</option>
                        <option value="/api/server-stats">/api/server-stats (Uptime metrics)</option>
                        <option value="/api/java-lesson">/api/java-lesson (Get syllabus data)</option>
                        <option value="/api/missing-route">/api/undefined (Trigger 444 custom 404)</option>
                      </>
                    ) : (
                      <>
                        <option value="/api/careers">/api/careers (Evaluate profiles body)</option>
                        <option value="/api/invalid-json">/api/careers (Force JSON crash review)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* POST Request Body JSON input */}
                {routeType === "POST" && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 font-mono">POST Payload body (json)</label>
                    <textarea
                      value={routePath === "/api/invalid-json" ? "{\n  invalid-json-text: missing\n}" : requestBodyJson}
                      onChange={(e) => setRequestBodyJson(e.target.value)}
                      disabled={routePath === "/api/invalid-json"}
                      rows={5}
                      className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-[11px] outline-none border border-slate-800 resize-none leading-relaxed"
                    />
                  </div>
                )}

                {/* Execute Simulated Call button */}
                <button
                  onClick={handleSimulateExpressCall}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl cursor-pointer shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Server className="w-4 h-4 text-green-300" />
                  Request Simulated Express router
                </button>
              </div>
            </div>

            {/* Server logs & output panels */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Console log monitors panel */}
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl h-44 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 block border-b border-slate-900 pb-2.5 mb-2.5 tracking-wider uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
                  NODE JS ENVIRONMENT CONSOLE LOG PATHS
                </span>
                <div className="flex-grow font-mono text-[10px] text-slate-300 overflow-auto space-y-1 pr-2">
                  {serverConsoleLogs.map((log, idx) => (
                    <div key={idx} className="leading-snug text-slate-350">{log}</div>
                  ))}
                </div>
              </div>

              {/* Server JSON Response packet header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64">
                
                {/* Headers column info */}
                <div className="bg-slate-900 border border-slate-830 p-4 rounded-xl flex flex-col h-full md:col-span-1">
                  <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-2 font-mono border-b border-slate-800 pb-1.5">
                    HTTP HEADERS OUT
                  </span>
                  <div className="font-mono text-[10px] text-indigo-300 space-y-1 overflow-auto">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 block text-orange-400 mb-2">
                      HTTP Status: {apiStatusCode}
                    </div>
                    <pre className="whitespace-pre-wrap">{responseHeaders}</pre>
                  </div>
                </div>

                {/* Response payload body output */}
                <div className="bg-slate-900 border border-slate-830 p-4 rounded-xl flex flex-col h-full md:col-span-2">
                  <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-2 font-mono border-b border-slate-800 pb-1.5 flex justify-between items-center">
                    <span>EXPRESS JSON RESPONSE</span>
                    <span className="text-[9px] bg-green-950 text-green-400 border border-green-900 px-1.5 py-0.5 rounded">Success payload</span>
                  </span>
                  <div className="flex-grow overflow-auto bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <pre className="font-mono text-[11px] text-emerald-400 leading-relaxed">{responseBody}</pre>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Theoretical notes */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">NodeJS & Express Architectural Guidelines</span>
              <p className="text-xs text-slate-500 leading-normal font-sans">
                Notice how Express handles endpoints by executing middleware controllers. This exact structural sequence runs inside our production containers. Feel free to copy these routing patterns directly into your real server repositories.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
