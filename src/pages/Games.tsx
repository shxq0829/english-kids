import { useState, useMemo, useCallback, useEffect } from 'react';
import { useI18n } from '../i18n';
import { useSpeech } from '../hooks/useSpeech';
import { words } from '../data/words';
import StarBurst from '../components/StarBurst';

type Game = 'menu' | 'listenpick' | 'memory';

// ---------- LISTEN & PICK ----------
function ListenPick({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showBurst, setShowBurst] = useState(false);

  const gameWords = useMemo(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, []);

  const options = useMemo(() => {
    if (round >= gameWords.length) return [];
    const correct = gameWords[round];
    const others = words.filter(w => w.en !== correct.en).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }, [round, gameWords]);

  useEffect(() => {
    if (round < gameWords.length && gameWords[round]) {
      setTimeout(() => speak(gameWords[round].en, 'en'), 300);
    }
  }, [round]);

  const handlePick = (word: typeof words[0]) => {
    if (feedback) return;
    const correct = gameWords[round];
    if (word.en === correct.en) {
      setFeedback('correct');
      setScore(s => s + 1);
      setShowBurst(true);
      setTimeout(() => {
        setFeedback(null);
        setShowBurst(false);
        setRound(r => r + 1);
      }, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  if (round >= gameWords.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <StarBurst show={true} />
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-extrabold text-kids-text">
          {t('common.goodJob')}
        </h2>
        <p className="text-xl text-kids-text/60">
          {score} / {gameWords.length}
        </p>
        <button
          onClick={onBack}
          className="px-8 py-4 bg-kids-yellow text-kids-text text-xl font-extrabold rounded-2xl card-shadow border-2 border-black/5 active:scale-95"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-4">
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />
      
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-kids-blue font-bold">{t('common.back')}</button>
        <div className="flex-1 text-center text-lg font-extrabold">
          ⭐ {score} / {round}
        </div>
        <div className="text-sm font-bold text-kids-text/30">{round + 1}/{gameWords.length}</div>
      </div>

      <h2 className="text-2xl font-extrabold text-center mb-1">{t('games.listenPick.title')}</h2>
      <p className="text-center text-kids-text/50 text-sm mb-6">{t('games.listenPick.desc')}</p>

      {/* Speak button */}
      <div className="text-center mb-6">
        <button
          onClick={() => speak(gameWords[round]?.en || '', 'en')}
          className="w-20 h-20 rounded-full bg-kids-blue text-white text-3xl shadow-xl border-[3px] border-blue-600 active:scale-90 transition-all animate-pulse-glow"
        >
          🔊
        </button>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((word, i) => (
          <button
            key={i}
            onClick={() => handlePick(word)}
            disabled={!!feedback}
            className={`
              aspect-square rounded-2xl flex flex-col items-center justify-center gap-2
              card-shadow border-[3px] transition-all active:scale-90
              ${feedback === 'correct' && word.en === gameWords[round].en
                ? 'bg-kids-green border-green-600 animate-bounce-in'
                : feedback === 'wrong' && word.en !== gameWords[round].en
                ? 'bg-gray-100 border-gray-200'
                : 'bg-white border-black/10'
              }
              ${feedback ? 'pointer-events-none' : ''}
            `}
          >
            <span className="text-5xl">{word.emoji}</span>
            <span className="text-sm font-bold text-kids-text/60">{word.zh}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`text-center mt-4 text-2xl font-extrabold animate-bounce-in ${feedback === 'correct' ? 'text-kids-green' : 'text-kids-red animate-shake'}`}>
          {feedback === 'correct' ? t('games.listenPick.correct') : t('games.listenPick.wrong')}
        </div>
      )}
    </div>
  );
}

// ---------- MEMORY MATCH ----------
interface Card {
  id: number;
  emoji: string;
  word: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryMatch({ onBack }: { onBack: () => void }) {
  const { t, lang } = useI18n();
  const { speak } = useSpeech();
  const [cards, setCards] = useState<Card[]>([]);
  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [pairs, setPairs] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  const initGame = useCallback(() => {
    const selected = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
    const pairs: Card[] = [];
    selected.forEach((w, i) => {
      pairs.push({ id: i * 2, emoji: w.emoji, word: w.en, flipped: false, matched: false });
      pairs.push({ id: i * 2 + 1, emoji: w.emoji, word: w.en, flipped: false, matched: false });
    });
    setCards(pairs.sort(() => Math.random() - 0.5));
    setFirstPick(null);
    setLocked(false);
    setPairs(0);
  }, []);

  useEffect(() => { initGame(); }, []);

  const handleFlip = (id: number) => {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    speak(card.word, 'en');

    if (firstPick === null) {
      setFirstPick(id);
    } else {
      setLocked(true);
      const first = newCards.find(c => c.id === firstPick)!;
      const current = newCards.find(c => c.id === id)!;

      if (first.emoji === current.emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstPick || c.id === id ? { ...c, matched: true } : c
          ));
          setFirstPick(null);
          setLocked(false);
          setPairs(p => {
            const newP = p + 1;
            if (newP === 6) {
              setShowBurst(true);
            }
            return newP;
          });
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstPick || c.id === id ? { ...c, flipped: false } : c
          ));
          setFirstPick(null);
          setLocked(false);
        }, 800);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-4">
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />

      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-kids-blue font-bold">{t('common.back')}</button>
        <div className="flex-1 text-right text-sm font-bold text-kids-text/50">
          {t('games.memory.pairs').replace('{n}', String(pairs))}
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-center mb-6">{t('games.memory.title')}</h2>

      <div className="grid grid-cols-3 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            disabled={card.matched}
            className={`
              aspect-square rounded-2xl flex items-center justify-center text-4xl
              transition-all duration-300 card-shadow border-[3px]
              ${card.flipped || card.matched
                ? 'bg-white border-kids-green rotate-0 shadow-green-100'
                : 'bg-kids-purple border-purple-700 text-white rotate-3 hover:rotate-0'
              }
              ${card.matched ? 'opacity-60 scale-90' : 'active:scale-95'}
            `}
          >
            {card.flipped || card.matched ? (
              <span className="animate-bounce-in">{card.emoji}</span>
            ) : (
              <span className="text-3xl font-extrabold">?</span>
            )}
          </button>
        ))}
      </div>

      {pairs === 6 && (
        <div className="text-center mt-6 animate-bounce-in">
          <div className="text-5xl mb-2">🎉</div>
          <div className="text-2xl font-extrabold text-kids-green">{t('common.goodJob')}</div>
          <button
            onClick={initGame}
            className="mt-4 px-8 py-3 bg-kids-yellow text-kids-text text-lg font-extrabold rounded-2xl card-shadow border-2 border-black/5 active:scale-95"
          >
            🔄 {lang === 'zh' ? '再玩一次' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- MAIN ----------
export default function Games() {
  const { t } = useI18n();
  const [game, setGame] = useState<Game>('menu');

  if (game === 'listenpick') return <ListenPick onBack={() => setGame('menu')} />;
  if (game === 'memory') return <MemoryMatch onBack={() => setGame('menu')} />;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-kids-text text-center mt-2">{t('games.title')}</h2>
      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={() => setGame('listenpick')}
          className="p-6 bg-white rounded-3xl card-shadow border-2 border-black/5 text-left active:scale-95 transition-all"
        >
          <div className="text-4xl mb-2">👂</div>
          <div className="text-xl font-extrabold text-kids-text">{t('games.listenPick.title')}</div>
          <div className="text-sm text-kids-text/50 mt-1">{t('games.listenPick.desc')}</div>
        </button>
        <button
          onClick={() => setGame('memory')}
          className="p-6 bg-white rounded-3xl card-shadow border-2 border-black/5 text-left active:scale-95 transition-all"
        >
          <div className="text-4xl mb-2">🧠</div>
          <div className="text-xl font-extrabold text-kids-text">{t('games.memory.title')}</div>
          <div className="text-sm text-kids-text/50 mt-1">{t('games.memory.desc')}</div>
        </button>
      </div>
    </div>
  );
}
