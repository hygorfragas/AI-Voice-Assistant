import { useState, useCallback, useEffect } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [hasSupport, setHasSupport] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      setRecognition(recognition);
      setHasSupport(true);
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  const startListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSupport,
  };
}
