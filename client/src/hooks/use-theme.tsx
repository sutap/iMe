import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the available color schemes
export type ColorScheme = {
  name: string;
  primary: string;
  variant: 'professional' | 'tint' | 'vibrant';
};

// Predefined color schemes
export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: 'Teal Minimalist',
    primary: 'hsl(181, 76%, 55%)', // Teal color from the reference design
    variant: 'vibrant'
  },
  {
    name: 'Default Blue',
    primary: 'hsl(244 82% 60%)', // Original blue
    variant: 'professional'
  },
  {
    name: 'Ocean',
    primary: 'hsl(199 89% 48%)', // Bright blue
    variant: 'professional'
  },
  {
    name: 'Forest',
    primary: 'hsl(142 72% 29%)', // Deep green
    variant: 'professional'
  },
  {
    name: 'Sunset',
    primary: 'hsl(22 87% 57%)', // Orange
    variant: 'vibrant'
  },
  {
    name: 'Purple Haze',
    primary: 'hsl(267 83% 60%)', // Purple
    variant: 'tint'
  }
];

interface ThemeContextType {
  // Theme settings
  appearance: 'light' | 'dark' | 'system';
  setAppearance: (appearance: 'light' | 'dark' | 'system') => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  radius: number;
  setRadius: (radius: number) => void;
  applyTheme: () => void;
  colorSchemes: ColorScheme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('light');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(COLOR_SCHEMES[0]);
  const [radius, setRadius] = useState<number>(0.5);

  // Load saved theme preferences
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('iMe-theme');
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        if (theme.appearance) setAppearance(theme.appearance);
        if (theme.radius !== undefined) setRadius(theme.radius);
        
        // Find matching color scheme or use default
        if (theme.colorScheme) {
          const savedScheme = COLOR_SCHEMES.find(
            scheme => scheme.primary === theme.colorScheme.primary
          );
          if (savedScheme) setColorScheme(savedScheme);
        }
      }
      
      // Apply the theme immediately on load
      applyTheme();
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  }, []);

  // Function to apply theme changes to theme.json settings
  const applyTheme = () => {
    // Prepare the theme object
    const themeConfig = {
      variant: colorScheme.variant,
      primary: colorScheme.primary,
      appearance: appearance,
      radius: radius
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('iMe-theme', JSON.stringify({
      appearance,
      colorScheme,
      radius
    }));
    
    // Update the document root with theme attributes
    // This is for immediate visual feedback before the actual theme.json is updated
    document.documentElement.setAttribute('data-theme', appearance === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : appearance);
    
    document.documentElement.style.setProperty('--theme-primary', colorScheme.primary);
    document.documentElement.style.setProperty('--theme-radius', `${radius}rem`);
    
    // Send theme update to server
    fetch('/api/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(themeConfig),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update theme');
      }
      return response.json();
    })
    .then(() => {
      toast({
        title: 'Theme Updated',
        description: 'Your theme preferences have been saved.',
      });
    })
    .catch(error => {
      console.error('Error updating theme:', error);
      // Still show visual feedback even if server update fails
      toast({
        title: 'Theme Applied Locally',
        description: 'Theme saved locally, but server update failed.',
        variant: 'destructive',
      });
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        appearance,
        setAppearance,
        colorScheme,
        setColorScheme,
        radius,
        setRadius,
        applyTheme,
        colorSchemes: COLOR_SCHEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}