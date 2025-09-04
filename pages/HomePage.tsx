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
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [end, duration]);
  return format ? format(count) : count;
}

import { BookOpen, Shield, DollarSign, CheckCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import TestimonialCarousel from '../components/common/TestimonialCarousel';
import { topCarouselTestimonials, bottomCarouselTestimonials } from '../constants/testimonialsData';

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
  return (
    <div className="space-y-16 relative">
      {/* 1. Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
  className="hero min-h-[60vh] rounded-box flex flex-col justify-center items-center py-8" style={{ backgroundColor: '#F3F0F8' }}
      >
        <div className="max-w-3xl w-full text-center space-y-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-7xl font-bold mb-4" style={{ color: '#6C1BA0' }}>
            Trusty: Your Guide to Digital Safety
          </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl text-base-content/80 mb-6">
              <span style={{ color: '#6C1BA0' }}>Trusty</span> is a <span style={{ color: '#6C1BA0' }}>FREE online guide</span> designed to help seniors recognize online threats, avoid scams, and stay safe, confident, and in control in today's digital world—one simple step at a time.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-base-content/90 mb-4"
            >
              We understand that scams can be difficult to spot, and with technology changing so quickly, keeping up can feel overwhelming. Backed by a dedicated team of volunteers, Trusty shares your goal of staying secure. Through simple lessons and easy-to-use tools, you'll learn how to protect yourself and navigate the digital world with greater confidence and peace of mind.
            </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
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
                aria-label="Start Free Course"
              >
                <BookOpen className="mr-2" /> Start Your Free Course
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. Why Trusty Matters */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1 }}
  className="max-w-4xl mx-auto text-center py-12 rounded-xl" style={{ backgroundColor: '#fff' }}
      >
  <h2 className="text-5xl font-bold mb-12" style={{ color: '#6C1BA0' }}>Why Trusty Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 1 in 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <Shield className="h-10 w-10 mb-2" style={{ color: '#6C1BA0' }} />
            <p className="font-bold text-3xl mb-2" style={{ color: '#6C1BA0' }}>1 in 4</p>
            <p>Every year, one in four older adults is targeted by an online scam.</p>
          </motion.div>
          {/* $3 Billion+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <DollarSign className="h-10 w-10 mb-2" style={{ color: '#6C1BA0' }} />
            <p className="font-bold text-3xl mb-2" style={{ color: '#6C1BA0' }}>$3 Billion+</p>
            <p>In 2023, seniors lost over $3 billion to fraud.</p>
          </motion.div>
          {/* It's Getting Harder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <BookOpen className="h-10 w-10 mb-2" style={{ color: '#6C1BA0' }} />
            <p className="font-bold text-3xl mb-2" style={{ color: '#6C1BA0' }}>It’s Getting Harder</p>
            <p>With AI, fake websites, and scam calls, it’s becoming more difficult to know what’s real.</p>
          </motion.div>
        </div>
        <p className="text-2xl text-base-content/80 max-w-2xl mx-auto">But don't worry! You don't need to be a tech expert. Trusty will guide you, one simple step at a time. Trusty is always here for you.</p>
      </motion.section>

      {/* 3. Clara's Story */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.2 }}
  className="max-w-4xl mx-auto py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-base-100 rounded-xl shadow p-8 text-left text-xl md:text-2xl border border-base-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="h-12 w-12" style={{ color: '#6C1BA0' }} />
            <span className="font-semibold text-2xl" style={{ color: '#6C1BA0' }}>Story from Clara, 72 — Santa Ana, California</span>
          </div>
          <p className="mb-4">"One morning, I got an email that looked like it came from my bank. It asked me to click a link and update my information.</p>
          <p className="mb-4">It looked real, but something felt a little off. So I showed it to my son, Mason. He told me it was a scam, and I'm glad I didn't click it.</p>
          <p className="mb-6">That's when I realized: the internet is helpful, but it's also important to be careful. I wanted to learn more, and that's how I found Trusty."</p>
          <div className="my-6 text-4xl font-bold text-center" style={{ color: '#6C1BA0' }}>
            "I feel more confident now."
          </div>
          <p className="text-center italic text-base-content/70 text-lg">And I know Trusty will always be by my side.<br/>— Clara, Trusty user</p>
        </motion.div>
      </motion.section>

      {/* 4. What You'll Learn */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.2 }}
  className="max-w-4xl mx-auto py-12 rounded-xl" style={{ backgroundColor: '#F3F0F8' }}
      >
  <h2 className="text-5xl font-bold text-center mb-10" style={{ color: '#6C1BA0' }}>What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Scam spotting</span>
              <div className="text-lg">How to recognize online scams</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Fake news detection</span>
              <div className="text-lg">How to spot fake news and photos</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Safe browsing</span>
              <div className="text-lg">How to browse the internet safely</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold text-2xl">Getting help</span>
              <div className="text-lg">Where to go for help if something seems suspicious</div>
            </div>
          </div>
        </div>
        <p className="text-xl text-center text-base-content/70 mt-10">All explained in a calm, friendly way, with big text, short lessons, and helpful examples!</p>
      </motion.section>

      {/* 5. Curriculum Overview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.3 }}
  className="max-w-4xl mx-auto py-12 rounded-xl" style={{ backgroundColor: '#fff' }}
      >
  <h2 className="text-5xl font-bold text-center mb-12" style={{ color: '#6C1BA0' }}>TRUSTY Digital Safety Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "The Basics",
              desc: "What is Online Safety?"
            },
            {
              title: "Common Scams Explained",
              desc: "Internet Scams & How to Spot Them"
            },
            {
              title: "Spotting Fake News & Deepfakes",
              desc: "How to tell real from fake online"
            },
            {
              title: "Safe Browsing & Websites",
              desc: "How to know if a website can be trusted"
            },
            {
              title: "Passwords & Privacy",
              desc: "Protecting your digital life"
            },
            {
              title: "AI & Misinformation",
              desc: "Staying smart in an AI-powered world"
            },
            {
              title: "Cyber Hygiene Habits",
              desc: "Keeping your digital life clean and healthy"
            },
            {
              title: "Reporting & Getting Help",
              desc: "What to do when something goes wrong"
            },
            {
              title: "Final Quiz & Certificate",
              desc: "Review what you've learned and earn your Trusty certificate!"
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
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.4 }}
  className="max-w-4xl mx-auto py-12 rounded-xl" style={{ backgroundColor: '#F3F0F8' }}
      >
  <h2 className="text-5xl font-bold text-center mb-10" style={{ color: '#6C1BA0' }}>Helpful Tools to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BookOpen size={48} style={{ color: '#6C1BA0' }} />} 
            title="AI Text Checker" 
            description="Quickly find out if that email or article was written by a computer." 
            link="/text-checker" 
          />
          <FeatureCard 
            icon={<Shield size={48} style={{ color: '#6C1BA0' }} />} 
            title="AI Image Checker" 
            description="Upload a picture to check for signs of AI-generation." 
            link="/image-checker" 
          />
          <FeatureCard 
            icon={<DollarSign size={48} style={{ color: '#6C1BA0' }} />} 
            title="Fact-Checker" 
            description="Quickly check the credibility of a claim or news story." 
            link="/fact-checker" 
          />
        </div>
      </motion.section>

      {/* 7. Testimonials Section - Counter-rotating carousels */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1 }}
  className="py-16 rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #F3F0F8 0%, #E5E7EB 100%)' }}
      >
        {/* Background pattern */}
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
        
        {/* Top carousel - moving left */}
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
        
        {/* Bottom carousel - moving right */}
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
