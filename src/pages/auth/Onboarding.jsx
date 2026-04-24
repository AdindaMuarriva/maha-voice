import { useState, useEffect, useRef } from 'react';
import bg1 from '../../assets/bg.png';
import bg2 from '../../assets/bg2.png';
import bg3 from '../../assets/bg3.png';
import robot1 from '../../assets/robot_full.png';
import robot2 from '../../assets/robot_onboarding2.png';
import robot3 from '../../assets/robot_onboarding3.png';

// ─────────────────────────────────────────────
// DATA STEPS
// ─────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    bg: bg1,
    robot: robot1,
    robotAlt: 'Hava melambaikan tangan',
    robotSize: '79%',
    showBack: false,
    title: 'Halo, kenalin aku',
    highlight: 'Hava!',
    desc: 'Teman digitalmu yang siap menemani dan mendengarkan kapan pun kamu butuh.',
    boldWord: null,
    primaryBtn: 'Lanjut',
    secondaryBtn: 'Lewati',
    secondaryAction: 'skip',
  },
  {
    id: 2,
    bg: bg2,
    robot: robot2,
    robotAlt: 'Hava duduk',
    robotSize: '69%',
    showBack: true,
    title: 'Lagi ngerasa',
    highlight: 'berat?',
    desc: 'Cerita sama Hava, kita cari tahu bareng lewat screening singkat.',
    boldWord: 'Hava',
    primaryBtn: 'Lanjut',
    secondaryBtn: 'Lewati',
    secondaryAction: 'skip',
  },
  {
    id: 3,
    bg: bg3,
    robot: robot3,
    robotAlt: 'Hava duduk pegang HP',
    robotSize: '80%',
    showBack: true,
    title: 'Yuk, mulai dari',
    highlight: 'sekarang!',
    desc: 'Langkah kecilmu menuju kondisi yang lebih baik dimulai dari sini.',
    boldWord: null,
    primaryBtn: 'Daftar Sekarang',
    secondaryBtn: 'Sudah Punya Akun? Masuk di sini',
    secondaryAction: 'login',
  },
];

// ─────────────────────────────────────────────
// HELPER — bold satu kata dalam kalimat
// ─────────────────────────────────────────────
const BoldDesc = ({ text, bold }) => {
  if (!bold || !text.includes(bold)) {
    return <span>{text}</span>;
  }
  const [before, after] = text.split(bold);
  return (
    <span>
      {before}
      <strong style={{ fontWeight: 700, color: '#1e293b' }}>{bold}</strong>
      {after}
    </span>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Onboarding = ({ onComplete, onLogin }) => {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'out'
  const [dir, setDir] = useState('forward');
  const [bubblePulse, setBubblePulse] = useState(true);
  const timerRef = useRef(null);

  const step = STEPS[idx];

  const navigate = (nextIdx, direction) => {
    if (phase === 'out') return;
    setDir(direction);
    setPhase('out');
    setTimeout(() => {
      setIdx(nextIdx);
      setPhase('in');
    }, 230);
  };

  const handleNext = () => {
    if (idx < STEPS.length - 1) navigate(idx + 1, 'forward');
    else onComplete?.();
  };

  const handleBack = () => {
    if (idx > 0) navigate(idx - 1, 'back');
  };

  const handleSecondary = () => {
    if (step.secondaryAction === 'login') onLogin?.();
    else onComplete?.();
  };

  // slide direction
  const outX = dir === 'forward' ? '-24px' : '24px';
  const contentStyle = {
    transition: 'opacity 0.23s ease, transform 0.23s ease',
    opacity: phase === 'out' ? 0 : 1,
    transform: phase === 'out' ? `translateX(${outX})` : 'translateX(0)',
  };

  return (
    <>
      {/* ── Inject Poppins + keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .ob-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        @keyframes ob-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes ob-bubble-in {
          from { opacity: 0; transform: scale(0.7) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ob-float   { animation: ob-float 3.4s ease-in-out infinite; }

        .ob-btn-primary {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .ob-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ob-btn-primary:active::after { opacity: 1; }
        .ob-btn-primary:active        { transform: scale(0.97); }

        .ob-dot-active {
          animation: none;
        }

        /* scrollbar hide for inner scroll if any */
        .ob-root::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="ob-root"
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── BG Image (crossfade) ── */}
        {STEPS.map((s, i) => (
          <img
            key={s.id}
            src={s.bg}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              transition: 'opacity 0.4s ease',
              opacity: i === idx ? 1 : 0,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        ))}

        {/* bottom fade so card blends nicely */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, transparent 55%)',
        }} />

        {/* ── Kembali ── */}
        <div style={{ position: 'relative', zIndex: 10, padding: '18px 22px 0' }}>
          {step.showBack ? (
            <button
              onClick={handleBack}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#0096a1', fontWeight: 600, fontSize: 15,
                padding: 5, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 11L1 6L6 1" stroke="#0096a1" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Kembali
            </button>
          ) : (
            /* spacer agar layout konsisten */
            <div style={{ height: 20 }} />
          )}
        </div>

        {/* ── Robot Area (centered, animated) ── */}
        <div
          style={{
            ...contentStyle,
            position: 'relative',
            zIndex: 10,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%', 
              height: '100%',
            }}
          >
            {/* floating wrapper */}
            <div className="ob-float flex items-center justify-center">
              <img
                src={step.robot}
                alt={step.robotAlt}
                draggable={false}
                style={{
                  width: step.robotSize,
                  maxWidth: 220,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 16px 28px rgba(0,80,100,0.18))',
                  userSelect: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Content Card ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            borderRadius: '36px 36px 0 0',
            padding: '28px 28px 26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.60)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderTop: '1px solid rgba(255,255,255,0.6)',
          }}
        >
          {/* Text block */}
          <div style={{ ...contentStyle, width: '100%', marginBottom: 20 }}>
            <h2 style={{
              margin: 0, fontSize: 30, fontWeight: 700,
              color: '#1e293b', lineHeight: 1.2,
            }}>
              {step.title}
            </h2>
            <h2 style={{
              margin: '2px 0 0', fontSize: 30, fontWeight: 800,
              color: '#0096a1', lineHeight: 1.2,
            }}>
              {step.highlight}
            </h2>
            <p style={{
              margin: '10px 0 0', fontSize: 13.5, fontWeight: 400,
              color: '#64748b', lineHeight: 1.65,
            }}>
              <BoldDesc text={step.desc} bold={step.boldWord} />
            </p>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 22 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 9,
                  borderRadius: 99,
                  transition: 'width 0.3s ease, background 0.3s ease',
                  width: i === idx ? 32 : 9,
                  background: i === idx ? '#0096a1' : '#cbd5e1',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Primary */}
            <button
              onClick={handleNext}
              className="ob-btn-primary"
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(90deg, #5BB0C5 0%, #2D5A66 100%)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.2,
                boxShadow: '0 6px 20px rgba(45,90,102,0.30)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                fontFamily: 'Poppins, sans-serif',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(45,90,102,0.45)';
                  e.currentTarget.style.filter = 'brightness(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,90,102,0.30)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'scale(0.97)';
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
              >{step.primaryBtn}
              </button>

            {/* Secondary */}
            <button
              onClick={handleSecondary}
              style={{
                width: '100%',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#0096a1',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: step.id === 3 ? 'underline' : 'none',
                textUnderlineOffset: 3,
                transition: 'opacity 0.15s',
                fontFamily: 'Poppins, sans-serif',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {step.secondaryBtn}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;