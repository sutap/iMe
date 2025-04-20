import React from 'react';
import Layout from '@/components/layout';
import { ThemeSelector } from '@/components/theme/theme-selector';
import { Palette } from 'lucide-react';

export default function ThemeSettings() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-3">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Theme Settings</h1>
          <p className="text-muted-foreground max-w-md">
            Personalize your iMe experience by choosing your preferred color scheme and appearance.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ThemeSelector />
          
          <div className="mt-10 p-6 bg-card rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">About Theme Settings</h2>
            <div className="prose prose-sm">
              <p>
                Your theme preferences are stored locally on your device and will persist between sessions.
                Changes take effect immediately across the entire application.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Color Schemes</h3>
              <p>
                Choose from a variety of carefully designed color schemes that affect primary buttons, 
                links, and accent elements throughout the app.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Appearance Mode</h3>
              <p>
                Switch between light and dark modes, or let the app automatically adjust based on your 
                system preferences.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Rounding Style</h3>
              <p>
                Adjust the border radius of UI elements to create a more subtle or rounded appearance
                according to your visual preference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}