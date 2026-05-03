import { useEffect, useState } from 'react';
import instructionBg from '../../assets/instructionbg.png';
import { getScreeningQuestions } from '../../services/adminApi';

const DEFAULT_QUESTIONS = [
  "Dalam satu bulan terakhir, seberapa sering kamu merasa kesulitan mengendalikan hal-hal penting dalam kehidupan perkuliahanmu?",
  "Seberapa sering kamu merasa gelisah atau cemas berlebihan mengenai tugas-tugas yang belum selesai?",
  "Seberapa sering kamu merasa tidak mampu menangani tanggung jawab yang diberikan di organisasi atau kelas?",
  "Seberapa sering kamu merasa frustrasi karena hal-hal di luar kendalimu mengganggu aktivitasmu?",
  "Seberapa sering kamu merasa kesulitan berkonsentrasi pada pelajaran atau pekerjaan karena pikiranmu kacau?",
  "Seberapa sering kamu merasa bahwa masalahmu menumpuk hingga tidak bisa diatasi?",
  "Seberapa sering kamu merasa lelah secara emosional akibat tuntutan perkuliahan?",
  "Seberapa sering kamu merasa kehilangan motivasi untuk mengerjakan tugas atau kegiatan yang biasanya kamu sukai?",
  "Seberapa sering kamu merasa sulit tidur karena memikirkan tanggung jawab perkuliahanmu?",
  "Seberapa sering kamu merasa bahwa tekanan dari perkuliahan membuatmu sulit menikmati waktu luangmu?",
];

const normalizeQuestion = (question, index) => {
  if (typeof question === 'string') {
    return {
      id_question: `default-${index + 1}`,
      question_text: question,
      weight: 1,
      sort_order: index + 1,
      is_active: true,
    };
  }

  const weight = Number(question?.weight);

  return {
    id_question: question?.id_question || `question-${index + 1}`,
    question_text: question?.question_text || question?.text || DEFAULT_QUESTIONS[index] || `Pertanyaan ${index + 1}`,
    weight: Number.isFinite(weight) ? Math.min(Math.max(Math.trunc(weight), 1), 4) : 1,
    sort_order: Number.isFinite(Number(question?.sort_order)) ? Number(question.sort_order) : index + 1,
    is_active: question?.is_active ?? true,
  };
};

const OPTIONS = [
  { label: "Tidak Pernah", value: 0 },
  { label: "Jarang",       value: 1 },
  { label: "Kadang-kadang",value: 2 },
  { label: "Sering",       value: 3 },
  { label: "Selalu",       value: 4 },
];

