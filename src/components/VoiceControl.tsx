import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';

interface VoiceControlProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleSpeech: () => void;
  onOpenSettings?: () => void;
}

export function VoiceControl({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onToggleSpeech,
  onOpenSettings,
}: VoiceControlProps) {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={isListening ? onStopListening : onStartListening}
        className={`p-4 rounded-full transition-all transform hover:scale-105 ${
          isListening
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-4 ring-red-500/50'
            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:ring-4 hover:ring-blue-500/50'
        } shadow-lg backdrop-blur-sm`}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 animate-pulse" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={onToggleSpeech}
        className={`p-4 rounded-full transition-all transform hover:scale-105 ${
          isSpeaking
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 ring-4 ring-green-500/50'
            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:ring-4 hover:ring-gray-500/50'
        } shadow-lg backdrop-blur-sm`}
      >
        {isSpeaking ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>

      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="p-4 rounded-full transition-all transform hover:scale-105
            bg-purple-500/20 text-purple-400 hover:bg-purple-500/30
            hover:ring-4 hover:ring-purple-500/50 shadow-lg backdrop-blur-sm"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}