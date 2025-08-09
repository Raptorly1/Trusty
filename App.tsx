
import React from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Search, FileText, ImageIcon, CheckSquare, Shield } from 'lucide-react';

import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import AITextCheckerPage from './pages/AITextCheckerPage';
import FeedbackToolPage from './pages/FeedbackToolPage';
import AIImageCheckerPage from './pages/AIImageCheckerPage';
import FactCheckerPage from './pages/FactCheckerPage';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/course', label: 'Course', icon: BookOpen },
  { path: '/text-checker', label: 'Text Checker', icon: FileText },
  { path: '/feedback-tool', label: 'Feedback Tool', icon: CheckSquare },
  { path: '/image-checker', label: 'Image Checker', icon: ImageIcon },
  { path: '/fact-checker', label: 'Fact-Checker', icon: Search },
];

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="navbar container mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}><NavLink to={path} className={({ isActive }) => isActive ? "active" : ""}> <Icon className="h-4 w-4" /> {label}</NavLink></li>
              ))}
            </ul>
          </div>
          <NavLink to="/" className="inline-flex items-center gap-2 px-4 py-2 text-2xl font-bold text-primary normal-case rounded-full border border-transparent hover:border-primary hover:bg-primary/10 focus:border-primary focus:bg-primary/20 transition">
            <Shield className="h-7 w-7" /> Trusty
          </NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-base font-medium">
            {navLinks.map(({ path, label }) => (
              <li key={path}><NavLink to={path} className={({ isActive }) => isActive ? "active" : ""}>{label}</NavLink></li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn btn-primary" href="#/course">Start Learning</a>
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
        <p>All right reserved by Trusty</p>
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

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/course" element={<PageWrapper><CoursePage /></PageWrapper>} />
            <Route path="/text-checker" element={<PageWrapper><AITextCheckerPage /></PageWrapper>} />
            <Route path="/feedback-tool" element={<PageWrapper><FeedbackToolPage /></PageWrapper>} />
            <Route path="/image-checker" element={<PageWrapper><AIImageCheckerPage /></PageWrapper>} />
            <Route path="/fact-checker" element={<PageWrapper><FactCheckerPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

const RootApp: React.FC = () => (
    <HashRouter>
        <App />
    </HashRouter>
);

export default RootApp;
