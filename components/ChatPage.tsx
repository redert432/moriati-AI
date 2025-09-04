
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { ChatMessage } from '../types';
import { fetchPrayerTimes } from '../services/prayerTimeService';
import Loader from './Loader';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'مرحباً بك! أنا موريافي، كيف يمكنني مساعدتك اليوم؟ يمكنك أن تسألني عن أوقات الصلاة في مدن المملكة.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        try {
            if (!process.env.API_KEY) {
                // This will be caught by the catch block
                throw new Error("API key not found. Please set the API_KEY environment variable.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prayerTimesTool = {
                functionDeclarations: [{
                    name: 'get_prayer_times',
                    description: 'الحصول على أوقات الصلاة لمدينة محددة في المملكة العربية السعودية',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            city: {
                                type: Type.STRING,
                                description: 'المدينة في المملكة العربية السعودية، مثل: الرياض، جدة'
                            }
                        },
                        required: ['city']
                    }
                }]
            };

            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                tools: [prayerTimesTool],
                systemInstruction: 'أنت مساعد ذكاء اصطناعي باسم موريافي. كن ودودًا ومساعدًا. مهمتك هي الإجابة على الأسئلة وتنفيذ المهام المطلوبة. إذا طُلب منك أوقات الصلاة، استخدم الأداة المتاحة لك ثم قم بعرض النتائج للمستخدم بصيغة واضحة وجميلة باللغة العربية. مثال: "أوقات الصلاة في [المدينة] اليوم هي:\n- الفجر: [الوقت]\n- الظهر: [الوقت]\n- العصر: [الوقت]\n- المغرب: [الوقت]\n- العشاء: [الوقت]".',
            });
            setChat(newChat);

        } catch(error) {
             setMessages(prev => [...prev, { role: 'model', text: 'حدث خطأ في الإعدادات: ' + (error as Error).message }]);
        }

    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            let stream = await chat.sendMessageStream({ message: userMessage.text });
            let text = '';
            
            // First pass for tool calls
            for await (const chunk of stream) {
                const functionCalls = chunk.functionCalls;
                if (functionCalls && functionCalls.length > 0) {
                    const call = functionCalls[0]; // Process the first call
                    if (call.name === 'get_prayer_times') {
                        const city = call.args.city;
                        const prayerTimes = await fetchPrayerTimes(city);
                        
                        // Send the result back to the model
                        stream = await chat.sendMessageStream({
                            toolResponse: {
                                functionResponses: [{
                                    name: 'get_prayer_times',
                                    response: { name: 'get_prayer_times', content: prayerTimes },
                                }]
                            }
                        });
                    }
                }
            }

            // Second pass for final text response (streaming to UI)
            let currentModelMessage = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of stream) {
                text = chunk.text;
                if (text) {
                    currentModelMessage += text;
                     setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = currentModelMessage;
                        return newMessages;
                    });
                }
            }

        } catch (error) {
            const errorMessage = "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى. " + (error instanceof Error ? error.message : "");
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-[75vh] max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && (
                           <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 011.087.85l.377 1.915a1 1 0 001.913.248l1.36-4.081a1 1 0 00-1.824-.61l-1.042 3.126-1.12-5.694a1 1 0 00-1.916-.376l-1.33 6.732a1 1 0 00.78 1.23l5.538 1.153a1 1 0 001.14-.32l.83-1.244a1 1 0 000-1.156l-1.57-2.355a1 1 0 00-1.542-.42l-1.22 1.22a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414l3.535-3.536a1 1 0 000-1.414l-4.242-4.243a1 1 0 00-1.18-.172L2.31 4.507 10 1.66l7.69 3.296a1 1 0 10.78-1.84l-7-3z" /></svg>
                           </div>
                       )}
                        <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 011.087.85l.377 1.915a1 1 0 001.913.248l1.36-4.081a1 1 0 00-1.824-.61l-1.042 3.126-1.12-5.694a1 1 0 00-1.916-.376l-1.33 6.732a1 1 0 00.78 1.23l5.538 1.153a1 1 0 001.14-.32l.83-1.244a1 1 0 000-1.156l-1.57-2.355a1 1 0 00-1.542-.42l-1.22 1.22a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414l3.535-3.536a1 1 0 000-1.414l-4.242-4.243a1 1 0 00-1.18-.172L2.31 4.507 10 1.66l7.69 3.296a1 1 0 10.78-1.84l-7-3z" /></svg>
                           </div>
                        <div className="px-4 py-3 rounded-2xl bg-gray-700 rounded-bl-none">
                            <div className="flex items-center justify-center space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اسأل موريافي أي شيء..."
                        aria-label="Chat input"
                        disabled={isLoading || !chat}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim() || !chat}
                        aria-label="Send message"
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                         </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;

