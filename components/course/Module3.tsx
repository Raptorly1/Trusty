import React from 'react';
import { Newspaper, AlertTriangle, Search, CheckCircle, ExternalLink, Users, Zap } from 'lucide-react';

const Module3: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Newspaper className="w-16 h-16 mx-auto text-info mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Spotting Fake News</h1>
        <p className="text-xl text-base-content/70">Learning to verify information in the digital age</p>
      </div>

      {/* What is Fake News */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-info">
            <Newspaper className="w-6 h-6" />
            What Is Fake News?
          </h2>
          <p className="text-lg leading-relaxed">
            Fake news refers to false or misleading information that's presented as if it were real news. It can be completely made up, partially true but twisted, or real information taken out of context.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Sometimes fake news is created to make money from clicks, influence opinions, or simply to confuse people. It spreads quickly on social media because sensational stories often get more attention than regular news.
          </p>
        </div>
      </div>

      {/* Why It Matters */}
      <div className="card bg-error/5 border border-error/20">
        <div className="card-body">
          <h2 className="card-title text-2xl text-error">
            <AlertTriangle className="w-6 h-6" />
            Why Fake News Matters
          </h2>
          <p className="text-lg mb-4">
            Fake news isn't just annoying—it can be genuinely harmful. When people believe and share false information, it can:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-error mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Influence Important Decisions</h4>
                  <p className="text-sm">People might make choices about health, finances, or voting based on false information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-error mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Create Panic or Fear</h4>
                  <p className="text-sm">False emergency information can cause unnecessary anxiety and poor decisions</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-error mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Damage Relationships</h4>
                  <p className="text-sm">Sharing false information can hurt trust with family and friends</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-error mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Spread Quickly</h4>
                  <p className="text-sm">False information often spreads faster than the truth, making the problem worse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Spot Fake News */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-primary">
            <Search className="w-6 h-6" />
            How to Spot Fake News
          </h2>
          <p className="text-lg mb-6">
            Before believing or sharing a story, ask yourself these key questions:
          </p>
          
          <div className="space-y-6">
            <div className="card bg-primary/5 border border-primary/20">
              <div className="card-body">
                <h3 className="card-title text-lg text-primary">1. Who wrote this?</h3>
                <p>Is it from a well-known, respected news source? Or is it from a random blog or social media account? Check if the author or organization is credible and has a track record of accurate reporting.</p>
              </div>
            </div>

            <div className="card bg-info/5 border border-info/20">
              <div className="card-body">
                <h3 className="card-title text-lg text-info">2. What's the evidence?</h3>
                <p>Does the story mention specific sources, studies, or expert quotes? Be suspicious of articles that only state opinions as facts without backing them up with verifiable information.</p>
              </div>
            </div>

            <div className="card bg-warning/5 border border-warning/20">
              <div className="card-body">
                <h3 className="card-title text-lg text-warning">3. What's the emotion?</h3>
                <p>Does the story make you feel very angry, scared, or excited? Sometimes fake news is designed to trigger strong emotions to stop you from thinking critically about the facts.</p>
              </div>
            </div>

            <div className="card bg-success/5 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-lg text-success">4. Check other sources</h3>
                <p>See if major, respected news organizations are reporting the same story. If it's a big, true story, multiple credible sources will usually cover it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Tools */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-accent">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <CheckCircle className="w-6 h-6" />
            Helpful Tools to Verify Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Fact-Checking Websites:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Snopes.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>FactCheck.org</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>PolitiFact.com</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Trusty's Tools:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Text Checker - Analyze articles for bias</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Fact-Checker - Verify claims quickly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="card bg-success/10 border border-success/20">
        <div className="card-body">
          <h2 className="card-title text-2xl text-success">Best Practices for Information Sharing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-success">✓ DO:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <span>Pause before sharing emotional content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <span>Check multiple reliable sources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <span>Look for expert opinions and citations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <span>Consider the source's motivation</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-error">✗ DON'T:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                  <span>Share just because it confirms your beliefs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                  <span>Trust headlines without reading the article</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                  <span>Share information from unknown sources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                  <span>Assume social media posts are accurate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Remember: Take your time to verify!</h3>
          <p className="text-lg mt-2">
            In our fast-paced digital world, taking a moment to verify information before believing or sharing it is one of the most valuable skills you can develop. Our tools can help you with this!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Module3;
