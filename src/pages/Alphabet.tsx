import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { useSpeech } from '../hooks/useSpeech';
import { letters } from '../data/letters';
import StarBurst from '../components/StarBurst';

const LETTER_COLORS: Record<string, string> = {
  kids_red: '#FF4B4B', kids_blue: '#4B9CFF', kids_yellow: '#FFD84B',
  kids_green: '#4BE07A', kids_orange: '#FF9B4B', kids_purple: '#B44BFF',
  kids_pink: '#FF7EB3', kids_brown: '#C9A96E',
};

export default function Alphabet() {
  const { t, lang } = useI18n();
  const { speakLetter, speakWord } = useSpeech();
  const [selected, setSelected] = useState<string | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const touchStartX = useRef(0);

  const letterKeys = Object.keys(letters);
  const data = selected ? letters[selected as keyof typeof letters] : null;

  const goToPrevLetter = useCallback(() => {
    const idx = currentIndex > 0 ? currentIndex - 1 : letterKeys.length - 1;
    const letter = letterKeys[idx];
    setCurrentIndex(idx);
    setSelected(letter);
    speakLetter(letter);
    setShowBurst(true);
  }, [currentIndex]);

  const goToNextLetter = useCallback(() => {
    const idx = currentIndex < letterKeys.length - 1 ? currentIndex + 1 : 0;
    const letter = letterKeys[idx];
    setCurrentIndex(idx);
    setSelected(letter);
    speakLetter(letter);
    setShowBurst(true);
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextLetter();
      } else {
        goToPrevLetter();
      }
    }
  };

  useEffect(() => {
    if (!selected || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    // Draw the letter as a guide
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold 180px "Nunito", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E5E5E5';
    ctx.fillText(selected, canvas.width / 4, canvas.height / 4);
  }, [selected, isTracing]);

  const getCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#FF4B4B';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
    const ctx = ctxRef.current;
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    if (!selected || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold 180px "Nunito", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E5E5E5';
    ctx.fillText(selected, canvas.width / 4, canvas.height / 4);
  };

  return (
    <div className="p-4">
      <StarBurst show={showBurst} onDone={() => setShowBurst(false)} />

      {!selected ? (
        <>
          <h2 className="text-3xl font-extrabold text-kids-text text-center mt-2">{t('alphabet.title')}</h2>
          <p className="text-center text-kids-text/50 text-sm mb-4">{t('alphabet.subtitle')}</p>

          <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-w-lg mx-auto">
            {letterKeys.map((letter) => {
              const d = letters[letter as keyof typeof letters];
              const bgColor = LETTER_COLORS[d.color] || '#FFD84B';
              return (
                <button
                  key={letter}
                  onClick={() => {
                    setSelected(letter);
                    setCurrentIndex(letterKeys.indexOf(letter));
                    speakLetter(letter);
                    setShowBurst(true);
                  }}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center
                    card-shadow border-[2px] border-black/10 active:scale-90 transition-all
                    text-white font-extrabold"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-3xl">{letter}</span>
                  <span className="text-[10px] opacity-70">{d.emoji}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* Detail view */
        <div 
          className="max-w-md mx-auto animate-slide-up"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setSelected(null)}
            className="mb-4 text-kids-blue font-bold text-lg"
          >
            {t('common.back')}
          </button>

          {/* Navigation arrows */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevLetter}
              className="p-3 bg-white rounded-full shadow-md border-2 border-black/10 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-kids-blue" />
            </button>
            <span className="text-sm text-kids-text/50 font-bold">
              {currentIndex + 1} / {letterKeys.length}
            </span>
            <button
              onClick={goToNextLetter}
              className="p-3 bg-white rounded-full shadow-md border-2 border-black/10 active:scale-90 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-kids-blue" />
            </button>
          </div>

          {/* Letter display */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl font-extrabold text-white shadow-xl border-[3px] border-black/10"
              style={{ backgroundColor: LETTER_COLORS[data?.color || 'kids-yellow'] || '#FFD84B' }}
            >
              {selected}
            </div>
            <div>
              <div className="text-4xl">{data?.emoji}</div>
              <div className="text-xl font-bold text-kids-text">
                {lang === 'zh' ? data?.animalZh : data?.animal}
              </div>
            </div>
          </div>

          {/* Listen button */}
          <button
            onClick={() => {
              speakLetter(selected);
              speakWord(data?.animal || selected, 'en');
              // Also say Chinese version after a delay
              if (lang === 'zh') {
                setTimeout(() => speakWord(data?.animalZh || '', 'zh'), 1500);
              }
            }}
            className="w-full py-4 bg-kids-blue text-white text-xl font-extrabold rounded-2xl mb-3
              card-shadow border-[3px] border-blue-600 active:scale-95 transition-all"
          >
            {t('alphabet.listen')}
          </button>

          {/* Trace toggle */}
          <button
            onClick={() => setIsTracing(!isTracing)}
            className={`w-full py-4 text-xl font-extrabold rounded-2xl mb-3
              card-shadow border-[3px] active:scale-95 transition-all
              ${isTracing ? 'bg-kids-orange text-white border-orange-600' : 'bg-kids-green text-white border-green-600'}`}
          >
            {isTracing ? t('alphabet.clear') : t('alphabet.trace')}
          </button>

          {/* Tracing canvas */}
          {isTracing && (
            <div className="bg-white rounded-2xl p-4 shadow-inner border-2 border-black/5">
              <canvas
                ref={canvasRef}
                className="w-full h-48 rounded-xl bg-white touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={clearCanvas}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95 transition-all"
                >
                  {t('alphabet.clear')}
                </button>
                <button
                  onClick={() => {
                    clearCanvas();
                    setIsTracing(false);
                  }}
                  className="flex-1 py-3 bg-kids-purple text-white font-bold rounded-xl active:scale-95 transition-all"
                >
                  ✓ {lang === 'zh' ? '完成' : 'Done'}
                </button>
              </div>
            </div>
          )}

          {/* Letter variants */}
          <div className="flex gap-3 mt-3 text-center">
            <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 border-black/5">
              <div className="text-xs text-kids-text/50 font-bold">{t('alphabet.uppercase')}</div>
              <div className="text-4xl font-extrabold text-kids-text">{selected}</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 border-black/5">
              <div className="text-xs text-kids-text/50 font-bold">{t('alphabet.lowercase')}</div>
              <div className="text-4xl font-extrabold text-kids-text">{selected.toLowerCase()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
