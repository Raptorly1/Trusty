import React from 'react';
import { Shield, Lock, AlertTriangle, Users, Info } from 'lucide-react';

const Module1: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">The Basics – What is Online Safety?</h1>
        <p className="text-xl text-base-content/70">Your guide to staying safe in the digital world</p>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            <Info className="w-6 h-6" />
            What does it mean to be safe online?
          </h2>
          <p className="text-lg leading-relaxed">
            Being safe online means protecting yourself when you use the internet, whether you're on a phone, tablet, or computer. 
            Just like you lock your front door at night or avoid talking to strangers in public, there are simple things you can do to stay safe when you're online.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
        <div className="card-body">
          <h3 className="card-title text-xl text-success">
            <Shield className="w-5 h-5" />
            Online safety helps you:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Avoid scams</h4>
                <p className="text-sm">That try to trick you out of money or personal information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-info mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Keep details private</h4>
                <p className="text-sm">Like your name, birthday, or credit card number</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Feel confident</h4>
                <p className="text-sm">And in control when reading news, emails, or using apps</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      <div className="alert alert-warning">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Why do we need to be careful?</h3>
          <p>Unfortunately, the internet has some bad actors who pretend to be someone they're not, create fake websites, send tricky emails, or share false news stories. Their goal? To confuse or trick you.</p>
        </div>
      </div>

      {/* Consequences Section */}
      <div className="card bg-error/5 border border-error/20">
        <div className="card-body">
          <h3 className="card-title text-error">These scams can lead to:</h3>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">Losing money</span> from fake offers or donations
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">Identity theft</span>, where someone pretends to be you using your private details
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold">Trust issues</span>, where it becomes hard to know what's real and what's not
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Encouragement Section */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">But don't worry, Trusty is here to guide you, step-by-step.</h3>
          <p className="text-lg mt-2">
            Once you learn what to look out for and practice a few smart habits, staying safe online becomes much easier, and a lot less stressful!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Module1;
