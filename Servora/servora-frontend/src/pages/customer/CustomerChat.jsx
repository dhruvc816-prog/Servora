import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../../services/chatService';

function CustomerChat() {
    const [requestId, setRequestId] = useState('');
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleConnect = () => {
        if (requestId.trim()) {
            setIsConnected(true);
            setMessages([{
                role: 'ai',
                text: `Connected to request **${requestId.substring(0, 8)}...**! How can I help you today?`
            }]);
        }
    };

    const handleSend = async () => {
        if (!requestId || !question.trim()) return;

        const userMsg = { role: 'user', text: question };
        setMessages(prev => [...prev, userMsg]);
        setQuestion('');
        setLoading(true);

        try {
            const res = await sendMessage(requestId, question);
            const aiMsg = { role: 'ai', text: res.data.data };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-2xl animate-slide-up">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-600 mb-4 shadow-glow">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">AI Support Chat</h1>
                    <p className="text-surface-400 text-sm">Get instant answers about your service request</p>
                </div>

                {/* Chat container */}
                <div className="glass-card overflow-hidden">
                    {/* Request ID bar */}
                    {!isConnected ? (
                        <div className="p-6 border-b border-surface-800/50">
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Request ID</label>
                            <div className="flex gap-3">
                                <input
                                    id="chat-request-id"
                                    placeholder="Paste your Request ID to start chatting..."
                                    className="input-premium flex-1"
                                    value={requestId}
                                    onChange={(e) => setRequestId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                                />
                                <button
                                    onClick={handleConnect}
                                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-brand-600 text-white font-medium text-sm hover:shadow-glow transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Connect
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 py-3 border-b border-surface-800/50 flex items-center justify-between bg-surface-900/30">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-surface-400">Connected to</span>
                                <span className="text-xs font-mono text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
                                    {requestId.substring(0, 12)}...
                                </span>
                            </div>
                            <button
                                onClick={() => { setIsConnected(false); setMessages([]); setRequestId(''); }}
                                className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="h-[400px] overflow-y-auto p-6 space-y-4" style={{ scrollbarGutter: 'stable' }}>
                        {messages.length === 0 && isConnected && (
                            <div className="text-center py-12">
                                <svg className="w-10 h-10 mx-auto text-surface-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-surface-500 text-sm">Ask anything about your request</p>
                            </div>
                        )}

                        {!isConnected && messages.length === 0 && (
                            <div className="text-center py-16">
                                <svg className="w-12 h-12 mx-auto text-surface-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <p className="text-surface-500 font-medium">Enter your Request ID above</p>
                                <p className="text-surface-600 text-sm mt-1">to start chatting with our AI assistant</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
                            >
                                <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar */}
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        msg.role === 'user'
                                            ? 'bg-brand-500/20 border border-brand-500/30'
                                            : 'bg-purple-500/20 border border-purple-500/30'
                                    }`}>
                                        {msg.role === 'user' ? (
                                            <svg className="w-3.5 h-3.5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-tr-md'
                                            : 'bg-surface-800/80 text-surface-300 border border-surface-700/50 rounded-tl-md'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-scale-in">
                                <div className="flex items-start gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="bg-surface-800/80 border border-surface-700/50 px-4 py-3 rounded-2xl rounded-tl-md">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    {isConnected && (
                        <div className="p-4 border-t border-surface-800/50 bg-surface-900/30">
                            <div className="flex gap-3">
                                <input
                                    id="chat-input"
                                    placeholder="Ask about your request..."
                                    className="input-premium flex-1"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={loading}
                                />
                                <button
                                    id="chat-send-btn"
                                    onClick={handleSend}
                                    disabled={loading || !question.trim()}
                                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-6 text-center animate-fade-in">
                    <div className="flex gap-4 justify-center">
                        <Link to="/customer/request" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Request
                        </Link>
                        <span className="text-surface-700">•</span>
                        <Link to="/customer/track" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Track Request
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerChat;