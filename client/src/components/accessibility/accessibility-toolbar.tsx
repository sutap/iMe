import { useVoiceCommands } from "@/hooks/use-voice-commands";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Settings, 
  Mic, 
  Eye, 
  Type, 
  ChevronUp
} from "lucide-react";

export function AccessibilityToolbar() {
  const { 
    voiceEnabled, 
    toggleVoiceEnabled,
    highContrastMode, 
    toggleHighContrastMode,
    fontSize,
    setFontSize,
    startListening,
    stopListening,
    isListening,
    transcript,
    lastCommand
  } = useVoiceCommands();
  
  const [expanded, setExpanded] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showMicAnimation, setShowMicAnimation] = useState(false);
  
  // Keep track of the transcript changes to show mic animation
  useEffect(() => {
    if (isListening && transcript) {
      setShowMicAnimation(true);
      const timer = setTimeout(() => {
        setShowMicAnimation(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [transcript, isListening]);
  
  // For mobile devices that need a fixed position toolbar
  return (
    <>
      {/* Main Toolbar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-2">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center"
          >
            <Settings className="h-5 w-5" />
            <span className="ml-2 text-sm">Accessibility</span>
            <ChevronUp className={`ml-1 h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
          
          {voiceEnabled && (
            <Button 
              variant={isListening ? "destructive" : "outline"} 
              size="icon"
              className={`relative ${showMicAnimation ? 'animate-pulse' : ''}`}
              onClick={isListening ? stopListening : startListening}
            >
              <Mic className="h-4 w-4" />
              {showMicAnimation && (
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-25 animate-ping"></span>
              )}
            </Button>
          )}
        </div>
        
        {expanded && (
          <div className="p-3 space-y-4 border-t border-gray-200 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-gray-500" />
                <Label htmlFor="voice-commands-mobile" className="text-sm">Voice Commands</Label>
              </div>
              <Switch 
                id="voice-commands-mobile" 
                checked={voiceEnabled}
                onCheckedChange={toggleVoiceEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <Label htmlFor="high-contrast-mobile" className="text-sm">High Contrast</Label>
              </div>
              <Switch 
                id="high-contrast-mobile" 
                checked={highContrastMode}
                onCheckedChange={toggleHighContrastMode}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-gray-500" />
                <Label className="text-sm">Font Size</Label>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <Button 
                  size="sm" 
                  variant={fontSize === 'normal' ? "default" : "outline"} 
                  className="text-xs py-1" 
                  onClick={() => setFontSize('normal')}
                >
                  Normal
                </Button>
                <Button 
                  size="sm" 
                  variant={fontSize === 'large' ? "default" : "outline"} 
                  className="text-xs py-1" 
                  onClick={() => setFontSize('large')}
                >
                  Large
                </Button>
                <Button 
                  size="sm" 
                  variant={fontSize === 'extra-large' ? "default" : "outline"} 
                  className="text-xs py-1" 
                  onClick={() => setFontSize('extra-large')}
                >
                  XL
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Popover Button (Desktop Only) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button className="rounded-full w-12 h-12 shadow-lg flex items-center justify-center">
              <Settings className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium text-base">Accessibility Controls</h3>
              
              {voiceEnabled && isListening && (
                <div className="bg-blue-50 p-2 rounded-md border border-blue-200 flex items-center space-x-2">
                  <Mic className={`h-4 w-4 text-blue-500 ${showMicAnimation ? 'animate-pulse' : ''}`} />
                  <p className="text-sm text-blue-700 flex-1">
                    {transcript ? `"${transcript}"` : "Listening..."}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={stopListening}
                  >
                    <span className="sr-only">Stop listening</span>
                    <span className="h-2 w-2 bg-red-500 rounded-sm"></span>
                  </Button>
                </div>
              )}
              
              {lastCommand && (
                <div className="text-xs text-gray-500">
                  Last command: "{lastCommand}"
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mic className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="voice-commands-popover" className="text-sm">Voice Commands</Label>
                </div>
                <Switch 
                  id="voice-commands-popover" 
                  checked={voiceEnabled}
                  onCheckedChange={toggleVoiceEnabled}
                />
              </div>
              
              {voiceEnabled && (
                <Button 
                  size="sm"
                  variant={isListening ? "destructive" : "outline"} 
                  className="w-full" 
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? "Stop Listening" : "Start Listening"}
                </Button>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="high-contrast-popover" className="text-sm">High Contrast</Label>
                </div>
                <Switch 
                  id="high-contrast-popover" 
                  checked={highContrastMode}
                  onCheckedChange={toggleHighContrastMode}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm">Font Size</Label>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <Button 
                    size="sm" 
                    variant={fontSize === 'normal' ? "default" : "outline"} 
                    className="text-xs py-1" 
                    onClick={() => setFontSize('normal')}
                  >
                    Normal
                  </Button>
                  <Button 
                    size="sm" 
                    variant={fontSize === 'large' ? "default" : "outline"} 
                    className="text-xs py-1" 
                    onClick={() => setFontSize('large')}
                  >
                    Large
                  </Button>
                  <Button 
                    size="sm" 
                    variant={fontSize === 'extra-large' ? "default" : "outline"} 
                    className="text-xs py-1" 
                    onClick={() => setFontSize('extra-large')}
                  >
                    XL
                  </Button>
                </div>
              </div>
              
              <div className="pt-2 text-xs text-gray-500">
                <p>Use voice commands like "go to dashboard", "navigate to health", "increase font size", or "enable high contrast".</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}