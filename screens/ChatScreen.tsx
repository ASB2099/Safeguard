import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Page, Message } from '../types';
import Header from '../components/Header';
import { getBotResponse } from '../services/geminiService';

interface ChatScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userInput = input;
    setInput('');
    addMessage(userInput, 'user');
    setIsLoading(true);
    
    try {
      const isFirstMessage = messages.length === 0;
      const botResponse = await getBotResponse(userInput, isFirstMessage);
      addMessage(botResponse, 'bot');
    } catch (error) {
      addMessage("I'm sorry, I encountered an error. Please try again.", 'bot');
    } finally {
      setIsLoading(false);
    }
  };
  
   useEffect(() => {
    const sendInitialGreeting = async () => {
      setIsLoading(true);
      try {
        const botResponse = await getBotResponse("Initial Greeting", true);
        addMessage(botResponse, 'bot');
      } catch (error) {
        addMessage("Hello! I'm having some trouble connecting. How can I help?", 'bot');
      } finally {
        setIsLoading(false);
      }
    };
    sendInitialGreeting();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header title="Customer Support" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="bg-white/50 dark:bg-black/20 text-center p-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">Email: support@safeguard.app | Phone: +1 (555) 123-4567</p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-green-500 dark:bg-red-500 text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-gray-200 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400'} text-right`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start animate-fadeInUp">
                <div className="bg-white dark:bg-gray-700 text-gray-800 rounded-2xl rounded-bl-none p-3 shadow">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <button onClick={startCamera} className="text-gray-500 hover:text-green-500 dark:hover:text-red-400">
            <CameraIcon />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="flex-grow bg-transparent focus:outline-none mx-3 text-sm text-gray-800 dark:text-gray-200"
            disabled={isLoading}
          />
          <button onClick={handleSend} className="bg-green-500 dark:bg-red-500 text-white rounded-full p-2 hover:bg-green-600 dark:hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors">
            <SendIcon />
          </button>
        </div>
      </div>
      
      {isCameraOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 animate-fadeIn">
          <video ref={videoRef} autoPlay className="w-full h-auto max-h-[80%] rounded-lg" />
          <button onClick={stopCamera} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full font-bold">Close Camera</button>
        </div>
      )}

    </div>
  );
};

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;

export default ChatScreen;