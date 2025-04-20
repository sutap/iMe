import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface AccessibilityContextType {
  // Accessibility settings
  accessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  
  // Voice commands
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  resetTranscript: () => void;
  voiceEnabled: boolean;
  toggleVoiceEnabled: () => void;
  lastCommand: string | null;
  
  // Text-to-speech
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// Create a browser-safe speech synthesis function
const createSpeech = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    return utterance;
  }
  return null;
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Accessibility settings
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  // Router 
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Speech recognition
  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Set font size classes on body
  useEffect(() => {
    document.body.classList.remove('font-size-large', 'font-size-extra-large');
    if (fontSize !== 'normal') {
      document.body.classList.add(`font-size-${fontSize}`);
    }
  }, [fontSize]);

  // Set accessibility mode classes on body
  useEffect(() => {
    if (accessibilityMode) {
      document.body.classList.add('accessibility-mode');
    } else {
      document.body.classList.remove('accessibility-mode');
    }
  }, [accessibilityMode]);

  // Set high contrast mode classes on body
  useEffect(() => {
    if (highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrastMode]);

  // Process voice commands
  useEffect(() => {
    if (!isListening || !transcript || !voiceEnabled) return;

    const lowercaseTranscript = transcript.toLowerCase().trim();
    
    // Only process if we have at least one word
    if (lowercaseTranscript.length > 2) {
      let commandProcessed = false;

      // Navigation commands
      if (lowercaseTranscript.includes('go to') || lowercaseTranscript.includes('navigate to')) {
        const destinations = {
          'dashboard': '/',
          'home': '/',
          'schedule': '/schedule',
          'calendar': '/schedule',
          'health': '/health',
          'fitness': '/health',
          'finance': '/finance',
          'money': '/finance',
          'discovery': '/discovery',
          'search': '/discovery',
          'settings': '/settings',
          'login': '/auth',
          'logout': '/auth',
        };

        for (const [keyword, path] of Object.entries(destinations)) {
          if (lowercaseTranscript.includes(keyword)) {
            setLocation(path);
            speak(`Navigating to ${keyword}`);
            setLastCommand(`Navigate to ${keyword}`);
            commandProcessed = true;
            resetTranscript();
            break;
          }
        }
      }

      // Accessibility commands
      if (!commandProcessed) {
        // Font size commands
        if (lowercaseTranscript.includes('increase font') || 
            lowercaseTranscript.includes('larger font') || 
            lowercaseTranscript.includes('bigger text')) {
          if (fontSize === 'normal') {
            setFontSize('large');
            speak('Increased font size to large');
          } else if (fontSize === 'large') {
            setFontSize('extra-large');
            speak('Increased font size to extra large');
          } else {
            speak('Font size is already at maximum');
          }
          setLastCommand('Increase font size');
          commandProcessed = true;
        } 
        else if (lowercaseTranscript.includes('decrease font') || 
                 lowercaseTranscript.includes('smaller font') || 
                 lowercaseTranscript.includes('smaller text')) {
          if (fontSize === 'extra-large') {
            setFontSize('large');
            speak('Decreased font size to large');
          } else if (fontSize === 'large') {
            setFontSize('normal');
            speak('Decreased font size to normal');
          } else {
            speak('Font size is already at minimum');
          }
          setLastCommand('Decrease font size');
          commandProcessed = true;
        }
        else if (lowercaseTranscript.includes('normal font') || 
                 lowercaseTranscript.includes('reset font')) {
          setFontSize('normal');
          speak('Font size reset to normal');
          setLastCommand('Reset font size');
          commandProcessed = true;
        }

        // Contrast commands
        else if (lowercaseTranscript.includes('high contrast') || 
                 lowercaseTranscript.includes('dark mode')) {
          if (lowercaseTranscript.includes('disable') || 
              lowercaseTranscript.includes('turn off') ||
              lowercaseTranscript.includes('deactivate')) {
            setHighContrastMode(false);
            speak('High contrast mode disabled');
            setLastCommand('Disable high contrast mode');
          } else {
            setHighContrastMode(true);
            speak('High contrast mode enabled');
            setLastCommand('Enable high contrast mode');
          }
          commandProcessed = true;
        }
      }

      // If a command was processed, show toast and reset transcript
      if (commandProcessed) {
        toast({
          title: "Voice Command",
          description: `Processed: "${transcript}"`,
          duration: 3000,
        });
        resetTranscript();
      }
    }
  }, [transcript, voiceEnabled, isListening]);

  // Accessibility toggle functions
  const toggleAccessibilityMode = () => {
    setAccessibilityMode(!accessibilityMode);
    toast({
      title: `Accessibility Mode ${!accessibilityMode ? 'Enabled' : 'Disabled'}`,
      duration: 3000,
    });
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(!highContrastMode);
    toast({
      title: `High Contrast Mode ${!highContrastMode ? 'Enabled' : 'Disabled'}`,
      duration: 3000,
    });
  };

  const setFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    setFontSizeState(size);
    toast({
      title: `Font Size: ${size.charAt(0).toUpperCase() + size.slice(1)}`,
      duration: 3000,
    });
  };

  const toggleVoiceEnabled = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (newState && browserSupportsSpeechRecognition) {
      startListening();
      toast({
        title: "Voice Commands Enabled",
        description: "You can now use voice commands to control the app",
        duration: 3000,
      });
    } else if (!newState && isListening) {
      stopListening();
      toast({
        title: "Voice Commands Disabled",
        duration: 3000,
      });
    } else if (newState && !browserSupportsSpeechRecognition) {
      toast({
        title: "Voice Commands Not Supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
        duration: 5000,
      });
      setVoiceEnabled(false);
    }
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      toast({
        title: "Voice Commands Not Supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  // Text to speech functions
  const speak = (text: string) => {
    const utterance = createSpeech(text);
    if (utterance) {
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        accessibilityMode,
        toggleAccessibilityMode,
        highContrastMode,
        toggleHighContrastMode,
        fontSize,
        setFontSize,
        isListening,
        startListening,
        stopListening,
        transcript,
        resetTranscript,
        voiceEnabled,
        toggleVoiceEnabled,
        lastCommand,
        speak,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useVoiceCommands = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useVoiceCommands must be used within an AccessibilityProvider');
  }
  return context;
};

// HOC to provide voice command functionality to components
export function withVoiceCommands<T extends {}>(
  Component: React.ComponentType<T>
): React.FC<T> {
  return (props: T) => {
    const accessibilityContext = useVoiceCommands();
    
    return <Component {...props} accessibilityContext={accessibilityContext} />;
  };
}