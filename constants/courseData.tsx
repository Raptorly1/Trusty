
import React from 'react';
import { CourseModule, ExerciseType, FinalQuizQuestion } from '../types';

export const courseModules: CourseModule[] = [
  {
    title: "1. Welcome to the Digital World",
    description: "Understanding the basics of being online safely.",
    content: (
      <div className="space-y-4 text-lg">
        <p>Welcome! The internet is a wonderful place to connect with family, learn new things, and explore hobbies. Think of it like a giant city. There are amazing museums and parks, but also some areas you need to be careful in.</p>
        <p>In this first module, we'll learn the basic 'rules of the road' to make sure your journey online is safe and fun. We'll cover what personal information is and why it's important to protect it.</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Personal Information:</strong> This is anything that can identify you, like your full name, address, phone number, or birthday.</li>
          <li><strong>Sharing Safely:</strong> Only share personal information on trusted websites, and think twice before posting it publicly.</li>
        </ul>
      </div>
    ),
    exercise: {
      type: ExerciseType.QUIZ,
      question: "Which of the following is considered 'personal information' you should be careful about sharing online?",
      options: [
        { text: "Your favorite color", isCorrect: false },
        { text: "Your home address", isCorrect: true },
        { text: "A recipe you like", isCorrect: false },
        { text: "The weather in your city", isCorrect: false },
      ],
      correctFeedback: "That's right! Your home address is very personal and should be kept private.",
      incorrectFeedback: "Not quite. While your favorite color is personal to you, it can't be used to identify you in the same way your home address can."
    }
  },
  {
    title: "2. Spotting Scams and Phishing",
    description: "Learn to identify suspicious emails and messages.",
    content: (
       <div className="space-y-4 text-lg">
        <p>Scammers often try to trick you with emails, texts, or phone calls. This is called 'phishing'. They 'fish' for your personal information. They might pretend to be your bank, a government agency, or even a friend.</p>
        <p>Look for these red flags:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Urgency:</strong> They say you must act NOW or something bad will happen.</li>
          <li><strong>Strange Links:</strong> Hover your mouse over a link (don't click!) to see if the web address looks suspicious.</li>
          <li><strong>Generic Greetings:</strong> Messages that say "Dear Customer" instead of your name can be a warning sign.</li>
          <li><strong>Spelling & Grammar Mistakes:</strong> Professional companies usually check their messages for errors.</li>
        </ul>
      </div>
    ),
    exercise: {
      type: ExerciseType.SCAM_IDENTIFICATION,
      instructions: "Read the following messages. Click the ones you think are scams.",
      items: [
        { 
          content: "URGENT: Your bank account is LOCKED. Click here to verify your details immediately: bit.ly/bank-fix", 
          isScam: true,
          explanation: "This is a scam. The urgent language and suspicious link are big red flags."
        },
        { 
          content: "Hi, just a reminder your library book is due next Friday. You can renew it online at our official website. Thanks, Your Local Library.", 
          isScam: false,
          explanation: "This is likely safe. It's a polite reminder with no urgent demands or suspicious links."
        },
        { 
          content: "Congratulation! You won a FREE cruise! To claim your prize, please provide your credit card number for a small verification fee.", 
          isScam: true,
          explanation: "This is a classic scam. Legitimate prizes don't require you to pay a fee or give credit card details."
        },
      ]
    }
  },
  {
    title: "3. Strong Passwords are Your Best Friend",
    description: "Create and manage strong, unique passwords.",
    content: (
       <div className="space-y-4 text-lg">
        <p>A strong password is like a strong lock on your front door. A weak password is easy for criminals to guess.</p>
        <p>Here's how to create a strong one:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Make it long:</strong> Aim for at least 12 characters.</li>
          <li><strong>Mix it up:</strong> Use a combination of uppercase letters, lowercase letters, numbers, and symbols (like !, @, #, $).</li>
          <li><strong>Make it unique:</strong> Use a different password for every important account (email, banking, etc.).</li>
          <li><strong>Think of a phrase:</strong> A good trick is to think of a memorable phrase, like "MyGrandsonLeoWasBornIn2023!", and use that as a base.</li>
        </ul>
        <p>Avoid using common words, your name, or your birthday.</p>
      </div>
    ),
    exercise: {
      type: ExerciseType.PASSWORD_CHECKER,
    }
  },
  {
    title: "4. Recognizing AI and Fake News",
    description: "How to think critically about what you see online.",
    content: (
      <div className="space-y-4 text-lg">
        <p>Not everything you read online is true. Some information is misleading, and some is created by computers (Artificial Intelligence or AI) to look real.</p>
        <p>Before you believe or share something, ask yourself:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Who wrote this?</strong> Is it from a well-known news source or a random blog?</li>
          <li><strong>What's the evidence?</strong> Does it mention sources or just state opinions as facts?</li>
          <li><strong>What's the emotion?</strong> Does the story make you feel very angry or scared? That can be a tactic to stop you from thinking critically.</li>
          <li><strong>Check other sources:</strong> See if major, respected news organizations are reporting the same story.</li>
        </ul>
        <p>Our tools, like the Text Checker and Fact-Checker, can help you with this!</p>
      </div>
    ),
    exercise: {
      type: ExerciseType.QUIZ,
      question: "You see an article on social media with a shocking headline. What's the BEST first step?",
      options: [
        { text: "Share it immediately so your friends are aware.", isCorrect: false },
        { text: "Believe it, because it looks professionally written.", isCorrect: false },
        { text: "Check if respected news sources are reporting the same thing.", isCorrect: true },
        { text: "Comment on the article to argue with people.", isCorrect: false },
      ],
      correctFeedback: "Excellent! Checking other reliable sources is the most important step to verify information.",
      incorrectFeedback: "It's best to pause before sharing. Checking other sources first helps prevent the spread of misinformation."
    }
  },
];

export const finalQuizQuestions: FinalQuizQuestion[] = [
  {
    question: "If you receive an email asking for your password, you should:",
    options: ["Reply with your password", "Ignore it and delete it", "Click the link to see if it's real", "Forward it to all your contacts"],
    correctAnswer: "Ignore it and delete it"
  },
  {
    question: "A strong password should include:",
    options: ["Only your pet's name", "Your birthday", "A mix of letters, numbers, and symbols", "The word 'password'"],
    correctAnswer: "A mix of letters, numbers, and symbols"
  },
  {
    question: "What is 'phishing'?",
    options: ["A fun water sport", "A way to make friends online", "When someone tries to trick you into giving personal information", "A type of computer virus"],
    correctAnswer: "When someone tries to trick you into giving personal information"
  },
  {
    question: "Before sharing a surprising news story you saw on social media, you should:",
    options: ["Share it right away", "Try to verify it with trusted news sources", "Only share it with family", "Assume it's true"],
    correctAnswer: "Try to verify it with trusted news sources"
  }
];
