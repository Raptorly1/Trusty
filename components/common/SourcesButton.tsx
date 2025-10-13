import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, BookOpen } from 'lucide-react';

interface SourcesButtonProps {
  moduleNumber: 2 | 3 | 4;
}

const moduleSources = {
  2: [
    { title: "Texas Attorney General - Common Scams", url: "https://www.texasattorneygeneral.gov/consumer-protection/common-scams" },
    { title: "FBI - Common Frauds and Scams", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams" },
    { title: "Consumer Finance - Common Types of Scams", url: "https://www.consumerfinance.gov/ask-cfpb/what-are-some-common-types-of-scams-en-2092/" },
    { title: "FTC - How to Recognize and Avoid Phishing Scams", url: "https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams" },
    { title: "Wikipedia - Phishing", url: "https://en.wikipedia.org/wiki/Phishing" },
    { title: "Imperva - Phishing Attack Scam", url: "https://www.imperva.com/learn/application-security/phishing-attack-scam/" },
    { title: "FTC - Phone Scams", url: "https://consumer.ftc.gov/articles/phone-scams" },
    { title: "Wilton CT - Phone Scams PDF", url: "https://www.wiltonct.org/sites/g/files/vyhlif10026/f/uploads/phonescams.pdf" },
    { title: "Texas Attorney General - Phone Scams", url: "https://www.texasattorneygeneral.gov/consumer-protection/phone-mail-and-fax-scams/how-spot-and-report-phone-scams" },
    { title: "FTC - Spam Text Messages", url: "https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages" },
    { title: "FTC - Top Text Scams 2024", url: "https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/04/top-text-scams-2024" },
    { title: "Textedly - Spam Text Message Examples", url: "https://www.textedly.com/blog/spam-text-message-examples" },
    { title: "Avast - How to Spot a Fake Giveaway", url: "https://blog.avast.com/how-to-spot-a-fake-giveaway" },
    { title: "Cash App - Giveaway Scams", url: "https://cash.app/outsmart-scams/giveaway-scams" }
  ],
  3: [
    { title: "Wikipedia - Fake News", url: "https://en.wikipedia.org/wiki/Fake_news" },
    { title: "Cornell Library - Evaluate News/Fake News", url: "https://guides.library.cornell.edu/evaluate_news/fakenews" },
    { title: "University of Michigan - Fake News", url: "https://guides.lib.umich.edu/fakenews" },
    { title: "TRADOC - Social Media Fake News", url: "https://www.tradoc.army.mil/social-media-fake-news/" },
    { title: "PMC - Fake News Research Article", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9548403/" }
  ],
  4: [
    { title: "UW-Madison - Secure Website Identification", url: "https://it.wisc.edu/news/two-things-to-look-for-in-a-secure-website/" },
    { title: "Boston University - Unsafe Website Protection", url: "https://www.bu.edu/tech/support/information-security/security-for-everyone/how-to-identify-and-protect-yourself-from-an-unsafe-website/" },
    { title: "McAfee - Safe vs Unsafe Websites", url: "https://www.mcafee.com/blogs/internet-security/how-to-tell-whether-a-website-is-safe-or-unsafe/" },
    { title: "Google - Safe Experience with Ads", url: "https://blog.google/technology/ads/tips-to-continue-having-a-safe-and-positive-experience-with-ads/" },
    { title: "ClearCom IT - Avoiding Malvertising", url: "https://www.clearcomit.com/dont-click-that-5-tips-to-avoiding-malvertising/" },
    { title: "Trend Micro - Avoid Suspicious Websites", url: "https://helpcenter.trendmicro.com/en-us/article/tmka-05037#:~:text=Avoid%20Suspicious%20Websites:%20Be%20cautious,provides%20a%20better%20browsing%20experience." }
  ]
};

const SourcesButton: React.FC<SourcesButtonProps> = ({ moduleNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sources = moduleSources[moduleNumber];

  return (
    <>
      {/* Sources Button */}
      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-outline btn-info gap-2 hover:scale-105 transition-transform"
        >
          <BookOpen className="w-5 h-5" />
          View Module {moduleNumber} Sources
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              {/* Modal Content */}
              <motion.div
                className="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-base-300">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Module {moduleNumber} Sources</h3>
                    <p className="text-base-content/70 mt-1">Reference materials and additional reading</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn btn-ghost btn-sm btn-circle hover:btn-error"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid gap-3">
                    {sources.map((source, index) => (
                      <motion.a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-4 border border-base-300 rounded-lg hover:border-info hover:bg-info/5 transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-base-content group-hover:text-info transition-colors">
                              {source.title}
                            </h4>
                            <p className="text-sm text-base-content/60 mt-1 break-all">
                              {source.url}
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-base-content/40 group-hover:text-info transition-colors ml-3 flex-shrink-0" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-base-300 bg-base-200/50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-base-content/60">
                      {sources.length} sources available
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="btn btn-ghost"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SourcesButton;
