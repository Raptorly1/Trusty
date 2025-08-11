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

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, link: string }> = ({ icon, title, description, link }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="card bg-base-100 shadow-xl border border-base-200 h-full"
  >
    <div className="card-body items-center text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="p-4 bg-primary/10 rounded-full mb-4"
      >
        {icon}
      </motion.div>
      <h2 className="card-title text-2xl">{title}</h2>
      <p className="text-lg text-base-content/80">{description}</p>
      <div className="card-actions justify-end mt-4">
        <NavLink to={link} className="btn btn-primary btn-outline">
          Try Now
        </NavLink>
      </div>
    </div>
  </motion.div>
);

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 relative">
  {/* Hero & Clara's Story */}
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7 }}
    className="hero min-h-[60vh] bg-base-200 rounded-box flex flex-col justify-center items-center py-8"
  >
        <div className="max-w-3xl w-full text-center space-y-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-7xl font-bold text-primary mb-4">
            Trusty: Your Guide to Digital Safety
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl text-base-content/80 mb-6">
            One simple step at a time, Trusty helps you stay safe, confident, and in control online.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-base-content/90 mb-4"
          >
            “We know scams can be tricky to spot, and with technology changing so fast, it’s hard to keep up. But Trusty’s here to guide you every step of the way… and it’s completely free!”
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-base-100 rounded-xl shadow p-6 text-left text-xl md:text-2xl mx-auto max-w-2xl border border-base-300 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <User className="h-10 w-10 text-primary" />
              <span className="font-semibold text-primary">Story from Clara, 72 &mdash; Santa Ana, California</span>
            </div>
            <p className="mb-2">“One morning, I got an email that looked like it came from my bank. It asked me to click a link and update my information.</p>
            <p className="mb-2">It looked real, but something felt a little off. So I showed it to my son, Mason. He told me it was a scam, and I’m glad I didn’t click it.</p>
            <p className="mb-2">That’s when I realized: the internet is helpful, but it’s also important to be careful. I wanted to learn more, and that’s how I found Trusty.”</p>
            <div className="my-4 text-3xl font-bold text-primary text-center">“I feel more confident now.”</div>
            <p className="mt-2 italic text-base-content/70 text-center">And I know Trusty will always be by my side.<br/>— Clara, Trusty user</p>
          </motion.div>
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
                className="btn btn-accent btn-lg text-xl mt-8 shadow-lg transition-colors duration-200 hover:bg-accent/80 focus:bg-accent/90"
                aria-label="Start Free Course"
              >
                <BookOpen className="mr-2" /> Start Your Free Course
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
  </motion.section>

  {/* Why Trusty Matters */}
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay: 0.1 }}
    className="max-w-4xl mx-auto text-center py-12 bg-base-100 rounded-xl"
  >
        <h2 className="text-5xl font-bold mb-12">Why Trusty Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 1 in 4 Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <Shield className="h-10 w-10 text-primary mb-2" />
            <p className="font-bold text-primary text-3xl mb-2">
              {useCountUp({ end: 1, duration: 1 })} in {useCountUp({ end: 4, duration: 1 })}
            </p>
            <p>older adults gets targeted by an online scam every year</p>
          </motion.div>
          {/* $3 Billion+ Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <DollarSign className="h-10 w-10 text-primary mb-2" />
            <p className="font-bold text-primary text-3xl mb-2">
              ${useCountUp({ end: 3, duration: 1 })} Billion+
            </p>
            <p>seniors lost to fraud in 2023</p>
          </motion.div>
          {/* Static third card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300 transition hover:scale-105 hover:border-primary cursor-pointer flex flex-col items-center gap-2"
          >
            <BookOpen className="h-10 w-10 text-primary mb-2" />
            <p className="font-bold text-primary text-3xl mb-2">It's Getting Harder</p>
            <p>With AI, fake websites, and scam calls, it’s harder to tell what’s real</p>
          </motion.div>
        </div>
        <p className="text-2xl text-base-content/80 max-w-2xl mx-auto">But don’t worry! You don’t need to be a tech expert. Trusty will guide you, one simple step at a time. Trusty is always here for you.</p>
  </motion.section>

  {/* What You'll Learn */}
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="max-w-4xl mx-auto py-12 bg-base-200 rounded-xl"
  >
        <h2 className="text-5xl font-bold text-center mb-10">What You’ll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold">Scam spotting</span>
              <div className="text-xl">How to recognize online scams</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold">Fake news detection</span>
              <div className="text-xl">How to spot fake news and photos</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold">Safe browsing</span>
              <div className="text-xl">How to browse the internet safely</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-success mt-1" />
            <div>
              <span className="font-bold">Getting help</span>
              <div className="text-xl">Where to go for help if something seems suspicious</div>
            </div>
          </div>
        </div>
        <p className="text-xl text-center text-base-content/70 mt-10">All explained in a calm, friendly way, with big text, short lessons, and helpful examples!</p>
  </motion.section>

  {/* Curriculum Overview */}
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay: 0.3 }}
    className="max-w-4xl mx-auto py-12 bg-base-100 rounded-xl"
  >
        <h2 className="text-5xl font-bold text-center mb-12">TRUSTY Digital Safety Course</h2>
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
              desc: "Review what you’ve learned and earn your Trusty certificate!"
            }
          ].map((mod, idx) => (
            <div
              key={mod.title}
              className={`bg-base-100 rounded-xl shadow p-6 border ${idx === 8 ? 'border-primary' : 'border-base-300'} flex flex-col items-start gap-4 transition hover:scale-105 hover:border-primary cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`rounded-full bg-primary text-white font-bold text-xl w-10 h-10 flex items-center justify-center ${idx === 8 ? 'bg-primary/80' : ''}`}>{(idx+1).toString().padStart(2, '0')}</div>
                <span className={`text-2xl font-bold ${idx === 8 ? 'text-primary' : ''}`}>{mod.title}</span>
              </div>
              <p className="text-lg">{mod.desc}</p>
            </div>
          ))}
        </div>
  </motion.section>

  {/* Free Tools You Can Try Right Now */}
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay: 0.4 }}
    className="max-w-4xl mx-auto py-12 bg-base-200 rounded-xl"
  >
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Free Tools You Can Try Right Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />} 
            title="AI Text Checker" 
            description="Quickly find out if that email or article was written by a computer." 
            link="/text-checker" 
          />
          <FeatureCard 
            icon={<CheckCircle size={48} className="text-success" />} 
            title="Feedback Tool" 
            description="Get friendly, helpful feedback on your own writing." 
            link="/feedback-tool" 
          />
          <FeatureCard 
            icon={<Shield size={48} className="text-primary" />} 
            title="AI Image Checker" 
            description="Upload a picture to check for signs of AI-generation." 
            link="/image-checker" 
          />
          <FeatureCard 
            icon={<DollarSign size={48} className="text-primary" />} 
            title="Fact-Checker" 
            description="Quickly check the credibility of a claim or news story." 
            link="/fact-checker" 
          />
        </div>
  </motion.section>
      {/* Floating Sticky CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed bottom-4 right-4 left-4 md:left-auto md:right-8 z-50 flex justify-center md:justify-end pointer-events-none"
      >
        <NavLink
          to="/course"
          className="btn btn-accent btn-lg text-lg shadow-lg pointer-events-auto flex items-center gap-2"
          aria-label="Start Free Course"
        >
          <BookOpen className="h-6 w-6" />
          Start Free Course
        </NavLink>
      </motion.div>
    </div>
  );
};

export default HomePage;
