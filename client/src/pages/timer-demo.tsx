import { useState } from 'react';
import { CircularTimer } from '@/components/timer/circular-timer';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid } from 'lucide-react';

export default function TimerDemoPage() {
  const [currentTask, setCurrentTask] = useState({
    title: 'WORKING ON',
    name: 'Lai Kang',
    description: 'Mobile app design'
  });
  
  const [paused, setPaused] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#5a7a50' }}>
      <header className="pt-8 px-6 pb-4">
        <h1 className="text-white text-2xl font-medium tracking-wide">My Projects</h1>
        <div className="h-1 w-20 bg-white/30 mt-1 rounded-full"></div>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2 font-medium tracking-wide">
            {paused ? 'Paused' : currentTask.title}
          </h2>
          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm mb-6 inline-block">
            <div className="text-white/90 font-medium">{currentTask.name}</div>
            <div className="text-white/70 text-sm">{currentTask.description}</div>
          </div>
          <CircularTimer initialTime={87 * 60} size={180} />
        </div>
      </div>
      
      <div className="p-6 flex justify-center space-x-8">
        <div className="text-center">
          <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg text-white rounded-xl h-16 w-16 p-0">
            <Plus className="h-8 w-8" />
          </Button>
          <p className="text-white/90 text-xs mt-2 font-medium">Add New</p>
        </div>
        <div className="text-center">
          <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg text-white rounded-xl h-16 w-16 p-0">
            <LayoutGrid className="h-6 w-6" />
          </Button>
          <p className="text-white/90 text-xs mt-2 font-medium">View Existing</p>
        </div>
      </div>
    </div>
  );
}
