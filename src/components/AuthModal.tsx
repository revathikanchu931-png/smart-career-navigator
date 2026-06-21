import React, { useState } from "react";
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  googleProvider,
  signInWithPopup
} from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { X, Mail, Lock, User, Sparkles, ShieldAlert, LogIn, CheckCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        // Create Firebase Auth user
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Save user profile in firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: fullName,
          createdAt: new Date().toISOString(),
          skills: [],
          desiredRole: ""
        });

        setSuccessMsg("Account created successfully! Logging you in...");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Logged in successfully! Welcome back.");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "An authentication error occurred.";
      if (err.code === "auth/email-already-in-use") msg = "This email is already registered.";
      if (err.code === "auth/invalid-credential") msg = "Incorrect password or email.";
      if (err.code === "auth/web-channel-to-gapi") msg = "CORS block on IFrame credentials. Please try our instant Demo Profile login below!";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Safe login for demo purposes inside sandboxed previews (where popups might be blocked)
  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Sign in using our pre-existing demo email or register it
      const demoEmail = "demo.student@careernavigator.ai";
      const demoPass = "DemoStudent123";
      
      try {
         await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (loginErr) {
         // Create fresh if not exists
         const credential = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
         const user = credential.user;
         await setDoc(doc(db, "users", user.uid), {
           uid: user.uid,
           email: user.email,
           displayName: "Demo Student Navigator",
           createdAt: new Date().toISOString(),
           skills: ["React", "JavaScript", "HTML", "CSS", "Python", "SQL"],
           desiredRole: "Frontend Developer"
         });
      }
      
      setSuccessMsg("Instant Demo User signed in successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to start demo credentials. Please create a custom email account instead!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="auth-modal-overlay">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 transform transition-transform duration-300">
        
        {/* Banner header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            id="auth-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
              Secure Auth
            </span>
          </div>
          <h2 className="text-xl font-bold font-sans">
            {isSignUp ? "Join Smart Career Navigator" : "Welcome Back"}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {isSignUp ? "Launch your professional career with smart guides." : "Log in to view your career dashboards, saved jobs, and track lessons."}
          </p>
        </div>

        {/* Form area */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl border border-red-200 dark:border-red-900 text-xs" id="auth-error">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-start gap-2.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 p-3.5 rounded-xl border border-green-200 dark:border-green-900 text-xs" id="auth-success">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., Jessica Albus"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
                    id="input-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
                  id="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
                  id="input-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 duration-250 cursor-pointer"
              id="submit-auth-form"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isSignUp ? "Register Account" : "Access Platform"}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-mono tracking-widest uppercase">
              Sandbox-Proof Demo Code
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Fast Demo login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-indigo-300 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-semibold text-xs py-2.5 rounded-xl transition-all font-mono mb-4 cursor-pointer"
            id="btn-demo-login"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            USE INSTANT DEMO ACCOUNT (1-CLICK)
          </button>

          {/* Toggle view links */}
          <div className="text-center text-xs text-slate-500 mt-4">
            {isSignUp ? (
              <span>
                Already registered?{" "}
                <button 
                  onClick={() => setIsSignUp(false)} 
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline ml-1 cursor-pointer"
                  id="btn-toggle-login"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                First time visitor?{" "}
                <button 
                  onClick={() => setIsSignUp(true)} 
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline ml-1 cursor-pointer"
                  id="btn-toggle-signup"
                >
                  Create Student Account
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
