'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import api from '../lib/axios';

export default function ChatBox({}) {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [responses, setResponses] = useState([]);
    const [input, setInput] = useState('');
    const [rows, setRows] = useState(1)
    const limit = 10

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const bmi = localStorage.getItem('bmi');
        const username = localStorage.getItem('username');

        if (!userInfo || Object.keys(userInfo).length === 0 || !bmi || !username) {
            router.push('/');
            return;
        }
    }, [])

    useEffect(() => {
        const getHistory = async () => {
            try {
                const res = await api.get('/api/getchat');
                const history = res.data?.history || [];

                const pastMessages = history.map(item => item.chat);
                const pastResponses = history.map(item => item.answer);

                console.log(pastMessages, pastResponses, res);

                setMessages(pastMessages);
                setResponses(pastResponses);
            } catch(error) {
                console.error('Error loading chat history:', error);
            }
        }

        getHistory();
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) 
            return;

        setMessages((prev) => [...prev, input.trim()]);
        setInput('');
        setRows(1);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const bmi = localStorage.getItem('bmi');
            const username = localStorage.getItem('username');

            if (!userInfo || Object.keys(userInfo).length === 0 || !bmi || !username) {
                router.push('/');
                return;
            }

            const res = await api.post('/api/chat', {
                    message: input.trim(),
                    userInfo: userInfo,
                    bmi: bmi,
                    username: username
                });
            const aiText = res.data?.response || '';
            setResponses((prev) => [...prev, aiText]);
        } catch (err) {
            if (err.response?.status === 404) {
                router.push('/login');
                return;
            }

            console.error('Failed to get response: ', err);
            setResponses((prev) => [...prev, '*Sorry, something went wrong.*']);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        const lineCount = value.split('\n').length;

        setRows(Math.min(Math.max(lineCount, 1), limit));
    };

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        }, [messages, responses]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
        }
    };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto h-screen w-screen max-w-screen mx-auto px-0 my-[5vh] max-w-md mx-auto">
      {messages.length === 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-5">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex flex-row jutify-between items-center gap-5">
              <Image 
                src="/images/image_7.png"
                width={150}
                height={10}
                alt="Ai chat"
              />
              <div className="flex flex-col justify-center items-start">
                <p className="text-3xl font-bold text-left">Your Personal</p>
                <p className="text-3xl font-bold text-left">AI Health Assistant</p>  
              </div>
            </div>
            <p className="text-2xl font-bold text-center">Meet your smart companion for a healthier you.</p>  
            <p className="text-xl text-gray-500 text-center w-[60vw]">Our AI Chat Bot is here to guide you anytime, anywhere based on your BMI and personal health data. What Can the AI Chat Bot Do?</p>  
          </div>
        </div>
      )}
      <div 
        className="flex-1 overflow-y-auto px-50 mt-15 pt-6 pb-2 space-y-2"
      >
        {messages.map((msg, i) => (
            <div key={i}>
                <div ref={scrollRef}></div> 
                <div
                    className="flex bg-gray-100 text-black justify-end rounded-xl px-3 py-2 max-w-xs ml-auto w-fit"
                >
                    <div className="whitespace-pre-wrap break-words">{msg}</div>
                </div>
                
                {responses[i] && (
                    <div className="flex justify-center items-center">
                        <div className="my-5 text-black rounded-xl px-3 py-2 w-full max-w-[80%] whitespace-pre-wrap break-words">
                            <div ref={scrollRef}></div>
                            <ReactMarkdown className="prose prose-sm">{responses[i]}</ReactMarkdown>
                        </div>
                    </div>
                )}
          </div>
        ))}
      </div>
            
      <div className="rounded-xl p-[.1rem] mx-50 mb-4 bg-gradient-to-r from-[#D10FE8] to-[#4FB8E8]">
        <div className="p-4 bg-gray-100 rounded-xl">
          <div className="flex items-end gap-2">
            <textarea
              rows={rows}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Chat Sekarang"
              className="flex-1 px-3 py-2 resize-none focus:outline-none rounded-md"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}