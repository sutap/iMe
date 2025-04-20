import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useTheme, ColorScheme, COLOR_SCHEMES } from '@/hooks/use-theme';
import { Check, Moon, Sun, Monitor } from 'lucide-react';

export function ThemeSelector() {
  const { appearance, setAppearance, colorScheme, setColorScheme, radius, setRadius, applyTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>("color");
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>(colorScheme);
  const [selectedAppearance, setSelectedAppearance] = useState<'light' | 'dark' | 'system'>(appearance);
  const [selectedRadius, setSelectedRadius] = useState<number>(radius);

  const handleApply = () => {
    setColorScheme(selectedScheme);
    setAppearance(selectedAppearance);
    setRadius(selectedRadius);
    applyTheme();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize the look and feel of your iMe app</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="color">Color Scheme</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="rounding">Rounding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="color">
            <div className="space-y-4">
              <Label className="block mb-2">Choose a color scheme</Label>
              <div className="grid grid-cols-1 gap-3">
                {COLOR_SCHEMES.map((scheme) => (
                  <div
                    key={scheme.name}
                    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer border-2 ${
                      selectedScheme.name === scheme.name 
                        ? 'border-primary' 
                        : 'border-border'
                    }`}
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <span className="flex-grow">{scheme.name}</span>
                    {selectedScheme.name === scheme.name && <Check className="w-5 h-5 text-primary" />}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="space-y-4">
              <Label className="block mb-2">Choose appearance mode</Label>
              <RadioGroup
                value={selectedAppearance}
                onValueChange={(value) => setSelectedAppearance(value as 'light' | 'dark' | 'system')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center cursor-pointer">
                    <Sun className="w-5 h-5 mr-2" />
                    Light Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center cursor-pointer">
                    <Moon className="w-5 h-5 mr-2" />
                    Dark Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center cursor-pointer">
                    <Monitor className="w-5 h-5 mr-2" />
                    System Default
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="rounding">
            <div className="space-y-4">
              <div className="mb-4">
                <Label className="block mb-2">Border Radius</Label>
                <div className="flex items-center space-x-2">
                  <span>Subtle</span>
                  <Slider
                    value={[selectedRadius]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(values) => setSelectedRadius(values[0])}
                    className="flex-grow"
                  />
                  <span>Rounded</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div 
                  className="h-20 bg-primary flex items-center justify-center text-primary-foreground"
                  style={{ borderRadius: `${selectedRadius * 0.5}rem` }}
                >
                  Preview
                </div>
                <div 
                  className="h-20 bg-secondary flex items-center justify-center text-secondary-foreground"
                  style={{ borderRadius: `${selectedRadius * 0.5}rem` }}
                >
                  Preview
                </div>
                <div 
                  className="h-20 bg-accent flex items-center justify-center text-accent-foreground"
                  style={{ borderRadius: `${selectedRadius * 0.5}rem` }}
                >
                  Preview
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setSelectedScheme(colorScheme);
          setSelectedAppearance(appearance);
          setSelectedRadius(radius);
        }}>
          Reset
        </Button>
        <Button onClick={handleApply}>Apply Changes</Button>
      </CardFooter>
    </Card>
  );
}