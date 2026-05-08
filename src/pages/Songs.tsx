import { useState } from 'react';
import { useI18n } from '../i18n';
import { songs } from '../data/songs';

const SONG_COLORS: Record<string, string> = {
  'kids-yellow': '#FFD84B',
  'kids-blue': '#4B9CFF',
  'kids-pink': '#FF7EB3',
  'kids-green': '#4BE07A',
  'kids-orange': '#FF9B4B',
};

export default function Songs() {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-kids-text text-center mt-2">{t('songs.title')}</h2>
      <p className="text-center text-kids-text/50 text-sm mb-6">{t('songs.subtitle')}</p>

      {selected !== null ? (
        /* Song detail */
        <div className="animate-slide-up">
          <button onClick={() => setSelected(null)} className="mb-4 text-kids-blue font-bold text-lg">
            {t('common.back')}
          </button>

          <div
            className="w-full aspect-square rounded-3xl flex flex-col items-center justify-center mb-4 shadow-xl border-[3px] border-black/10"
            style={{ backgroundColor: SONG_COLORS[songs[selected].color] || '#FFD84B' }}
          >
            <span className="text-8xl">{songs[selected].emoji}</span>
            <span className="text-2xl font-extrabold text-white mt-2 text-center px-4">
              {lang === 'zh' ? songs[selected].titleZh : songs[selected].title}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-inner border-2 border-black/5 whitespace-pre-line text-lg font-medium text-kids-text leading-relaxed">
            <div className="text-center mb-2 text-2xl">🎤</div>
            {songs[selected].lyrics}
          </div>

          <p className="text-center text-xs text-kids-text/30 mt-4">
            💡 {lang === 'zh' ? '跟着一起唱吧！' : 'Sing along with your child!'}
          </p>
        </div>
      ) : (
        /* Song list */
        <div className="flex flex-col gap-3">
          {songs.map((song, i) => (
            <button
              key={song.id}
              onClick={() => setSelected(i)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl card-shadow border-2 border-black/5 active:scale-95 transition-all text-left"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                style={{ backgroundColor: SONG_COLORS[song.color] || '#FFD84B' }}
              >
                {song.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-kids-text truncate">
                  {lang === 'zh' ? song.titleZh : song.title}
                </div>
                <div className="text-xs text-kids-text/40 mt-0.5">
                  {lang === 'zh' ? '点击查看歌词' : 'Tap to see lyrics'}
                </div>
              </div>
              <span className="text-xl">▶️</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
