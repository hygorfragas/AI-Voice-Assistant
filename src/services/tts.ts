import type { Voice, VoiceSettings } from '../types/voice';

export class TTSService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async speak(text: string, settings: VoiceSettings): Promise<void> {
    if (!text.trim()) return;

    try {
      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find the matching system voice
      const voices = this.synthesis.getVoices();
      const matchingVoice = voices.find(v => v.voiceURI === settings.voiceId);
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      this.currentUtterance = utterance;

      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          this.currentUtterance = null;
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.currentUtterance = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        this.synthesis.speak(utterance);
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      throw error;
    }
  }

  stop(): void {
    this.synthesis.cancel();
    this.currentUtterance = null;
  }

  async getVoices(): Promise<Voice[]> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        const voices = this.synthesis.getVoices()
          .filter(voice => voice.lang.startsWith('en-'))
          .map(voice => ({
            id: voice.voiceURI,
            name: voice.name,
            provider: 'browser' as const,
            voice: voice
          }));
        
        // Prefer enhanced/neural voices
        voices.sort((a, b) => {
          const aScore = this.getVoiceScore(a.name);
          const bScore = this.getVoiceScore(b.name);
          return bScore - aScore;
        });

        resolve(voices);
      };

      // Handle both immediate and async voice loading
      const voices = this.synthesis.getVoices();
      if (voices.length) {
        loadVoices();
      } else {
        this.synthesis.onvoiceschanged = loadVoices;
      }
    });
  }

  private getVoiceScore(name: string): number {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('microsoft') && (lowerName.includes('neural') || lowerName.includes('natural'))) return 4;
    if (lowerName.includes('google') && (lowerName.includes('neural') || lowerName.includes('enhanced'))) return 3;
    if (lowerName.includes('neural')) return 2;
    if (lowerName.includes('enhanced')) return 1;
    return 0;
  }
}