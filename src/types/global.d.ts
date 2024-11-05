interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

declare const webkitSpeechRecognition: {
  new (): SpeechRecognition;
};