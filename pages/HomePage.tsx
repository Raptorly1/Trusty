// Animated counter hook
import React, { useEffect, useRef, useState } from 'react';

function useCountUp({ end, duration = 1, format }: { end: number, duration?: number, format?: (n: number) => string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start = 0;
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const value = Math.floor(progress * (end - start) + start);
      setCount(value);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [end, duration]);
  return format ? format(count) : count;
}

import { BookOpen, Shield, DollarSign, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// import TestimonialCarousel from '../components/common/TestimonialCarousel';
// import { topCarouselTestimonials, bottomCarouselTestimonials } from '../constants/testimonialsData';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, link: string }> = ({ icon, title, description, link }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
  className="card bg-base-100 shadow-xl border h-full" style={{ borderColor: '#6C1BA0' }}
  >
    <div className="card-body items-center text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
  style={{ backgroundColor: '#6C1BA01A' }} // 10% opacity
        className="p-4 rounded-full mb-4"
      >
        {icon}
      </motion.div>
  <h2 className="card-title text-2xl" style={{ color: '#6C1BA0' }}>{title}</h2>
      <p className="text-lg text-base-content/80">{description}</p>
      <div className="card-actions justify-end mt-4">
  <NavLink to={link} style={{ borderColor: '#6C1BA0', color: '#6C1BA0' }} className="btn btn-outline">
          Use Tool
        </NavLink>
      </div>
    </div>
  </motion.div>
);

