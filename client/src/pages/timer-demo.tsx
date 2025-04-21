import React, { useState } from 'react';
import { CircularTimer } from '@/components/timer/circular-timer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TimerDemoPage() {
  const [currentTask, setCurrentTask] = useState({
    title: 'WORKING ON',
    name: 'Lai Kang',
    description: 'Mobile app design'
  });
  
  const [paused, setPaused] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700">
      {/* Header section */}
      <header className="pt-8 px-6 pb-4">
        <h1 className="text-white text-2xl font-medium tracking-wide">My Projects</h1>
        <div className="h-1 w-20 bg-white/30 mt-1 rounded-full"></div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {paused ? (
          <div className="text-center">
            <h2 className="text-white text-xl mb-2 font-medium tracking-wide">Paused</h2>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm mb-6 inline-block">
              <div className="text-white/90 font-medium">{currentTask.name}</div>
              <div className="text-white/70 text-sm">{currentTask.description}</div>
            </div>
            <CircularTimer 
              initialTime={87 * 60} // 1 hour and 27 minutes
              size={180} 
            />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-white text-xl mb-2 font-medium tracking-wide">{currentTask.title}</h2>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm mb-6 inline-block">
              <div className="text-white/90 font-medium">{currentTask.name}</div>
              <div className="text-white/70 text-sm">{currentTask.description}</div>
            </div>
            <CircularTimer 
              initialTime={87 * 60} // 1 hour and 27 minutes  
              size={180} 
            />
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="p-6 flex justify-center space-x-8">
        <div className="text-center">
          <Button 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg text-white rounded-xl h-16 w-16 p-0"
          >
            <Plus className="h-8 w-8" />
          </Button>
          <p className="text-white/90 text-xs mt-2 font-medium">Add New</p>
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg text-white rounded-xl h-16 w-16 p-0"
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
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <circle cx="15.5" cy="8.5" r="1.5" />
              <circle cx="15.5" cy="15.5" r="1.5" />
              <circle cx="8.5" cy="15.5" r="1.5" />
            </svg>
          </Button>
          <p className="text-white/90 text-xs mt-2 font-medium">View Existing</p>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-bl-full opacity-30" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500 rounded-tr-full opacity-30" />
      <div className="absolute bottom-20 right-12 w-16 h-16 bg-blue-400 rounded-full opacity-20" />
    </div>
  );
}