import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { useSpeech } from '../hooks/useSpeech';
import { words } from '../data/words';

const CATEGORY_EMOJIS: Record<string, string> = {
  animals: '🐾', colors: '🎨', fruits: '🍎', numbers: '🔢', body: '👶', food: '🍕',
};

export default function Words() {
  const { t, lang } = useI18n();
  const { speak } = useSpeech();
  const [category, setCategory] = useState<string>('all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(
    () => category === 'all' ? words : words.filter(w => w.category === category),
    [category]
  );

  const current = filtered[index] || null;

  const goNext = () => {
    if (filtered.length === 0) return;
    setFlipped(false);
    setIndex((index + 1) % filtered.length);
    // Auto-speak on flip
    const next = filtered[(index + 1) % filtered.length];
    setTimeout(() => speak(next.en, 'en'), 200);
  };

  const goPrev = () => {
    if (filtered.length === 0) return;
    setFlipped(false);
    setIndex((index - 1 + filtered.length) % filtered.length);
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && current) {
      speak(current.en, 'en');
    }
  };

  const categories = ['all', ...Object.keys(CATEGORY_EMOJIS)];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-kids-text text-center mt-2">{t('words.title')}</h2>
      <p className="text-center text-kids-text/50 text-sm mb-3">{t('words.subtitle')}</p>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setIndex(0); setFlipped(false); }}
            className={`
              shrink-0 px-4 py-2 rounded-2xl text-sm font-extrabold transition-all active:scale-90
              border-2 border-black/5
              ${category === cat
                ? 'bg-kids-yellow text-kids-text shadow-md'
                : 'bg-white text-kids-text/60'
              }
            `}
          >
            {cat === 'all'
              ? lang === 'zh' ? '🌈 全部' : '🌈 All'
              : `${CATEGORY_EMOJIS[cat]} ${t(`words.categories.${cat}` as any).split(' ').slice(1).join(' ') || cat}`
            }
          </button>
        ))}
      </div>

      {/* Card */}
      {current ? (
        <div className="flex flex-col items-center gap-4">
          {/* Counter */}
          <div className="text-sm font-bold text-kids-text/40">
            {index + 1} / {filtered.length}
          </div>

          {/* Flashcard */}
          <button
            onClick={toggleFlip}
            className={`
              w-full aspect-[4/3] rounded-3xl flex flex-col items-center justify-center
              card-shadow border-[3px] border-black/10 transition-all duration-300
              active:scale-95 relative overflow-hidden
              ${flipped ? 'bg-kids-purple' : 'bg-white'}
            `}
            style={{ perspective: '1000px' }}
          >
            <div className={`
              text-center transition-all duration-300
              ${flipped ? 'animate-bounce-in' : ''}
            `}>
              <span className={`text-8xl block ${flipped ? 'mb-2' : 'mb-4'}`}>
                {current.emoji}
              </span>
              <span className={`block text-3xl font-extrabold ${flipped ? 'text-white' : 'text-kids-text'}`}>
                {flipped ? current.zh : current.en}
              </span>
              {flipped && (
                <span className="block text-lg text-white/70 mt-1 font-bold">
                  {current.en}
                </span>
              )}
            </div>

            {/* Tap hint */}
            <div className="absolute bottom-3 text-xs font-bold text-kids-text/30">
              {flipped ? '👆' : '👆 ' + (lang === 'zh' ? '点击翻面' : 'Tap to flip')}
            </div>
          </button>

          {/* Navigation */}
          <div className="flex gap-4 w-full">
            <button
              onClick={goPrev}
              className="flex-1 py-4 bg-white text-kids-text text-xl font-extrabold rounded-2xl
                card-shadow border-2 border-black/5 active:scale-90 transition-all"
            >
              ←
            </button>
            <button
              onClick={() => speak(current.en, 'en')}
              className="flex-1 py-4 bg-kids-blue text-white text-xl font-extrabold rounded-2xl
                card-shadow border-[3px] border-blue-600 active:scale-90 transition-all"
            >
              🔊
            </button>
            <button
              onClick={goNext}
              className="flex-1 py-4 bg-white text-kids-text text-xl font-extrabold rounded-2xl
                card-shadow border-2 border-black/5 active:scale-90 transition-all"
            >
              →
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-kids-text/40 py-20">
          {t('common.empty')}
        </div>
      )}
    </div>
  );
}
