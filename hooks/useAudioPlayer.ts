
import { useState, useCallback, useEffect } from 'react';
import { generateAudioSummary } from '../services/geminiService';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioText, setAudioText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (isGenerating || !audioText) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
        setError(`Audio playback error: ${e.error}`);
        setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [audioText, isGenerating]);
  
  const pause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const generateAndPlay = useCallback(async (textToSummarize: string) => {
    stop();
    setIsGenerating(true);
    setError(null);
    try {
      const summaryText = await generateAudioSummary(textToSummarize);
      setAudioText(summaryText);
    } catch (e) {
      setError('Failed to generate audio summary.');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }, [stop]);

  useEffect(() => {
    if (audioText && !isGenerating) {
        play();
    }
  }, [audioText, isGenerating, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { isPlaying, isGenerating, error, generateAndPlay, play, pause, stop };
};
