import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, TrendingUp, Target } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface PerformanceCardProps {
  weeklyStats: {
    totalTrades: number;
    winRate: number;
    profitLoss: number;
    bestTrade: number;
    roi: number;
  };
  badges?: string[];
}

export const PerformanceCard = ({ weeklyStats, badges = [] }: PerformanceCardProps) => {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('performance-card');
    if (!element) return;

    setGenerating(true);
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = 'weekly-performance.png';
      link.href = dataUrl;
      link.click();

      toast.success('Performance card downloaded!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareText = `My week in trading:\n📊 ${weeklyStats.totalTrades} trades\n✅ ${weeklyStats.winRate.toFixed(1)}% win rate\n💰 $${weeklyStats.profitLoss.toFixed(2)} P/L\n🏆 Best trade: $${weeklyStats.bestTrade.toFixed(2)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Weekly Trading Performance',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Performance stats copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4">
      <div
        id="performance-card"
        className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-6 rounded-lg space-y-4"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Weekly Performance</h3>
          <p className="text-sm text-muted-foreground">My Trading Journey</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{weeklyStats.totalTrades}</p>
              <p className="text-xs text-muted-foreground">Total Trades</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{weeklyStats.winRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-bold text-green-500">
                ${weeklyStats.profitLoss.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Total P/L</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-bold text-yellow-500">
                ${weeklyStats.bestTrade.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Best Trade</p>
            </CardContent>
          </Card>
        </div>

        {badges.length > 0 && (
          <div className="flex justify-center gap-2 pt-2 border-t border-border/50">
            {badges.map((badge, idx) => (
              <span key={idx} className="text-2xl">{badge}</span>
            ))}
          </div>
        )}
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
    </div>
  );
};
