
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Search, FileText, ImageIcon, CheckSquare } from 'lucide-react';

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
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-base-200 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-7xl font-bold text-primary">
              Navigate the Digital World with Confidence
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="py-6 text-2xl text-base-content/80">
              Trusty provides easy-to-use tools and simple lessons to help you stay safe and smart online. No jargon, just clear, friendly guidance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <NavLink to="/course" className="btn btn-primary btn-lg text-xl">
                <BookOpen className="mr-2" /> Start Your Free Course
              </NavLink>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold mb-8">A Word From a Friend</h2>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-24 rounded-full">
              <img alt="Grandmother testimonial" src="https://picsum.photos/id/1027/200/200" />
            </div>
          </div>
          <div className="chat-bubble text-left text-xl">
            "I used to be so nervous about using my computer, especially with all the scams you hear about. Trusty's lessons were simple and made me feel so much more capable. Now I can email my grandkids without worrying!"
            <div className="mt-2 font-bold">- Barbara D.</div>
          </div>
        </div>
      </section>

      {/* Tools Overview */}
      <section>
        <h2 className="text-5xl font-bold text-center mb-12">Your Digital Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FileText size={48} className="text-primary" />}
            title="AI Text Checker"
            description="Curious if an email or article was written by a computer? Paste it here to find out."
            link="/text-checker"
          />
          <FeatureCard 
            icon={<CheckSquare size={48} className="text-primary" />}
            title="Feedback Tool"
            description="Get friendly, helpful feedback on your own writing, just like a helpful teacher would give."
            link="/feedback-tool"
          />
          <FeatureCard 
            icon={<ImageIcon size={48} className="text-primary" />}
            title="AI Image Checker"
            description="See a strange picture online? Upload it to check for signs of AI-generation."
            link="/image-checker"
          />
          <FeatureCard 
            icon={<Search size={48} className="text-primary" />}
            title="Fact-Checker"
            description="Check the credibility of a claim or a news story with our simple fact-checking tool."
            link="/fact-checker"
          />
          <FeatureCard 
            icon={<BookOpen size={48} className="text-primary" />}
            title="Digital Safety Course"
            description="Our step-by-step course covers everything from spotting scams to creating strong passwords."
            link="/course"
          />
           <FeatureCard 
            icon={<Shield size={48} className="text-primary" />}
            title="Why Trusty?"
            description="Built on powerful technology, designed for clarity and peace of mind. Your privacy is always our priority."
            link="/"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
