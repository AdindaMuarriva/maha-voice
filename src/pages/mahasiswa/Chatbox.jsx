import { useState, useEffect, useRef } from 'react';
import chatBg from '../../assets/chatbg.png';
import headRobot from '../../assets/head.png';

const Chatbox = ({ onBack, onNavigate }) => {
  const [isTyping, setIsTyping] = useState(true);
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // helper waktu
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  };

  // ── ACTION NAVIGATION ──
  const handleAction = (text) => {
    if (text === 'Ya, siap screening') {
        onNavigate?.('screening');
    } 
    else if (text === 'Ya, lihat riwayat') {
        onNavigate?.('history');
    }
    else if (text === 'Mau screening') {
        setTimeout(() => {
        onNavigate?.('screening');
        }, 1500);
    }
    };

  // ── OPTION CLICK ──
  const handleOptionClick = (text) => {
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text,
      time: getTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botMsg = null;

    const lower = text.toLowerCase();

    if (lower.includes('riwayat')) {
    botMsg = {
        text: 'Kamu mau lihat riwayat screening sekarang?',
        options: ['Ya, lihat riwayat', 'Nanti saja']
    };
    } 
    else if (lower.includes('screening')) {
    botMsg = {
        text: 'Hava akan mengarahkan kamu ke halaman screening stress, kamu siap?',
        options: ['Ya, siap screening', 'Nanti saja']
    };
    } 
    else if (lower.includes('cerita')) {
    botMsg = {
        text: 'Aku siap dengerin cerita kamu 😊'
    };
    } 
    else if (lower === 'nanti saja') {
    botMsg = {
        text: 'Baik, kita lanjut ngobrol saja ya 😊'
    };
    }

      setIsTyping(false);

      if (botMsg) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'bot',
            text: botMsg.text,
            options: botMsg.options,
            time: getTime()
          }
        ]);
      }

      handleAction(text);

    }, 1200);
  };

  // ── SEND MANUAL ──
  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: input,
      time: getTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Aku mengerti 😊 bisa ceritakan lebih lanjut?',
          time: getTime()
        }
      ]);
    }, 1200);
  };

  // ── INIT CHAT ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: 1,
          type: 'bot',
          text: 'Halo Adinda, aku Hava!',
          time: getTime()
        },
        {
          id: 2,
          type: 'bot',
          text: 'Apa yang bisa aku bantu hari ini?',
          time: getTime(),
          options: ['Mau cerita', 'Mau screening', 'Mau cek riwayat screening']
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
                        {opt}
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