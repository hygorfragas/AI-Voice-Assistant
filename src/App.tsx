import React, { useState, useCallback, useEffect } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { VoiceControl } from './components/VoiceControl';
import { VoiceSettings } from './components/VoiceSettings';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { TTSService } from './services/tts';
import type { Voice } from './types/voice';
import { AIService } from './services/ai';

const aiService = new AIService();
const ttsService = new TTSService();

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<Voice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSupport: hasVoiceSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await ttsService.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setCurrentVoice(availableVoices[0]);
      }
    };
    loadVoices();
  }, []);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      setResponse('');
      setError(null);
      let fullResponse = '';

      try {
        const stream = aiService.chatStream(input);

        for await (const chunk of stream) {
          fullResponse += chunk;
          setResponse(fullResponse);
        }

        if (autoSpeak && currentVoice) {
          setIsSpeaking(true);
          await ttsService.speak(fullResponse, { voiceId: currentVoice.id });
          setIsSpeaking(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
        setInput('');
        stopListening();
      }
    },
    [input, isLoading, autoSpeak, currentVoice, stopListening]
  );

  useEffect(() => {
    if (isListening && transcript) {
      handleSubmit();
    }
  }, [isListening, transcript, handleSubmit]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
    }
    setAutoSpeak(!autoSpeak);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl relative">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4 animate-pulse">
            <Bot className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            AI Voice Assistant
          </h1>
        </div>

        {hasVoiceSupport && (
          <VoiceControl
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onToggleSpeech={toggleSpeech}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        <div className="mb-6 min-h-[200px] p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : response ? (
            <p className="text-gray-200 leading-relaxed">{response}</p>
          ) : (
            <p className="text-gray-400 text-center">
              {hasVoiceSupport
                ? 'Click the microphone or type to start...'
                : 'Type your message to start...'}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasVoiceSupport
                ? 'Type or click the microphone...'
                : 'Type your message...'
            }
            className="w-full px-6 py-4 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-500 pr-12 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {showSettings && (
          <VoiceSettings
            voices={voices}
            currentVoice={currentVoice}
            onVoiceChange={setCurrentVoice}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;