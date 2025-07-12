

import { Module, QuizQuestion, InteractiveType } from './types';
import module1Markdown from './modules/module1.md?raw';
import module2Markdown from './modules/module2.md?raw';
import module3Markdown from './modules/module3.md?raw';
import module4Markdown from './modules/module4.md?raw';
import module5Markdown from './modules/module5.md?raw';
import module6Markdown from './modules/module6.md?raw';
import module7Markdown from './modules/module7.md?raw';
import module8Markdown from './modules/module8.md?raw';

// Helper to clean markdown content from user-provided files
const cleanMarkdown = (markdown: string): string => {
  // Remove interactive sections, which are defined separately in the Module object
  const contentOnly = markdown.split(/#+\s*(Interactive Activity|Tools for Verification|Create a Digital Safety Cheat Sheet)/)[0];
  // Remove the main H1 title, as it's handled by the CourseModule component's props
  const withoutTitle = contentOnly.replace(/^#\s[^\n]*/, '').trim();
  // HTML is preserved so that elements like images and custom divs are rendered correctly.
  // The new MarkdownRenderer is designed to handle this.
  // Clean up extra newlines and trim whitespace
  return withoutTitle.replace(/\n\s*\n/g, '\n\n').trim();
};



export const COURSE_MODULES: Module[] = [
  {
    id: 1,
    title: "Module 1: The Basics",
    subtitle: "What is Online Safety?",
    markdownContent: cleanMarkdown(module1Markdown),
    interactive: {
      type: InteractiveType.TAP_RISKY_BEHAVIOR,
      prompt: "Based on what you've learned, which of these is a risky online behavior?",
      options: [
        { text: "Calling your bank using the number on their official website.", isCorrect: false, feedback: "This is safe! You are using a trusted source to contact them." },
        { text: "Ignoring a text message from a number you don't recognize.", isCorrect: false, feedback: "Good choice! It's wise to ignore messages from unknown sources." },
        { text: "Clicking a link in a surprise email to claim a prize.", isCorrect: true, feedback: "Exactly! Unexpected prizes are a common trick to get you to click a dangerous link." },
      ],
      correctAnswerFeedback: "Great job! Unsolicited links are a major red flag."
    },
  },
  {
    id: 2,
    title: "Module 2: Common Scams",
    subtitle: "Common Scams Explained",
    markdownContent: cleanMarkdown(module2Markdown),
    interactive: {
      type: InteractiveType.REAL_OR_SCAM,
      prompt: "You receive this text. Is it real or a scam?",
      extraData: {
        message: "Your FEDEX package has a customs fee. To release it for delivery, please visit [fedex-tracking-updates.com] and pay $1.99 now.",
      },
      options: [
        { text: "It's Real", isCorrect: false, feedback: "Not quite. Unexpected fees and unofficial-looking links are signs of a scam. FedEx uses fedex.com." },
        { text: "It's a Scam", isCorrect: true, feedback: "Correct! Scammers use fake links and small, urgent fees to steal your credit card information." },
      ],
      correctAnswerFeedback: "Excellent! You spotted the signs of a phishing text."
    },
  },
  {
    id: 3,
    title: "Module 3: Fake News",
    subtitle: "Spotting Fake News & Deepfakes",
    markdownContent: cleanMarkdown(module3Markdown),
    interactive: {
      type: InteractiveType.REAL_OR_SCAM,
      prompt: "Based on the article, is the following headline likely to be real or fake news?",
      extraData: {
        message: "Headline: \"Scientists Discover Broccoli Cures All Forms of Cancer Overnight\"",
      },
      options: [
        { text: "Likely Real", isCorrect: false, feedback: "Not likely. Extraordinary claims like curing all cancers overnight require extraordinary evidence. This is a big red flag for fake news." },
        { text: "Likely Fake", isCorrect: true, feedback: "Correct! Headlines that sound too good to be true are almost always fake. It's important to be skeptical and check your sources." },
      ],
      correctAnswerFeedback: "Excellent! You've spotted a classic fake news red flag."
    },
  },
    {
    id: 4,
    title: "Module 4: Safe Browsing",
    subtitle: "Safe Browsing & Secure Sites",
    markdownContent: cleanMarkdown(module4Markdown),
    interactive: {
      type: InteractiveType.CHOOSE_REAL_SITE,
      prompt: "You want to log into your MyBank account. Which link is safer to click?",
      options: [
        { text: "mybank.secure-login.com", isCorrect: false, feedback: "Be careful. Scammers often add familiar words to a fake address. The real domain should be at the end." },
        { text: "https://mybank.com/login", isCorrect: true, feedback: "That's the one! The address starts with the company's real name and has the secure lock icon." },
      ],
      correctAnswerFeedback: "Perfect! You correctly identified the official and secure website."
    },
  },
  {
    id: 5,
    title: "Module 5: Passwords",
    subtitle: "Passwords & Privacy",
    markdownContent: cleanMarkdown(module5Markdown),
    interactive: {
      type: InteractiveType.PASSWORD_CHECKER,
      prompt: "Let's practice creating a strong password. A good password is long (12+ characters) and uses a mix of upper/lower case letters, numbers, and symbols.",
      correctAnswerFeedback: "This is a great starting point for a strong password!"
    },
  },
   {
    id: 6,
    title: "Module 6: AI Content",
    subtitle: "AI & Misinformation",
    markdownContent: cleanMarkdown(module6Markdown),
    interactive: {
      type: InteractiveType.AI_IMAGE_GUESS,
      prompt: "Which of these people is AI-made? Look for unnatural details.",
      options: [
        { text: "Person A", isCorrect: false, feedback: "Not quite. This is a real photo with natural lighting and skin texture. Look closely at the other image for clues like perfectly symmetrical features or waxy-looking skin, which are common signs of AI." },
        { text: "Person B", isCorrect: true, feedback: "Correct! This image was generated by AI. The slightly waxy skin and perfectly symmetrical features are common clues." },
      ],
      correctAnswerFeedback: "Great eye! You're learning to spot the tell-tale signs of AI."
    },
  },
  {
    id: 7,
    title: "Module 7: Good Habits",
    subtitle: "Cyber Hygiene Habits",
    markdownContent: cleanMarkdown(module7Markdown),
    interactive: {
      type: InteractiveType.CHEAT_SHEET,
      prompt: "Cyber Hygiene Cheat Sheet",
      extraData: {
        cheatSheet: [
          {
            title: "Keep Software & Devices Updated",
            tips: [
              "Turn on automatic updates for your computer, phone, and apps.",
              "Install updates as soon as you see them—updates fix security problems.",
              "Restart your device after updates to finish installing them."
            ]
          },
          {
            title: "Download Apps Safely",
            tips: [
              "Only download apps from official stores (App Store, Google Play, or the company’s website).",
              "Check reviews and permissions before installing any app.",
              "Avoid clicking pop-up ads or links to download software."
            ]
          },
          {
            title: "Protect Your Passwords",
            tips: [
              "Never share your passwords with anyone who contacts you.",
              "Use a different password for each important account.",
              "Watch out for people looking over your shoulder when you type passwords in public."
            ]
          },
          {
            title: "Be Wary of Urgency",
            tips: [
              "Scammers often say you must act right now—pause and verify first.",
              "If you get a scary or urgent message, contact the company or person directly using a trusted number.",
              "It’s always okay to take your time before responding."
            ]
          }
        ]
      }
    },
  },
  {
    id: 8,
    title: "Module 8: Getting Help",
    subtitle: "Reporting & Getting Help",
    markdownContent: cleanMarkdown(module8Markdown),
    interactive: {
      type: InteractiveType.GUIDED_REPORTING,
      prompt: "You've identified a scam email. What's the best first step?",
       options: [
        { text: "Delete it immediately and forget about it.", isCorrect: false, feedback: "While deleting it is good, reporting it first helps protect others." },
        { text: "Report it to the relevant authorities, like the FTC.", isCorrect: true, feedback: "Correct! Reporting scams to the FTC (at ReportFraud.ftc.gov) helps them track and fight scammers." },
        { text: "Reply to the scammer and tell them you know it's a scam.", isCorrect: false, feedback: "It's best not to engage with scammers at all. This just confirms your email is active." },
      ],
      correctAnswerFeedback: "That's right! Reporting fraud is an important step to protect the community."
    },
  }
];

export const FINAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "A website address bar shows a padlock icon 🔒. What does this usually mean?",
    options: ["The website is popular.", "The connection to the website is secure.", "The website has no advertisements.", "The website is for shopping only."],
    correctAnswerIndex: 1,
  },
  {
    question: "You receive an email from your bank with a link to 'verify your account immediately'. What is the safest action?",
    options: ["Click the link to see if it's real.", "Reply with your account number.", "Delete the email and call your bank using the number on their official website.", "Forward it to all your contacts to warn them."],
    correctAnswerIndex: 2,
  },
  {
    question: "Which of the following is the strongest password?",
    options: ["MyDogMax1", "12345678", "P@ssw0rd!", "HappySun-Day!2024"],
    correctAnswerIndex: 3,
  },
  {
    question: "What is a 'phishing' scam?",
    options: ["A contest to win a fishing trip.", "An attempt to get your personal information by pretending to be a trustworthy company.", "A computer virus that slows down your device.", "A pop-up ad for fishing gear."],
    correctAnswerIndex: 1,
  },
    {
    question: "If you get a text message about a package delivery you were not expecting, you should:",
    options: ["Click the link to track the package.", "Call the number in the text message.", "Pay the small customs fee they ask for.", "Delete the message and ignore it."],
    correctAnswerIndex: 3,
  },
];