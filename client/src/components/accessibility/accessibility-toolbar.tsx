import React, { useState } from 'react';
import { useVoiceCommands } from '@/hooks/use-voice-commands';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Mic, MicOff, Eye, Type, Volume2, Maximize, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibilityToolbarProps {
  className?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    accessibilityMode,
    toggleAccessibilityMode,
    highContrastMode,
    toggleHighContrastMode,
    fontSize,
    setFontSize,
    voiceEnabled,
    toggleVoiceEnabled,
    isListening,
    transcript,
  } = useVoiceCommands();

  return (
    <div className={cn("fixed bottom-20 right-4 md:bottom-4 z-50 flex flex-col items-end", className)}>
      {/* Voice command status indicator (only shown when voice is enabled) */}
      {voiceEnabled && (
        <div className="mb-3 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-3 w-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium">
              {isListening ? 'Listening...' : 'Voice paused'}
            </span>
          </div>
          {transcript && (
            <div className="text-sm text-gray-500 italic truncate max-w-[200px]">
              "{transcript}"
            </div>
          )}
        </div>
      )}

      {/* Main accessibility button that toggles the toolbar popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="default" 
            size="lg" 
            className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shadow-lg",
              accessibilityMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-900"
            )}
            aria-label="Accessibility options"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"></path>
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-72 p-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2">Accessibility Options</h3>
            
            {/* Accessibility Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Maximize className="h-4 w-4" />
                <Label htmlFor="accessibility-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Accessibility Mode
                </Label>
              </div>
              <Switch 
                id="accessibility-mode" 
                checked={accessibilityMode} 
                onCheckedChange={toggleAccessibilityMode} 
              />
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <Label htmlFor="high-contrast" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  High Contrast
                </Label>
              </div>
              <Switch 
                id="high-contrast" 
                checked={highContrastMode} 
                onCheckedChange={toggleHighContrastMode} 
              />
            </div>
            
            {/* Voice Commands Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                <Label htmlFor="voice-commands" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Voice Commands
                </Label>
              </div>
              <Switch 
                id="voice-commands" 
                checked={voiceEnabled} 
                onCheckedChange={toggleVoiceEnabled}
              />
            </div>
            
            {/* Font Size Controls */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Label className="text-sm font-medium leading-none">Font Size</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={fontSize === 'normal' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFontSize('normal')} 
                  className="flex-1"
                >
                  A
                </Button>
                <Button 
                  variant={fontSize === 'large' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFontSize('large')} 
                  className="flex-1 text-lg"
                >
                  A
                </Button>
                <Button 
                  variant={fontSize === 'extra-large' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFontSize('extra-large')} 
                  className="flex-1 text-xl"
                >
                  A
                </Button>
              </div>
            </div>
            
            {/* Voice Command Help */}
            {voiceEnabled && (
              <div className="text-sm text-gray-500 border-t pt-3 mt-3">
                <p className="font-medium mb-1 flex items-center">
                  <Volume2 className="h-4 w-4 mr-1" /> Voice Commands
                </p>
                <p className="text-xs">Try saying:</p>
                <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
                  <li>"Go to dashboard"</li>
                  <li>"Show health"</li>
                  <li>"High contrast on"</li>
                  <li>"Increase font size"</li>
                  <li>"What can I say?"</li>
                </ul>
              </div>
            )}
            
            {/* Close button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              onClick={() => setIsOpen(false)}
            >
              <PanelLeftClose className="h-4 w-4 mr-2" />
              Close Menu
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};