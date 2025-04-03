import { useState, useCallback, useEffect, useRef } from 'react';

export interface WebSpeechInterface {
  speak: (text: string, voice?: string, onComplete?: () => void) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
  availableVoices: SpeechSynthesisVoice[];
}

export const useWebSpeech = (): WebSpeechInterface => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Get available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`).join(', '));
        }
      };
      
      // Load voices immediately if they're already available
      loadVoices();
      
      // Otherwise wait for the voiceschanged event
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      setIsSupported(false);
      setError('Speech synthesis is not supported in this browser');
    }
  }, []);
  
  // Speak text using the Web Speech API
  const speak = useCallback((text: string, voiceName?: string, onComplete?: () => void) => {
    if (!isSupported || !text) {
      if (!isSupported) {
        setError('Speech synthesis is not supported in this browser');
      }
      return;
    }
    
    try {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Set voice if specified and available
      if (voiceName && availableVoices.length > 0) {
        const voice = availableVoices.find(v => 
          v.name.toLowerCase().includes(voiceName.toLowerCase())
        );
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      // Default to a male voice if available
      if (!utterance.voice && availableVoices.length > 0) {
        const maleVoice = availableVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('guy') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('james')
        );
        if (maleVoice) {
          utterance.voice = maleVoice;
        }
      }
      
      // Set properties
      utterance.rate = 0.9; // Slightly slower than normal
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Speech ended');
        if (onComplete) onComplete();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
        if (onComplete) onComplete();
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
    } catch (err) {
      console.error('Error in speech synthesis:', err);
      setError(`Failed to start speech: ${err instanceof Error ? err.message : String(err)}`);
      setIsSpeaking(false);
      if (onComplete) onComplete();
    }
  }, [isSupported, availableVoices]);
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (!isSupported) return;
    
    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } catch (err) {
      console.error('Error stopping speech:', err);
      setError(`Failed to stop speech: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [isSupported]);
  
  return {
    speak,
    stopSpeaking,
    isSpeaking,
    isSupported,
    error,
    availableVoices
  };
};

export default useWebSpeech;
