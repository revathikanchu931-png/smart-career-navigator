import React from "react";
import { User } from "../firebase";
import { Compass, Briefcase, GraduationCap, FileText, BarChart2, MessageSquare, LogIn, LogOut, Sun, Moon, Menu, X, Code } from "lucide-react";

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  darkMode,
  toggleDarkMode,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2, protected: true },
    { id: "assessment", label: "Assessment", icon: Compass, protected: false },
    { id: "advisor", label: "Career Advisor", icon: MessageSquare, protected: false },
    { id: "resume", label: "ATS Resume", icon: FileText, protected: false },
    { id: "skillgap", label: "Skill Gap", icon: GraduationCap, protected: false },
    { id: "jobs", label: "Jobs", icon: Briefcase, protected: false },
    { id: "resources", label: "Courses", icon: GraduationCap, protected: false },
    { id: "sandbox", label: "Practice Lab", icon: Code, protected: false },
  ];

  const visibleItems = navItems.filter(item => !item.protected || user);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200" id="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleTabClick(user ? "dashboard" : "landing")}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold" id="brand-logo">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-sans font-bold text-base xl:text-lg tracking-tight text-slate-900 dark:text-white">
                Smart Career <span className="hidden xl:inline text-indigo-600 dark:text-indigo-400">Navigator</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Actions & Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
              id="theme-toggler"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 xl:gap-3">
                <div className="hidden xl:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Student</span>
                </div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-indigo-100 paint-current"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200">
                    {(user.displayName || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs xl:text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  id="btn-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs xl:text-sm px-3.5 py-2 rounded-xl transition-all shadow-sm duration-200"
                id="btn-login-open"
              >
                <LogIn className="w-4 h-4" />
                Get Started
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-850"
              id="theme-toggler-mobile"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 pb-4 border-t border-slate-200 dark:border-slate-800 px-4">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200">
                      {(user.displayName || user.email || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      {user.displayName || user.email?.split("@")[0]}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Student</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-red-200 dark:border-red-950 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-xl font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
