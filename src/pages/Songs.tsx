import { useState } from 'react';
import { useI18n } from '../i18n';
import { useSpeech } from '../hooks/useSpeech';
import { songs } from '../data/songs';

const SONG_COLORS: Record<string, string> = {
  'kids-yellow': '#FFD84B', 'kids-blue': '#4B9CFF', 'kids-pink': '#FF7EB3',
  'kids-green': '#4BE07A', 'kids-orange': '#FF9B4B', 'kids-brown': '#C9A96E',
  'kids-purple': '#B44BFF', 'kids-red': '#FF4B4B',
};

export default function Songs() {
  const { t, lang } = useI18n();
  const { singLyrics, singingLine, stop } = useSpeech();
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<'play' | 'singalong' | null>(null);

  const isPlaying = singingLine >= 0;
  const song = selected !== null ? songs[selected] : null;

  const handlePlay = () => {
    if (!song) return;
    stop();
    setMode('play');
    setTimeout(() => singLyrics(song.lyrics, 'en', false), 100);
  };

  const handleSingAlong = () => {
    if (!song) return;
    stop();
    setMode('singalong');
    setTimeout(() => singLyrics(song.lyrics, 'en', true), 100);
  };

  const handleStop = () => {
    stop();
    setMode(null);
  };

  const lyricsLines = song?.lyrics.split('\n').filter(l => l.trim()) || [];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-kids-text text-center mt-2">{t('songs.title')}</h2>
      <p className="text-center text-kids-text/50 text-sm mb-6">{t('songs.subtitle')}</p>

      {selected !== null && song ? (
        /* Song detail */
        <div className="animate-slide-up">
          <button onClick={() => { stop(); setSelected(null); setMode(null); }} className="mb-4 text-kids-blue font-bold text-lg">
            {t('common.back')}
          </button>

          <div
            className="w-full aspect-square rounded-3xl flex flex-col items-center justify-center mb-4 shadow-xl border-[3px] border-black/10"
            style={{ backgroundColor: SONG_COLORS[song.color] || '#FFD84B' }}
          >
            <span className="text-8xl">{song.emoji}</span>
            <span className="text-2xl font-extrabold text-white mt-2 text-center px-4">
              {lang === 'zh' ? song.titleZh : song.title}
            </span>
          </div>

          {/* Play buttons */}
          <div className="flex gap-3 mb-4">
            {!isPlaying ? (
              <>
                <button
                  onClick={handlePlay}
                  className="flex-1 py-4 bg-kids-blue text-white text-xl font-extrabold rounded-2xl
                    card-shadow border-[3px] border-blue-600 active:scale-95 transition-all"
                >
                  🔊 {lang === 'zh' ? '播放' : 'Play'}
                </button>
                <button
                  onClick={handleSingAlong}
                  className="flex-1 py-4 bg-kids-green text-white text-xl font-extrabold rounded-2xl
                    card-shadow border-[3px] border-green-600 active:scale-95 transition-all"
                >
                  🎤 {lang === 'zh' ? '跟唱' : 'Sing'}
                </button>
              </>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 py-4 bg-kids-red text-white text-xl font-extrabold rounded-2xl
                  card-shadow border-[3px] border-red-600 active:scale-95 transition-all animate-pulse"
              >
                ⏹ {lang === 'zh' ? '停止' : 'Stop'}
              </button>
            )}
          </div>

          {isPlaying && (
            <p className="text-center text-sm text-kids-blue font-bold mb-2">
              {mode === 'singalong' ? '🎤 ' + (lang === 'zh' ? '跟唱模式：读一行，你跟唱一行' : 'Sing Along: Repeat after each line') : '🔊 ' + (lang === 'zh' ? '播放中...' : 'Playing...')}
            </p>
          )}

          {/* Lyrics with highlighting */}
          <div className="bg-white rounded-2xl p-6 shadow-inner border-2 border-black/5 text-lg font-medium text-kids-text leading-relaxed">
            <div className="text-center mb-2 text-2xl">🎤</div>
            {lyricsLines.map((line, i) => (
              <p
                key={i}
                className={`py-1 px-2 rounded-lg transition-all ${
                  singingLine === i
                    ? 'bg-kids-yellow/30 text-kids-text font-extrabold scale-105 -mx-2 px-4'
                    : ''
                }`}
              >
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
      ) : (
        /* Song list */
        <div className="flex flex-col gap-3">
          {songs.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(i)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl card-shadow border-2 border-black/5 active:scale-95 transition-all text-left"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                style={{ backgroundColor: SONG_COLORS[s.color] || '#FFD84B' }}
              >
                {s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-kids-text truncate">
                  {lang === 'zh' ? s.titleZh : s.title}
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
