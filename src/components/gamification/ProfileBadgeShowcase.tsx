import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useXPSystem } from '@/hooks/useXPSystem';
import { Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

export const ProfileBadgeShowcase = () => {
  const { user } = useAuth();
  const { xpData } = useXPSystem();
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('badge-showcase');
    if (!element) return;

    setGenerating(true);
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = 'my-trading-badges.png';
      link.href = dataUrl;
      link.click();

      toast.success('Badge showcase downloaded!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Trading Achievements',
      text: `Check out my trading progress! Level ${xpData?.currentLevel} with ${xpData?.totalXPEarned} XP earned! 🏆`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      toast.success('Share text copied to clipboard!');
    }
  };

  if (!user || !xpData) return null;

  const initials = (user.email?.substring(0, 2) || 'U').toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Showcase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          id="badge-showcase"
          className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-lg space-y-4"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-xl">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">Level {xpData.currentLevel}</Badge>
                <Badge variant="secondary">{xpData.totalXPEarned} XP</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-2xl font-bold">🏆</p>
              <p className="text-xs text-muted-foreground mt-1">Trading Champion</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">🔥</p>
              <p className="text-xs text-muted-foreground mt-1">Hot Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">💎</p>
              <p className="text-xs text-muted-foreground mt-1">Diamond Hands</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} disabled={generating} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
