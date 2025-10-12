import React from 'react';
import { Key, Shield, Lock, AlertTriangle, CheckCircle, Smartphone, X, Eye, EyeOff } from 'lucide-react';

const Module5: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Key className="w-16 h-16 mx-auto text-accent mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Strong Passwords & Privacy</h1>
        <p className="text-xl text-base-content/70">Protecting Your Digital Life</p>
      </div>

      {/* Introduction */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <p className="text-lg leading-relaxed">
            Your passwords are like the <strong>keys to your digital home</strong>. Just like you wouldn't leave your house key under the doormat, you shouldn't leave your online accounts unprotected.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Let's explore how to create <strong>strong, secure passwords</strong> and protect your personal information online.
          </p>
        </div>
      </div>

      {/* Why Strong Passwords Matter */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <Lock className="w-6 h-6" />
            Why Strong Passwords Matter
          </h2>
          <p className="text-lg mb-6">
            Think of passwords as <strong>locks on your digital doors</strong>. A weak password is like a flimsy lock, easy for criminals to break. A strong one keeps your private life safe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success">Strong passwords:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Protect your personal and financial information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Lock className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Stop hackers from breaking into your accounts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Prevent others from pretending to be you</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>Keep your emails, photos, and documents private</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error">What Makes a Password Weak?</h3>
                <p className="mb-3">Many people use passwords that are easy to guess. Avoid passwords that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Use personal details (like your name or birthday)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Use common words like "password" or "welcome"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Use simple patterns like "123456" or "qwerty"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Are too short (less than 8 characters)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Are reused for many different accounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Create Strong Passwords */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-primary">
            <CheckCircle className="w-6 h-6" />
            How to Create Strong but Memorable Passwords
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">A strong password should:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be at least <strong>12 characters long</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include <strong>uppercase and lowercase letters, numbers, and symbols</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Avoid real words or personal information</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be <strong>unique for each important account</strong></span>
                </li>
              </ul>
            </div>

            <div className="card bg-info/10 border border-info/20">
              <div className="card-body">
                <h3 className="card-title text-info">Try the Phrase Method:</h3>
                <div className="space-y-4">
                  <div className="step">
                    <div className="badge badge-info badge-sm">1</div>
                    <span className="ml-2">Think of a phrase:</span>
                    <div className="bg-base-200 p-2 rounded mt-1 font-mono text-sm">
                      "I love watching birds at my feeder!"
                    </div>
                  </div>
                  <div className="step">
                    <div className="badge badge-info badge-sm">2</div>
                    <span className="ml-2">Use the first letter of each word:</span>
                    <div className="bg-base-200 p-2 rounded mt-1 font-mono text-sm">
                      Ilwbamf!
                    </div>
                  </div>
                  <div className="step">
                    <div className="badge badge-info badge-sm">3</div>
                    <span className="ml-2">Add numbers or symbols:</span>
                    <div className="bg-base-200 p-2 rounded mt-1 font-mono text-sm">
                      Ilwbamf!2023
                    </div>
                  </div>
                  <div className="step">
                    <div className="badge badge-success badge-sm">4</div>
                    <span className="ml-2">Mix in capital letters:</span>
                    <div className="bg-success/10 p-2 rounded mt-1 font-mono text-sm font-bold">
                      IlWbAmF!2023
                    </div>
                  </div>
                </div>
                <p className="text-sm mt-4 text-success font-semibold">
                  Now you've got a strong password that's hard to guess, but still easy for you to remember!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Not to Share Online */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-warning">
        <div className="card-body">
          <h2 className="card-title text-2xl text-warning">
            <EyeOff className="w-6 h-6" />
            What Not to Share Online
          </h2>
          <p className="text-lg mb-6">
            Even with strong passwords, be careful about what personal details you share publicly online.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h4 className="font-bold text-error mb-2">Avoid sharing:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-error" />
                    <span>Your full <strong>birthdate</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-error" />
                    <span>Your <strong>home address</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-error" />
                    <span><strong>Phone numbers</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-error" />
                    <span>Vacation plans</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-warning/10 border border-warning/20">
              <div className="card-body">
                <h4 className="font-bold text-warning mb-2">Be extra careful with:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>Pictures showing your <strong>house, keys, or address</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span><strong>Financial or banking info</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>Answers to security questions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h4 className="font-bold text-success mb-2">Safe to share:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>General interests and hobbies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>General city or region</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Public achievements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Managers */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-secondary">
            <Smartphone className="w-6 h-6" />
            Password Managers: A Handy Tool
          </h2>
          <p className="text-lg mb-6">
            If keeping track of all your passwords feels overwhelming, a <strong>password manager</strong> can help.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What's a Password Manager?</h3>
              <p>It's a <strong>secure app</strong> that stores your passwords in one place, like a digital safe.</p>
              
              <h4 className="font-bold text-secondary">Benefits:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                  <span>You only need to remember <strong>one master password</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                  <span>It can create strong passwords for you</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                  <span>It can fill in your passwords automatically</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                  <span>Your info stays <strong>encrypted</strong> (scrambled for safety)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-secondary">Popular Password Managers:</h4>
              <div className="space-y-3">
                <div className="card bg-secondary/10 border border-secondary/20">
                  <div className="card-body p-4">
                    <h5 className="font-bold">Bitwarden</h5>
                    <p className="text-sm">Free and very secure</p>
                  </div>
                </div>
                <div className="card bg-secondary/10 border border-secondary/20">
                  <div className="card-body p-4">
                    <h5 className="font-bold">LastPass</h5>
                    <p className="text-sm">Simple to use</p>
                  </div>
                </div>
                <div className="card bg-secondary/10 border border-secondary/20">
                  <div className="card-body p-4">
                    <h5 className="font-bold">1Password</h5>
                    <p className="text-sm">Great for families</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative to Password Managers */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-info">
        <div className="card-body">
          <h2 className="card-title text-2xl text-info">If You Prefer Not to Use a Password Manager</h2>
          <p className="text-lg mb-4">That's okay! You can still stay safe by:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Key className="w-5 h-5 text-info mt-1 flex-shrink-0" />
              <span>Writing passwords in a notebook and keeping it in a safe place at home</span>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-info mt-1 flex-shrink-0" />
              <span>Using <strong>different passwords</strong> for your most important accounts</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-info mt-1 flex-shrink-0" />
              <span><strong>Changing your passwords</strong> every 6 to 12 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Strong passwords are your first line of defense!</h3>
          <p className="text-lg mt-2">
            By avoiding weak passwords, using smart habits, and managing your information carefully, you can protect your digital life with confidence.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>12+ characters</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Unique per account</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeOff className="w-5 h-5" />
              <span>Keep private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module5;
