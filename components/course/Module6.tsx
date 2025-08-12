import React from 'react';
import { Bot, Eye, AlertTriangle, Search, CheckCircle, Zap, Image as ImageIcon } from 'lucide-react';
import SourcesButton from '../common/SourcesButton';

const Module6: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Bot className="w-16 h-16 mx-auto text-secondary mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">Recognizing AI and Fake Content</h1>
        <p className="text-xl text-base-content/70">How to think critically about what you see online</p>
      </div>

      {/* Introduction */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <p className="text-lg leading-relaxed">
            Not everything you read or see online is real. Some information is misleading, and some content is created by computers (Artificial Intelligence or AI) to look real. Learning to spot these can help you make better decisions.
          </p>
        </div>
      </div>

      {/* AI Detection Guide */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-secondary">
            <Bot className="w-6 h-6" />
            What is AI-Generated Content?
          </h2>
          <p className="text-lg mb-6">
            Artificial Intelligence can now create very realistic text, images, and even videos. While this technology has many benefits, it can also be misused to create fake news, scam messages, or misleading content.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-info/10 border border-info/20">
              <div className="card-body">
                <h3 className="card-title text-info">AI-Generated Text Signs:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                    <span>Repetitive phrases or unusual wording</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                    <span>Lacks specific, verifiable details</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                    <span>Generic or overly perfect language</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                    <span>Inconsistent facts or timeline</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-warning/10 border border-warning/20">
              <div className="card-body">
                <h3 className="card-title text-warning">AI-Generated Image Signs:</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Odd-looking hands, fingers, or teeth</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Blurry or inconsistent backgrounds</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Perfect skin with no blemishes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                    <span>Strange lighting or shadows</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Thinking Questions */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-primary">
            <Search className="w-6 h-6" />
            Before You Believe or Share, Ask Yourself:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div className="card bg-primary/10 border border-primary/20">
                <div className="card-body">
                  <h3 className="font-bold text-primary">Who wrote this?</h3>
                  <p className="text-sm">Is it from a well-known news source or a random blog? Check the author's credentials and the website's reputation.</p>
                </div>
              </div>

              <div className="card bg-info/10 border border-info/20">
                <div className="card-body">
                  <h3 className="font-bold text-info">What's the evidence?</h3>
                  <p className="text-sm">Does it mention sources or just state opinions as facts? Look for links to studies, expert quotes, or verifiable data.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card bg-warning/10 border border-warning/20">
                <div className="card-body">
                  <h3 className="font-bold text-warning">What's the emotion?</h3>
                  <p className="text-sm">Does the story make you feel very angry or scared? That can be a tactic to stop you from thinking critically.</p>
                </div>
              </div>

              <div className="card bg-success/10 border border-success/20">
                <div className="card-body">
                  <h3 className="font-bold text-success">Check other sources</h3>
                  <p className="text-sm">See if major, respected news organizations are reporting the same story.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Detection Examples */}
      <div className="card bg-base-100 shadow-lg border-l-4 border-l-secondary">
        <div className="card-body">
          <h2 className="card-title text-2xl text-secondary">
            <ImageIcon className="w-6 h-6" />
            Practice: Can You Spot the AI?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error">Likely AI-Generated</h3>
                <div className="mockup-window border border-error bg-base-300">
                  <div className="flex justify-center px-4 py-8 bg-base-200">
                    <div className="text-center">
                      <Bot className="w-16 h-16 mx-auto text-error mb-4" />
                      <p className="text-sm font-mono">"Perfect person with flawless skin, six fingers on one hand, and eyes that seem to glow unnaturally"</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="font-bold text-error mb-2">Red flags:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Too-perfect appearance</li>
                    <li>• Wrong number of fingers</li>
                    <li>• Unnatural glowing eyes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success">Likely Real</h3>
                <div className="mockup-window border border-success bg-base-300">
                  <div className="flex justify-center px-4 py-8 bg-base-200">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
                      <p className="text-sm font-mono">"Natural photo with normal lighting, realistic skin texture, and proper human proportions"</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="font-bold text-success mb-2">Good signs:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Natural imperfections</li>
                    <li>• Consistent lighting</li>
                    <li>• Proper anatomy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deepfakes Warning */}
      <div className="alert alert-warning">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Watch Out for Deepfakes</h3>
          <p>Deepfakes are AI-generated videos that make it look like someone said or did something they never actually did. These are becoming harder to detect, so always verify important videos through trusted news sources.</p>
        </div>
      </div>

      {/* Verification Tools */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl text-accent">
            <Zap className="w-6 h-6" />
            Tools to Help You Verify Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Trusty's Tools:</h4>
              <div className="space-y-3">
                <div className="card bg-accent/10 border border-accent/20">
                  <div className="card-body p-4">
                    <h5 className="font-bold">AI Text Checker</h5>
                    <p className="text-sm">Analyze text to see if it might be AI-generated</p>
                  </div>
                </div>
                <div className="card bg-accent/10 border border-accent/20">
                  <div className="card-body p-4">
                    <h5 className="font-bold">AI Image Checker</h5>
                    <p className="text-sm">Upload images to check for AI generation signs</p>
                  </div>
                </div>
                <div className="card bg-accent/10 border border-accent/20">
                  <div className="card-body p-4">
                    <h5 className="font-bold">Fact Checker</h5>
                    <p className="text-sm">Verify claims and statements quickly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg">Best Practices:</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>Cross-check with multiple reliable sources</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Search className="w-5 h-5 text-info mt-1 flex-shrink-0" />
                  <span>Use reverse image search for suspicious photos</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                  <span>Look closely at details like hands, text, and backgrounds</span>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-error mt-1 flex-shrink-0" />
                  <span>Be extra skeptical of content that seems too perfect or shocking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold">Stay curious and question what you see!</h3>
          <p className="text-lg mt-2">
            AI technology is advancing rapidly, but by staying informed and using verification tools, you can navigate the digital world with confidence. When in doubt, use our tools to help verify content!
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Look closely</span>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Verify sources</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Use tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Button */}
      <SourcesButton moduleNumber={6} />
    </div>
  );
};

export default Module6;
