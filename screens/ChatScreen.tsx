import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Page, Message } from '../types';
import Header from '../components/Header';
import { getBotResponse } from '../services/geminiService';
import { useTranslation } from '../LanguageContext';

interface ChatScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const getSystemInstruction = useCallback(() => {
    const languageMap: { [key: string]: string } = {
        en: 'English',
        hi: 'Hindi',
    };
    const langName = languageMap[language] || 'English';

    return `You are 'Surakshify', a friendly and helpful AI assistant for travelers. 
    Your goal is to provide concise, useful, and safe information. 
    Respond exclusively in ${langName}.
    Keep your answers brief and to the point.
    If asked about sensitive topics like personal safety, give cautious and general advice, e.g., 'Always be aware of your surroundings and keep your valuables secure.'
    If asked for medical advice, tell the user to contact emergency services or a professional doctor immediately.
    Do not engage in long, off-topic conversations.
    Start your very first message with a warm welcome like 'Hello! I'm Surakshify, your personal travel assistant. How can I help you today?' in ${langName}.`;
  }, [language]);


  useEffect(() => {
    // Set initial message from bot when component mounts
    const sendInitialMessage = async () => {
        setIsLoading(true);
        try {
            const botResponse = await getBotResponse("Initial Greeting", getSystemInstruction());
            addMessage(botResponse, 'bot');
        } catch (error: any) {
            addMessage(t(error.message as any), 'bot');
        } finally {
            setIsLoading(false);
        }
    }
    sendInitialMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const botResponse = await getBotResponse(userInput, getSystemInstruction());
      addMessage(botResponse, 'bot');
    // FIX: Corrected a malformed try-catch block that was causing multiple parsing errors.
    } catch (error: any) {
      addMessage(t(error.message as any), 'bot');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('ai_assistant_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.Chat} showLanguageSwitcher/>
      
      <div className="bg-chat-primary/10 dark:bg-chat-primary-dark/10 backdrop-blur-sm text-center p-2 transition-colors duration-500">
        <p className="text-xs text-chat-primary dark:text-chat-primary-dark">{t('chat_disclaimer')}</p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-colors duration-500 ${
              msg.sender === 'user' 
                ? 'bg-chat-primary dark:bg-chat-primary-dark text-white dark:text-dark-bg rounded-br-none shadow-colored-md' 
                : 'bg-light-surface dark:bg-dark-surface backdrop-blur-md text-light-text dark:text-dark-text rounded-bl-none shadow-md'
            }`} style={{ '--shadow-color': theme === 'light' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(192, 132, 252, 0.3)' } as React.CSSProperties}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-purple-100 dark:text-purple-100' : 'text-light-text-secondary dark:text-dark-text-secondary'} text-right`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start animate-fadeInUp">
                <div className="bg-light-surface dark:bg-dark-surface backdrop-blur-md rounded-2xl rounded-bl-none p-3 shadow-colored-md transition-colors duration-500">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-chat-primary dark:bg-chat-primary-dark rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-chat-primary dark:bg-chat-primary-dark rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-chat-primary dark:bg-chat-primary-dark rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-light-surface/60 dark:bg-dark-surface/60 backdrop-blur-md border-t border-light-border dark:border-dark-border transition-colors duration-500">
        <div className="flex items-center bg-light-surface/50 dark:bg-dark-surface/50 rounded-full px-4 py-2 transition-colors duration-500 border border-light-border dark:border-dark-border">
          <button onClick={startCamera} className="text-chat-primary hover:text-purple-700 dark:text-chat-primary-dark dark:hover:text-purple-300">
            <CameraIcon />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat_input_placeholder')}
            className="flex-grow bg-transparent focus:outline-none mx-3 text-sm text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary"
            disabled={isLoading}
          />
          <button onClick={handleSend} className="bg-chat-primary dark:bg-chat-primary-dark text-white rounded-full p-2 hover:bg-purple-600 dark:hover:bg-purple-500 disabled:bg-purple-200 dark:disabled:bg-purple-800 transition-colors duration-500">
            <SendIcon />
          </button>
        </div>
      </div>
      
      {isCameraOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 animate-fadeIn">
          <video ref={videoRef} autoPlay className="w-full h-auto max-h-[80%] rounded-lg" />
          <button onClick={stopCamera} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full font-bold">{t('close_camera')}</button>
        </div>
      )}

    </div>
  );
};

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;

export default ChatScreen;