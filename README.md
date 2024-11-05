

# AI Voice Assistant

A modern, voice assistant built with React, TypeScript, and the Hugging Face Inference API. This application features a sleek UI with glowing effects, voice recognition, and text-to-speech capabilities.

![AI Assistant Preview](https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop)

![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.0.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-blue?style=for-the-badge&logo=tailwindcss)
![Hugging Face API](https://img.shields.io/badge/Hugging%20Face%20API-powered-orange?style=for-the-badge&logo=huggingface)

## Features

- 🎙️ **Voice Recognition** - Speak to your AI assistant
- 🔊 **Text-to-Speech** - Listen to AI responses
- ✨ **Real-time Streaming** - See responses as they're generated
- 🎨 **Futuristic UI** - Glowing effects and smooth animations
- 📱 **Responsive Design** - Works on all devices
- 🤖 **Powered by Llama 2** - Advanced language model from Meta

## Tech Stack

- **React + TypeScript**
- **Tailwind CSS**
- **Hugging Face Inference API**
- **Web Speech API**
- **Lucide React Icons**

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/alwalid54321/ai-voice-assistant.git
   cd ai-voice-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file with your Hugging Face API key:**
   ```plaintext
   VITE_HUGGINGFACE_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

- **Click the microphone icon** to start/stop voice recognition.
- **Click the speaker icon** to mute/unmute AI responses.
- **Type in the input field** or use voice recognition to interact.
- **Press enter** or **click the send button** to submit your message.

## Project Structure

```plaintext
src/
├── components/        # React components
│   ├── Header.tsx
│   ├── InputForm.tsx
│   └── MessageList.tsx
├── hooks/             # Custom React hooks
│   ├── useSpeechRecognition.ts
│   └── useSpeechSynthesis.ts
├── services/          # External services
│   └── ai.ts
├── types/             # TypeScript types
│   └── index.ts
└── App.tsx            # Main application component
```

## Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## License

This project is licensed under the GPL License - see the [LICENSE](LICENSE) file for details.