const shuffleArray = (items = []) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [next[i], next[randomIndex]] = [next[randomIndex], next[i]];
  }
  return next;
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Screening = ({ onBack, onFinish }) => {
  const [step, setStep]           = useState('instruction'); // 'instruction' | 'quiz'
  const [currentQ, setCurrentQ]   = useState(0);
  const [scores, setScores]       = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS.map(normalizeQuestion));
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState('');

  const handleStart = () => setStep('quiz');

  useEffect(() => {
    let active = true;

    const loadQuestions = async () => {
      try {
        setLoadingQuestions(true);
        const result = await getScreeningQuestions();
        const apiQuestions = Array.isArray(result?.questions) ? result.questions : [];

        if (!active) {
          return;
        }

        if (apiQuestions.length) {
          const normalized = apiQuestions
            .map((question, index) => normalizeQuestion(question, index))
            .sort((a, b) => {
              if (a.sort_order !== b.sort_order) {
                return a.sort_order - b.sort_order;
              }
              return String(a.id_question).localeCompare(String(b.id_question));
            });

          setQuestions(shuffleArray(normalized));
          setQuestionError('');
        } else {
          setQuestions(shuffleArray(DEFAULT_QUESTIONS.map(normalizeQuestion)));
          setQuestionError('Belum ada pertanyaan di database, jadi Hava memakai pertanyaan bawaan dulu.');
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setQuestions(shuffleArray(DEFAULT_QUESTIONS.map(normalizeQuestion)));
        setQuestionError('Gagal memuat pertanyaan dari backend, jadi Hava memakai pertanyaan bawaan dulu.');
      } finally {
        if (active) {
          setLoadingQuestions(false);
        }
      }
    };

    loadQuestions();

    return () => {
      active = false;
    };
  }, []);

  const activeQuestions = questions.length ? questions : DEFAULT_QUESTIONS.map(normalizeQuestion);

  const handleNext = () => {
    if (selectedOpt === null) return;
    const currentQuestion = activeQuestions[currentQ];
    const questionWeight = currentQuestion?.weight || 1;
    const weightedScore = selectedOpt * questionWeight;
    const answerEntry = {
      id_question: currentQuestion?.id_question,
      question_text: currentQuestion?.question_text,
      selected_value: selectedOpt,
      weight: questionWeight,
      score: weightedScore,
    };
    const newScores = [...scores, answerEntry];
    setScores(newScores);
    setSelectedOpt(null);
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      const totalScore = newScores.reduce((sum, item) => sum + item.score, 0);
      const totalPossibleScore = activeQuestions.reduce((sum, item) => sum + (Number(item.weight) || 1) * 4, 0);
      onFinish?.({
        score: totalScore,
        totalScore: totalPossibleScore || 40,
        answers: newScores,
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .sc-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        /* outer wrapper — fills MobileContainer, bg is FIXED via background-attachment */
        .sc-root {
          position: relative;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;

          background-image: url(${instructionBg});
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
        }

        .sc-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.6); /* atur 0.4–0.7 */
          z-index: 0;
        }
          
        /* fixed bg layer — sits inside the scroll container but doesn't scroll */
        .sc-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          z-index: 0;
          pointer-events: none;
          opacity: 0.35;
        }

        /* everything on top of bg */
        .sc-content {
          position: relative;
          z-index: 1;
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* back button */
        .sc-back {
          display: inline-flex; align-items: center; gap: 5px;
          background: none; border: none; cursor: pointer;
          color: #3C7A92; font-size: 13px; font-weight: 600;
          padding: 0; font-family: 'Poppins', sans-serif;
        }

        /* instruction step cards */
        .sc-step-card {
          background: #f0f0f0;
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        /* quiz option */
        .sc-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Poppins', sans-serif;
        }
        .sc-option.selected {
          border-color: #3C7A92;
          background: #EAF4F7;
        }
        .sc-option:active { transform: scale(0.98); }

        /* primary button */
        .sc-btn {
          width: 100%; padding: 14px 0;
          background: #3C7A92; color: #fff;
          border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          cursor: pointer; transition: opacity 0.15s, transform 0.15s;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 6px 18px rgba(60,122,146,0.30);
        }
        .sc-btn:disabled { opacity: 0.38; cursor: not-allowed; }
        .sc-btn:active:not(:disabled) { transform: scale(0.98); }

        .sc-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="sc-root sc-scroll">
        <div className="sc-content">

          {/* ── BACK BUTTON (always visible) ── */}
          <div style={{ padding: '18px 22px 0' }}>
            <button className="sc-back" onClick={onBack}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 11L1 6L6 1" stroke="#3C7A92" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali ke Beranda
            </button>
          </div>

          {/* ══════════════════════════════════
               STEP 1 — INSTRUCTION
          ══════════════════════════════════ */}
          {step === 'instruction' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 22px 32px' }}>

              {/* Badge */}
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#BDE8F5', color: '#3C7A92',
                  padding: '5px 14px', borderRadius: 999,
                  fontSize: 11, fontWeight: 600,
                }}>
                  <span style={{ fontSize: 8 }}>●</span> Sebelum Mulai
                </span>
              </div>

              {/* Title */}
              <h1 style={{ margin: '0 0 10px', fontSize: 30, fontWeight: 800, color: '#3C7A92', lineHeight: 1.2 }}>
                Screening Stress<br />Hanya 5 Menit
              </h1>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>
                Jawab 10 pertanyaan singkat untuk mengetahui tingkat stresmu saat ini.
              </p>

              {/* Step cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { n: 1, t: 'Jawab Jujur', d: 'Tidak ada jawaban benar atau salah. Jawab sesuai kondisimu sebenarnya.' },
                  { n: 2, t: 'Pilih yang paling sesuai', d: 'Setiap pertanyaan punya 5 pilihan dari "Tidak pernah" hingga "Selalu".' },
                  { n: 3, t: 'Lihat hasilmu', d: 'Setelah selesai, kamu akan tahu level stresmu dan mendapat rekomendasi.' },
                ].map(item => (
                  <div key={item.n} className="sc-step-card">
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#3C7A92', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, flexShrink: 0,
                    }}>
                      {item.n}
                    </div>
                    <div>
                      <p style={{ margin: '2px 0 4px', fontSize: 13.5, fontWeight: 700, color: '#1e293b' }}>
                        {item.t}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info box */}
              <div style={{
                background: '#E1F0F6', borderRadius: 14,
                border: '1px solid #3C7A92',
                padding: '12px 16px', marginBottom: 28,
              }}>
                <p style={{ margin: 0, fontSize: 12, color: '#3C7A92', fontWeight: 500, lineHeight: 1.6 }}>
                  Jawaban kamu bersifat rahasia dan hanya digunakan untuk keperluan screening, bukan dibagikan ke pihak lain.
                </p>
                {questionError && (
                  <p style={{ margin: '8px 0 0', fontSize: 11.5, color: '#b45309', lineHeight: 1.5 }}>
                    {questionError}
                  </p>
                )}
              </div>

              {/* CTA */}
              <button className="sc-btn" onClick={handleStart} style={{ marginBottom: 20 }}>
                {loadingQuestions ? 'Menyiapkan Pertanyaan...' : 'Mulai Screening Stress'}
              </button>

            </div>
          )}

          {/* ══════════════════════════════════
               STEP 2 — QUIZ
          ══════════════════════════════════ */}
          {step === 'quiz' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 22px 32px' }}>

              {/* Quiz header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#3C7A92' }}>
                  Screening Stress
                </h2>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#3C7A92' }}>
                  Pertanyaan {currentQ + 1}/{activeQuestions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%', height: 6, background: '#dde6ea',
                borderRadius: 999, marginBottom: 18, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: 'linear-gradient(90deg, #5BB0C5, #3C7A92)',
                  width: `${((currentQ + 1) / Math.max(activeQuestions.length, 1)) * 100}%`,
                  transition: 'width 0.4s ease',
                }} />
              </div>

              {/* Question card */}
              <div style={{
                background: '#f0f0f0',
                borderRadius: 28,
                padding: '22px 20px 24px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>

                {/* Question text */}
                <p style={{
                  margin: '0 0 8px', fontSize: 14, fontWeight: 700,
                  color: '#3C7A92', lineHeight: 1.6,
                }}>
                  {activeQuestions[currentQ % activeQuestions.length]?.question_text}
                </p>

                {/* Hint */}
                <p style={{ margin: '0 0 18px', fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                  Jawab sesuai perasaanmu yang sebenarnya. Tidak ada jawaban benar salah.
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`sc-option${selectedOpt === opt.value ? ' selected' : ''}`}
                      onClick={() => setSelectedOpt(opt.value)}
                    >
                      {/* Radio circle */}
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: `2px solid ${selectedOpt === opt.value ? '#3C7A92' : '#cbd5e1'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'border-color 0.15s',
                      }}>
                        {selectedOpt === opt.value && (
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3C7A92' }} />
                        )}
                      </div>
                      <span style={{
                        fontSize: 13.5, fontWeight: 600,
                        color: selectedOpt === opt.value ? '#3C7A92' : '#64748b',
                      }}>
                        {opt.label} ({opt.value})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <button
                  className="sc-btn"
                  onClick={handleNext}
                  disabled={selectedOpt === null}
                >
                  Berikutnya
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Screening;