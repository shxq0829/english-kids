import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useSpeech } from '../hooks/useSpeech';

export default function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { speak } = useSpeech();

  const handleStart = () => {
    speak('Hello!', 'en');
    navigate('/alphabet');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-8 gap-6">
      {/* Mascot area */}
      <div className="relative">
        {/* Blocky mascot */}
        <div className="w-32 h-32 bg-kids-red rounded-[28px] border-[4px] border-black/10 flex items-center justify-center shadow-xl animate-float"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <div className="text-center">
            <div className="text-5xl">🧱</div>
            <div className="text-xs font-extrabold text-white mt-1">BLOCKY</div>
          </div>
        </div>
        {/* Eyes */}
        <div className="absolute top-8 left-8 w-4 h-4 bg-white rounded-full shadow-inner" />
        <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full shadow-inner" />
      </div>

      {/* Speech bubble */}
      <div className="bg-white rounded-3xl px-6 py-4 shadow-lg relative max-w-xs border-2 border-black/5">
        <div className="absolute -top-3 left-10 w-6 h-6 bg-white border-l-2 border-t-2 border-black/5 rotate-45" />
        <p className="text-lg font-bold text-kids-text">{t('home.mascotSay')}</p>
      </div>

      <h1 className="text-4xl font-extrabold text-kids-text text-center leading-tight animate-slide-up">
        {t('home.title')}
      </h1>

      <p className="text-xl text-kids-text/60 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {t('home.subtitle')}
      </p>

      {/* Start button */}
      <button
        onClick={handleStart}
        className="mt-4 px-12 py-5 bg-kids-yellow text-kids-text text-2xl font-extrabold rounded-3xl
          card-shadow border-[3px] border-black/10 active:scale-95 transition-all
          animate-bounce-in hover:animate-wiggle"
      >
        🌟 {t('home.startBtn')}
      </button>

      {/* Decorative blocks */}
      <div className="flex gap-2 mt-2 opacity-30">
        {['❤️', '💙', '💛', '💚', '🧡', '💜'].map((color, i) => (
          <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
            {color}
          </span>
        ))}
      </div>
    </div>
  );
}