const HomePage: React.FC = () => {
// NOTE: Ensure mobile-first responsive design. Use Tailwind breakpoints (sm:, md:, lg:) so mobile styles apply by default and desktop styles only at larger widths.
  
  // Force layout recalculation on mount to fix iOS Safari Intersection Observer issues
  useEffect(() => {
    // Trigger a reflow to ensure IntersectionObserver works correctly on iOS
    const forceReflow = () => {
      document.body.offsetHeight;
      window.scrollTo(0, 0);
    };
    
    // Run immediately and after a short delay to ensure animations initialize
    forceReflow();
    const timer = setTimeout(forceReflow, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-16 relative">
      {/* 1. Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
  className="hero min-h-[60vh] rounded-box flex flex-col justify-center items-center py-8" style={{ backgroundColor: '#F3F0F8' }}
      >
        <div className="max-w-3xl w-full text-center space-y-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold mb-4" style={{ color: '#6C1BA0' }}>
            A compass for navigating the misinformation era
          </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl md:text-3xl text-base-content/80 mb-6">
              Build resilience against <span style={{ color: '#6C1BA0' }}>AI-powered misinformation</span> and digital manipulation
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl md:text-2xl text-base-content/90 mb-4"
            >
              Trusty is a free AI-powered system that helps users, especially high-risk populations such as seniors, identify online threats, verify information, and make trustworthy digital decisions through explainable, evidence-based insights.
            </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              <NavLink
                to="/course"
                className="btn btn-lg text-xl mt-8 shadow-lg transition-colors duration-200"
                style={{ backgroundColor: '#6C1BA0', color: '#fff' }}
                aria-label="Explore Courses"
              >
                <BookOpen className="mr-2" /> Explore Curriculum
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. The Threat Landscape */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
  className="max-w-4xl mx-auto text-center py-12 rounded-xl" style={{ backgroundColor: '#fff' }}
      >
  <h2 className="text-5xl font-bold mb-12" style={{ color: '#6C1BA0' }}>The Threat Landscape</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* $4.2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.7 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <DollarSign className="h-10 w-10 mb-2" style={{ color: '#6C1BA0' }} />
            <p className="font-bold text-3xl mb-2" style={{ color: '#6C1BA0' }}>$4.2B+</p>
            <p>Lost to fraud in 2024 as threat actors scale with AI</p>
          </motion.div>
          {/* Deepfakes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <Shield className="h-10 w-10 mb-2" style={{ color: '#6C1BA0' }} />
            <p className="font-bold text-3xl mb-2" style={{ color: '#6C1BA0' }}>Deepfakes</p>
            <p>Synthetic media at scale—voice, video, and text</p>
          </motion.div>
          {/* Speed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <BookOpen className="h-10 w-10 mb-2" style={{ color: '#6C1BA0' }} />
            <p className="font-bold text-3xl mb-2" style={{ color: '#6C1BA0' }}>Attack Velocity</p>
            <p>Campaigns launch in minutes, not days</p>
          </motion.div>
        </div>
        <p className="text-2xl text-base-content/80 max-w-2xl mx-auto">Arm yourself with the skills to identify, analyze, and respond to modern digital threats.</p>
      </motion.section>

      {/* 3. Core Competencies */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
  className="max-w-4xl mx-auto py-12 rounded-xl" style={{ backgroundColor: '#F3F0F8' }}
      >
  <h2 className="text-5xl font-bold text-center mb-10" style={{ color: '#6C1BA0' }}>Core Competencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Media Forensics</span>
              <div className="text-lg">Detect AI-generated audio, video, and images</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Source Verification</span>
              <div className="text-lg">Trace claims to origin and verify credibility</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Social Engineering</span>
              <div className="text-lg">Recognize phishing, scam, and manipulation tactics</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Threat Response</span>
              <div className="text-lg">Report incidents and escalate appropriately</div>
            </div>
          </div>
        </div>
        <p className="text-xl text-center text-base-content/70 mt-10">Actionable skills for the modern threat environment.</p>
      </motion.section>

      {/* 5. Curriculum Overview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.7, delay: 0.3 }}
  className="max-w-4xl mx-auto py-12 rounded-xl" style={{ backgroundColor: '#fff' }}
      >
  <h2 className="text-5xl font-bold text-center mb-12" style={{ color: '#6C1BA0' }}>Digital Safety Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Threat Fundamentals",
              desc: "Foundations of digital manipulation"
            },
            {
              title: "Social Engineering",
              desc: "Psychological tactics and defense"
            },
            {
              title: "Synthetic Media",
              desc: "Deepfakes and AI-generated content"
            },
            {
              title: "Source Intelligence",
              desc: "Verification and attribution"
            },
            {
              title: "Privacy & OpSec",
              desc: "Operational security practices"
            },
            {
              title: "AI & Disinformation",
              desc: "ML-powered misinformation"
            },
            {
              title: "Digital Hygiene",
              desc: "Attack surface reduction"
            },
            {
              title: "Incident Response",
              desc: "Reporting and escalation"
            },
            {
              title: "Assessment",
              desc: "Verify your competency"
            }
          ].map((mod, idx) => (
            <NavLink
              key={mod.title}
              to={idx === 8 ? "/course/quiz" : `/course/${idx + 1}`}
              className={`bg-base-100 rounded-xl shadow p-6 border flex flex-col items-start gap-4 transition hover:scale-105 cursor-pointer`}
              style={{ borderColor: idx === 8 ? '#6C1BA0' : '#E5E7EB' }}
              aria-label={`Open module ${idx + 1}: ${mod.title}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`rounded-full text-white font-bold text-xl w-10 h-10 flex items-center justify-center`} style={{ backgroundColor: '#6C1BA0' }}>
                  {(idx+1).toString().padStart(2, '0')}
                </div>
                <span className={`text-2xl font-bold`} style={{ color: idx === 8 ? '#6C1BA0' : undefined }}>{mod.title}</span>
              </div>
              <p className="text-lg">{mod.desc}</p>
            </NavLink>
          ))}
        </div>
      </motion.section>

      {/* 6. Free Tools You Can Try Right Now */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.7, delay: 0.4 }}
  className="max-w-4xl mx-auto py-12 rounded-xl" style={{ backgroundColor: '#F3F0F8' }}
      >
  <h2 className="text-5xl font-bold text-center mb-10" style={{ color: '#6C1BA0' }}>Interactive Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BookOpen size={48} style={{ color: '#6C1BA0' }} />} 
            title="AI Text Analysis" 
            description="Detect AI-generated text using linguistic and statistical signals." 
            link="/text-checker" 
          />
          <FeatureCard 
            icon={<Shield size={48} style={{ color: '#6C1BA0' }} />} 
            title="Image Forensics" 
            description="Analyze images for AI generation artifacts and manipulation." 
            link="/image-checker" 
          />
          <FeatureCard 
            icon={<CheckCircle size={48} style={{ color: '#6C1BA0' }} />} 
            title="Claim Verification" 
            description="Cross-reference claims against trusted data sources." 
            link="/fact-checker" 
          />
        </div>
      </motion.section>

      {/* 7. Testimonials Section - Counter-rotating carousels
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
  className="py-16 rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #F3F0F8 0%, #E5E7EB 100%)' }}
      >
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="testimonial-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonial-pattern)" />
          </svg>
        </div>
        
        <div className="text-center mb-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-4" style={{ color: '#6C1BA0' }}
          >
            Join Others Who Feel Safer Online
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-base-content/80 max-w-2xl mx-auto"
          >
            Real stories from real people who've taken control of their digital safety
          </motion.p>
        </div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <TestimonialCarousel 
            testimonials={topCarouselTestimonials} 
            direction="left" 
            speed={20}
            className="py-4"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <TestimonialCarousel 
            testimonials={bottomCarouselTestimonials} 
            direction="right" 
            speed={25}
            className="py-4"
          />
        </motion.div>
      </motion.section>
      </motion.section> */}

      {/* Floating Sticky CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed bottom-4 right-4 left-4 md:left-auto md:right-8 z-50 flex justify-center md:justify-end pointer-events-none"
      >
        {/* <NavLink
          to="/course"
          className="btn btn-lg text-lg shadow-lg pointer-events-auto flex items-center gap-2"
          aria-label="Start Free Course"
    style={{ backgroundColor: '#6C1BA0', color: '#fff' }}
        >
          <BookOpen className="h-6 w-6" style={{ color: '#fff' }} />
          Start Free Course
        </NavLink> */}
      </motion.div>
    </div>
  );
};

export default HomePage;
