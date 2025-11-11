import { useState, useRef, useEffect } from 'react';
import { Pipette, Lock, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useThemeGating } from '@/hooks/useThemeGating';
import { calculateContrast } from '@/utils/contrastValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BackgroundColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const BackgroundColorPicker = ({
  currentColor,
  onColorChange,
}: BackgroundColorPickerProps) => {
  const { canAccessBackgroundColor, handleLockedBackgroundColor } = useThemeGating();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Parse initial HSL
  const parseHsl = (hsl: string) => {
    const parts = hsl.split(' ');
    return {
      h: parseFloat(parts[0]),
      s: parseFloat(parts[1]),
      l: parseFloat(parts[2])
    };
  };

  const initialHsl = parseHsl(currentColor);
  const [hue, setHue] = useState(initialHsl.h);
  const [saturation, setSaturation] = useState(initialHsl.s);
  const [lightness, setLightness] = useState(initialHsl.l);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hexValue, setHexValue] = useState('');
  const [contrastWarning, setContrastWarning] = useState<string | null>(null);

  const isLocked = !canAccessBackgroundColor();

  // Convert HSL to RGB
  useEffect(() => {
    const hslToRgb = (h: number, s: number, l: number) => {
      s = s / 100;
      l = l / 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
      else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
      else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
      else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
      else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
      else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    };

    const newRgb = hslToRgb(hue, saturation, lightness);
    setRgb(newRgb);
    
    const hex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`;
    setHexValue(hex);

    if (!isLocked) {
      const hsl = `${hue} ${saturation}% ${lightness}%`;
      onColorChange(hsl);

      // Validate contrast
      const lightTextContrast = calculateContrast('0 0% 100%', hsl);
      const darkTextContrast = calculateContrast('0 0% 9%', hsl);
      const bestContrast = Math.max(lightTextContrast, darkTextContrast);

      if (bestContrast < 4.5) {
        setContrastWarning(`Low contrast (${bestContrast.toFixed(2)}:1). Text may be hard to read.`);
      } else {
        setContrastWarning(null);
      }
    }
  }, [hue, saturation, lightness, isLocked, onColorChange]);

  // Draw gradient canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw saturation gradient (left to right)
    for (let x = 0; x < width; x++) {
      const s = (x / width) * 100;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      
      // Top: light (high lightness)
      gradient.addColorStop(0, `hsl(${hue}, ${s}%, 100%)`);
      // Middle: pure color
      gradient.addColorStop(0.5, `hsl(${hue}, ${s}%, 50%)`);
      // Bottom: dark (low lightness)
      gradient.addColorStop(1, `hsl(${hue}, ${s}%, 0%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 1, height);
    }
  }, [hue]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLocked) {
      handleLockedBackgroundColor();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSaturation = (x / rect.width) * 100;
    const newLightness = 100 - (y / rect.height) * 100;

    setSaturation(Math.max(0, Math.min(100, newSaturation)));
    setLightness(Math.max(0, Math.min(100, newLightness)));
  };

  const handleCanvasMouseDown = () => {
    if (!isLocked) setIsDragging(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || isLocked) return;
    handleCanvasClick(e);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    if (isLocked) return;
    
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: numValue };
    setRgb(newRgb);

    // Convert RGB to HSL
    const r = newRgb.r / 255;
    const g = newRgb.g / 255;
    const b = newRgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    setHue(Math.round(h * 360));
    setSaturation(Math.round(s * 100));
    setLightness(Math.round(l * 100));
  };

  const handleHexChange = (hex: string) => {
    if (isLocked) return;
    
    setHexValue(hex);
    
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      handleRgbChange('r', r.toString());
      setRgb({ r, g, b });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Pipette className="h-4 w-4" />
          Background Color
          {isLocked && (
            <span className="text-xs text-muted-foreground">(Elite only)</span>
          )}
        </Label>
        {isLocked && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <Lock className="h-3 w-3 text-purple-500" />
            <span className="text-xs font-medium text-purple-500">Elite</span>
          </div>
        )}
      </div>

      <div className={`relative space-y-3 ${isLocked ? 'opacity-60' : ''}`}>
        {/* Color Gradient Picker */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={160}
            className={`w-full h-40 rounded-lg border-2 border-border shadow-sm ${
              isLocked ? 'cursor-not-allowed' : 'cursor-crosshair'
            }`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onClick={handleCanvasClick}
          />
          
          {/* Color Picker Indicator */}
          {!isLocked && (
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
              style={{
                left: `${(saturation / 100) * 100}%`,
                top: `${((100 - lightness) / 100) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleLockedBackgroundColor}
              >
                <Lock className="h-3 w-3" />
                Unlock with Elite
              </Button>
            </div>
          )}
        </div>

        {/* Hue Slider */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Hue</Label>
          <Slider
            value={[hue]}
            onValueChange={([value]) => !isLocked && setHue(value)}
            max={360}
            step={1}
            disabled={isLocked}
            className="w-full"
            style={{
              background: isLocked ? undefined : 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            }}
          />
        </div>

        {/* RGB Inputs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">R</Label>
            <Input
              type="number"
              value={rgb.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
              min={0}
              max={255}
              disabled={isLocked}
              className="text-center text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">G</Label>
            <Input
              type="number"
              value={rgb.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
              min={0}
              max={255}
              disabled={isLocked}
              className="text-center text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">B</Label>
            <Input
              type="number"
              value={rgb.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
              min={0}
              max={255}
              disabled={isLocked}
              className="text-center text-sm"
            />
          </div>
        </div>

        {/* Hex Input with Color Preview */}
        <div className="flex gap-2">
          <div
            className="w-12 h-10 rounded-md border-2 border-border shadow-sm flex-shrink-0"
            style={{ backgroundColor: hexValue }}
          />
          <Input
            type="text"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 font-mono text-sm"
            disabled={isLocked}
          />
        </div>

        {/* Contrast Warning */}
        {!isLocked && contrastWarning && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {contrastWarning}
            </AlertDescription>
          </Alert>
        )}

        {!isLocked && !contrastWarning && (
          <p className="text-xs text-muted-foreground">
            Choose any background color. Ensure good contrast with text.
          </p>
        )}
      </div>
    </div>
  );
};

