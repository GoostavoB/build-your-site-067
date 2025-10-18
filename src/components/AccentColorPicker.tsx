import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Blue', value: '#3B82F6', hsl: '217 91% 60%' },
  { name: 'Green', value: '#22C55E', hsl: '142 71% 45%' },
  { name: 'Purple', value: '#8B5CF6', hsl: '258 90% 66%' },
  { name: 'Red', value: '#EF4444', hsl: '0 84% 60%' },
];

export function AccentColorPicker() {
  const { user } = useAuth();
  const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[0].value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccentColor();
  }, [user]);

  const fetchAccentColor = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_settings')
      .select('accent_color')
      .eq('user_id', user.id)
      .single();
    
    if (data?.accent_color) {
      setSelectedColor(data.accent_color);
    }
  };

  const handleColorChange = async (color: string, hsl: string) => {
    if (!user) return;
    
    setSelectedColor(color);
    setLoading(true);

    const { error } = await supabase
      .from('user_settings')
      .update({ accent_color: color })
      .eq('user_id', user.id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update accent color');
    } else {
      // Update CSS variable
      document.documentElement.style.setProperty('--accent', hsl);
      document.documentElement.style.setProperty('--chart-1', hsl);
      toast.success('Accent color updated!');
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-semibold mb-2">Accent Color</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Choose your preferred accent color for charts, buttons, and highlights
      </p>
      
      <div className="grid grid-cols-4 gap-4">
        {ACCENT_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => handleColorChange(color.value, color.hsl)}
            disabled={loading}
            className="relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50"
            style={{
              borderColor: selectedColor === color.value ? color.value : 'transparent',
              backgroundColor: selectedColor === color.value ? `${color.value}10` : 'transparent'
            }}
          >
            <div
              className="w-12 h-12 rounded-full transition-transform"
              style={{ backgroundColor: color.value }}
            />
            {selectedColor === color.value && (
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color.value }}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-sm font-medium">{color.name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
