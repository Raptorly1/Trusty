import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, BookOpen } from 'lucide-react';

interface SourcesButtonProps {
  moduleNumber: 2 | 3 | 4 | 5 | 6 | 7 | 8;
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
  ],
  5: [
    { title: "Microsoft - Create and Use Strong Passwords", url: "https://support.microsoft.com/en-us/windows/create-and-use-strong-passwords-c5cebb49-8c53-4f5e-2bc4-fe357ca048eb" },
    { title: "Google - Strong Password Guidelines", url: "https://support.google.com/accounts/answer/32040?hl=en" },
    { title: "CISA - Use Strong Passwords", url: "https://www.cisa.gov/secure-our-world/use-strong-passwords" },
    { title: "TerraNova Security - How to Create Strong Passwords", url: "https://www.terranovasecurity.com/blog/how-to-create-a-strong-password-in-7-easy-steps" },
    { title: "Privacy Guides - Passwords Overview", url: "https://www.privacyguides.org/en/basics/passwords-overview/" },
    { title: "FTC - Protect Your Personal Information", url: "https://consumer.ftc.gov/articles/protect-your-personal-information-hackers-and-scammers" },
    { title: "Lenovo - How to Protect Your Privacy Online", url: "https://www.lenovo.com/us/en/glossary/how-to-protect-your-privacy-online/?orgRef=https%253A%252F%252Fwww.google.com%252F&srsltid=AfmBOoqt_Z031jA41DozqE4SeT-wMBNLBHRfJJoml04JThbWo7qzy8IC" },
    { title: "PCMag - Best Password Managers", url: "https://www.pcmag.com/picks/the-best-password-managers" },
    { title: "Wired - Best Password Managers", url: "https://www.wired.com/story/best-password-managers/" }
  ],
  6: [
    { title: "IBM - AI Generated Content", url: "https://www.ibm.com/think/insights/ai-generated-content" },
    { title: "TechTarget - Pros and Cons of AI Generated Content", url: "https://www.techtarget.com/whatis/feature/Pros-and-cons-of-AI-generated-content" },
    { title: "Conductor - AI Generated Content Guide", url: "https://www.conductor.com/academy/ai-generated-content/" },
    { title: "IBM - What is Artificial Intelligence", url: "https://www.ibm.com/think/topics/artificial-intelligence" },
    { title: "Google Cloud - What is Artificial Intelligence", url: "https://cloud.google.com/learn/what-is-artificial-intelligence" },
    { title: "NASA - What is Artificial Intelligence", url: "https://www.nasa.gov/what-is-artificial-intelligence/" },
    { title: "MTU - Computing AI", url: "https://www.mtu.edu/computing/ai/" },
    { title: "Pace University - AI Detection Guide", url: "https://libguides.pace.edu/c.php?g=1292205&p=9488470" },
    { title: "East Central University - Detecting AI Generated Text", url: "https://www.eastcentral.edu/free/ai-faculty-resources/detecting-ai-generated-text/" },
    { title: "OpenAI Community - Spotting AI Writing", url: "https://community.openai.com/t/what-are-your-strategies-for-spotting-ai-writing/1150515/3" },
    { title: "Britannica - Real vs AI Images", url: "https://elearn.eb.com/real-vs-ai-images/" },
    { title: "MIT - Detect Fakes Project", url: "https://www.media.mit.edu/projects/detect-fakes/overview/" },
    { title: "Illinois State University - Evaluating Deepfakes", url: "https://guides.library.illinoisstate.edu/evaluating/deepfakes" },
    { title: "Northwestern - Detect Fakes", url: "https://detectfakes.kellogg.northwestern.edu/" },
    { title: "Turing Institute - What are Deepfakes", url: "https://www.turing.ac.uk/blog/what-are-deepfakes-and-how-can-we-detect-them" }
  ],
  7: [
    { title: "Kaspersky - Cyber Hygiene Habits", url: "https://www.kaspersky.com/resource-center/preemptive-safety/cyber-hygiene-habits" },
    { title: "Infosecurity Europe - Digital Security Practices", url: "https://www.infosecurityeurope.com/en-gb/blog/guides-checklists/10-everyday-practices-to-enhance-digital-security.html" },
    { title: "University of Redlands - Cyber Hygiene", url: "https://www.redlands.edu/offices-directory/offices/information-security-office/cyber-hygiene" },
    { title: "Proofpoint - Cyber Hygiene", url: "https://www.proofpoint.com/us/threat-reference/cyber-hygiene" },
    { title: "Stay Safe Online - Software Updates", url: "https://www.staysafeonline.org/articles/software-updates" },
    { title: "NCSC - Keeping Devices Updated", url: "https://www.ncsc.gov.uk/collection/device-security-guidance/managing-deployed-devices/keeping-devices-and-software-up-to-date" },
    { title: "UWCU - Urgency Scams", url: "https://www.uwcu.org/checking/articles/urgency-scams#:~:text=Urgency%20scams%20attempt%20to%20trigger,feel%20pressured%20into%20acting%20quickly." },
    { title: "University of Tennessee - Avoiding Scammers", url: "https://oit.utk.edu/security/learning-library/article-archive/avoiding-scammers/" },
    { title: "Tripwire - Top Scam Techniques", url: "https://www.tripwire.com/state-of-security/top-scam-techniques-what-you-need-to-know" },
    { title: "Kindred Credit Union - How Fraudsters Build Scams", url: "https://blog.kindredcu.com/how-fraudsters-build-scams-and-use-urgency-to-trick-you" },
    { title: "PFFCU - How to Avoid Urgency Scams", url: "https://www.pffcu.org/services/blog/how-to-avoid-urgency-scams/" }
  ],
  8: [
    { title: "FTC - Report Fraud", url: "https://reportfraud.ftc.gov/" },
    { title: "USA.gov - Where to Report Scams", url: "https://www.usa.gov/where-report-scams" },
    { title: "OCC - Report Internet Scams", url: "https://www.helpwithmybank.gov/help-topics/fraud-scams/scams/internet-scams/phishing-report.html" },
    { title: "FTC - Phone Scams", url: "https://consumer.ftc.gov/articles/phone-scams" },
    { title: "FBI - Scams and Safety", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety" },
    { title: "IC3 - Internet Crime Complaint Center", url: "https://www.ic3.gov/" },
    { title: "IRS - Report Phishing", url: "https://www.irs.gov/privacy-disclosure/report-phishing" },
    { title: "NCSC - Report Scam Website", url: "https://www.ncsc.gov.uk/collection/phishing-scams/report-scam-website" },
    { title: "USA.gov - Credit Freeze", url: "https://www.usa.gov/credit-freeze" },
    { title: "Equifax - Credit Freeze", url: "https://www.equifax.com/personal/credit-report-services/credit-freeze/" },
    { title: "Experian - Security Freeze", url: "https://www.experian.com/blogs/ask-experian/credit-education/preventing-fraud/security-freeze/" },
    { title: "TransUnion - Credit Freeze", url: "https://www.transunion.com/credit-freeze" },
    { title: "FTC - Credit Freeze vs Fraud Alert", url: "https://consumer.ftc.gov/articles/credit-freeze-or-fraud-alert-whats-right-your-credit-report" },
    { title: "Massachusetts - Freeze Your Credit", url: "https://www.mass.gov/info-details/freeze-your-credit" },
    { title: "IdentityTheft.gov", url: "https://www.identitytheft.gov/" },
    { title: "USA.gov - Identity Theft", url: "https://www.usa.gov/identity-theft" },
    { title: "IRS - Identity Theft Guide", url: "https://www.irs.gov/identity-theft-fraud-scams/identity-theft-guide-for-individuals" },
    { title: "Texas Attorney General - Identity Theft", url: "https://www.texasattorneygeneral.gov/consumer-protection/identity-theft/what-do-if-your-identity-stolen" },
    { title: "California Attorney General - Identity Theft Checklist", url: "https://oag.ca.gov/idtheft/facts/victim-checklist" },
    { title: "SSA - Identity Theft Protection", url: "https://www.ssa.gov/pubs/EN-05-10064.pdf" },
    { title: "OVC - Stop Elder Fraud", url: "https://ovc.ojp.gov/program/stop-elder-fraud/providing-help-restoring-hope" },
    { title: "FBI - Elder Fraud", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/elder-fraud" },
    { title: "CFPB - Protecting Against Fraud for Older Adults", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/protecting-against-fraud/" },
    { title: "NCOA - Avoiding Scams", url: "https://www.ncoa.org/older-adults/money/management/avoiding-scams/" },
    { title: "LA County - Smarter Seniors", url: "https://dcba.lacounty.gov/smarterseniors/" },
    { title: "California Aging - Protecting Against Scams", url: "https://aging.ca.gov/Aging_Resources/Protecting_Yourself_Against_Common_Scams/" },
    { title: "OVC - Elder Fraud Resources", url: "https://ovc.ojp.gov/program/elder-fraud-abuse/related-resources" }
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
