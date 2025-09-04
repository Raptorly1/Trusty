import React from 'react';
import { Globe, Lock, Shield, AlertTriangle, Eye, ExternalLink, X, Zap } from 'lucide-react';
import SourcesButton from '../common/SourcesButton';

const Module4: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Globe className="w-16 h-16 mx-auto text-success mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Safe Browsing & Websites</h1>
        <p className="text-xl text-base-content/70">Navigate the web with confidence and security</p>
      </div>

      {/* What Makes a Website Safe */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-success">
            <Lock className="w-6 h-6" />
            What Makes a Website Safe?
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            When you visit a website, especially to shop or enter personal information, you want to make sure it's legitimate and secure. Here's what to look for:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success">
                  <Shield className="w-5 h-5" />
                  HTTPS & Lock Icon
                </h3>
                <div className="mockup-browser border border-success">
                  <div className="mockup-browser-toolbar">
                    <div className="flex items-center gap-2 w-full">
                      <Lock className="w-4 h-4 text-success" />
                      <input
                        readOnly
                        value="https://secure-website.com"
                        className="input input-bordered border-success w-full text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center px-4 py-8 bg-success/5">
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto text-success mb-2" />
                      <p className="text-sm text-success font-semibold">This site is secure</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm mt-2">Look for "https://" and a lock icon in your browser's address bar. This means your information is encrypted.</p>
              </div>
            </div>

            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error">
                  <AlertTriangle className="w-5 h-5" />
                  Warning Signs
                </h3>
                <div className="mockup-browser border border-error">
                  <div className="mockup-browser-toolbar">
                    <div className="flex items-center gap-2 w-full">
                      <AlertTriangle className="w-4 h-4 text-error" />
                      <input
                        readOnly
                        value="http://suspicious-site.com"
                        className="input input-bordered border-error w-full text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center px-4 py-8 bg-error/5">
                    <div className="text-center">
                      <X className="w-8 h-8 mx-auto text-error mb-2" />
                      <p className="text-sm text-error font-semibold">Not secure</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm mt-2">Avoid entering personal information on sites without "https://" or that show security warnings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Tell if a Website is Real or Fake */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-warning">
            <Eye className="w-6 h-6" />
            How to Tell if a Website is Real (or Fake)
          </h2>
          
          <div className="space-y-6">
            <div className="alert alert-info">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <h4 className="font-bold">Scammers create fake websites that look almost identical to real ones</h4>
                <p>They do this to steal your login information, credit card details, or personal data.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-success">✓ Signs of a Legitimate Website:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Correct spelling:</span> Real companies spell their own names correctly
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Professional design:</span> Well-organized layout with clear navigation
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Contact information:</span> Real address, phone number, customer service
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Reviews & reputation:</span> Can be found on independent review sites
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg text-error">✗ Red Flags to Avoid:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Strange URLs:</span> amaz0n.com instead of amazon.com
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Poor grammar:</span> Lots of spelling mistakes or awkward wording
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Pressure tactics:</span> "Limited time only!" or "Act now or lose forever!"
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold">Too-good-to-be-true deals:</span> Prices that are unrealistically low
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avoiding Sketchy Ads and Links */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <ExternalLink className="w-6 h-6" />
            Avoiding Sketchy Ads and Dangerous Links
          </h2>
          <p className="text-lg mb-6">
            While browsing, you'll likely see ads or links, but not all are safe. Here's how to be smart about clicking:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error">Be Cautious with Ads That:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Claim big prizes: "You've won $10,000!"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Sound urgent: "Only 5 minutes left to claim!"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ExternalLink className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Ask you to download software</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Use flashy designs or strange animations</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success">Smart Clicking Tips:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span><strong>Hover</strong> over a link to see where it actually goes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Globe className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Check the bottom of your screen for the full web address</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>If it seems strange or too good to be true, <strong>don't click it</strong></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ExternalLink className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>When in doubt, <strong>type the web address yourself</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-ups and Malware */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-warning">
        <div className="card-body">
          <h2 className="card-title text-2xl text-warning">
            <AlertTriangle className="w-6 h-6" />
            Watch Out for Pop-Ups and Malware Tricks
          </h2>
          <p className="text-lg mb-6">
            Some websites show <strong>pop-up windows</strong> designed to scare or trick you. These are almost always fake and can install harmful programs if you click them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-warning">Common Pop-up Messages Include:</h4>
              <div className="space-y-3">
                <div className="mockup-window border border-error bg-error/10">
                  <div className="flex justify-center px-4 py-8 bg-error/5">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 mx-auto text-error mb-2" />
                      <p className="font-bold text-error">WARNING!</p>
                      <p className="text-sm">Your computer has a virus!</p>
                      <button className="btn btn-error btn-sm mt-2">Click here to fix</button>
                    </div>
                  </div>
                </div>
                <div className="text-center text-error font-semibold">
                  ⚠️ This is a FAKE pop-up - Don't click!
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-success">How to Handle Pop-ups:</h4>
              <div className="card bg-success/10 border border-success/20">
                <div className="card-body">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-error mt-1 flex-shrink-0" />
                      <span>Don't click <strong>anything</strong> inside a suspicious pop-up</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <span>Use the <strong>X in the corner</strong> to close the window</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                      <span>If it won't close, shut your browser completely</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-info mt-1 flex-shrink-0" />
                      <span>Restart your device if pop-ups keep appearing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Stay Safe While Browsing</h3>
          <p className="text-lg mt-2">
            By learning how to recognize secure websites, avoid fake links and pop-ups, and browse with caution, you can safely explore the internet without putting your personal information at risk.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Look for HTTPS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Hover before clicking</span>
            </div>
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5" />
              <span>Close suspicious pop-ups</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Button */}
      <SourcesButton moduleNumber={4} />
    </div>
  );
};

export default Module4;
