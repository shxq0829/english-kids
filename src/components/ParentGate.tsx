import { useState } from 'react';
import { useI18n } from '../i18n';

interface ParentGateProps {
  onPass: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  { q: '3 + 7 = ?', a: '10' },
  { q: '5 + 4 = ?', a: '9' },
  { q: '6 + 2 = ?', a: '8' },
  { q: '2 + 8 = ?', a: '10' },
];

export default function ParentGate({ onPass, onBack }: ParentGateProps) {
  const { t } = useI18n();
  const [question] = useState(() => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (answer.trim() === question.a) {
      setError(false);
      onPass();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-6">
      {/* Gate icon */}
      <div className="text-6xl animate-float">🔐</div>

      <h2 className="text-3xl font-extrabold text-kids-text">
        {t('settings.parentGate')}
      </h2>

      <p className="text-xl text-kids-text/70">
        {t('settings.gateQuestion')}
      </p>

      {/* Question display */}
      <div className="bg-white blocky p-6 shadow-lg">
        <span className="text-4xl font-extrabold text-kids-purple">{question.q}</span>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', '✓'].map((key) => (
          <button
            key={key}
            onClick={() => {
              if (key === '✓') { handleSubmit(); return; }
              if (key === '←') { setAnswer(a => a.slice(0, -1)); setError(false); return; }
              if (answer.length < 3) { setAnswer(a => a + key); setError(false); }
            }}
            className={`
              h-16 text-2xl font-extrabold rounded-2xl border-[3px] border-black/10
              active:scale-95 transition-transform
              ${key === '✓'
                ? 'col-span-1 bg-kids-green text-white'
                : key === '←'
                ? 'col-span-1 bg-kids-red text-white'
                : 'bg-white hover:bg-kids-yellow/20'
              }
            `}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Answer display */}
      <div className={`text-3xl font-extrabold h-10 ${error ? 'text-kids-red animate-shake' : 'text-kids-text'}`}>
        {error ? t('settings.gateWrong') : answer || ' '}
      </div>

      <button
        onClick={onBack}
        className="text-kids-blue text-lg font-bold mt-2"
      >
        {t('common.back')}
      </button>
    </div>
  );
}
