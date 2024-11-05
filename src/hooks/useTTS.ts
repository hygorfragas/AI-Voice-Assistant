import { useState, useCallback, useEffect } from 'react';
import { TTSService } from '../services/tts';
import type { Voice, VoiceSettings } from '../types/voice';

export function useTTS() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<Voice | null>(null);
  const [currentProvider, setCurrentProvider] = useState<"browser" | "xtts" | "elevenlabs">("browser");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tts] = useState(() => new TTSService());

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await tts.getVoices();
      setVoices(availableVoices);
      
      // Prefer enhanced voices
      const preferredVoice = availableVoices.find(v => 
        v.name.toLowerCase().includes('neural') || 
        v.name.toLowerCase().includes('enhanced')
      );
      setCurrentVoice(preferredVoice || availableVoices[0] || null);
    };

    loadVoices();
  }, [currentProvider, tts]);

  const speak = useCallback(async (text: string) => {
    if (!currentVoice) return;

    try {
      setIsSpeaking(true);
      const settings: VoiceSettings = {
        voice: currentVoice.voice,
        voiceId: currentVoice.id,
        rate: 1.1,
        pitch: 1,
        volume: 1
      };

      await tts.speak(text, settings);
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, [currentVoice, tts]);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const changeProvider = useCallback((provider: "browser" | "xtts" | "elevenlabs") => {
    setCurrentProvider(provider);
    tts.setProvider(provider);
  }, [tts]);

  return {
    speak,
    cancel,
    isSpeaking,
    voices,
    currentVoice,
    setCurrentVoice,
    currentProvider,
    changeProvider
  };
}