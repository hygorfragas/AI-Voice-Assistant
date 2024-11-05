import React from 'react';
import { Voice } from '../types/voice';

interface VoiceSettingsProps {
  voices: Voice[];
  currentVoice: Voice | null;
  onVoiceChange: (voice: Voice) => void;
  onClose: () => void;
}

export function VoiceSettings({
  voices,
  currentVoice,
  onVoiceChange,
  onClose,
}: VoiceSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Voice Settings</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Voice
          </label>
          <select
            value={currentVoice?.id || ''}
            onChange={(e) => {
              const voice = voices.find((v) => v.id === e.target.value);
              if (voice) onVoiceChange(voice);
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}