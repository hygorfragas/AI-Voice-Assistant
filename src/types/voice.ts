export interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

export interface VoiceSettings {
  voice?: SpeechSynthesisVoice;
  voiceId?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface Voice {
  id: string;
  name: string;
  provider: "browser" | "xtts" | "elevenlabs";
  voice?: SpeechSynthesisVoice;
}