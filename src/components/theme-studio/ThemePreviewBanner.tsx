import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';

interface ThemePreviewBannerProps {
  themeName: string;
  onApply: () => void;
  onCancel: () => void;
}

export const ThemePreviewBanner = ({ 
  themeName, 
  onApply, 
  onCancel 
}: ThemePreviewBannerProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-in-down">
      <div className="bg-card border-2 border-primary shadow-lg rounded-xl p-4 min-w-[320px]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-semibold">Previewing Theme</p>
            <p className="text-xs text-muted-foreground">{themeName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-8 gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={onApply}
              className="h-8 gap-1"
            >
              <Check className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
