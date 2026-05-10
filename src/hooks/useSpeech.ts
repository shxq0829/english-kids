import { useCallback, useRef, useState } from 'react';

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [singingLine, setSingingLine] = useState(-1);

  const speak = useCallback((text: string, lang: 'en' | 'zh' = 'en') => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = 0.75;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    const voices = synth.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(
        v => lang === 'en'
          ? (v.lang.startsWith('en') && v.name.includes('Female'))
          : v.lang.startsWith('zh')
      );
      if (preferred) utterance.voice = preferred;
    }

    synth.speak(utterance);
  }, []);

  const singLyrics = useCallback((lyrics: string, lang: 'en' | 'zh' = 'en', singAlong = false) => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    synth.cancel();
    setSingingLine(-1);

    const lines = lyrics.split('\n').filter(l => l.trim());
    const pauseMs = singAlong ? 2500 : 1200;

    lines.forEach((line, i) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
      utterance.rate = singAlong ? 0.65 : 0.75;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.onstart = () => setSingingLine(i);
      synth.speak(utterance);

      // Pause between lines (except last)
      if (i < lines.length - 1) {
        const pause = new SpeechSynthesisUtterance('');
        pause.volume = 0;
        pause.rate = pauseMs / 100;
        synth.speak(pause);
      }
    });
  }, []);

  const stop = useCallback(() => {
    setSingingLine(-1);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  const speakLetter = useCallback((letter: string) => {
    speak(letter, 'en');
  }, [speak]);

  const speakWord = useCallback((word: string, lang: 'en' | 'zh' = 'en') => {
    speak(word, lang);
  }, [speak]);

  return { speak, speakLetter, speakWord, stop, singLyrics, singingLine };
}
