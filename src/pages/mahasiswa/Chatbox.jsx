import { useState, useEffect, useRef } from 'react';
import chatBg from '../../assets/chatbg.png';
import headRobot from '../../assets/head.png';
import { getChatHistory, sendChatMessage } from '../../services/chatApi';

const Chatbox = ({ currentUser, onBack, onNavigate }) => {
  const [isTyping, setIsTyping] = useState(true);
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionStartedAt, setSessionStartedAt] = useState('');

  const navigationPrompts = {
    screening: {
      text: 'Baik! Hava akan mengalihkan kamu ke halaman screening stress, kamu siap?',
      primaryLabel: 'Ya, siap!',
      secondaryLabel: 'Nanti saja',
    },
    riwayat: {
      text: 'Baik! Hava akan membuka riwayat screening kamu, mau lanjut sekarang?',
      primaryLabel: 'Lihat riwayat',
      secondaryLabel: 'Nanti saja',
    },
    musik: {
      text: 'Baik! Hava akan membuka fitur musik relaksasi, mau lanjut sekarang?',
      primaryLabel: 'Buka musik',
      secondaryLabel: 'Nanti saja',
    },
    dashboard: {
      text: 'Hava akan kembali ke beranda, mau lanjut?',
      primaryLabel: 'Ya, kembali',
      secondaryLabel: 'Nanti saja',
    },
  };

  const welcomeMessages = [
    {
      id: 'welcome-1',
      type: 'bot',
      text: 'Halo, aku Hava!',
      time: 'Baru saja',
    },
    {
      id: 'welcome-2',
      type: 'bot',
      text: 'Ceritakan apa yang sedang kamu rasakan, atau pilih salah satu opsi di bawah.',
      time: 'Baru saja',
      options: ['Mau cerita', 'Mau screening', 'Mau cek riwayat screening'],
    },
  ];

  // helper waktu
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  };

  // UUID v4 fallback for older browsers
  const uuidv4 = () => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // ── ACTION NAVIGATION ──
  const handleAction = (target) => {
    const normalizedTarget = target === 'history' ? 'riwayat' : target;

    if (!normalizedTarget) {
      return;
    }

    const targetMap = {
      screening: 'screening',
      riwayat: 'riwayat',
      musik: 'musik',
      dashboard: 'dashboard',
    };

    const nextPage = targetMap[normalizedTarget];

    if (nextPage) {
      onNavigate?.(nextPage);
    }
  };

  const buildNavigationOptions = (target) => {
    const prompt = navigationPrompts[target];

    if (!prompt) {
      return null;
    }

    return [
      { label: prompt.primaryLabel, kind: 'navigate', target },
      { label: prompt.secondaryLabel, kind: 'dismiss' },
    ];
  };

  const appendBotMessage = (text, options = null, time = getTime()) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        type: 'bot',
        text,
        options,
        time,
      },
    ]);
  };

  const submitMessage = async (text) => {
    const trimmed = String(text || '').trim();

    if (!trimmed) {
      return;
    }

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: trimmed,
      time: getTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await sendChatMessage({
        userId: currentUser?.id_user,
        sessionId,
        since: sessionStartedAt,
        message: trimmed,
      });

      if (result?.sessionId && result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
        try {
          const storageKey = `mahavoice-chat-session-${currentUser?.id_user}`;
          window.localStorage.setItem(storageKey, result.sessionId);
        } catch (e) {
          // ignore storage errors
        }
      }

      const actionTarget = result?.action?.type === 'navigate' ? result.action.target : null;
      const normalizedActionTarget = actionTarget === 'history' ? 'riwayat' : actionTarget;
      const botText = result?.assistantMessage?.text || result?.reply;

      if (botText || normalizedActionTarget) {
        appendBotMessage(
          botText || navigationPrompts[normalizedActionTarget]?.text || 'Baik, aku bantu arahkan ke fitur yang kamu butuhkan.',
          normalizedActionTarget ? buildNavigationOptions(normalizedActionTarget) : null,
          result?.assistantMessage?.time || getTime(),
        );
      } else if (result?.assistantMessage) {
        setMessages(prev => [...prev, {
          id: result.assistantMessage.id_chat || Date.now() + 1,
          type: 'bot',
          text: result.assistantMessage.text,
          time: result.assistantMessage.time || getTime(),
        }]);
      }
    } catch (error) {
      appendBotMessage('Maaf, Hava sedang tidak bisa dihubungi. Coba lagi sebentar ya.');
    } finally {
      setIsTyping(false);
    }
  };

  // ── OPTION CLICK ──
  const handleOptionClick = (option) => {
    if (typeof option === 'string') {
      setInput(option);
      submitMessage(option);
      return;
    }

    if (option?.kind === 'navigate') {
      handleAction(option.target);
      return;
    }

    if (option?.kind === 'dismiss') {
      appendBotMessage('Kalau mau lanjut nanti, tinggal pilih fitur lain atau ketik pesan ya.');
    }
  };

  // ── SEND MANUAL ──
  const handleSend = () => {
    submitMessage(input);
  };

  // ── INIT CHAT ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const userId = currentUser?.id_user;

    if (!userId) {
      setMessages(welcomeMessages);
      setIsTyping(false);
      return;
    }

    const storageKey = `mahavoice-chat-session-${userId}`;
    const storageStartKey = `mahavoice-chat-session-start-${userId}`;
    const storedSessionId = window.localStorage.getItem(storageKey);
    const storedSessionStart = window.localStorage.getItem(storageStartKey);
    const resolvedSessionId = storedSessionId || uuidv4();
    const resolvedSessionStart = storedSessionStart || new Date().toISOString();

    if (!storedSessionId) {
      window.localStorage.setItem(storageKey, resolvedSessionId);
    }

    if (!storedSessionStart) {
      window.localStorage.setItem(storageStartKey, resolvedSessionStart);
    }

    setSessionId(resolvedSessionId);
    setSessionStartedAt(resolvedSessionStart);
  }, [currentUser?.id_user]);

  useEffect(() => {
    const userId = currentUser?.id_user;

    if (!userId || !sessionId) {
      return;
    }

    let isActive = true;

    const loadHistory = async () => {
      setIsTyping(true);

      try {
        const result = await getChatHistory({
          userId,
          since: sessionStartedAt,
          limit: 20,
        });

        if (!isActive) {
          return;
        }

        if (result?.messages?.length) {
          setMessages(result.messages.map((message) => ({
            id: message.id_chat,
            type: message.role === 'assistant' ? 'bot' : 'user',
            text: message.text,
            time: message.time,
          })));
        } else {
          setMessages(welcomeMessages);
        }
      } catch (error) {
        if (isActive) {
          setMessages(welcomeMessages);
        }
      } finally {
        if (isActive) {
          setIsTyping(false);
        }
      }
    };

    loadHistory();

    return () => {
      isActive = false;
    };
  }, [currentUser?.id_user, sessionId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .chat-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-anim { animation: slide-up 0.4s ease forwards; }

        .option-btn {
          background: white;
          color: #3C7A92;
          transition: all 0.2s ease;
        }
        .option-btn:hover {
          background: #E1F0F6;
        }
      `}</style>

      <div 
        className="chat-root relative h-full w-full flex flex-col overflow-hidden bg-white"
        style={{ 
          backgroundImage: `url(${chatBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* HEADER */}
        <div className="relative z-10 flex flex-col items-center pt-5 pb-2">
          <button 
            onClick={onBack}
            className="absolute left-5 top-8 flex items-center gap-1 text-[#0096a1] font-semibold text-sm"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 11L1 6L6 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
             Kembali
          </button>
          
          <img src={headRobot} className="w-14 h-11" />
          <h3 className="text-lg font-bold mt-1">Hava</h3>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 space-y-6 pb-24">

          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col gap-1 msg-anim ${msg.type === 'user' ? 'items-end' : ''}`}>

              <div className={`
                py-3 px-5 rounded-[24px] max-w-[80%]
                ${msg.type === 'bot' 
                  ? 'bg-[#50A1C1] text-white rounded-tl-none' 
                  : 'bg-[#E1F0F6] text-slate-800 rounded-tr-none'}
              `}>
                <p className="text-[14px] font-medium">{msg.text}</p>

                {msg.options && (
                  <div className="mt-4 flex flex-col gap-2">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="option-btn py-2 px-4 rounded-full text-xs font-bold"
                      >
                        {typeof opt === 'string' ? opt : opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-500">
                {msg.time}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="bg-[#50A1C1] py-3 px-5 rounded-3xl rounded-tl-none flex gap-1.5 w-fit">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}
        <div className="absolute bottom-6 left-0 w-full px-5 flex gap-3">
          <div className="flex-1 bg-white rounded-full h-12 border px-5 flex items-center">
            <input 
              type="text" 
              placeholder="Ketik pesan..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full outline-none text-sm"
            />
          </div>
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-[#50A1C1] rounded-full flex items-center justify-center text-white"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbox;