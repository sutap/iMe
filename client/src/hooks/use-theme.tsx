import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type ColorScheme = {
  name: string;
  primary: string;
  variant: 'professional' | 'tint' | 'vibrant';
};

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: 'Sage Green',
    primary: 'hsl(110, 25%, 45%)',
    variant: 'tint'
  },
  {
    name: 'Forest',
    primary: 'hsl(142 72% 29%)',
    variant: 'professional'
  },
  {
    name: 'Ocean',
    primary: 'hsl(199 89% 48%)',
    variant: 'professional'
  },
  {
    name: 'Sunset',
    primary: 'hsl(22 87% 57%)',
    variant: 'vibrant'
  },
  {
    name: 'Purple Haze',
    primary: 'hsl(267 83% 60%)',
    variant: 'tint'
  },
  {
    name: 'Clay',
    primary: 'hsl(25 35% 55%)',
    variant: 'tint'
  }
];

interface ThemeContextType {
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
  const [radius, setRadius] = useState<number>(0.75);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('iMe-theme');
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        if (theme.appearance) setAppearance(theme.appearance);
        if (theme.radius !== undefined) setRadius(theme.radius);
        
        if (theme.colorScheme) {
          const savedScheme = COLOR_SCHEMES.find(
            scheme => scheme.primary === theme.colorScheme.primary
          );
          if (savedScheme) setColorScheme(savedScheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  }, []);

  const applyTheme = () => {
    const themeConfig = {
      variant: colorScheme.variant,
      primary: colorScheme.primary,
      appearance: appearance,
      radius: radius
    };
    
    localStorage.setItem('iMe-theme', JSON.stringify({
      appearance,
      colorScheme,
      radius
    }));
    
    document.documentElement.setAttribute('data-theme', appearance === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : appearance);
    
    document.documentElement.style.setProperty('--theme-primary', colorScheme.primary);
    document.documentElement.style.setProperty('--theme-radius', `${radius}rem`);
    
    fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(themeConfig),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to update theme');
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
