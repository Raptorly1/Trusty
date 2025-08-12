import React from 'react';
import { AlertTriangle, Phone, Shield, Heart, HelpCircle, Users, MapPin, FileText, CheckCircle } from 'lucide-react';
import SourcesButton from '../common/SourcesButton';

const Module8: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto text-error mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Reporting & Getting Help</h1>
        <p className="text-xl text-base-content/70">What to Do When Something Goes Wrong</p>
      </div>

      {/* Introduction */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <p className="text-lg leading-relaxed">
            Even when you follow every safety step, things can still go wrong, and that's okay. What matters most is <strong>knowing what to do next</strong>. You're not alone, and there are trusted people and tools ready to help you.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Let's go over <strong>how to report scams, protect your identity, and find support.</strong>
          </p>
        </div>
      </div>

      {/* Where to Report Scams */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-error">
            <AlertTriangle className="w-6 h-6" />
            Where and How to Report Scams
          </h2>
          <p className="text-lg mb-6">
            Reporting scams helps protect others and can sometimes help you recover losses. Here's where to go:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-error">Government Agencies:</h3>
              <div className="space-y-3">
                <div className="card bg-error/10 border border-error/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Federal Trade Commission (FTC)</span>
                    </h4>
                    <p className="text-sm mt-1">Report at: ReportFraud.ftc.gov</p>
                    <p className="text-sm">Phone: 1-877-FTC-HELP</p>
                  </div>
                </div>

                <div className="card bg-error/10 border border-error/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>FBI Internet Crime Complaint Center</span>
                    </h4>
                    <p className="text-sm mt-1">Report at: ic3.gov</p>
                    <p className="text-sm">For internet-related crimes</p>
                  </div>
                </div>

                <div className="card bg-error/10 border border-error/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Local Police</span>
                    </h4>
                    <p className="text-sm mt-1">For immediate threats or if you've lost money</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-warning">Financial Institutions:</h3>
              <div className="space-y-3">
                <div className="card bg-warning/10 border border-warning/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">Your Bank or Credit Card Company</h4>
                    <p className="text-sm mt-1">Call immediately if you shared financial information</p>
                    <p className="text-sm">They can freeze accounts and dispute charges</p>
                  </div>
                </div>

                <div className="card bg-warning/10 border border-warning/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">Credit Monitoring Services</h4>
                    <p className="text-sm mt-1">Experian, Equifax, TransUnion</p>
                    <p className="text-sm">For identity theft concerns</p>
                  </div>
                </div>

                <div className="card bg-warning/10 border border-warning/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">Social Security Administration</h4>
                    <p className="text-sm mt-1">If your Social Security number was compromised</p>
                    <p className="text-sm">Call: 1-800-772-1213</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Freeze */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-info">
        <div className="card-body">
          <h2 className="card-title text-2xl text-info">
            <Shield className="w-6 h-6" />
            How to Freeze Your Credit
          </h2>
          <p className="text-lg mb-6">
            A credit freeze prevents new accounts from being opened in your name. It's free and one of the best ways to protect yourself from identity theft.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-info">The Three Credit Bureaus:</h3>
              <div className="space-y-3">
                <div className="card bg-info/10 border border-info/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">Experian</h4>
                    <p className="text-sm">1-888-397-3742</p>
                    <p className="text-sm">experian.com/freeze</p>
                  </div>
                </div>
                <div className="card bg-info/10 border border-info/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">Equifax</h4>
                    <p className="text-sm">1-800-349-9960</p>
                    <p className="text-sm">equifax.com/personal/credit-report-services</p>
                  </div>
                </div>
                <div className="card bg-info/10 border border-info/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">TransUnion</h4>
                    <p className="text-sm">1-888-909-8872</p>
                    <p className="text-sm">transunion.com/credit-freeze</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-success">What You Need to Know:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>It's <strong>completely free</strong> to freeze and unfreeze your credit</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>You need to contact <strong>all three bureaus</strong> separately</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>You can <strong>temporarily unfreeze</strong> when you need to apply for credit</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>It <strong>won't affect</strong> your credit score or existing accounts</span>
                </li>
              </ul>

              <div className="alert alert-info">
                <Shield className="w-5 h-5" />
                <div>
                  <h4 className="font-bold">Important:</h4>
                  <p className="text-sm">Keep the PIN or password they give you safe - you'll need it to unfreeze later!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identity Theft Recovery */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-warning">
            <Users className="w-6 h-6" />
            What to Do if Your Identity Is Stolen
          </h2>
          <p className="text-lg mb-6">
            If you discover someone is using your personal information, act quickly but don't panic. Here's your step-by-step plan:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-warning">Immediate Steps:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="badge badge-warning badge-sm mt-1">1</div>
                  <div>
                    <h4 className="font-semibold">Contact Your Bank</h4>
                    <p className="text-sm">Report any unauthorized transactions immediately</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="badge badge-warning badge-sm mt-1">2</div>
                  <div>
                    <h4 className="font-semibold">Place Fraud Alerts</h4>
                    <p className="text-sm">Call one credit bureau to place alerts on all reports</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="badge badge-warning badge-sm mt-1">3</div>
                  <div>
                    <h4 className="font-semibold">Change Passwords</h4>
                    <p className="text-sm">Update passwords on all important accounts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="badge badge-warning badge-sm mt-1">4</div>
                  <div>
                    <h4 className="font-semibold">File Police Report</h4>
                    <p className="text-sm">Get a copy for your records and to show creditors</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-success">Recovery Resources:</h3>
              <div className="space-y-3">
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">IdentityTheft.gov</h4>
                    <p className="text-sm">Free government resource with step-by-step recovery plans</p>
                  </div>
                </div>
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">FTC Identity Theft Hotline</h4>
                    <p className="text-sm">1-877-ID-THEFT (1-877-438-4338)</p>
                  </div>
                </div>
                <div className="card bg-success/10 border border-success/20">
                  <div className="card-body p-4">
                    <h4 className="font-bold">AARP Fraud Watch Network</h4>
                    <p className="text-sm">Free support and guidance for seniors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources for Seniors */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-accent">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <Heart className="w-6 h-6" />
            Resources for Seniors
          </h2>
          <p className="text-lg mb-6">
            You're not alone - these trusted organizations are here to help:
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="card bg-accent/10 border border-accent/20">
                <div className="card-body">
                  <h3 className="card-title text-accent">
                    <Shield className="w-5 h-5" />
                    AARP Fraud Watch Network
                  </h3>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Free fraud prevention resources</li>
                    <li>• Scam-tracking map</li>
                    <li>• Phone: 1-877-908-3360</li>
                    <li>• Website: aarp.org/fraudwatch</li>
                  </ul>
                </div>
              </div>

              <div className="card bg-accent/10 border border-accent/20">
                <div className="card-body">
                  <h3 className="card-title text-accent">
                    <Heart className="w-5 h-5" />
                    Senior Medicare Patrol (SMP)
                  </h3>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Helps prevent Medicare fraud</li>
                    <li>• Free education and assistance</li>
                    <li>• Phone: 1-877-808-2468</li>
                    <li>• Website: smpresource.org</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card bg-accent/10 border border-accent/20">
                <div className="card-body">
                  <h3 className="card-title text-accent">
                    <MapPin className="w-5 h-5" />
                    Eldercare Locator
                  </h3>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Connects you to local services</li>
                    <li>• Help with various senior issues</li>
                    <li>• Phone: 1-800-677-1116</li>
                    <li>• Website: eldercare.acl.gov</li>
                  </ul>
                </div>
              </div>

              <div className="card bg-accent/10 border border-accent/20">
                <div className="card-body">
                  <h3 className="card-title text-accent">
                    <HelpCircle className="w-5 h-5" />
                    Finding Tech Help
                  </h3>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• <strong>Public libraries</strong> - Free tech support</li>
                    <li>• <strong>Senior centers</strong> - Digital safety workshops</li>
                    <li>• <strong>Senior Planet</strong> - Free online training</li>
                    <li>• Website: seniorplanet.org</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-primary">
            <FileText className="w-6 h-6" />
            Create Your Emergency Contact List
          </h2>
          <p className="text-lg mb-6">
            Keep these important numbers handy. Write them down and keep copies in multiple places:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-primary/10 border border-primary/20">
              <div className="card-body">
                <h3 className="card-title text-primary">Financial Contacts:</h3>
                <div className="space-y-2 mt-3 text-sm">
                  <div>Bank: _________________</div>
                  <div>Credit Card: _________________</div>
                  <div>Credit Union: _________________</div>
                  <div>Investment Account: _________________</div>
                </div>
              </div>
            </div>

            <div className="card bg-primary/10 border border-primary/20">
              <div className="card-body">
                <h3 className="card-title text-primary">Emergency Numbers:</h3>
                <div className="space-y-2 mt-3 text-sm">
                  <div>FTC Fraud Hotline: 1-877-FTC-HELP</div>
                  <div>Identity Theft: 1-877-ID-THEFT</div>
                  <div>AARP Fraud Watch: 1-877-908-3360</div>
                  <div>Local Police: _________________</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Remember: Help is always available!</h3>
          <p className="text-lg mt-2">
            If something goes wrong online, don't panic. You can report it, freeze your credit, recover from identity theft, and find trusted help. Knowing where to turn and what steps to take makes all the difference.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Call for help</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Freeze credit</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Report scams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Button */}
      <SourcesButton moduleNumber={8} />
    </div>
  );
};

export default Module8;
