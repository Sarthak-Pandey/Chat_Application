import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
  getChats, 
  getMessages, 
  sendMessage, 
  deleteChat 
} from '../service/chat.api';
import { intitlizeSocketConnection } from '../service/chat.socket';
import Button from '../../../components/Button';
import { 
  Send, 
  Plus, 
  Trash2, 
  LogOut, 
  MessageSquare, 
  Sparkles, 
  Bot, 
  User, 
  Cpu, 
  Layers, 
  Play, 
  ChevronRight, 
  Terminal, 
  Compass, 
  RefreshCw,
  Search,
  BookOpen,
  Code
} from 'lucide-react';

// Custom Loading State Component for AI Processing
const LoadingStateComponent = () => {
  const steps = [
    "Initializing neural core pipeline...",
    "Querying contextual memory layers...",
    "Synthesizing cognitive response...",
    "Streaming verified outputs..."
  ];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % steps.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0b0a0a]/90 border border-red-950/30 shadow-lg shadow-black/80 max-w-xl animate-slow-glow transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Cybernetic Spinning Core SVG */}
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          {/* Outer glowing pulsed ring */}
          <div className="absolute inset-0 rounded-full border border-rose-500/10 animate-cyber-pulse"></div>
          
          {/* Outer rotating gradient ring */}
          <svg className="absolute w-full h-full animate-spin" style={{ animationDuration: '5s' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#red-glow-grad)" strokeWidth="2.5" strokeDasharray="150 100" />
            <defs>
              <linearGradient id="red-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9f1239" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Middle counter-rotating dashed ring */}
          <svg className="absolute w-5/6 h-5/6 animate-spin-reverse" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="12 28" strokeOpacity="0.6" />
          </svg>

          {/* Inner core node */}
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-700 to-red-500 shadow-md shadow-rose-500/80 relative">
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" style={{ animationDuration: '1.8s' }}></span>
          </div>
        </div>

        {/* Loading text container */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            NEURAL SYNAPSE ACTIVE
          </div>
          <div className="text-sm font-sans text-neutral-300 mt-1 truncate">
            {steps[currentStepIndex]}
          </div>
        </div>
      </div>

      {/* Pulsing visual progress trace */}
      <div className="relative h-[3px] w-full bg-neutral-950 rounded-full overflow-hidden border border-red-950/20">
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-infinite"
             style={{
               animationName: 'slide-right',
               animationDuration: '1.4s',
               animationIterationCount: 'infinite',
               animationTimingFunction: 'ease-in-out'
             }}
        ></div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slide-right {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}} />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Sidebar and History
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  
  // Message Log
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  // Socket & Streaming states
  const [socketId, setSocketId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Status for sending/loading state
  const [loadingResponseId, setLoadingResponseId] = useState(null);

  // Suggested Prompts Grid
  const suggestedPrompts = [
    {
      title: "Node.js API Setup",
      description: "Write a clean Express server setup with JWT auth.",
      icon: Code,
      prompt: "Write a complete, clean REST API configuration in Node.js with Express and JWT authentication. Focus on modular routing and secure password hashing."
    },
    {
      title: "Debug React Loops",
      description: "Explain and fix infinite renders in React hooks.",
      icon: Cpu,
      prompt: "Show me a typical code example that causes an infinite rendering loop in React hooks (using useEffect) and explain step-by-step how to debug and solve it."
    },
    {
      title: "Marketing Concept",
      description: "Draft high-converting copy for a cyberpunk brand.",
      icon: Compass,
      prompt: "Draft highly compelling, futuristic marketing copy for a brand launching a premium cyberpunk-style modular wristwatch. Include a slogan and key product benefits."
    },
    {
      title: "Explain Quantum Computing",
      description: "Use clear programming paradigms to explain concepts.",
      icon: BookOpen,
      prompt: "Explain the fundamental principles of quantum computing—superposition and entanglement—using simple programming abstractions or code analogies that a developer can grasp instantly."
    }
  ];

  // Fetch initial history
  useEffect(() => {
    fetchChatsList();
    
    // Initialize Socket connection
    socketRef.current = intitlizeSocketConnection();
    
    socketRef.current.on('connect', () => {
      console.log("Socket connected, socket ID:", socketRef.current.id);
      setSocketId(socketRef.current.id);
    });

    // Socket streaming token listener
    socketRef.current.on('message:token', ({ chatId, content, tempId }) => {
      // Turn off loading animation for this tempId as tokens are incoming
      setLoadingResponseId(null);
      
      setMessages(prev => prev.map(msg => {
        if (msg.tempId === tempId) {
          return { 
            ...msg, 
            content: msg.content + content,
            isStreaming: true 
          };
        }
        return msg;
      }));
    });

    // Socket stream done listener
    socketRef.current.on('message:done', ({ chatId, aimessage, tempId }) => {
      setLoadingResponseId(null);
      setMessages(prev => prev.map(msg => {
        if (msg.tempId === tempId) {
          // Replace temp streaming object with verified backend database object
          return { 
            ...aimessage, 
            isStreaming: false 
          };
        }
        return msg;
      }));
      
      // If we started a new chat, update active ID and refresh sidebar
      if (chatId) {
        setActiveChatId(chatId);
      }
      fetchChatsList();
    });

    // Socket error listener
    socketRef.current.on('message:error', ({ tempId, message }) => {
      setLoadingResponseId(null);
      setMessages(prev => prev.map(msg => {
        if (msg.tempId === tempId) {
          return { 
            ...msg, 
            content: `[Error: ${message || "Generation halted due to connection error"}]`,
            isError: true,
            isStreaming: false 
          };
        }
        return msg;
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch Chats
  const fetchChatsList = async () => {
    setIsLoadingChats(true);
    try {
      const data = await getChats();
      setChats(data.chats || []);
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  // Fetch specific conversation messages
  const loadChatMessages = async (chatId) => {
    setActiveChatId(chatId);
    setIsLoadingMessages(true);
    try {
      const data = await getMessages(chatId);
      setMessages(data.message || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Delete chat handler
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Avoid selecting the chat
    try {
      await deleteChat(chatId);
      // If deleted chat was active, reset to welcome screen
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
      fetchChatsList();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Switch to new chat workspace
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  // Submit Prompt Handler
  const handleSendMessage = async (customMessageText) => {
    const textToSend = (customMessageText || inputMessage).trim();
    if (!textToSend) return;

    // Reset input
    setInputMessage('');

    // Generate unique tempId for client tracking
    const tempId = `temp-${Date.now()}`;

    // Append user message local representation
    const userMessageLocal = {
      _id: `user-temp-${Date.now()}`,
      content: textToSend,
      role: 'user'
    };

    // Append AI placeholder loading bubble
    const aiMessagePlaceholder = {
      _id: `ai-temp-${Date.now()}`,
      content: '',
      role: 'ai',
      tempId: tempId,
      isTemp: true
    };

    setMessages(prev => [...prev, userMessageLocal, aiMessagePlaceholder]);
    
    // Trigger loader state for this message tempId
    setLoadingResponseId(tempId);

    try {
      // Trigger API post call sending socket identity for streaming target
      await sendMessage(textToSend, activeChatId || undefined, socketId || undefined, tempId);
    } catch (err) {
      console.error("Failed to transmit message:", err);
      // Turn off loading animation and display error
      setLoadingResponseId(null);
      setMessages(prev => prev.map(msg => {
        if (msg.tempId === tempId) {
          return { 
            ...msg, 
            content: `Failed to connect to the server. Please check your backend connection.`, 
            isError: true 
          };
        }
        return msg;
      }));
    }
  };

  // Scroll to bottom helper
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingResponseId]);

  return (
    <div className="flex h-screen bg-[#050505] text-neutral-200 overflow-hidden font-sans selection:bg-rose-500 selection:text-white">
      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-950/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-rose-950/5 blur-[120px] pointer-events-none"></div>

      {/* 1. SIDEBAR (Past Chat History) */}
      <aside className="w-80 border-r border-red-950/20 bg-[#08080a]/90 backdrop-blur-md flex flex-col z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-red-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-800 to-red-600 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-white/5 animate-pulse">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wider font-mono">RED.SYNAPSE</h1>
              <span className="text-[10px] text-rose-500/80 font-mono tracking-widest font-semibold uppercase">AI Core v1.2</span>
            </div>
          </div>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-800/80 to-rose-700/80 hover:from-red-700 hover:to-rose-600 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-red-950/40 hover:shadow-red-900/40 border border-red-600/20 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        {/* Chats History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2 font-mono">
            Chat History
          </div>
          
          {isLoadingChats && chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-neutral-500">
              <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
              <span className="text-xs font-mono">Synchronizing...</span>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-10 text-neutral-600 text-xs font-mono border border-dashed border-red-950/10 rounded-xl m-2">
              No active logs found
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = activeChatId === chat._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => loadChatMessages(chat._id)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-red-950/20 border border-red-900/30 text-white shadow-inner' 
                      : 'hover:bg-neutral-900/50 border border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-6">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-500' : 'text-neutral-500'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{chat.title || "Untiled Log"}</p>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5 font-mono">
                        {chat.lastSnippet || "Empty chat buffer"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete Button (visible on group hover) */}
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-neutral-950/80 border border-red-950/40 text-neutral-400 hover:text-red-500 hover:border-red-900/60"
                    title="Purge chat log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User Info & Footer Session */}
        <div className="p-4 border-t border-red-950/20 bg-[#060608]/90 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-rose-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.username || "Operator"}</p>
              <p className="text-[10px] text-rose-500/70 font-mono truncate">{user?.email || "online"}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-950/10 transition-all cursor-pointer border border-transparent hover:border-red-950/30"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden bg-gradient-to-b from-[#050505] to-[#08080a]">
        
        {/* Workspace Top Header */}
        <header className="h-16 border-b border-red-950/15 flex items-center justify-between px-6 bg-[#050505]/75 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              {activeChatId ? "Synchronized Feed" : "Standalone Console"}
            </p>
          </div>
          {activeChatId && (
            <div className="text-xs font-mono text-neutral-500">
              ID: <span className="text-rose-500">{activeChatId.slice(-8)}</span>
            </div>
          )}
        </header>

        {/* Conversation Stream Frame */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {isLoadingMessages ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-neutral-500">
              <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
              <p className="text-xs font-mono tracking-wider">Retrieving transaction blocks...</p>
            </div>
          ) : messages.length === 0 ? (
            /* EMPTY WELCOME SCREEN */
            <div className="max-w-3xl mx-auto py-16 flex flex-col justify-center h-full">
              <div className="text-center mb-10">
                <div className="inline-flex p-3 rounded-2xl bg-red-950/10 border border-red-900/20 shadow-md shadow-red-950/10 mb-4 animate-bounce">
                  <Sparkles className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-4xl font-light text-white tracking-tight font-serif">
                  How can I <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent font-medium">help you</span> today?
                </h2>
                <p className="text-neutral-400 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                  Query the neural core for complex logic, system architecture designs, copy creation, or secure codebases.
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedPrompts.map((item, index) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-5 rounded-2xl bg-[#0b0a0a]/60 border border-red-950/15 hover:border-red-800/40 hover:bg-[#111010]/80 transition-all duration-300 group cursor-pointer shadow-lg shadow-black/30 hover:shadow-red-950/10 hover:scale-[1.01]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-900/20 text-rose-500 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* MESSAGE LOG STREAM */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const isLoaderActive = loadingResponseId === msg.tempId;

                return (
                  <div 
                    key={msg._id} 
                    className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Bot avatar prefix for AI responses */}
                    {!isUser && (
                      <div className="w-9 h-9 rounded-xl bg-[#0b0a0a] border border-red-950/40 flex items-center justify-center shrink-0 shadow shadow-black/80">
                        <Bot className="w-5.5 h-5.5 text-rose-500" />
                      </div>
                    )}

                    <div className="max-w-[85%]">
                      {isUser ? (
                        /* User Message Card */
                        <div className="px-4.5 py-3 rounded-2xl bg-[#121010] border border-red-950/30 text-neutral-100 shadow-lg shadow-black/40 text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      ) : isLoaderActive ? (
                        /* Dynamic loading state component */
                        <LoadingStateComponent />
                      ) : (
                        /* AI Message Response Card */
                        <div className={`p-5 rounded-2xl bg-[#08080a] border ${
                          msg.isError ? 'border-red-900/40' : 'border-neutral-900'
                        } text-neutral-200 shadow-xl shadow-black/60 text-sm leading-relaxed relative`}>
                          
                          {/* Inner neon border hint */}
                          {!msg.isError && (
                            <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-red-600/30 via-transparent to-transparent"></div>
                          )}

                          <div className="prose prose-invert prose-red max-w-none text-[14px]">
                            {msg.content}
                            
                            {/* Flashing terminal cursor when streaming */}
                            {msg.isStreaming && (
                              <span className="inline-block w-1.5 h-4 ml-1 bg-rose-500 animate-cursor-blink align-middle"></span>
                            )}
                          </div>

                          {/* Action footer for messages */}
                          {!msg.isStreaming && !msg.isTemp && (
                            <div className="mt-4 pt-3 border-t border-neutral-900/40 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                              <span>Block verified: ok</span>
                              <span className="uppercase text-rose-500/70">core generated</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Frame */}
        <div className="p-6 bg-gradient-to-t from-[#08080a] to-transparent shrink-0">
          <div className="max-w-3xl mx-auto">
            
            {/* Input wrap container */}
            <div className="relative rounded-2xl bg-[#0b0a0a]/90 border border-red-950/20 focus-within:border-red-800/60 focus-within:ring-1 focus-within:ring-red-900/40 shadow-2xl shadow-black transition-all duration-300 p-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Submit prompt to the AI core (Press Enter to transmit)..."
                rows={2}
                disabled={loadingResponseId !== null}
                className="w-full bg-transparent resize-none border-0 py-2 px-3 text-neutral-200 placeholder-neutral-600 focus:ring-0 focus:outline-none text-sm leading-relaxed custom-scrollbar disabled:opacity-50"
              />

              {/* Action utilities bar inside the input block */}
              <div className="flex items-center justify-between pt-2 px-2 border-t border-red-950/10">
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-950 border border-red-950/20 text-rose-500 font-semibold uppercase">
                    <Terminal className="w-3.5 h-3.5" />
                    gpt-4o-stream
                  </div>
                  <span className="hidden sm:inline">Web search bypass: active</span>
                </div>

                <Button
                  onClick={() => handleSendMessage()}
                  disabled={loadingResponseId !== null || !inputMessage.trim()}
                  variant="primary"
                  className="!h-9 !py-1 px-4 text-xs tracking-wider font-semibold uppercase font-mono relative overflow-hidden group"
                >
                  <span className="flex items-center gap-1.5">
                    Transmit
                    <Send className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Hint Notice */}
            <p className="text-center text-[10px] text-neutral-600 font-mono mt-3">
              Red.Synapse is a paired development engine. Confirm sensitive outputs manually.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}



