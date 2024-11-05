import { useState, useCallback, useEffect } from 'react';

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasSupport = 'speechSynthesis' in window;

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang.startsWith('en-'))
        .map((voice) => ({
          voice,
          name: voice.name,
          lang: voice.lang,
        }));

      setVoices(availableVoices);

      // Prioritize voices in this order:
      // 1. Microsoft natural/neural voices
      // 2. Google neural/enhanced voices
      // 3. Any other English neural/enhanced voices
      // 4. Default to first available English voice
      const preferredVoice = availableVoices.find(
        (v) => 
          v.name.toLowerCase().includes('microsoft') && 
          (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural'))
      ) || availableVoices.find(
        (v) => 
          v.name.toLowerCase().includes('google') && 
          (v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('enhanced'))
      ) || availableVoices.find(
        (v) => 
          v.name.toLowerCase().includes('neural') || 
          v.name.toLowerCase().includes('enhanced')
      );

      setCurrentVoice(preferredVoice?.voice || availableVoices[0]?.voice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!hasSupport) return;

      const utterance = new SpeechSynthesisUtterance(text);
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [hasSupport, currentVoice]
  );

  const cancel = useCallback(() => {
    if (!hasSupport) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [hasSupport]);

  return {
    speak,
    cancel,
    isSpeaking,
    hasSupport,
    voices,
    currentVoice,
    setCurrentVoice,
  };
}