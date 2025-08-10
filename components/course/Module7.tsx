import React from 'react';
import { RefreshCw, Smartphone, Key, Clock, Shield, Download, Eye, CheckCircle, FileText } from 'lucide-react';

const Module7: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto text-success mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Cyber Hygiene Habits</h1>
        <p className="text-xl text-base-content/70">Keeping Your Digital Life Clean and Healthy</p>
      </div>

      {/* Introduction */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <p className="text-lg leading-relaxed">
            Just like you visit the doctor for regular check-ups, your <strong>digital life also needs care</strong>. These everyday habits, called <strong>cyber hygiene</strong>, help keep your devices secure, your information safe, and your mind at ease.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Let's walk through simple steps to protect yourself online.
          </p>
        </div>
      </div>

      {/* Keep Software Updated */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-primary">
            <RefreshCw className="w-6 h-6" />
            Keep Your Software and Devices Updated
          </h2>
          <p className="text-lg mb-6">
            Software updates aren't just about new features—they often include important security fixes that protect you from the latest threats.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success">Why Updates Matter:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Fix security vulnerabilities</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Improve device performance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <RefreshCw className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Add new safety features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Stay ahead of cyber threats</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-info/10 border border-info/20">
              <div className="card-body">
                <h3 className="card-title text-info">What to Update:</h3>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-info" />
                    <span><strong>Phone/Tablet:</strong> iOS or Android system updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-info" />
                    <span><strong>Computer:</strong> Windows, Mac, or Linux updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-info" />
                    <span><strong>Apps:</strong> Email, browser, social media apps</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-info" />
                    <span><strong>Antivirus:</strong> Security software definitions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-6">
            <RefreshCw className="w-5 h-5" />
            <div>
              <h4 className="font-bold">Pro Tip:</h4>
              <p>Turn on automatic updates when possible! This way, your devices stay protected without you having to remember.</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Safety */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-warning">
            <Smartphone className="w-6 h-6" />
            Be Careful with App Downloads
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-success">Only Download from Trusted Sources</h3>
              <div className="space-y-3">
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-success" />
                      <span><strong>iPhones/iPads:</strong> Use the Apple App Store</span>
                    </div>
                  </div>
                </div>
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-success" />
                      <span><strong>Android devices:</strong> Use the Google Play Store</span>
                    </div>
                  </div>
                </div>
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <div className="flex items-center space-x-2">
                      <Download className="w-5 h-5 text-success" />
                      <span><strong>Computers:</strong> Only download from official company websites</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-warning">Check Before You Download:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Who made it?</span>
                    <p className="text-sm">Is it a company you trust?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">What do others say?</span>
                    <p className="text-sm">Read user reviews and ratings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">What does it ask for?</span>
                    <p className="text-sm">Be cautious if a simple app wants access to your contacts or location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-warning mt-6">
            <Smartphone className="w-5 h-5" />
            <div>
              <h4 className="font-bold">Avoid apps from:</h4>
              <p>Pop-up ads or unfamiliar websites — they may contain harmful software.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Security */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-accent">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <Key className="w-6 h-6" />
            Don't Share Your Passwords
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="card bg-accent/10 border border-accent/20">
              <div className="card-body">
                <h3 className="card-title text-accent">Keep Your Passwords Private</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Key className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>Never give your password to someone who calls, emails, or messages you</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span><strong>Real companies will never ask</strong> for your full password</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <RefreshCw className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>If you must share a password with a close family member, <strong>change it afterwards</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-warning/10 border border-warning/20">
              <div className="card-body">
                <h3 className="card-title text-warning">
                  <Eye className="w-5 h-5" />
                  Watch for "Shoulder Surfing"
                </h3>
                <p className="mt-3">Be aware of people nearby when entering passwords in public places, like coffee shops or airports.</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm">Tips for public spaces:</h4>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Position your screen away from others</li>
                    <li>• Use your body to shield your typing</li>
                    <li>• Look around before entering sensitive info</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Be Skeptical of Urgency */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-error">
            <Clock className="w-6 h-6" />
            Be Skeptical of Urgency
          </h2>
          <p className="text-lg mb-6">
            Scammers love to create fake urgency to pressure you into making quick decisions. Real emergencies are rare in the digital world.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error">Warning Phrases:</h3>
                <ul className="space-y-2 mt-3 text-sm">
                  <li>"Act now or lose this opportunity forever!"</li>
                  <li>"Your account will be closed in 24 hours!"</li>
                  <li>"Limited time offer - expires today!"</li>
                  <li>"Urgent action required immediately!"</li>
                  <li>"Your security has been compromised!"</li>
                </ul>
              </div>
            </div>

            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success">When You Feel Pressured:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span><strong>Pause</strong> and take a deep breath</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span><strong>Step away</strong> from the computer or phone</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span><strong>Verify</strong> through a different channel</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span><strong>Ask for help</strong> if you're unsure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Tips */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-secondary">Additional Cyber Hygiene Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="card bg-secondary/10 border border-secondary/20">
              <div className="card-body p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">Regular Backups</h4>
                </div>
                <p className="text-sm">Back up important files and photos regularly to avoid losing them.</p>
              </div>
            </div>

            <div className="card bg-secondary/10 border border-secondary/20">
              <div className="card-body p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">Antivirus Software</h4>
                </div>
                <p className="text-sm">Use reputable antivirus software and keep it updated.</p>
              </div>
            </div>

            <div className="card bg-secondary/10 border border-secondary/20">
              <div className="card-body p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">Clean Up Old Apps</h4>
                </div>
                <p className="text-sm">Delete apps you no longer use to reduce security risks.</p>
              </div>
            </div>

            <div className="card bg-secondary/10 border border-secondary/20">
              <div className="card-body p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">Check Privacy Settings</h4>
                </div>
                <p className="text-sm">Review privacy settings on social media and other accounts.</p>
              </div>
            </div>

            <div className="card bg-secondary/10 border border-secondary/20">
              <div className="card-body p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">Monitor Accounts</h4>
                </div>
                <p className="text-sm">Regularly check bank and credit card statements for unusual activity.</p>
              </div>
            </div>

            <div className="card bg-secondary/10 border border-secondary/20">
              <div className="card-body p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">Secure Networks</h4>
                </div>
                <p className="text-sm">Be cautious when using public Wi-Fi for sensitive activities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Your Cheat Sheet */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-info">
        <div className="card-body">
          <h2 className="card-title text-2xl text-info">
            <FileText className="w-6 h-6" />
            Create Your Own Safety Cheat Sheet
          </h2>
          <p className="text-lg mb-6">
            Pick your top 5 cyber hygiene habits and write them down. Put this list somewhere you'll see it regularly as a reminder.
          </p>
          
          <div className="card bg-info/10 border border-info/20">
            <div className="card-body">
              <h3 className="card-title text-info">Example Cheat Sheet:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Keep my devices updated</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Only download apps from official stores</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Never share passwords via email or text</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Pause before clicking urgent messages</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Back up important files monthly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Good cyber hygiene is like brushing your teeth!</h3>
          <p className="text-lg mt-2">
            Small, regular habits make a big difference in keeping you safe online. Start with one or two habits and gradually build your routine.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Update regularly</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Pause when pressured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Stay protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module7;
