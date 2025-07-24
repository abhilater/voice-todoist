'use client';
import { useState, useEffect } from 'react';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/types';

interface VoiceButtonProps {
  onVoiceResult: (text: string) => void;
}

export default function VoiceButton({ onVoiceResult }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setIsSupported(supported);
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognitionConstructor();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onVoiceResult(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      className={`btn voice-button ${isListening ? 'btn-danger' : 'btn-primary'}`}
      onClick={startListening}
      disabled={isListening}
      type="button"
    >
      🎤
    </button>
  );
}