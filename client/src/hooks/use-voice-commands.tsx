import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useLocation, useRoute } from 'wouter';
import { useToast } from './use-toast';

// Types for our Accessibility Context
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

// Create context with default values
const AccessibilityContext = createContext<AccessibilityContextType>({
  accessibilityMode: false,
  toggleAccessibilityMode: () => {},
  highContrastMode: false,
  toggleHighContrastMode: () => {},
  fontSize: 'normal',
  setFontSize: () => {},
  isListening: false,
  startListening: () => {},
  stopListening: () => {},
  transcript: '',
  resetTranscript: () => {},
  voiceEnabled: false,
  toggleVoiceEnabled: () => {},
  lastCommand: null,
  speak: () => {},
  stopSpeaking: () => {},
});

// Provider component that wraps around our app
export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Accessibility settings
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  
  // Navigation and UI feedback
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Speech recognition setup
  const {
    transcript,
    resetTranscript,
    listening: isListening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();
  
  // Check for browser support on mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: 'Speech Recognition Unavailable',
        description: 'Your browser does not support speech recognition. Try Chrome for the best experience.',
        variant: 'destructive',
      });
    }
    
    if (!isMicrophoneAvailable) {
      toast({
        title: 'Microphone Access Required',
        description: 'Please allow microphone access to use voice commands.',
        variant: 'destructive',
      });
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, toast]);

  // Toggle accessibility mode
  const toggleAccessibilityMode = () => {
    setAccessibilityMode(prev => !prev);
    
    // When turning on accessibility mode, give audio feedback
    if (!accessibilityMode) {
      speak('Accessibility mode enabled.');
    }
  };

  // Toggle high contrast mode
  const toggleHighContrastMode = () => {
    setHighContrastMode(prev => !prev);
    
    // Apply high contrast class to the document body
    if (!highContrastMode) {
      document.body.classList.add('high-contrast');
      speak('High contrast mode enabled.');
    } else {
      document.body.classList.remove('high-contrast');
      speak('High contrast mode disabled.');
    }
  };
  
  // Font size management
  const changeFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    setFontSize(size);
    
    // Remove existing font size classes
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large');
    
    // Add the new font size class
    document.body.classList.add(`font-size-${size}`);
    
    speak(`Font size set to ${size}.`);
  };
  
  // Toggle voice commands
  const toggleVoiceEnabled = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (newState) {
      startListening();
      speak('Voice commands activated.');
    } else {
      stopListening();
      speak('Voice commands deactivated.');
    }
  };
  
  // Start listening for voice commands
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };
  
  // Stop listening for voice commands
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };
  
  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Stop text-to-speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  
  // Process voice commands
  useEffect(() => {
    if (!voiceEnabled || !transcript) return;

    // Convert transcript to lowercase for easier matching
    const command = transcript.toLowerCase().trim();
    
    // Only process if the command is different from the last one
    if (command !== lastCommand && command.length > 0) {
      setLastCommand(command);
      
      // Navigation commands
      if (command.includes('go to dashboard') || command.includes('show dashboard')) {
        navigate('/');
        speak('Navigating to dashboard.');
      } 
      else if (command.includes('go to schedule') || command.includes('show schedule')) {
        navigate('/schedule');
        speak('Navigating to schedule.');
      }
      else if (command.includes('go to health') || command.includes('show health')) {
        navigate('/health');
        speak('Navigating to health.');
      }
      else if (command.includes('go to finance') || command.includes('show finance')) {
        navigate('/finance');
        speak('Navigating to finance.');
      }
      else if (command.includes('go to discovery') || command.includes('show discover')) {
        navigate('/discovery');
        speak('Navigating to discovery.');
      }
      
      // Accessibility commands
      else if (command.includes('high contrast on') || command.includes('enable high contrast')) {
        setHighContrastMode(true);
        document.body.classList.add('high-contrast');
        speak('High contrast mode enabled.');
      }
      else if (command.includes('high contrast off') || command.includes('disable high contrast')) {
        setHighContrastMode(false);
        document.body.classList.remove('high-contrast');
        speak('High contrast mode disabled.');
      }
      else if (command.includes('increase font size') || command.includes('larger text')) {
        if (fontSize === 'normal') changeFontSize('large');
        else if (fontSize === 'large') changeFontSize('extra-large');
        speak('Font size increased.');
      }
      else if (command.includes('decrease font size') || command.includes('smaller text')) {
        if (fontSize === 'extra-large') changeFontSize('large');
        else if (fontSize === 'large') changeFontSize('normal');
        speak('Font size decreased.');
      }
      else if (command.includes('normal font size') || command.includes('reset font size')) {
        changeFontSize('normal');
        speak('Font size reset to normal.');
      }
      
      // Help command
      else if (command.includes('what can i say') || command.includes('show commands') || 
               command.includes('help') || command.includes('list commands')) {
        speak('Available commands include: go to dashboard, go to schedule, go to health, go to finance, go to discovery, high contrast on, high contrast off, increase font size, decrease font size, normal font size, and stop listening.');
        toast({
          title: 'Voice Commands',
          description: 'Try saying: "Go to dashboard", "High contrast on", "Increase font size", or "Stop listening"',
          duration: 6000,
        });
      }
      
      // Turn off voice commands
      else if (command.includes('stop listening') || command.includes('turn off voice') || 
               command.includes('disable voice commands')) {
        speak('Voice commands deactivated.');
        setVoiceEnabled(false);
        stopListening();
      }
    }
    
    // Auto-reset the transcript after a delay to prepare for the next command
    const resetTimer = setTimeout(() => {
      if (command === lastCommand) {
        resetTranscript();
        setLastCommand(null);
      }
    }, 5000);
    
    return () => clearTimeout(resetTimer);
  }, [transcript, voiceEnabled, lastCommand, fontSize, navigate, resetTranscript, toast]);
  
  // Update the document body with accessibility classes when mode is toggled
  useEffect(() => {
    if (accessibilityMode) {
      document.body.classList.add('accessibility-mode');
    } else {
      document.body.classList.remove('accessibility-mode');
    }
    
    return () => {
      // Clean up when the component unmounts
      document.body.classList.remove('accessibility-mode', 'high-contrast', 
        'font-size-normal', 'font-size-large', 'font-size-extra-large');
    };
  }, [accessibilityMode]);
  
  return (
    <AccessibilityContext.Provider
      value={{
        accessibilityMode,
        toggleAccessibilityMode,
        highContrastMode,
        toggleHighContrastMode,
        fontSize,
        setFontSize: changeFontSize,
        isListening,
        startListening,
        stopListening,
        transcript,
        resetTranscript,
        voiceEnabled,
        toggleVoiceEnabled,
        lastCommand,
        speak,
        stopSpeaking
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use the accessibility context
export const useVoiceCommands = () => useContext(AccessibilityContext);

// Higher-order component to wrap components that need accessibility features
export function withVoiceCommands<T extends {}>(
  Component: React.ComponentType<T>
): React.FC<T> {
  return (props: T) => {
    return (
      <AccessibilityProvider>
        <Component {...props} />
      </AccessibilityProvider>
    );
  };
}