import { useCallback, useRef } from 'react';

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const speak = useCallback((text: string, lang: 'en' | 'zh' = 'en') => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = 0.75; // Slower for kids
    utterance.pitch = 1.2; // Slightly higher, friendlier
    utterance.volume = 1;

    // Try to pick a friendly voice
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

  const stop = useCallback(() => {
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

  return { speak, speakLetter, speakWord, stop };
}
