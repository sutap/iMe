import React, { useState, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

interface CircularTimerProps {
  initialTime?: number; // in seconds
  size?: number; // size in pixels
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

export function CircularTimer({
  initialTime = 60 * 60, // default 1 hour
  size = 200,
  onComplete,
  title,
  subtitle
}: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [startTime] = useState(Date.now());

  // Calculate stroke dash offset based on time left
  const calculateProgress = () => {
    const progress = 1 - timeLeft / initialTime;
    return progress * circumference;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1;
          if (newTimeLeft <= 0 && onComplete) {
            onComplete();
          }
          return Math.max(0, newTimeLeft);
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onComplete) onComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  // Toggle timer state
  const toggleTimer = () => {
    setIsActive(prev => !prev);
  };

  // SVG parameters
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center justify-center">
      {title && <h2 className="text-white text-lg font-medium mb-1">{title}</h2>}
      {subtitle && <p className="text-white/80 text-sm mb-4">{subtitle}</p>}
      
      <div className="relative" style={{ width: size, height: size }}>
        {/* Base circle */}
        <svg width={size} height={size} className="absolute">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={strokeWidth}
          />
        </svg>
        
        {/* Progress circle */}
        <svg width={size} height={size} className="absolute transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="white"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={calculateProgress()}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-3xl font-bold">{formatTime(timeLeft)}</span>
          <button 
            onClick={toggleTimer}
            className="mt-2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            {isActive ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}