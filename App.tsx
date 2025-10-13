
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Search, FileText, ImageIcon, CheckSquare } from 'lucide-react';

import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import AITextCheckerPage from './pages/AITextCheckerPage';
import FeedbackToolPage from './pages/FeedbackToolPage';
import AIImageCheckerPage from './pages/AIImageCheckerPage';
import FactCheckerPage from './pages/FactCheckerPage';
import ServerStatusPopup from './components/common/ServerStatusPopup';
import ServerStatusIndicator from './components/common/ServerStatusIndicator';
import { useServerStatus } from './hooks/useServerStatus';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/course', label: 'Course', icon: BookOpen },
  { path: '/text-checker', label: 'Text Checker', icon: FileText },
  { path: '/feedback-tool', label: 'Feedback Tool', icon: CheckSquare },
  { path: '/image-checker', label: 'Image Checker', icon: ImageIcon },
  { path: '/fact-checker', label: 'Fact-Checker', icon: Search },
];



// Move MobileDropdown out of Header
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
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 mt-2 z-50 p-3 shadow-lg bg-base-100 rounded-2xl w-56 border border-base-300"
        >
          {navLinks.map(({ path, label, icon: Icon }) => (
            <li key={path} className="mb-1 last:mb-0">
              <NavLink
                to={path}
                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg text-base font-medium transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200 text-base-content"
                }`}
                onClick={() => setDropdownOpen(false)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  </div>
);

const Header: React.FC = () => {
  const { status } = useServerStatus(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            <span className="hidden xs:inline sm:inline">Trusty</span>
          </NavLink>
        </div>
        {/* Desktop nav links - spread out */}
        <nav className="hidden lg:flex flex-1 justify-start ml-8">
          <ul className="flex gap-6 xl:gap-10 text-base font-medium">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <NavLink to={path} className={({ isActive }) => isActive ? "active text-primary" : "hover:text-primary/80"}>{label}</NavLink>
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
          <a className="btn btn-primary min-h-[44px] h-11 px-3 sm:px-4 text-sm sm:text-base font-medium" href="#/course">
            <span className="hidden sm:inline">Start Learning</span>
            <span className="sm:hidden">Start</span>
          </a>
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
        <p className="text-sm text-base-content/70">Empowering safe and confident digital navigation.</p>
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
    const aiRoutes = ['/text-checker', '/image-checker', '/fact-checker', '/feedback-tool'];
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
            <Route path="/text-checker" element={<PageWrapper><AITextCheckerPage /></PageWrapper>} />
            <Route path="/feedback-tool" element={<PageWrapper><FeedbackToolPage /></PageWrapper>} />
            <Route path="/image-checker" element={<PageWrapper><AIImageCheckerPage /></PageWrapper>} />
            <Route path="/fact-checker" element={<PageWrapper><FactCheckerPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      
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
    <HashRouter>
        <App />
    </HashRouter>
);

export default RootApp;
