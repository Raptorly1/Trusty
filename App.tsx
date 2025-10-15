import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Search, FileText, ImageIcon } from 'lucide-react';

import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import FinalQuizPage from './pages/FinalQuizPage';
import AITextCheckerPage from './pages/AITextCheckerPage';
import AIImageCheckerPage from './pages/AIImageCheckerPage';
import FactCheckerPage from './pages/FactCheckerPage';
import ServerStatusPopup from './components/common/ServerStatusPopup';
import ServerStatusIndicator from './components/common/ServerStatusIndicator';
import { useServerStatus } from './hooks/useServerStatus';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/course', label: 'Course', icon: BookOpen },
  { path: '/text-checker', label: 'Text Checker', icon: FileText },
  { path: '/image-checker', label: 'Image Checker', icon: ImageIcon },
  { path: '/fact-checker', label: 'Fact-Checker', icon: Search },
];

// Mobile Dropdown Component
const MobileDropdown: React.FC<{
  navLinks: typeof navLinks,
  dropdownOpen: boolean,
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ navLinks, dropdownOpen, setDropdownOpen }) => (
  <div className="relative">
    <button
      tabIndex={0}
      aria-label="Open navigation menu"
      className="btn btn-ghost min-h-[44px] h-11 w-11 p-0 rounded-lg flex items-center justify-center border border-transparent hover:border-primary hover:bg-primary/10 focus:border-primary focus:bg-primary/20"
      onClick={() => setDropdownOpen((open) => !open)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    </button>
    <AnimatePresence>
      {dropdownOpen && (
        <>
          {/* Backdrop for mobile - closes dropdown when tapped */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setDropdownOpen(false)}
          />
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 z-50 p-3 shadow-lg bg-base-100 rounded-2xl w-56 border border-base-300 flex flex-col items-center"
            style={{ touchAction: 'manipulation' }} // Improve touch responsiveness
          >
            {navLinks.map(({ path, label, icon: Icon }) => (
              <li key={path} className="mb-1 last:mb-0">
                <NavLink
                  to={path}
                  className={({ isActive }) => `flex flex-col items-center justify-center gap-2 p-3 rounded-lg text-base font-medium transform transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 text-center ${
                      isActive
                        ? "text-[#6C1BA0] font-bold"
                        : "text-black hover:bg-base-200 hover:-translate-y-1 hover:scale-105"
                    }`}
                  onClick={(e) => {
                    // Allow the navigation to process first, then close dropdown
                    setTimeout(() => setDropdownOpen(false), 100);
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 mx-auto" />
                  <span className="w-full text-center">{label}</span>
                </NavLink>
              </li>
            ))}
          </motion.ul>
        </>
      )}
    </AnimatePresence>
  </div>
);

const Header: React.FC = () => {
  const { status } = useServerStatus(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coursePanelOpen, setCoursePanelOpen] = useState(false);
  const location = useLocation();
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown when location changes (mobile navigation fix)
  useEffect(() => {
    setDropdownOpen(false);
    setCoursePanelOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('trusty-header');
      if (!header) return;
      const rect = header.getBoundingClientRect();
      setIsScrolled(rect.top < 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close course panel on outside click or Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!coursePanelOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setCoursePanelOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCoursePanelOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [coursePanelOpen]);

  // simple modules list (keeps code local and avoids extra imports)
  const modules = Array.from({ length: 8 }, (_, i) => ({ id: `${i + 1}`, title: `Module ${i + 1}` }));

  const isCourseActive = location.pathname.startsWith('/course');

  return (
    <header id="trusty-header" className="bg-base-200/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 min-h-[64px] flex items-center justify-between">
        {/* Logo and mobile dropdown */}
        <div className="flex items-center gap-2 lg:gap-6 flex-shrink-0">
          <div className="lg:hidden">
            {(isScrolled || window.innerWidth < 1024) ? (
              <MobileDropdown navLinks={navLinks} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
            ) : null}
          </div>
          <NavLink to="/" className="inline-flex items-center gap-2 px-2 py-2 text-xl sm:text-2xl font-bold text-primary normal-case rounded-full border border-transparent hover:border-primary hover:bg-primary/10 focus:border-primary focus:bg-primary/20 transition">
            <img src="/Logo.png" alt="Trusty Logo" className="h-8 w-8 sm:h-12 sm:w-12 object-contain" />
            <span className="hidden xs:inline sm:inline" style={{ color: '#6c1ba0' }}>Trusty</span>
          </NavLink>
        </div>
        {/* Desktop nav links - spread out */}
        <nav className="hidden lg:flex flex-1 justify-center ml-8">
          <ul className="flex gap-6 xl:gap-10 text-base font-medium w-full justify-center items-center">
            {navLinks.map(({ path, label }) => (
              <li key={path} className="w-full flex justify-center relative">
                {path === '/course' ? (
                  <div ref={panelRef} className="relative">
                    <button
                      aria-haspopup="menu"
                      aria-expanded={coursePanelOpen}
                      onClick={() => setCoursePanelOpen(open => !open)}
                      className={`px-3 py-2 transform transition duration-200 ease-in-out flex items-center gap-2 ${isCourseActive ? 'font-bold text-[#6C1BA0] border-b-2' : 'text-base-content hover:-translate-y-1 hover:scale-105'}`}
                    >
                      {label}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {coursePanelOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-3 z-50 w-64 bg-base-100 rounded-2xl shadow-lg border border-base-300 p-3"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <ul className="flex flex-col gap-1">
                            {modules.map(m => (
                              <li key={m.id}>
                                <NavLink
                                  to={`/course/${m.id}`}
                                  className={({ isActive }) => `block w-full text-left px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-base-200 font-bold text-[#6C1BA0]' : 'hover:bg-base-200'}`}
                                  onClick={() => setCoursePanelOpen(false)}
                                >
                                  {m.title}
                                </NavLink>
                              </li>
                            ))}
                            <li>
                              <NavLink
                                to="/course/quiz"
                                className={({ isActive }) => `block w-full text-left px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-base-200 font-bold text-[#6C1BA0]' : 'hover:bg-base-200'}`}
                                onClick={() => setCoursePanelOpen(false)}
                                aria-label="Final Quiz"
                              >
                                Final Quiz
                              </NavLink>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold border-b-2 px-3 py-2 transform transition duration-200 ease-in-out text-[#6C1BA0] hover:-translate-y-1 hover:scale-105"
                        : "px-3 py-2 transform transition duration-200 ease-in-out text-base-content hover:-translate-y-1 hover:scale-105"
                    }
                    style={({ isActive }) => ({
                      borderBottomColor: isActive ? '#6C1BA0' : undefined,
                    })}
                  >
                    {label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Status and CTA */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden sm:flex">
            <ServerStatusIndicator status={status} showText size="sm" />
          </div>
          <div className="flex sm:hidden">
            <ServerStatusIndicator status={status} showText={false} size="xs" />
          </div>
          <NavLink to="/course" className="btn btn-primary min-h-[44px] h-11 px-3 sm:px-4 text-sm sm:text-base font-medium flex items-center justify-center text-center">
            <span className="hidden sm:inline w-full text-center">Start Learning</span>
            <span className="sm:hidden w-full text-center">Start</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-16">
      <nav className="grid grid-flow-col gap-4">
        {navLinks.map(({ path, label }) => (
          <NavLink key={path} to={path} className="link link-hover">{label}</NavLink>
        ))}
      </nav>
      <aside>
        <p>Made by Prahas Duggireddy and Chloesse Chang</p>
        <p className="text-sm text-base-content/70">Empowering safe and confident digital navigation for seniors.</p>
      </aside>
    </footer>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="container mx-auto px-4 py-8"
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const location = useLocation();
  const [showServerPopup, setShowServerPopup] = useState(false);
  const [hasShownWarmingPopup, setHasShownWarmingPopup] = useState(false);
  const { status, isWarming, estimatedWaitTime, startWarmUp, checkStatus } = useServerStatus(true);

  // Warm up server on initial load (non-blocking)
  useEffect(() => {
    startWarmUp();
  }, [startWarmUp]);

  // Show informational popup when server is warming and user visits AI features for the first time
  useEffect(() => {
    const aiRoutes = ['/text-checker', '/image-checker', '/fact-checker'];
    const isAIRoute = aiRoutes.some(route => location.pathname.includes(route));

    if (isAIRoute && isWarming && !hasShownWarmingPopup) {
      setShowServerPopup(true);
      setHasShownWarmingPopup(true);
    }

    // Auto-hide popup when server becomes ready
    if (status === 'ready' && showServerPopup) {
      setTimeout(() => setShowServerPopup(false), 2000);
    }
  }, [location.pathname, isWarming, hasShownWarmingPopup, status, showServerPopup]);

  const handleRetryServer = async () => {
    await checkStatus();
  };

  const handleClosePopup = () => {
    setShowServerPopup(false);
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/course" element={<PageWrapper><CoursePage /></PageWrapper>} />
            <Route path="/course/:moduleId" element={<PageWrapper><CoursePage /></PageWrapper>} />
                         <Route path="/course/quiz" element={<PageWrapper><FinalQuizPage /></PageWrapper>} />
            <Route path="/text-checker" element={<PageWrapper><AITextCheckerPage /></PageWrapper>} />
            <Route path="/image-checker" element={<PageWrapper><AIImageCheckerPage /></PageWrapper>} />
            <Route path="/fact-checker" element={<PageWrapper><FactCheckerPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />


      {/* Vercel Web Analytics - configured for SPA with route tracking */}
      <Analytics 
        mode="production"
        debug={false}
        route={location.pathname}
      />
      {/* Vercel Speed Insights - with explicit route for SPA */}
      <SpeedInsights route={location.pathname} />

      {/* Server Status Popup - Informational only */}
      <ServerStatusPopup
        status={status}
        isVisible={showServerPopup}
        estimatedWaitTime={estimatedWaitTime}
        onClose={handleClosePopup}
        onRetry={handleRetryServer}
      />
    </div>
  );
}

const RootApp: React.FC = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default RootApp;
