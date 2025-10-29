import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface GradientConfig {
  type: 'linear';
  angle: number;
  color1: string;
  color2: string;
}

interface GradientBuilderProps {
  value?: GradientConfig;
  onChange: (gradient: GradientConfig) => void;
  disabled?: boolean;
}

export const GradientBuilder = ({ value, onChange, disabled }: GradientBuilderProps) => {
  const [mode, setMode] = useState<'solid' | 'gradient'>(
    value?.color1 === value?.color2 ? 'solid' : 'gradient'
  );
  const [color1, setColor1] = useState(value?.color1 || '#667eea');
  const [color2, setColor2] = useState(value?.color2 || '#764ba2');
  const [angle, setAngle] = useState(value?.angle || 135);

  useEffect(() => {
    if (mode === 'solid') {
      onChange({ type: 'linear', angle: 0, color1, color2: color1 });
    } else {
      onChange({ type: 'linear', angle, color1, color2 });
    }
  }, [mode, color1, color2, angle]);

  const previewStyle = mode === 'solid' 
    ? { background: color1 } 
    : { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === 'solid' ? 'default' : 'outline'}
          onClick={() => setMode('solid')}
          disabled={disabled}
          className="flex-1"
        >
          Solid Color
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'gradient' ? 'default' : 'outline'}
          onClick={() => setMode('gradient')}
          disabled={disabled}
          className="flex-1"
        >
          Gradient
        </Button>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Color {mode === 'gradient' ? '1' : ''}</Label>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            disabled={disabled}
            className="w-full h-12 rounded-lg cursor-pointer border border-border"
          />
        </div>
        {mode === 'gradient' && (
          <div className="space-y-2">
            <Label className="text-xs">Color 2</Label>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              disabled={disabled}
              className="w-full h-12 rounded-lg cursor-pointer border border-border"
            />
          </div>
        )}
      </div>

      {/* Angle Slider (for gradient) */}
      {mode === 'gradient' && (
        <div className="space-y-2">
          <Label className="text-xs">Gradient Angle: {angle}°</Label>
          <Slider
            value={[angle]}
            onValueChange={([val]) => setAngle(val)}
            min={0}
            max={360}
            step={15}
            disabled={disabled}
            className="w-full"
          />
        </div>
      )}

      {/* Live Preview */}
      <div
        className="h-24 rounded-lg border-2 border-border transition-all"
        style={previewStyle}
      />
    </div>
  );
};
