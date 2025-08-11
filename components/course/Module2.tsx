import React from 'react';
import { Phone, Mail, MessageSquare, Gift, AlertTriangle, Shield, Eye, ExternalLink } from 'lucide-react';
import SourcesButton from '../common/SourcesButton';

const Module2: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto text-warning mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Common Scams Explained</h1>
        <p className="text-xl text-base-content/70">Internet Scams & How to Spot Them</p>
      </div>

      {/* Introduction */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <p className="text-lg leading-relaxed">
            Now that you've learned the basics of online safety, it's time to take a closer look at <strong>common scams</strong>, which are the tricks that scammers use to fool people. Once you can recognize them, you'll be much better at <strong>avoiding danger and staying in control</strong>.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Let's go through the most common types of scams, one by one.
          </p>
        </div>
      </div>

      {/* Phone Scams */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-error">
        <div className="card-body">
          <h2 className="card-title text-2xl text-error">
            <Phone className="w-6 h-6" />
            Phone Scams
          </h2>
          <p className="text-lg mb-4">
            Scammers call pretending to be from your bank, the government, or tech support. They create fake urgency to pressure you into acting quickly.
          </p>

          <div className="bg-error/10 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-error mb-2">Common Phone Scam Examples:</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                <span>"Your Social Security number has been suspended."</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                <span>"We've detected suspicious activity on your bank account."</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                <span>"Your computer has been hacked, and we need remote access to fix it."</span>
              </li>
            </ul>
          </div>

          <div className="alert alert-warning">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h4 className="font-bold">Red Flags:</h4>
              <p>They ask for passwords, Social Security numbers, or demand immediate payment via gift cards, wire transfers, or cryptocurrency.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Scams */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-warning">
        <div className="card-body">
          <h2 className="card-title text-2xl text-warning">
            <Mail className="w-6 h-6" />
            Email Scams (Phishing)
          </h2>
          <p className="text-lg mb-4">
            Phishing emails look like they're from trusted companies but are designed to steal your information. They often mimic banks, online stores, or government agencies.
          </p>

          <div className="bg-warning/10 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-warning mb-2">What to Look For:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold">Urgency</h5>
                  <p className="text-sm">"Act now or your account will be closed!"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold">Strange Links</h5>
                  <p className="text-sm">Hover to see if the web address looks suspicious</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold">Generic Greetings</h5>
                  <p className="text-sm">"Dear Customer" instead of your name</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold">Poor Grammar</h5>
                  <p className="text-sm">Professional companies check for errors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Message Scams */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-info">
        <div className="card-body">
          <h2 className="card-title text-2xl text-info">
            <MessageSquare className="w-6 h-6" />
            Text Message Scams
          </h2>
          <p className="text-lg mb-4">
            Scammers send text messages pretending to be a company, delivery service, or bank. These messages are usually short, urgent, and ask you to click something fast.
          </p>

          <div className="bg-info/10 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-info mb-2">Examples of Text Scams:</h4>
            <div className="space-y-3">
              <div className="mockup-phone border-primary">
                <div className="camera"></div>
                <div className="display">
                  <div className="artboard artboard-demo phone-1 bg-base-200 p-4">
                    <div className="chat chat-start">
                      <div className="chat-bubble chat-bubble-error">
                        Package undeliverable. Click here to reschedule: bit.ly/fake-link
                      </div>
                    </div>
                    <div className="chat chat-start">
                      <div className="chat-bubble chat-bubble-warning">
                        Suspicious sign-in detected. Verify your account now: suspicious-link.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h4 className="font-bold">Red Flags to Watch For:</h4>
              <ul className="mt-2 space-y-1">
                <li>• Messages from unknown numbers</li>
                <li>• Shortened links (bit.ly, tinyurl)</li>
                <li>• About accounts you don't have</li>
                <li>• Asks for passwords or credit card numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Giveaway & Lottery Scams */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-accent">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <Gift className="w-6 h-6" />
            Giveaway & Lottery Scams
          </h2>
          <p className="text-lg mb-4">
            "Congratulations! You've won!" These scams promise big prizes but ask for money upfront or personal information to "claim" your winnings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-bold text-accent mb-2">Common Claims:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>"You've won the lottery!"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>"Free vacation for answering our survey!"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>"Claim your inheritance!"</span>
                </li>
              </ul>
            </div>
            <div className="bg-error/10 rounded-lg p-4">
              <h4 className="font-bold text-error mb-2">The Truth:</h4>
              <p className="text-sm">
                Legitimate prizes don't require upfront fees, and you can't win a lottery you never entered. Real companies don't ask for Social Security numbers to claim prizes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
            {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Remember: When in doubt, trust your instincts!</h3>
          <p className="text-lg mt-2">
            If something feels too good to be true, pressures you to act fast, or asks for personal information, it's probably a scam. Take your time, and verify independently.
          </p>
        </div>
      </div>

      {/* Sources Button */}
      <SourcesButton moduleNumber={2} />
    </div>
  );
};

export default Module2;
