import { BookOpen } from 'lucide-react';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, link: string }> = ({ icon, title, description, link }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="card bg-base-100 shadow-xl border border-base-200 h-full"
  >
    <div className="card-body items-center text-center">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        {icon}
      </div>
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
    <div className="space-y-24">
      {/* Hero & Clara's Story */}
      <section className="hero min-h-[60vh] bg-base-200 rounded-box flex flex-col justify-center items-center">
        <div className="max-w-3xl w-full text-center space-y-8">
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
          <div className="bg-base-100 rounded-xl shadow p-6 text-left text-xl md:text-2xl mx-auto max-w-2xl border border-base-300">
            <p className="mb-4 font-semibold text-primary">Story from Clara, 72</p>
            <p className="mb-2">“One morning, I got an email that looked like it came from my bank. It asked me to click a link and update my information.</p>
            <p className="mb-2">It looked real, but something felt a little off. So I showed it to my son, Mason. He told me it was a scam, and I’m glad I didn’t click it.</p>
            <p className="mb-2">That’s when I realized: the internet is helpful, but it’s also important to be careful. I wanted to learn more, and that’s how I found Trusty.”</p>
            <p className="mt-4 italic text-base-content/70">“I feel more confident now. And I know Trusty will always be by my side.”<br/>— Clara, Trusty user</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <NavLink to="/course" className="btn btn-primary btn-lg text-xl mt-8">
              <BookOpen className="mr-2" /> Start Your Free Course
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Why Trusty Matters */}
      <section className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-5xl font-bold mb-8">Why Trusty Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300">
            <p className="font-bold text-primary text-3xl mb-2">1 in 4</p>
            <p>older adults gets targeted by an online scam every year</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300">
            <p className="font-bold text-primary text-3xl mb-2">$3 Billion+</p>
            <p>seniors lost to fraud in 2023</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 text-xl border border-base-300">
            <p className="font-bold text-primary text-3xl mb-2">It's Getting Harder</p>
            <p>With AI, fake websites, and scam calls, it’s harder to tell what’s real</p>
          </div>
        </div>
        <p className="text-2xl text-base-content/80 max-w-2xl mx-auto">But don’t worry! You don’t need to be a tech expert. Trusty will guide you, one simple step at a time. Trusty is always here for you.</p>
      </section>

      {/* What You'll Learn */}
      <section className="max-w-4xl mx-auto py-12">
        <h2 className="text-5xl font-bold text-center mb-8">What You’ll Learn</h2>
        <ul className="list-disc list-inside text-2xl text-left max-w-2xl mx-auto space-y-4">
          <li>How to recognize online scams</li>
          <li>How to spot fake news and photos</li>
          <li>How to browse the internet safely</li>
          <li>Where to go for help if something seems suspicious</li>
        </ul>
        <p className="text-xl text-center text-base-content/70 mt-8">All explained in a calm, friendly way, with big text, short lessons, and helpful examples!</p>
      </section>

      {/* Curriculum Overview */}
      <section className="max-w-4xl mx-auto py-12">
        <h2 className="text-5xl font-bold text-center mb-8">TRUSTY Digital Safety Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 1: The Basics</h3>
            <p className="text-lg">What is Online Safety?</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 2: Common Scams Explained</h3>
            <p className="text-lg">Internet Scams & How to Spot Them</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 3: Spotting Fake News & Deepfakes</h3>
            <p className="text-lg">How to tell real from fake online</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 4: Safe Browsing & Websites</h3>
            <p className="text-lg">How to know if a website can be trusted</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 5: Passwords & Privacy</h3>
            <p className="text-lg">Protecting your digital life</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 6: AI & Misinformation</h3>
            <p className="text-lg">Staying smart in an AI-powered world</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 7: Cyber Hygiene Habits</h3>
            <p className="text-lg">Keeping your digital life clean and healthy</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-base-300">
            <h3 className="text-2xl font-bold mb-2">Module 8: Reporting & Getting Help</h3>
            <p className="text-lg">What to do when something goes wrong</p>
          </div>
          <div className="bg-base-100 rounded-xl shadow p-6 border border-primary">
            <h3 className="text-2xl font-bold mb-2 text-primary">Final Quiz & Certificate</h3>
            <p className="text-lg">Review what you’ve learned and earn your Trusty certificate!</p>
          </div>
        </div>
      </section>

      {/* CTA and Tool Cards */}
      <section className="max-w-4xl mx-auto py-12">
        <div className="flex justify-center mb-12">
          <NavLink to="/course" className="btn btn-primary btn-lg text-xl">
            <BookOpen className="mr-2" /> Start the Course
          </NavLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />} 
            title="Digital Safety Course" 
            description="Step-by-step lessons to help you stay safe online." 
            link="/course" 
          />
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />} 
            title="AI Text Checker" 
            description="Paste an email or article to see if it was written by a computer." 
            link="/text-checker" 
          />
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />} 
            title="Feedback Tool" 
            description="Get friendly feedback on your own writing." 
            link="/feedback-tool" 
          />
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />} 
            title="AI Image Checker" 
            description="Upload a picture to check for signs of AI-generation." 
            link="/image-checker" 
          />
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />} 
            title="Fact-Checker" 
            description="Check the credibility of a claim or news story." 
            link="/fact-checker" 
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
