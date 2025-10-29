import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FinalQuiz from '../components/common/FinalQuiz';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseModule, ExerciseType } from '../types';
import { CheckCircle, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import Module1 from '../components/course/Module1';
import Module2 from '../components/course/Module2';
import Module3 from '../components/course/Module3';
import Module4 from '../components/course/Module4';
import Module5 from '../components/course/Module5';
import Module6 from '../components/course/Module6';
import Module7 from '../components/course/Module7';
import Module8 from '../components/course/Module8';

// Extra questions for Module 4
const module4ExtraQuestions = [
	{
		question: "Which of these is a suspicious domain name?",
		options: [
			{ text: "www.target.com", isCorrect: false },
			{ text: "www.target-shopping.net", isCorrect: true },
			{ text: "www.target.com/sale", isCorrect: false },
			{ text: "shop.target.com", isCorrect: false }
		]
	},
	{
		question: "A banner ad says, \"Your IP address has been selected to receive an iPhone X.\" What should you do?",
		options: [
			{ text: "Click it and follow the instructions", isCorrect: false },
			{ text: "Share it with a friend", isCorrect: false },
			{ text: "Ignore or close the ad immediately", isCorrect: true },
			{ text: "Enter your phone number just in case", isCorrect: false }
		]
	},
	{
		question: "What should you avoid when downloading software on your computer?",
		options: [
			{ text: "The company's official website", isCorrect: false },
			{ text: "The app store", isCorrect: false },
			{ text: "A pop-up ad or unknown site offering free downloads", isCorrect: true },
			{ text: "A trusted tech site", isCorrect: false }
		]
	},
	{
		question: "Which of these is the safest way to visit your bank's website?",
		options: [
			{ text: "Search for \"my bank login\" on Google", isCorrect: false },
			{ text: "Click a link from an email", isCorrect: false },
			{ text: "Type the address directly into your browser", isCorrect: true },
			{ text: "Use a third-party app", isCorrect: false }
		]
	},
	{
		question: "Why are pop-ups that claim your device is infected usually fake?",
		options: [
			{ text: "They never appear", isCorrect: false },
			{ text: "Only tech support sends pop-ups", isCorrect: false },
			{ text: "Legitimate antivirus tools don't use pop-up ads", isCorrect: true },
			{ text: "All pop-ups are viruses", isCorrect: false }
		]
	},
	{
		question: "What does the \"S\" in \"https://\" stand for?",
		options: [
			{ text: "Simple", isCorrect: false },
			{ text: "Safe", isCorrect: false },
			{ text: "Secure", isCorrect: true },
			{ text: "Software", isCorrect: false }
		]
	},
	{
		question: "A website looks like Amazon but the address says www.amaz0n-sale.com. What's wrong?",
		options: [
			{ text: "The name is spelled incorrectly with a zero instead of 'o'", isCorrect: true },
			{ text: "The layout is too simple", isCorrect: false },
			{ text: "It uses https://", isCorrect: false },
			{ text: "Nothing — it's a special version", isCorrect: false }
		]
	},
	{
		question: "What should you do before entering personal information on any website?",
		options: [
			{ text: "Check that the website uses https:// and has a lock icon", isCorrect: true },
			{ text: "Make sure the website has bright colors", isCorrect: false },
			{ text: "Ensure the page loads quickly", isCorrect: false },
			{ text: "Look for lots of advertisements", isCorrect: false }
		]
	},
	{
		question: "If you accidentally click on a suspicious link, what should you do immediately?",
		options: [
			{ text: "Continue browsing to see what happens", isCorrect: false },
			{ text: "Close your browser and run a security scan", isCorrect: true },
			{ text: "Enter fake information to test the site", isCorrect: false },
			{ text: "Share the link with friends to warn them", isCorrect: false }
		]
	},
	{
		question: "What's the best way to verify if a website is legitimate?",
		options: [
			{ text: "Check if it has professional-looking design", isCorrect: false },
			{ text: "Look for contact information, privacy policy, and secure connection", isCorrect: true },
			{ text: "See if it loads without errors", isCorrect: false },
			{ text: "Count the number of images on the page", isCorrect: false }
		]
	},
	{
		question: "A pop-up appears claiming you've won a prize and asks for your credit card to pay shipping. What should you do?",
		options: [
			{ text: "Pay the small shipping fee to get your prize", isCorrect: false },
			{ text: "Provide your credit card information since it's just for shipping", isCorrect: false },
			{ text: "Close the pop-up immediately - this is a common scam", isCorrect: true },
			{ text: "Share the \"opportunity\" with family members", isCorrect: false }
		]
	},
	{
		question: "How can you tell if an online shopping site is trustworthy?",
		options: [
			{ text: "It has the lowest prices", isCorrect: false },
			{ text: "It has customer reviews, secure payment options, and clear return policies", isCorrect: true },
			{ text: "It has flashy animations and graphics", isCorrect: false },
			{ text: "It promises immediate delivery", isCorrect: false }
		]
	}
];

// Extra questions for Module 5
const module5ExtraQuestions = [
	{
		question: "What makes a password strong?",
		options: [
			{ text: "Using your name and birthday", isCorrect: false },
			{ text: "Using common words like \"password\"", isCorrect: false },
			{ text: "A mix of upper and lowercase letters, numbers, and symbols", isCorrect: true },
			{ text: "Making it exactly 8 characters long", isCorrect: false }
		]
	},
	{
		question: "Why should you use different passwords for different accounts?",
		options: [
			{ text: "It's more confusing for you", isCorrect: false },
			{ text: "If one account is hacked, others remain safe", isCorrect: true },
			{ text: "It's required by law", isCorrect: false },
			{ text: "Websites won't accept the same password", isCorrect: false }
		]
	},
	{
		question: "What should you do if you think someone knows your password?",
		options: [
			{ text: "Wait and see if anything bad happens", isCorrect: false },
			{ text: "Change your password immediately", isCorrect: true },
			{ text: "Add numbers to your existing password", isCorrect: false },
			{ text: "Use that password for less important accounts", isCorrect: false }
		]
	},
	{
		question: "Where is the safest place to store your passwords?",
		options: [
			{ text: "Written on a sticky note on your computer", isCorrect: false },
			{ text: "In a text file on your desktop", isCorrect: false },
			{ text: "In a reputable password manager", isCorrect: true },
			{ text: "In your email drafts", isCorrect: false }
		]
	},
	{
		question: "What is a passphrase?",
		options: [
			{ text: "A very short password", isCorrect: false },
			{ text: "A longer password made of multiple words or a memorable sentence", isCorrect: true },
			{ text: "A password shared with family", isCorrect: false },
			{ text: "A password that never changes", isCorrect: false }
		]
	},
	{
		question: "If a website gets hacked and your password is stolen, what should you do?",
		options: [
			{ text: "Change passwords for that site and any other sites using the same password", isCorrect: true },
			{ text: "Nothing, since you weren't directly targeted", isCorrect: false },
			{ text: "Just change the password for that one site", isCorrect: false },
			{ text: "Stop using that website forever", isCorrect: false }
		]
	},
	{
		question: "What's the purpose of two-factor authentication (2FA)?",
		options: [
			{ text: "To make logging in faster", isCorrect: false },
			{ text: "To add an extra layer of security beyond just your password", isCorrect: true },
			{ text: "To share your account with family", isCorrect: false },
			{ text: "To remember your password for you", isCorrect: false }
		]
	},
	{
		question: "Which of these is NOT a good practice for password security?",
		options: [
			{ text: "Using a password manager", isCorrect: false },
			{ text: "Enabling two-factor authentication", isCorrect: false },
			{ text: "Sharing your password with tech support over the phone", isCorrect: true },
			{ text: "Using unique passwords for each account", isCorrect: false }
		]
	},
	{
		question: "How often should you update your passwords?",
		options: [
			{ text: "Every week", isCorrect: false },
			{ text: "When there's been a security breach or you suspect compromise", isCorrect: true },
			{ text: "Never", isCorrect: false },
			{ text: "Every day", isCorrect: false }
		]
	},
	{
		question: "What should you do if you forget a password?",
		options: [
			{ text: "Try guessing common passwords", isCorrect: false },
			{ text: "Use the official \"forgot password\" or \"reset password\" option", isCorrect: true },
			{ text: "Create a new account", isCorrect: false },
			{ text: "Call customer service and give them personal information", isCorrect: false }
		]
	},
	{
		question: "Why shouldn't you use the same password everywhere?",
		options: [
			{ text: "It's too easy to remember", isCorrect: false },
			{ text: "If one service is compromised, all your accounts are at risk", isCorrect: true },
			{ text: "Companies require different passwords", isCorrect: false },
			{ text: "It's against the law", isCorrect: false }
		]
	},
	{
		question: "What makes a good security question answer?",
		options: [
			{ text: "Something everyone knows about you", isCorrect: false },
			{ text: "Something that's easy to guess from your social media", isCorrect: false },
			{ text: "Something only you would know and that doesn't change", isCorrect: true },
			{ text: "Your actual mother's maiden name", isCorrect: false }
		]
	}
];

// Extra questions for Module 6
const module6ExtraQuestions = [
	{
		question: "A news article has perfect grammar, but it's full of vague phrases and no sources are listed. What should you suspect?",
		options: [
			{ text: "It's definitely real news", isCorrect: false },
			{ text: "It might be AI-generated content", isCorrect: true },
			{ text: "It's from a professional journalist", isCorrect: false },
			{ text: "Grammar doesn't matter for credibility", isCorrect: false }
		]
	},
	{
		question: "A friend posts a blurry photo of her new cat on Facebook with a caption full of typos. Is this likely AI or real?",
		options: [
			{ text: "AI - because it's on social media", isCorrect: false },
			{ text: "Real - imperfections and typos suggest human authenticity", isCorrect: true },
			{ text: "AI - because it mentions a pet", isCorrect: false },
			{ text: "Impossible to tell", isCorrect: false }
		]
	},
	{
		question: "A video call shows your cousin asking for money, but his lip movements are slightly off. What should you do?",
		options: [
			{ text: "Send the money immediately since it's family", isCorrect: false },
			{ text: "Be suspicious - this could be a deepfake or AI-generated video", isCorrect: true },
			{ text: "Ask for the money amount again", isCorrect: false },
			{ text: "Ignore the technical glitch and help", isCorrect: false }
		]
	},
	{
		question: "You find a blog post that repeats the same idea over and over in slightly different ways. What might this suggest?",
		options: [
			{ text: "The author really wants to emphasize the point", isCorrect: false },
			{ text: "It could be AI-generated content trying to reach a word count", isCorrect: true },
			{ text: "It's definitely written by a professional", isCorrect: false },
			{ text: "Repetition always means quality content", isCorrect: false }
		]
	},
	{
		question: "A new online \"influencer\" has stunning photos, but none of them show real places or events. What red flag is this?",
		options: [
			{ text: "They value their privacy", isCorrect: false },
			{ text: "They might be an AI-generated persona", isCorrect: true },
			{ text: "They're very artistic", isCorrect: false },
			{ text: "They travel to exotic locations", isCorrect: false }
		]
	},
	{
		question: "An email from your grandchild has an odd tone and mentions things they've never talked about before. What should you do?",
		options: [
			{ text: "Respond normally since emails can sound different", isCorrect: false },
			{ text: "Call them directly to verify it's really them", isCorrect: true },
			{ text: "Assume they're just growing and changing", isCorrect: false },
			{ text: "Reply asking about the unusual topics", isCorrect: false }
		]
	},
	{
		question: "A podcast sounds smooth, but the host talks in a slightly robotic tone and never makes mistakes. What might this indicate?",
		options: [
			{ text: "It's a very professional host", isCorrect: false },
			{ text: "It could be AI-generated audio", isCorrect: true },
			{ text: "The host is just well-prepared", isCorrect: false },
			{ text: "High-quality recording equipment", isCorrect: false }
		]
	},
	{
		question: "How can you verify if a shocking video of a celebrity is real?",
		options: [
			{ text: "Check if it looks professional", isCorrect: false },
			{ text: "See if reputable news sources are reporting the same story", isCorrect: true },
			{ text: "Count how many people have shared it", isCorrect: false },
			{ text: "Look for high video quality", isCorrect: false }
		]
	},
	{
		question: "What's a good sign that online content is human-generated rather than AI?",
		options: [
			{ text: "Perfect grammar and spelling", isCorrect: false },
			{ text: "Personal details, mistakes, and authentic imperfections", isCorrect: true },
			{ text: "Very formal language", isCorrect: false },
			{ text: "Repetitive phrasing", isCorrect: false }
		]
	},
	{
		question: "A comment under a news article feels overly emotional and extreme, but includes personal details. Is it likely AI or real?",
		options: [
			{ text: "AI - because it's emotional", isCorrect: false },
			{ text: "LIKELY REAL: PERSONAL STORY….", isCorrect: true },
			{ text: "AI - because it's under a news article", isCorrect: false },
			{ text: "Always impossible to tell", isCorrect: false }
		]
	},
	{
		question: "You see a shared image of a celebrity at a strange event, but it's not covered in any news outlets. What should you think?",
		options: [
			{ text: "News outlets are slow to report", isCorrect: false },
			{ text: "It could be an AI-generated or manipulated image", isCorrect: true },
			{ text: "It's definitely real if it looks clear", isCorrect: false },
			{ text: "Celebrity events aren't always newsworthy", isCorrect: false }
		]
	},
	{
		question: "What's the best way to stay informed about AI-generated content?",
		options: [
			{ text: "Assume everything online is fake", isCorrect: false },
			{ text: "Learn to recognize common signs and verify through multiple sources", isCorrect: true },
			{ text: "Only trust content from social media", isCorrect: false },
			{ text: "Avoid all digital media", isCorrect: false }
		]
	}
];

// Extra questions for Module 1
const module1ExtraQuestions = [
	{
		question: "Why should older adults care about online safety?",
		options: [
			{ text: "It helps them save money on their phone bill", isCorrect: false },
			{ text: "It prevents viruses from damaging their printer", isCorrect: false },
			{ text: "It protects their identity and personal information online", isCorrect: true },
			{ text: "It makes the internet faster", isCorrect: false }
		]
	},
	{
		question: "Which of the following is a basic example of staying safe online?",
		options: [
			{ text: "Ignoring any emails from friends", isCorrect: false },
			{ text: "Never using the internet", isCorrect: false },
			{ text: "Being careful about what information you share", isCorrect: true },
			{ text: "Using the same password everywhere", isCorrect: false }
		]
	},
	{
		question: "What is a scammer most likely trying to get from you?",
		options: [
			{ text: "A restaurant recommendation", isCorrect: false },
			{ text: "Personal or financial information", isCorrect: true },
			{ text: "Help with their homework", isCorrect: false },
			{ text: "Your favorite TV shows", isCorrect: false }
		]
	},
	{
		question: "What's one reason scammers may target older adults?",
		options: [
			{ text: "They often play too many games", isCorrect: false },
			{ text: "They usually have the latest technology", isCorrect: false },
			{ text: "They may be more trusting and less familiar with online tricks", isCorrect: true },
			{ text: "They don't own a phone", isCorrect: false }
		]
	},
	{
		question: "What is one risk of sharing too much personal information online?",
		options: [
			{ text: "You might get more internet ads", isCorrect: false },
			{ text: "It makes it easier for scammers to target you", isCorrect: true },
			{ text: "You lose your internet connection", isCorrect: false },
			{ text: "Your screen will turn off", isCorrect: false }
		]
	},
	{
		question: "If something online seems too good to be true, it probably is. This is a sign of:",
		options: [
			{ text: "A good deal", isCorrect: false },
			{ text: "A system update", isCorrect: false },
			{ text: "An internet scam", isCorrect: true },
			{ text: "A birthday greeting", isCorrect: false }
		]
	},
	{
		question: "If you feel confused or unsure about something online, you should:",
		options: [
			{ text: "Guess and click anyway", isCorrect: false },
			{ text: "Ask a trusted family member or tech helper", isCorrect: true },
			{ text: "Call the number in the message right away", isCorrect: false },
			{ text: "Post about it on social media", isCorrect: false }
		]
	},
	{
		question: "What is the first step to staying safe online?",
		options: [
			{ text: "Buying the newest computer", isCorrect: false },
			{ text: "Installing games", isCorrect: false },
			{ text: "Learning how to recognize common online threats", isCorrect: true },
			{ text: "Watching more videos", isCorrect: false }
		]
	}
];

// Extra questions for Module 2
const module2ExtraQuestions = [
	{
		question: "A caller says you owe money to the IRS and must pay immediately using a gift card. What kind of scam is this?",
		options: [
			{ text: "Email scam", isCorrect: false },
			{ text: "Giveaway scam", isCorrect: false },
			{ text: "Phone scam", isCorrect: true },
			{ text: "Text message scam", isCorrect: false }
		]
	},
	{
		question: "Which of the following is a red flag of a phone scam?",
		options: [
			{ text: "The caller has a clear voice", isCorrect: false },
			{ text: "They speak calmly and clearly", isCorrect: false },
			{ text: "They ask for gift card payments", isCorrect: true },
			{ text: "They offer helpful tech tips", isCorrect: false }
		]
	},
	{
		question: "What's wrong with this email: \"Dear Customer, click here to verify your account or risk suspension\"?",
		options: [
			{ text: "It's helpful", isCorrect: false },
			{ text: "It includes your full name", isCorrect: false },
			{ text: "It sounds official", isCorrect: false },
			{ text: "It uses a generic greeting and urgency", isCorrect: true }
		]
	},
	{
		question: "A scammer sends you a message about a delivery you didn't order, asking you to click a short link. What should you do?",
		options: [
			{ text: "Click it to track the package", isCorrect: false },
			{ text: "Forward it to your friends", isCorrect: false },
			{ text: "Ignore and delete the message", isCorrect: true },
			{ text: "Reply with your delivery info", isCorrect: false }
		]
	},
	{
		question: "Why are emails with poor grammar and spelling a red flag?",
		options: [
			{ text: "They are written by children", isCorrect: false },
			{ text: "They usually come from official sources", isCorrect: false },
			{ text: "Real companies don't proofread", isCorrect: false },
			{ text: "They're often signs of phishing scams", isCorrect: true }
		]
	},
	{
		question: "Which of the following is a sign of a text scam?",
		options: [
			{ text: "A message from your mom", isCorrect: false },
			{ text: "A security alert from your bank about your real account", isCorrect: false },
			{ text: "A message from a number you don't know about a \"free prize\"", isCorrect: true },
			{ text: "A text about an upcoming doctor's appointment", isCorrect: false }
		]
	},
	{
		question: "A message says: \"Congratulations! You've won a gift card. Pay $10 to claim it.\" What kind of scam is this?",
		options: [
			{ text: "Email scam", isCorrect: false },
			{ text: "Text message scam", isCorrect: false },
			{ text: "Phone scam", isCorrect: false },
			{ text: "Giveaway/lottery scam", isCorrect: true }
		]
	},
	{
		question: "What's a common red flag in a giveaway scam?",
		options: [
			{ text: "You need to answer survey questions", isCorrect: false },
			{ text: "They ask for your address", isCorrect: false },
			{ text: "You're asked to send money to get your prize", isCorrect: true },
			{ text: "You must agree to terms and conditions", isCorrect: false }
		]
	},
	{
		question: "Which of the following is NOT a common method scammers use in phone scams?",
		options: [
			{ text: "Pretending to be the IRS", isCorrect: false },
			{ text: "Offering free Medicare equipment", isCorrect: false },
			{ text: "Asking you to join a real sweepstakes", isCorrect: true },
			{ text: "Claiming a grandchild is in trouble", isCorrect: false }
		]
	},
	{
		question: "An email warning you about \"suspicious activity\" asks you to click a link. What should you do first?",
		options: [
			{ text: "Click the link to fix the problem fast", isCorrect: false },
			{ text: "Call the number in the email", isCorrect: false },
			{ text: "Check if the email address is correct", isCorrect: true },
			{ text: "Forward it to friends", isCorrect: false }
		]
	},
	{
		question: "What makes a scam text look urgent?",
		options: [
			{ text: "It uses emojis", isCorrect: false },
			{ text: "It says, \"Act now!\" or \"Verify immediately!\"", isCorrect: true },
			{ text: "It thanks you politely", isCorrect: false },
			{ text: "It includes personal stories", isCorrect: false }
		]
	},
	{
		question: "What makes a fake email look official even when it's a scam?",
		options: [
			{ text: "It always uses emojis", isCorrect: false },
			{ text: "It includes real news headlines", isCorrect: false },
			{ text: "It mimics the look of a real company email", isCorrect: true },
			{ text: "It's short and vague", isCorrect: false }
		]
	}
];

// Extra questions for Module 3
const module3ExtraQuestions = [
	{
		question: "An article claims a celebrity has been arrested but doesn't mention where it happened or any sources. What's missing?",
		options: [
			{ text: "A dramatic headline", isCorrect: false },
			{ text: "Source details and evidence", isCorrect: true },
			{ text: "Emojis", isCorrect: false },
			{ text: "Ads", isCorrect: false }
		]
	},
	{
		question: "Which of the following is a sign a website may be untrustworthy?",
		options: [
			{ text: "Clean layout and clear sources", isCorrect: false },
			{ text: "A real author with credentials", isCorrect: false },
			{ text: "Lots of pop-ups and flashy ads", isCorrect: true },
			{ text: "A recent publication date", isCorrect: false }
		]
	},
	{
		question: "What should you do before sharing an article that made you angry or shocked?",
		options: [
			{ text: "Comment your opinion first", isCorrect: false },
			{ text: "Read only the headline", isCorrect: false },
			{ text: "Check other trusted news sources", isCorrect: true },
			{ text: "Assume it's true if it matches your beliefs", isCorrect: false }
		]
	},
	{
		question: "If an article has no author listed and no sources mentioned, what should you do?",
		options: [
			{ text: "Trust it if it agrees with you", isCorrect: false },
			{ text: "Share it anyway", isCorrect: false },
			{ text: "Treat it with caution—it may not be credible", isCorrect: true },
			{ text: "Post it on every platform", isCorrect: false }
		]
	},
	{
		question: "Why is it important to check the date of an article?",
		options: [
			{ text: "Older news is always more reliable", isCorrect: false },
			{ text: "The date doesn't matter if the story is interesting", isCorrect: false },
			{ text: "Old articles can be real but no longer relevant", isCorrect: true },
			{ text: "All websites automatically update dates", isCorrect: false }
		]
	},
	{
		question: "Which tool would best help you verify a viral rumor?",
		options: [
			{ text: "A meme generator", isCorrect: false },
			{ text: "Snopes.com", isCorrect: true },
			{ text: "A celebrity fan site", isCorrect: false },
			{ text: "TikTok comments", isCorrect: false }
		]
	},
	{
		question: "An article starts with: \"SHOCKING DISCOVERY! Scientists EXPOSE the TRUTH!\" What's a red flag here?",
		options: [
			{ text: "All caps and emotional language", isCorrect: true },
			{ text: "It mentions scientists", isCorrect: false },
			{ text: "It's short", isCorrect: false },
			{ text: "It talks about science", isCorrect: false }
		]
	},
	{
		question: "What's a common trick fake news uses to seem real?",
		options: [
			{ text: "Listing lots of sources", isCorrect: false },
			{ text: "Quoting well-known journalists", isCorrect: false },
			{ text: "Copying the look of real news websites", isCorrect: true },
			{ text: "Posting only verified content", isCorrect: false }
		]
	},
	{
		question: "You're unsure if a political article is real. What's the best first step?",
		options: [
			{ text: "Google the headline to see if it's on other trusted sites", isCorrect: true },
			{ text: "Ask a friend", isCorrect: false },
			{ text: "Share it with your family", isCorrect: false },
			{ text: "Assume it's true—it sounds believable", isCorrect: false }
		]
	},
	{
		question: "Why should you be cautious with articles that \"feel right\" or match your opinions exactly?",
		options: [
			{ text: "They're often boring", isCorrect: false },
			{ text: "They might be long", isCorrect: false },
			{ text: "They could be written to manipulate you", isCorrect: true },
			{ text: "They always tell the truth", isCorrect: false }
		]
	},
	{
		question: "Which of these is not a reliable fact-checking source?",
		options: [
			{ text: "Snopes.com", isCorrect: false },
			{ text: "FactCheck.org", isCorrect: false },
			{ text: "BBC News", isCorrect: false },
			{ text: "Random Reddit thread", isCorrect: true }
		]
	}
// 12th extra practice question for Module 3
,
{
	question: "Which of these is not a reliable fact-checking source?",
	options: [
		{ text: "Snopes.com", isCorrect: false },
		{ text: "FactCheck.org", isCorrect: false },
		{ text: "BBC News", isCorrect: false },
		{ text: "Random Reddit thread", isCorrect: true }
	]
}
];

// Course modules configuration
const courseModules: CourseModule[] = [
	{
		title: "Digital World Basics",
		description: "Understanding the basics of being online safely",
		content: <Module1 />,
                exercise: {
                        type: ExerciseType.QUIZ,
                        questions: [
                                {
                                        question: "What does being safe online mean?",
                                        options: [
                                                { text: "Turning off your device every night", isCorrect: false },
                                                { text: "Only using the internet at home", isCorrect: false },
                                                { text: "Protecting yourself while using the internet", isCorrect: true },
                                                { text: "Deleting all your apps regularly", isCorrect: false }
                                        ]
                                },
                                {
                                        question: "Which of the following is an example of a scam?",
                                        options: [
                                                { text: "A message from a friend asking how you are", isCorrect: false },
                                                { text: "A website asking for your name before a quiz", isCorrect: false },
                                                { text: "An email that says you've won money and asks for your bank info", isCorrect: true },
                                                { text: "A reminder to update your phone", isCorrect: false }
                                        ]
                                },
                                {
                                        question: "Why is it important to keep your personal details private?",
                                        options: [
                                                { text: "So your friends don't know too much about you", isCorrect: false },
                                                { text: "To stop hackers from stealing your identity", isCorrect: true },
                                                { text: "To use less internet data", isCorrect: false },
                                                { text: "Because websites don't like personal details", isCorrect: false }
                                        ]
                                },
                                {
                                        question: "What can happen if you fall for an online scam?",
                                        options: [
                                                { text: "You win a real prize", isCorrect: false },
                                                { text: "Your computer will start working faster", isCorrect: false },
                                                { text: "You might lose money or have your identity stolen", isCorrect: true },
                                                { text: "You'll get more likes on social media", isCorrect: false }
                                        ]
                                },
                                {
                                        question: "Which of these is a sign of an online scammer?",
                                        options: [
                                                { text: "A site with strong security and privacy settings", isCorrect: false },
                                                { text: "Someone pretending to be a trusted person", isCorrect: true },
                                                { text: "A teacher giving a homework assignment", isCorrect: false },
                                                { text: "A friend sending a game link", isCorrect: false }
                                        ]
                                },
                                {
                                        question: "How can online safety help you feel?",
                                        options: [
                                                { text: "Confused and nervous", isCorrect: false },
                                                { text: "Confident and in control", isCorrect: true },
                                                { text: "Annoyed by safety tips", isCorrect: false },
                                                { text: "Tired of using the internet", isCorrect: false }
                                        ]
                                }
                        ]
                }
	},
 {
 	title: "Common Scams",
 	description: "Learning to recognize and avoid common online scams",
 	content: <Module2 />,
 	exercise: {
 		type: ExerciseType.QUIZ,
 		questions: [
 			{
 				question: "Which of the following is a red flag in a phone scam?",
 				options: [
 					{ text: "The caller says hello politely", isCorrect: false },
 					{ text: "The caller asks you to confirm your name", isCorrect: false },
 					{ text: "The caller threatens arrest if you don’t pay right away", isCorrect: true },
 					{ text: "The caller offers you a free magazine subscription", isCorrect: false }
 				]
 			},
 			{
 				question: "You get an email from 'your bank' asking you to click a link and verify your account. What should you do?",
 				options: [
 					{ text: "Click the link and enter your details right away", isCorrect: false },
 					{ text: "Forward the email to your friends", isCorrect: false },
 					{ text: "Delete the email and call your bank using the number on your bank card", isCorrect: true },
 					{ text: "Reply and ask if the email is real", isCorrect: false }
 				]
 			},
 			{
 				question: "What makes a text message suspicious?",
 				options: [
 					{ text: "It uses emojis", isCorrect: false },
 					{ text: "It comes from a friend", isCorrect: false },
 					{ text: "It includes a short link and asks for personal info", isCorrect: true },
 					{ text: "It says 'Have a nice day!'", isCorrect: false }
 				]
 			},
 			{
 				question: "Which of the following giveaway messages is most likely a scam?",
 				options: [
 					{ text: "You are our lucky winner! Pay a small processing fee to unlock your prize.", isCorrect: false },
 					{ text: "Click this special link right now to claim your free vacation.", isCorrect: false },
 					{ text: "Reply with your credit card number so we can ship your free prize immediately!", isCorrect: false },
					{ text: "All of the above", isCorrect: true }
 				]
 			},
 			{
 				question: "Why should you be careful of email addresses that look almost correct, like 'amaz0n.com'?",
 				options: [
 					{ text: "They might be a new version of the company’s website", isCorrect: false },
 					{ text: "It’s probably a scam site pretending to be the real one", isCorrect: true },
 					{ text: "They usually offer better deals", isCorrect: false },
 					{ text: "They’re safe if the email says 'Dear Customer'", isCorrect: false }
 				]
 			},
 			{
 				question: "A caller says your grandchild is in jail and needs money urgently. What should you do?",
 				options: [
 					{ text: "Send the money immediately", isCorrect: false },
 					{ text: "Ask the caller to confirm your grandchild’s birthday", isCorrect: false },
 					{ text: "Hang up and call your grandchild or a trusted family member directly", isCorrect: true },
 					{ text: "Keep talking to the caller to learn more", isCorrect: false }
 				]
 			}
 		]
 	}
 },
	{
		title: "Spotting Fake News",
		description: "How to identify misinformation and verify facts",
		content: <Module3 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "What is one reason fake news can be dangerous?",
					options: [
						{ text: "It helps people find cheaper products", isCorrect: false },
						{ text: "It can cause people to make decisions based on wrong information", isCorrect: true },
						{ text: "It's usually just a joke and doesn't affect anyone", isCorrect: false },
						{ text: "It only appears on TV", isCorrect: false }
					]
				},
				{
					question: "Which of the following is a warning sign that a news article might be fake?",
					options: [
						{ text: "It includes quotes from experts", isCorrect: false },
						{ text: "It has a clean, professional website layout", isCorrect: false },
						{ text: "The web address is slightly different from a well-known site (like cnn-news.co)", isCorrect: true },
						{ text: "It was published today", isCorrect: false }
					]
				},
				{
					question: "Why should you read more than just the headline of an article?",
					options: [
						{ text: "Headlines are always fake", isCorrect: false },
						{ text: "Headlines might not tell the whole story", isCorrect: true },
						{ text: "Headlines contain grammar errors", isCorrect: false },
						{ text: "Headlines are written by bots", isCorrect: false }
					]
				},
				{
					question: "Which of these tools can help you check if a story is true?",
					options: [
						{ text: "Google Translate", isCorrect: false },
						{ text: "FactCheck.org", isCorrect: true },
						{ text: "YouTube", isCorrect: false },
						{ text: "Microsoft Word", isCorrect: false }
					]
				},
				{
					question: "Why is it important to check the date on a news article?",
					options: [
						{ text: "Older news is always false", isCorrect: false },
						{ text: "Dates show who wrote the article", isCorrect: false },
						{ text: "Old stories can resurface and confuse people if shared as new", isCorrect: true },
						{ text: "The date tells you which country it's from", isCorrect: false }
					]
				},
				{
					question: "What should you be extra careful about when reading something that matches your own opinions exactly?",
					options: [
						{ text: "It's definitely true", isCorrect: false },
						{ text: "It might be biased or fake, and made to get your attention", isCorrect: true },
						{ text: "It's written just for you", isCorrect: false },
						{ text: "It doesn't need checking", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "Safe Browsing",
		description: "How to browse the internet safely and securely",
		content: <Module4 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "What should you look for to know a website is secure?",
					options: [
						{ text: "A lock icon and 'https://' in the address bar", isCorrect: true },
						{ text: "Bright colors and lots of advertisements", isCorrect: false },
						{ text: "Pop-ups saying the site is secure", isCorrect: false },
						{ text: "The website loads very quickly", isCorrect: false }
					]
				},
				{
					question: "What should you do when you see an ad offering big prizes or sounding urgent?",
					options: [
						{ text: "Click quickly before the timer runs out", isCorrect: false },
						{ text: "Ignore it or close the page — it's likely a scam", isCorrect: true },
						{ text: "Share it with a friend to double your chances", isCorrect: false },
						{ text: "Refresh the page to see if it's real", isCorrect: false }
					]
				},
				{
					question: "You visit a website that begins with 'http://' instead of 'https://'. What should you do?",
					options: [
						{ text: "Keep browsing, it's probably fine", isCorrect: false },
						{ text: "Avoid entering any personal information", isCorrect: true },
						{ text: "Only use it if the images look professional", isCorrect: false },
						{ text: "Refresh the page to make it secure", isCorrect: false }
					]
				},
				{
					question: "What should you do when a pop-up claims your device is infected?",
					options: [
						{ text: "Click the button to remove the virus", isCorrect: false },
						{ text: "Restart your computer right away", isCorrect: false },
						{ text: "Click the X or close your browser completely", isCorrect: true },
						{ text: "Call the number listed in the pop-up", isCorrect: false }
					]
				},
				{
					question: "Why is it smart to hover over a link before clicking it?",
					options: [
						{ text: "It highlights the link", isCorrect: false },
						{ text: "It shows the link's true destination", isCorrect: true },
						{ text: "It makes the page load faster", isCorrect: false },
						{ text: "It copies the link to your clipboard", isCorrect: false }
					]
				},
				{
					question: "Which of the following is a red flag for a fake website?",
					options: [
						{ text: "It uses a simple layout", isCorrect: false },
						{ text: "It has spelling errors and strange grammar", isCorrect: true },
						{ text: "It loads slowly", isCorrect: false },
						{ text: "It shows product reviews", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "Strong Passwords",
		description: "Creating and managing secure passwords",
		content: <Module5 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "Which of these passwords is the strongest?",
					options: [
						{ text: "password123", isCorrect: false },
						{ text: "12345678", isCorrect: false },
						{ text: "MyD0g&C@t!2024", isCorrect: true },
						{ text: "your name + birthday", isCorrect: false }
					]
				},
				{
					question: "What's the best way to remember multiple strong passwords?",
					options: [
						{ text: "Write them all down on paper", isCorrect: false },
						{ text: "Use the same password for everything", isCorrect: false },
						{ text: "Use a password manager", isCorrect: true },
						{ text: "Make them all similar but slightly different", isCorrect: false }
					]
				},
				{
					question: "How often should you change your passwords?",
					options: [
						{ text: "Every 6 to 12 months", isCorrect: false },
						{ text: "When there is a security breach of your account", isCorrect: false },
						{ text: "When you suspect your account is compromised", isCorrect: false },
						{ text: "All of the above", isCorrect: true }
					]
				},
				{
					question: "What are the benefits of using a password manager?",
					options: [
						{ text: "You only need to remember one master password", isCorrect: false },
						{ text: "It can create strong passwords for you", isCorrect: false },
						{ text: "Your information stays encrypted (scrambled for safety)", isCorrect: false },
						{ text: "All of the above", isCorrect: true }
               		]
        		},
				{
					question: "What should you do if a website asks you to create a password that's at least 8 characters?",
					options: [
						{ text: "Use exactly 8 characters to meet the minimum", isCorrect: false },
						{ text: "Use a longer password with a mix of letters, numbers, and symbols", isCorrect: true },
						{ text: "Use your name plus some numbers", isCorrect: false },
						{ text: "Use a common word that's easy to remember", isCorrect: false }
					]
				},
				{
					question: "Someone calls you claiming to be from tech support and asks for your password. What should you do?",
					options: [
						{ text: "Give them the password since they're helping you", isCorrect: false },
						{ text: "Give them just part of the password", isCorrect: false },
						{ text: "Never give your password to anyone who calls or emails you", isCorrect: true },
						{ text: "Ask them to verify their identity first", isCorrect: false }
					]
				},
				{
					question: "What is two-factor authentication (2FA)?",
					options: [
						{ text: "Using two different passwords", isCorrect: false },
						{ text: "An extra security step that requires something you know AND something you have", isCorrect: true },
						{ text: "A way to share passwords safely", isCorrect: false },
						{ text: "A type of password manager", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "AI Detection",
		description: "Recognizing AI-generated content and staying informed",
		content: <Module6 />,
		exercise: {
			type: ExerciseType.QUIZ,
			questions: [
				{
					question: "A video shows a well-known politician saying something shocking, but it's not reported anywhere else. What should you do?",
					options: [
						{ text: "Share it immediately since it's shocking", isCorrect: false },
						{ text: "Check multiple reliable news sources before believing it", isCorrect: true },
						{ text: "Assume it's real because it's a video", isCorrect: false },
						{ text: "Post it on social media to get opinions", isCorrect: false }
					]
				},
				{
					question: "An email asks you to confirm your password due to 'suspicious activity,' but the wording feels robotic. What's your best response?",
					options: [
						{ text: "Click the link and update your password immediately", isCorrect: false },
						{ text: "Reply with your password to confirm it's you", isCorrect: false },
						{ text: "Be suspicious - this could be an AI-generated phishing attempt", isCorrect: true },
						{ text: "Forward it to friends to check if they got the same email", isCorrect: false }
					]
				},
				{
					question: "A voice message from your friend asks for money, but the tone sounds slightly off. What should you do?",
					options: [
						{ text: "Send the money right away since it's your friend", isCorrect: false },
						{ text: "Call your friend directly to confirm they actually sent the message", isCorrect: true },
						{ text: "Ignore it completely", isCorrect: false },
						{ text: "Ask for more details in the same chat", isCorrect: false }
					]
				},
				{
					question: "What's a good sign that an article is real and not AI-generated?",
					options: [
						{ text: "It has perfect grammar with no typos", isCorrect: false },
						{ text: "It includes specific details, named sources, and verifiable facts", isCorrect: true },
						{ text: "It's very emotional and dramatic", isCorrect: false },
						{ text: "It repeats the same point multiple times", isCorrect: false }
					]
				}
			]
		}
	},
	{
		title: "Cyber Hygiene Habits",
		description: "Building healthy digital habits for long-term safety",
		content: <Module7 />,
		exercise: {
			type: ExerciseType.PDF_VIEWER,
			instructions: "Review this Digital Safety Cheat Sheet to reinforce your cyber hygiene habits:",
			pdfPath: "/mod7CheatSheet.pdf"
		}
	},
	{
		title: "Reporting & Getting Help",
		description: "What to do when something goes wrong and where to get help",
		content: <Module8 />,
		exercise: {
			type: ExerciseType.CHECKLIST,
			instructions: "Build Your Personal Online Safety Plan. Fill in your emergency scam response sheet and add your support resources.",
			items: [
				"I know where to report scams",
				"I've saved important phone numbers",
				"I know how to freeze my credit if needed",
				"I know where to get help if I'm not sure what to do",
				"I will stay calm, pause, and act smart if something feels wrong"
			]
		}
	}
];

const CoursePage: React.FC = () => {
	const { moduleId } = useParams();
	const navigate = useNavigate();
	const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
	const [isExerciseMode, setIsExerciseMode] = useState(false);
	const [isQuizMode, setIsQuizMode] = useState(false);
	const [quizScore, setQuizScore] = useState<number | null>(null);
	const [exerciseAnswers, setExerciseAnswers] = useState<any>({});
	const [quizRetakeKey, setQuizRetakeKey] = useState(0);
	const [showExtraQuestions, setShowExtraQuestions] = useState(false);
	const [extraQuestionAnswers, setExtraQuestionAnswers] = useState<number[]>([]);
	const [extraExerciseAnswers, setExtraExerciseAnswers] = useState<any>({});

	// Sync moduleId from URL to state
	useEffect(() => {
		if (moduleId) {
			const idx = parseInt(moduleId, 10) - 1;
			if (!isNaN(idx) && idx >= 0 && idx < courseModules.length) {
				setCurrentModuleIndex(idx);
			}
		}
	}, [moduleId]);

	// Update URL when module changes
	useEffect(() => {
		if (currentModuleIndex >= 0 && currentModuleIndex < courseModules.length) {
			navigate(`/course/${currentModuleIndex + 1}`, { replace: true });
		}
	}, [currentModuleIndex, courseModules.length, navigate]);

        const handleNext = () => {
                if (!isExerciseMode) {
                        setIsExerciseMode(true);
                        return;
                }
                if (currentModuleIndex < courseModules.length - 1) {
                        setCurrentModuleIndex(prev => prev + 1);
                        setIsExerciseMode(false);
                        setExerciseAnswers({});
                        setShowExtraQuestions(false);
                        setExtraQuestionAnswers([]);
                        setExtraExerciseAnswers({});
                        return;
                }
                setIsQuizMode(true);
        }

        const handleBack = () => {
                if (isExerciseMode) {
                        // If in exercise mode, go back to module content
                        setIsExerciseMode(false);
                        setExerciseAnswers({});
                        setShowExtraQuestions(false);
                        setExtraQuestionAnswers([]);
                        setExtraExerciseAnswers({});
                } else if (currentModuleIndex > 0) {
                        // If not in exercise mode and not first module, go to previous module
                        setCurrentModuleIndex(prev => prev - 1);
                        setIsExerciseMode(false);
                        setExerciseAnswers({});
                        setShowExtraQuestions(false);
                        setExtraQuestionAnswers([]);
                        setExtraExerciseAnswers({});
                } else {
                        // If on first module and not in exercise mode, go back to course overview (home)
                        navigate('/');
                }
        }
	const handleExerciseComplete = () => {
		if (currentModuleIndex < courseModules.length - 1) {
			setCurrentModuleIndex(prev => prev + 1);
			setIsExerciseMode(false);
			setExerciseAnswers({});
			setShowExtraQuestions(false);
			setExtraQuestionAnswers([]);
			setExtraExerciseAnswers({});
		} else {
			setIsQuizMode(true);
		}
	}

	const renderExtraQuestions = () => {
		let extraQuestions;
		switch (currentModuleIndex) {
			case 0:
				extraQuestions = module1ExtraQuestions;
				break;
			case 1:
				extraQuestions = module2ExtraQuestions;
				break;
			case 2:
				extraQuestions = module3ExtraQuestions;
				break;
			case 3:
				extraQuestions = module4ExtraQuestions;
				break;
			case 4:
				extraQuestions = module5ExtraQuestions;
				break;
			case 5:
				extraQuestions = module6ExtraQuestions;
				break;
			default:
				return null;
		}
		
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mt-8 space-y-6"
			>
				<div className="divider">
					<span className="text-lg font-semibold">Extra Practice Questions</span>
				</div>
				
				{extraQuestions.map((question, qIndex) => (
					<div key={`extra-question-${question.question}`} className="card bg-base-200 shadow-lg">
						<div className="card-body">
							<h4 className="text-lg font-semibold mb-4">
								Question {qIndex + 1}: {question.question}
							</h4>
							<div className="space-y-2">
								{question.options.map((option, oIndex) => {
									const isSelected = extraQuestionAnswers.includes(qIndex) && extraExerciseAnswers[qIndex] === oIndex;
									const hasAnswered = extraQuestionAnswers.includes(qIndex);
									const buttonClass = hasAnswered ? 
										(option.isCorrect ? 'btn-success' : isSelected ? 'btn-error' : 'btn-outline') : 
										'btn-outline';
									
									return (
										<button
											key={`extra-option-${qIndex}-${oIndex}`}
											className={`btn ${buttonClass} w-full justify-start`}
											onClick={() => {
												if (!extraQuestionAnswers.includes(qIndex)) {
													setExtraQuestionAnswers(prev => [...prev, qIndex]);
													setExtraExerciseAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
												}
											}}
											disabled={hasAnswered}
										>
											{String.fromCharCode(65 + oIndex)}. {option.text}
										</button>
									);
								})}
							</div>
							{extraQuestionAnswers.includes(qIndex) && (
								<motion.div 
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									className="mt-4"
								>
									<div className={`p-4 rounded-lg ${
										question.options[extraExerciseAnswers[qIndex]]?.isCorrect ? 
											'bg-success/20 text-success-content' : 
											'bg-error/20 text-error-content'
									}`}>
										{question.options[extraExerciseAnswers[qIndex]]?.isCorrect ? 
											'✅ Correct! Great job.' : 
											`❌ Incorrect. The correct answer is: ${String.fromCharCode(65 + question.options.findIndex(o => o.isCorrect))}. ${question.options.find(o => o.isCorrect)?.text}`
										}
									</div>
								</motion.div>
							)}
						</div>
					</div>
				))}
				
				<div className="text-center mt-8">
					<div className="stats shadow">
						<div className="stat">
							<div className="stat-title">Progress</div>
							<div className="stat-value text-2xl">
								{extraQuestionAnswers.length}/{extraQuestions.length}
							</div>
							<div className="stat-desc">Questions completed</div>
						</div>
						<div className="stat">
							<div className="stat-title">Score</div>
							<div className="stat-value text-2xl">
								{extraQuestionAnswers.filter(qIndex => 
									extraQuestions[qIndex].options[extraExerciseAnswers[qIndex]]?.isCorrect
								).length}/{extraQuestionAnswers.length || 1}
							</div>
							<div className="stat-desc">Correct answers</div>
						</div>
					</div>
				</div>
			</motion.div>
		);
	};

	const renderExercise = () => {
		const exercise = currentModule.exercise;
		if (!exercise) return null;

		switch (exercise.type) {
			case ExerciseType.CHECKLIST:
				return (
					<div className="space-y-4">
						<p className="text-lg mb-6">{exercise.instructions}</p>
						<div className="space-y-3">
							{exercise.items?.map((item, index) => (
								<div key={typeof item === 'string' ? item : index} className="flex items-start gap-3">
									<input 
										type="checkbox" 
										className="checkbox checkbox-primary mt-1" 
										onChange={(e) => {
											setExerciseAnswers(prev => ({
												...prev,
												[index]: e.target.checked
											}));
										}}
									/>
									<label className="text-base cursor-pointer">{item}</label>
								</div>
							))}
						</div>
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);

			case ExerciseType.SCAM_IDENTIFICATION:
				return (
					<div className="space-y-4">
						<p className="text-lg mb-6">{exercise.instructions}</p>
						<div className="space-y-4">
							{exercise.items?.map((item, index) => (
								<div key={item.content} className="card bg-base-200 shadow">
									<div className="card-body">
										<p className="text-base mb-4">"{item.content}"</p>
										<div className="flex gap-3">
											<button 
												className={`btn ${exerciseAnswers[index] === true ? 'btn-error' : 'btn-outline'}`}
												onClick={() => {
													setExerciseAnswers(prev => ({ ...prev, [index]: true }));
												}}
											>
												Scam
											</button>
											<button 
												className={`btn ${exerciseAnswers[index] === false ? 'btn-success' : 'btn-outline'}`}
												onClick={() => {
													setExerciseAnswers(prev => ({ ...prev, [index]: false }));
												}}
											>
												Legitimate
											</button>
										</div>
										{exerciseAnswers.hasOwnProperty(index) && (
											<div className={`mt-3 p-3 rounded ${item.isScam === exerciseAnswers[index] ? 'bg-success/20 text-success-content' : 'bg-error/20 text-error-content'}`}>
												{item.explanation}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);

			case ExerciseType.QUIZ: {
				const quizExercise = exercise as any;
				const questions = quizExercise.questions || (quizExercise.question ? [{ question: quizExercise.question, options: quizExercise.options || [] }] : []);
				return (
					<div className="space-y-4">
						{questions.map((question: any, qIndex: number) => (
							<div key={`question-${question.question}`} className="space-y-4">
								<h3 className="text-xl font-semibold">Question {qIndex + 1}: {question.question}</h3>
								<div className="space-y-2">
									{question.options.map((option: any, oIndex: number) => {
										const isSelected = exerciseAnswers[qIndex] === oIndex;
										const hasAnswered = exerciseAnswers.hasOwnProperty(qIndex);
										const buttonClass = hasAnswered ? 
											(option.isCorrect ? 'btn-success' : isSelected ? 'btn-error' : 'btn-outline') : 
											'btn-outline';
										return (
											<button
												key={`option-${qIndex}-${oIndex}`}
												className={`btn ${buttonClass} w-full justify-start`}
												onClick={() => {
													if (!hasAnswered) {
														setExerciseAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
													}
												}}
												disabled={hasAnswered}
											>
												{String.fromCharCode(65 + oIndex)}. {option.text}
											</button>
										);
									})}
								</div>
								{exerciseAnswers.hasOwnProperty(qIndex) && (
									<div className="mt-4">
										<div className={`p-4 rounded ${
											question.options[exerciseAnswers[qIndex]]?.isCorrect ? 
												'bg-success/20 text-success-content' : 
												'bg-error/20 text-error-content'
										}`}>
											{question.options[exerciseAnswers[qIndex]]?.isCorrect ? 
												'✅ Correct! Great job.' : 
												`❌ Incorrect. The correct answer is: ${String.fromCharCode(65 + question.options.findIndex((o: any) => o.isCorrect))}. ${question.options.find((o: any) => o.isCorrect)?.text}`
											}
										</div>
									</div>
								)}
							</div>
						))}
						
                                                {/* Show extra questions button for Module 1 only */}
                                                {currentModuleIndex === 0 && !showExtraQuestions && (
                                                        <motion.div 
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.5, duration: 0.3 }}
                                                                className="mt-8 text-center"
                                                        >
                                                                <div className="divider">Want more practice?</div>
                                                                <button 
                                                                        onClick={() => setShowExtraQuestions(true)}
                                                                        className="btn btn-outline btn-lg gap-2"
                                                                >
                                                                        <Star className="h-5 w-5" />
                                                                        Try Extra Questions
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </button>
                                                                <p className="text-sm text-base-content/70 mt-2">
                                                                        8 additional questions to test your online safety knowledge
                                                                </p>
                                                        </motion.div>
                                                )}
						{/* Show extra questions button for Module 2 only */}
						{currentModuleIndex === 1 && !showExtraQuestions && (
							<motion.div 
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.3 }}
								className="mt-8 text-center"
							>
								<div className="divider">Want more practice?</div>
								<button 
									onClick={() => setShowExtraQuestions(true)}
									className="btn btn-outline btn-lg gap-2"
								>
									<Star className="h-5 w-5" />
									Try Extra Questions
									<ArrowRight className="h-4 w-4" />
								</button>
								<p className="text-sm text-base-content/70 mt-2">
									12 additional questions to test your scam detection skills
								</p>
							</motion.div>
						)}
						
								{/* Show extra questions button for Module 3 only */}
								{currentModuleIndex === 2 && !showExtraQuestions && (
									<motion.div 
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5, duration: 0.3 }}
										className="mt-8 text-center"
									>
										<div className="divider">Want more practice?</div>
										<button 
											onClick={() => setShowExtraQuestions(true)}
											className="btn btn-outline btn-lg gap-2"
										>
											<Star className="h-5 w-5" />
											Try Extra Questions
											<ArrowRight className="h-4 w-4" />
										</button>
										<p className="text-sm text-base-content/70 mt-2">
											12 additional questions to test your fake news detection skills
										</p>
									</motion.div>
								)}

								{/* Show extra questions button for Module 4 only */}
								{currentModuleIndex === 3 && !showExtraQuestions && (
									<motion.div 
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5, duration: 0.3 }}
										className="mt-8 text-center"
									>
										<div className="divider">Want more practice?</div>
										<button 
											onClick={() => setShowExtraQuestions(true)}
											className="btn btn-outline btn-lg gap-2"
										>
											<Star className="h-5 w-5" />
											Try Extra Questions
											<ArrowRight className="h-4 w-4" />
										</button>
										<p className="text-sm text-base-content/70 mt-2">
											12 additional questions to test your safe browsing skills
										</p>
									</motion.div>
								)}

								{/* Show extra questions button for Module 5 only */}
								{currentModuleIndex === 4 && !showExtraQuestions && (
									<motion.div 
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5, duration: 0.3 }}
										className="mt-8 text-center"
									>
										<div className="divider">Want more practice?</div>
										<button 
											onClick={() => setShowExtraQuestions(true)}
											className="btn btn-outline btn-lg gap-2"
										>
											<Star className="h-5 w-5" />
											Try Extra Questions
											<ArrowRight className="h-4 w-4" />
										</button>
										<p className="text-sm text-base-content/70 mt-2">
											12 additional questions to test your password security knowledge
										</p>
									</motion.div>
								)}

								{/* Show extra questions button for Module 6 only */}
								{currentModuleIndex === 5 && !showExtraQuestions && (
									<motion.div 
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5, duration: 0.3 }}
										className="mt-8 text-center"
									>
										<div className="divider">Want more practice?</div>
										<button 
											onClick={() => setShowExtraQuestions(true)}
											className="btn btn-outline btn-lg gap-2"
										>
											<Star className="h-5 w-5" />
											Try Extra Questions
											<ArrowRight className="h-4 w-4" />
										</button>
										<p className="text-sm text-base-content/70 mt-2">
											12 additional questions to test your AI detection skills
										</p>
									</motion.div>
								)}						{/* Render extra questions if enabled for Module 2 */}
                                                {/* Render extra questions if enabled for Module 1 */}
                                                {currentModuleIndex === 0 && showExtraQuestions && renderExtraQuestions()}
						{currentModuleIndex === 1 && showExtraQuestions && renderExtraQuestions()}
						
						{/* Render extra questions if enabled for Module 3 */}
						{currentModuleIndex === 2 && showExtraQuestions && renderExtraQuestions()}
						
						{/* Render extra questions if enabled for Module 4 */}
						{currentModuleIndex === 3 && showExtraQuestions && renderExtraQuestions()}
						
						{/* Render extra questions if enabled for Module 5 */}
						{currentModuleIndex === 4 && showExtraQuestions && renderExtraQuestions()}
						
						{/* Render extra questions if enabled for Module 6 */}
						{currentModuleIndex === 5 && showExtraQuestions && renderExtraQuestions()}
						
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);
			}

			case ExerciseType.PASSWORD_CHECKER:
				return (
					<div className="space-y-4">
						<p className="text-lg mb-6">Try creating a strong password using the tips from this module:</p>
						<div className="form-control">
							<label htmlFor="password-input" className="label">
								<span className="label-text">Enter a password to check its strength:</span>
							</label>
							<input 
								id="password-input"
								type="password" 
								placeholder="Enter password..." 
								className="input input-bordered w-full" 
								onChange={(e) => {
									const password = e.target.value;
									const strength = {
										hasLength: password.length >= 12,
										hasUpper: /[A-Z]/.test(password),
										hasLower: /[a-z]/.test(password),
										hasNumber: /\d/.test(password),
										hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
									};
									setExerciseAnswers({ strength, password });
								}}
							/>
						</div>
						{exerciseAnswers.strength && (
							<div className="mt-4 space-y-2">
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasLength ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>At least 12 characters</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasUpper ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains uppercase letters</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasLower ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains lowercase letters</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasNumber ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains numbers</span>
								</div>
								<div className={`flex items-center gap-2 ${exerciseAnswers.strength.hasSymbol ? 'text-success' : 'text-error'}`}>
									<CheckCircle className="h-4 w-4" />
									<span>Contains symbols</span>
								</div>
							</div>
						)}
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);

			case ExerciseType.PDF_VIEWER:
				 return (
					 <div className="space-y-4">
						 <p className="text-lg mb-6">{exercise.instructions}</p>
							 <motion.div
								 initial={{ opacity: 0, y: 10 }}
								 animate={{ opacity: 1, y: 0 }}
								 transition={{ duration: 0.3 }}
								 className="mb-4 flex justify-end"
							 >
								 <button
									 className="btn btn-outline btn-sm"
									 aria-label="Open PDF fullscreen"
									 onClick={() => window.open(exercise.pdfPath, '_blank', 'noopener,noreferrer')}
								 >
									 Fullscreen
								 </button>
							 </motion.div>
							 <div className="w-full h-[600px] border border-base-300 rounded-lg overflow-hidden shadow-lg">
								 <iframe
									 src={exercise.pdfPath}
									 width="100%"
									 height="100%"
									 className="border-0"
									 title="Digital Safety Cheat Sheet"
								 />
							 </div>
						 <div className="alert alert-info">
							 <div className="flex items-start gap-2">
								 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
									 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								 </svg>
								 <div>
									 <h3 className="font-bold">Print or Save This Cheat Sheet!</h3>
									 <p className="text-sm">Right-click on the PDF and select "Save As" to keep this handy reference guide for your digital safety habits.</p>
								 </div>
							 </div>
						 </div>
						 <div className="mt-8">
							 <button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								 Continue to Next Module
								 <ArrowRight />
							 </button>
						 </div>
					 </div>
				 );

			default:
				return (
					<div>
						<p>Exercise type not implemented yet.</p>
						<div className="mt-8">
							<button onClick={handleExerciseComplete} className="btn btn-primary btn-lg">
								Continue to Next Module
								<ArrowRight />
							</button>
						</div>
					</div>
				);
		}
	};



	const currentModule = courseModules[currentModuleIndex] || { title: '', description: '', content: <div>Loading...</div>, exercise: { type: ExerciseType.QUIZ, question: '', options: [], correctFeedback: '', incorrectFeedback: '' } };
	const progress = (currentModuleIndex + (isExerciseMode ? 0.5 : 0)) / courseModules.length * 100;

	// Animation key: changes for every module/exercise view and quiz mode
	const animationKey = `${currentModuleIndex}-${isExerciseMode ? 'exercise' : 'module'}-${isQuizMode ? 'quiz' : 'regular'}`;

	// Auto-scroll to top whenever the visible module, exercise, or quiz mode changes
	useEffect(() => {
		if (typeof window === 'undefined') return;
		try {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (e) {
			// Fallback for older browsers
			try {
				window.scrollTo(0, 0);
			} catch (err) {
				console.error('Failed to scroll to top:', err);
			}
			if (e instanceof Error) {
				console.error('Error during smooth scroll to top:', e);
			} else {
				console.error('Unknown error during smooth scroll to top');
			}
		}
	}, [animationKey]);

	// Show certificate UI if score >= 8
	if (quizScore !== null && quizScore >= 8) {
		return (
			<FinalQuiz
				key={quizRetakeKey}
				onComplete={() => {}}
			/>
		);
	}

	if (isQuizMode) {
		return (
			<FinalQuiz
				key={quizRetakeKey}
				onComplete={score => {
					if (score >= 8) {
						setQuizScore(score);
					}
					// If score < 8, let FinalQuiz handle retake modal and reset
				}}
			/>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-5xl font-bold text-center mb-4">Digital Safety Course</h1>
			<p className="text-xl text-center text-base-content/70 mb-8">
				Module {currentModuleIndex + 1} of {courseModules.length}
			</p>
			<progress className="progress progress-primary w-full mb-8" value={progress} max="100"></progress>

			<AnimatePresence mode="wait">
				<motion.div
					key={animationKey}
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -50 }}
					transition={{ duration: 0.4 }}
					className="card bg-base-100 shadow-xl"
				>
                                        <div className="card-body p-8 md:p-12">
                                                {/* Back button - show when not on first module or when in exercise mode */}
                                                {(currentModuleIndex > 0 || isExerciseMode) && (
                                                        <button
                                                                onClick={handleBack}
                                                                className="btn btn-ghost btn-sm mb-4 gap-2"
                                                                aria-label="Go back"
                                                        >
                                                                <ArrowLeft className="h-4 w-4" />
                                                                Back
                                                        </button>
                                                )}

                                                {!isExerciseMode ? (
                                                        <>
                                                                <h2 className="card-title text-4xl mb-4">{currentModule.title}</h2>
                                                                {currentModule.content}
                                                        </>
                                                ) : (
                                                        <>
                                                                <h2 className="card-title text-4xl mb-4">Let's Practice!</h2>
                                                                {renderExercise()}
                                                        </>
                                                )}						<div className="card-actions justify-end mt-8">
							{(!isExerciseMode) && (
								<button onClick={handleNext} className="btn btn-primary btn-lg">
									Continue to Exercise
									<ArrowRight />
								</button>
							)}
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default CoursePage;
