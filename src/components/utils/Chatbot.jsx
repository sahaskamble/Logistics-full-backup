'use client';
import { useState, useEffect, useRef } from 'react';
import { knowledgeBase } from '@/constants/ChatBotKnowledge';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { RefreshCcw, X } from 'lucide-react';

export default function ChatBot() {
	// Authentication and chat hooks
	const { user } = useAuth();
	const { createChatSession } = useChat();

	// Start with the chatbot closed
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{ sender: 'bot', text: '👋 Hello! I\'m your Green Ocean Logistics assistant. How can I help you today?', timestamp: Date.now() }
	]);
	const [input, setInput] = useState('');
	// Initialize with current time to start the proactive messaging
	const [lastProactiveTime, setLastProactiveTime] = useState(Date.now());
	// Track if user has dismissed the notification
	const [longDismissal, setLongDismissal] = useState(false);
	// Track total message count for representative redirect
	const [messageCount, setMessageCount] = useState(1); // Start with 1 for initial bot message
	// Track if conversation has been handed off to representative
	const [handedOffToRep, setHandedOffToRep] = useState(false);
	// Track typing indicator
	const [isTyping, setIsTyping] = useState(false);
	// Track if transitioning to human support
	const [isTransitioning, setIsTransitioning] = useState(false);
	const messagesEndRef = useRef(null);

	// Function to check if we should redirect to representative
	const shouldRedirectToRep = (currentCount) => {
		return currentCount >= 20 && !handedOffToRep;
	};

	// Function to get representative handoff message
	const getRepresentativeHandoffMessage = () => {
		if (user) {
			return "I understand you need more detailed assistance! 😊 Let me connect you with our human support team who can provide personalized help.\n\n" +
				"🎯 **I'm redirecting you to our Support Center...**\n\n" +
				"You'll be able to:\n" +
				"• Start a live chat with our GOL staff\n" +
				"• Get real-time assistance\n" +
				"• Upload documents if needed\n\n" +
				"Thank you for choosing Green Ocean Logistics! 🚢";
		} else {
			return "I understand you need more detailed assistance! 😊 To connect you with our human support team, please log in first.\n\n" +
				"📞 **Contact our representatives:**\n" +
				"• **Phone:** +91-1234567890\n" +
				"• **Email:** support@greenoceanlogistics.com\n" +
				"• **WhatsApp:** +91-9876543210\n\n" +
				"💡 **For live chat:** Please log in and visit our [Support Center](/support)\n\n" +
				"Our team is available 24/7 to assist you with your logistics needs. Thank you for choosing Green Ocean Logistics! 🚢";
		}
	};

	// Function to handle transition to human support
	const transitionToHumanSupport = async () => {
		if (!user) {
			toast.error('Please log in to start a live chat with our support team');
			return;
		}

		setIsTransitioning(true);

		try {
			// Create a new chat session
			const session = await createChatSession();

			if (session) {
				// Add transition message to current chat
				const transitionMessage = {
					sender: 'bot',
					text: '✅ **Redirecting you to our Support Center...**\n\n' +
						'You can start a live chat with our GOL staff there.\n\n' +
						'Thank you for using Green Ocean Logistics! 🚢',
					timestamp: Date.now()
				};

				setMessages(prev => [...prev, transitionMessage]);

				// Redirect to support page after a short delay
				setTimeout(() => {
					window.location.href = '/support';
				}, 2000);

				toast.success('Redirecting to Support Center...');
			}
		} catch (error) {
			console.error('Failed to create chat session:', error);
			toast.error('Failed to start live chat. Please try again or contact support directly.');

			// Fallback to contact information
			const fallbackMessage = {
				sender: 'bot',
				text: '❌ **Unable to start live chat session**\n\n' +
					'Please contact our support team directly:\n\n' +
					'📞 **Phone:** +91-1234567890\n' +
					'📧 **Email:** support@greenoceanlogistics.com\n' +
					'💬 **WhatsApp:** +91-9876543210\n\n' +
					'We apologize for the inconvenience and will assist you as soon as possible.',
				timestamp: Date.now()
			};

			setMessages(prev => [...prev, fallbackMessage]);
		} finally {
			setIsTransitioning(false);
		}
	};

	// Function to handle user messages and generate responses
	const getBotReply = async (message, currentMessageCount) => {
		const text = message.toLowerCase();

		// Check if we should redirect to representative first
		if (shouldRedirectToRep(currentMessageCount)) {
			setHandedOffToRep(true);
			// Trigger transition to human support
			setTimeout(() => transitionToHumanSupport(), 1000);
			return getRepresentativeHandoffMessage();
		}

		// Check for human agent request
		if (text.includes('human') || text.includes('agent') || text.includes('person') || text.includes('representative')) {
			setHandedOffToRep(true);
			// Trigger transition to human support
			setTimeout(() => transitionToHumanSupport(), 1000);

			if (user) {
				return "I'll connect you with a human representative right away! 🔄\n\n" +
					"Redirecting you to our Support Center where you can start a live chat with our GOL staff...\n\n" +
					"💡 You'll be able to chat directly with our team there.";
			} else {
				return "I'll connect you with a human representative right away! Here are the ways to reach our team:\n\n" +
					"📞 **Phone:** +91-1234567890\n" +
					"📧 **Email:** support@greenoceanlogistics.com\n" +
					"💬 **WhatsApp:** +91-9876543210\n\n" +
					"💡 **Tip:** Log in and visit our [Support Center](/support) to start a live chat session!\n\n" +
					"Our representatives are available 24/7 to assist you. Please provide your contact details and a brief description of your inquiry when you reach out.";
			}
		}

		// Check for greetings
		if (text.match(/^(hi|hello|hey|greetings|howdy)/i)) {
			return "Hello! I'm your Green Ocean Logistics assistant. How can I help you with your logistics needs today?";
		}

		// Check for thank you
		if (text.match(/thank you|thanks|thx/i)) {
			return "You're welcome! Is there anything else I can help you with regarding your logistics needs?";
		}

		// Check for goodbye
		if (text.match(/bye|goodbye|see you|farewell/i)) {
			return "Goodbye! Feel free to return if you have more questions about Green Ocean Logistics services.";
		}

		// Check for CFS list request
		if (text.includes('cfs list') || text.includes('list of cfs') || text.includes('all cfs') ||
			(text.includes('cfs') && text.includes('available')) ||
			(text.includes('container freight station') && text.includes('list'))) {
			return knowledgeBase["cfs list"];
		}

		// Check for general CFS information
		if ((text.includes('cfs') || text.includes('container freight station')) &&
			!text.includes('specific') && !text.includes('details') && !text.includes('which')) {
			return knowledgeBase["cfs"];
		}

		// Check for specific CFS inquiries
		if (text.includes('which cfs') || text.includes('what cfs') ||
			(text.includes('cfs') && text.includes('recommend')) ||
			(text.includes('best') && text.includes('cfs'))) {
			return "We have several excellent CFS facilities. Here are our top-rated options:\n\n" +
				"1. Gateway Distriparks Limited (Mumbai) - Rating: 4.8/5\n" +
				"2. EverCFS (Mumbai Port) - Rating: 4.8/5\n" +
				"3. GreenLogix (Chennai Port) - Rating: 4.5/5\n\n" +
				"Which one would you like to know more about?";
		}

		// Check for specific CFS details
		const cfsKeywords = {
			"gateway": ["gateway", "distriparks", "mumbai cfs", "nhava sheva"],
			"chennai icd": ["chennai icd", "chennai container", "chennai depot"],
			"delhi icd": ["delhi icd", "tughlakabad", "delhi container", "delhi depot"],
			"kolkata cfs": ["kolkata cfs", "kolkata container", "west bengal cfs"],
			"evercfs": ["evercfs", "ever cfs", "mumbai port cfs"],
			"greenlogix": ["greenlogix", "green logix", "chennai port cfs"],
			"swiftcargo": ["swiftcargo", "swift cargo", "jnpt cfs"]
		};

		for (const [cfsKey, keywords] of Object.entries(cfsKeywords)) {
			for (const keyword of keywords) {
				if (text.includes(keyword)) {
					return knowledgeBase[cfsKey];
				}
			}
		}

		// Check for CFS comparison request
		if ((text.includes('compare') || text.includes('difference') || text.includes('vs') || text.includes('versus')) &&
			(text.includes('cfs') || text.includes('container freight station'))) {
			return "Here's a comparison of our top CFS facilities:\n\n" +
				"Gateway Distriparks (Mumbai):\n• Rating: 4.8/5\n• Tariff: ₹5,001-10,000\n• Free Days: 7 days\n\n" +
				"Chennai ICD:\n• Rating: 4.3/5\n• Tariff: ₹10,001-15,000\n• Free Days: 10 days\n\n" +
				"Delhi ICD:\n• Rating: 4.0/5\n• Tariff: ₹0-5,000\n• Free Days: 30 days\n\n" +
				"Would you like specific details about any of these facilities?";
		}

		// Check for matches in the knowledge base
		for (const [keyword, response] of Object.entries(knowledgeBase)) {
			if (text.includes(keyword)) {
				return response;
			}
		}

		// Default response if no match is found
		return knowledgeBase.default;
	};

	// Handle sending a message
	const handleSend = async () => {
		if (input.trim() === '' || handedOffToRep || isTransitioning) return;

		const userInput = input.trim();
		const currentTime = Date.now();

		// Add user message with timestamp
		const userMessage = { sender: 'user', text: userInput, timestamp: currentTime };
		setMessages(prev => [...prev, userMessage]);

		// Increment message count (user message)
		const newMessageCount = messageCount + 1;
		setMessageCount(newMessageCount);

		// Check if this is a goodbye message
		const isGoodbye = userInput.toLowerCase().match(/bye|goodbye|see you|farewell/i);

		// Show typing indicator
		setIsTyping(true);

		try {
			// Get bot response with current message count (now async)
			const botResponse = await getBotReply(userInput, newMessageCount);

			// Add bot message after a delay to simulate thinking
			setTimeout(() => {
				setIsTyping(false);
				const botMessage = { sender: 'bot', text: botResponse, timestamp: Date.now() };
				setMessages(prev => [...prev, botMessage]);
				setLastProactiveTime(Date.now());

				// Increment message count (bot message)
				setMessageCount(prev => prev + 1);

				// If it's a goodbye message, reset the chat after a short delay
				if (isGoodbye && !handedOffToRep) {
					setTimeout(() => {
						setMessages([
							{ sender: 'bot', text: '👋 Hello! I\'m your Green Ocean Logistics assistant. How can I help you today?', timestamp: Date.now() }
						]);
						setMessageCount(1);
						setHandedOffToRep(false);
						setIsTransitioning(false);
						setIsOpen(false); // Also close the chat window
					}, 3000);
				}
			}, Math.random() * 1000 + 500); // Random delay between 500-1500ms for more natural feel
		} catch (error) {
			console.error('Error getting bot response:', error);
			setIsTyping(false);

			// Add error message
			const errorMessage = {
				sender: 'bot',
				text: 'I apologize, but I encountered an error. Please try again or contact our support team directly.',
				timestamp: Date.now()
			};
			setMessages(prev => [...prev, errorMessage]);
		}

		setInput('');
	};

	// Function to reset conversation
	const resetConversation = () => {
		setMessages([
			{ sender: 'bot', text: '👋 Hello! I\'m your Green Ocean Logistics assistant. How can I help you today?', timestamp: Date.now() }
		]);
		setMessageCount(1);
		setHandedOffToRep(false);
		setInput('');
		setIsTyping(false);
		setLastProactiveTime(Date.now());
	};

	// Scroll to bottom of messages when new messages are added
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Set up proactive messaging
	useEffect(() => {
		const proactiveInterval = setInterval(() => {
			// Show proactive message every 15 seconds if the chat isn't open
			const currentTime = Date.now();

			// Check if we should show a notification based on time and dismissal state
			const timeToWait = longDismissal ? 150 * 60 * 1000 : 15 * 1000; // 15 minutes or 15 seconds

			if (!isOpen && currentTime - lastProactiveTime > timeToWait) {
				// Show a temporary notification without opening the full chat
				const proactiveMessages = [
					"Are you facing any difficulties with your logistics needs? I'm here to help!",
					"Need assistance with shipping, tracking, or any other logistics service? Just ask me!",
					"Looking for information about our services? I can provide details on all Green Ocean Logistics offerings.",
					"Do you have questions about our EIR/COP, invoicing, or container services? I'm here to assist you!"
				];

				const randomMessage = proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)];

				// Create and show a temporary notification with Tailwind classes
				const notification = document.createElement('div');
				notification.className = 'fixed bottom-[90px] right-5 w-[300px] bg-[var(--accent)] rounded-xl shadow-lg z-[1001] overflow-hidden animate-[slideIn_0.3s_ease-out]';
				notification.style.animation = 'slideIn 0.3s ease-out';

				// Define the animation in a style tag if it doesn't exist
				if (!document.getElementById('chatbot-animations')) {
					const style = document.createElement('style');
					style.id = 'chatbot-animations';
					style.textContent = `
@keyframes slideIn {
from { transform: translateY(20px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
`;
					document.head.appendChild(style);
				}

				notification.innerHTML = `
<div class="p-4">
<p class="m-0 mb-3 text-gray-800 text-sm">${randomMessage}</p>
<div class="flex justify-between mt-3">
<button class="bg-[var(--primary)] text-[var(--accent)] px-3 py-2 rounded-md text-xs cursor-pointer border-none hover:bg-[var(--primary)]/70  transition-colors">Yes, I need help</button>
<button class="bg-[var(--accent)] text-[var(--foreground)] border px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[var(--accent)]/70 transition-colors">No, thanks</button>
</div>
</div>
`;

				document.body.appendChild(notification);

				// Add event listeners to the buttons
				const yesButton = notification.querySelector('button:first-child');
				const noButton = notification.querySelector('button:last-child');

				yesButton.addEventListener('click', () => {
					setIsOpen(true);
					document.body.removeChild(notification);
					setLongDismissal(false); // Reset the dismissal state
				});

				noButton.addEventListener('click', () => {
					document.body.removeChild(notification);
					setLongDismissal(true); // Set long dismissal when user clicks "No, thanks"
					setLastProactiveTime(Date.now()); // Update the time
				});

				// Auto-remove the notification after 10 seconds if no action is taken
				setTimeout(() => {
					if (document.body.contains(notification)) {
						document.body.removeChild(notification);
					}
				}, 10000);

				setLastProactiveTime(currentTime);
			}
		}, 5 * 1000); // Check every 5 seconds

		return () => clearInterval(proactiveInterval);
	}, [isOpen, lastProactiveTime, longDismissal]);

	return (
		<div className="fixed bottom-5 right-5 z-50">
			{!isOpen ? (
				<button
					className="w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center cursor-pointer shadow-lg border-none transition-all duration-300 hover:bg-[var(--primary)]/70 hover:scale-105"
					onClick={() => setIsOpen(true)}
					aria-label="Open chat"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
					</svg>
				</button>
			) : (
				<div className="absolute bottom-20 right-0 md:[25dvw] w-[300px] h-[500px] bg-[var(--background)] rounded-xl shadow-lg flex flex-col overflow-hidden">
					<div className="bg-[var(--primary)] text-white p-4 font-semibold flex justify-between items-center">
						<span>Assistant</span>
						<div className="flex items-center space-x-2">
							<button
								className="bg-transparent border-none text-white cursor-pointer text-sm hover:bg-white/20 px-2 py-1 rounded"
								onClick={resetConversation}
								aria-label="Reset conversation"
								title="Reset conversation"
							>
								<RefreshCcw size={18} />
							</button>
							<button
								className="bg-transparent border-none text-white cursor-pointer text-lg hover:bg-white/20 px-2 py-1 rounded"
								onClick={() => setIsOpen(false)}
								aria-label="Close chat"
							>
								<X size={20} />
							</button>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto p-4 flex flex-col">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`mb-3 max-w-[80%] p-3 rounded-2xl break-words ${msg.sender === 'bot'
									? 'self-start bg-[var(--accent)] text-gray-800'
									: 'self-end bg-[var(--primary)] text-white'
									}`}
							>
								<div className="whitespace-pre-line">{msg.text}</div>
								{msg.timestamp && (
									<div className={`text-xs mt-1 opacity-60 ${msg.sender === 'bot' ? 'text-gray-600' : 'text-gray-200'}`}>
										{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</div>
								)}
							</div>
						))}
						{isTyping && (
							<div className="mb-3 max-w-[80%] p-3 rounded-2xl bg-[var(--accent)] text-gray-800 self-start">
								<div className="flex items-center space-x-1">
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
										<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
										<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
									</div>
									<span className="text-sm text-gray-600 ml-2">Assistant is typing...</span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
					<div className="border-t border-[var(--primary)]">
						{/* Message counter and status */}
						<div className="px-3 py-2 text-xs text-gray-600 bg-gray-50 flex justify-between items-center">
							<span>Messages: {messageCount}/20</span>
							{isTransitioning && (
								<span className="text-blue-600 font-medium">🔄 Connecting to support...</span>
							)}
							{handedOffToRep && !isTransitioning && (
								<span className="text-green-600 font-medium">✓ Live chat available</span>
							)}
							{messageCount >= 15 && messageCount < 20 && !handedOffToRep && !isTransitioning && (
								<span className="text-orange-600 font-medium">⚠ Representative handoff soon</span>
							)}
						</div>

						<div className="flex p-3 md:max-w-[70dvh]">
							<input
								type="text"
								className={`p-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-[200px] bg-[var(--accent)] ${handedOffToRep || isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && !isTransitioning && handleSend()}
								placeholder={
									isTransitioning
										? "Connecting to support..."
										: handedOffToRep
											? "Live chat available - check new window"
											: "Ask questions..."
								}
								disabled={handedOffToRep || isTransitioning}
							/>
							<button
								className={`border-none rounded-r-xl px-4 py-2 cursor-pointer transition-colors ${handedOffToRep || isTransitioning
									? 'bg-gray-400 text-gray-600 cursor-not-allowed'
									: 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/70'
									}`}
								onClick={handleSend}
								disabled={handedOffToRep || isTransitioning}
							>
								{isTransitioning ? '🔄' : 'Send'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
