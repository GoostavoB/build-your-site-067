import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from "@/components/ui/card";

interface AssetPerformanceRadarProps {
  data: Array<{
    asset: string;
    winRate: number;
    avgProfit: number;
    tradeCount: number;
    roi: number;
  }>;
}

export const AssetPerformanceRadar = ({ data }: AssetPerformanceRadarProps) => {
  // Limit to top 5 assets by win rate
  const topAssets = data
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);

  // Normalize data for radar chart with 5 metrics (scale 0-100)
  const normalizedData = topAssets.map(item => ({
    asset: item.asset,
    'Win Rate': item.winRate,
    'ROI': Math.min((item.roi / 100) * 100, 100),
    'Trade Volume': Math.min((item.tradeCount / Math.max(...topAssets.map(d => d.tradeCount))) * 100, 100),
    'Avg Profit': Math.min((item.avgProfit / Math.max(...topAssets.map(d => d.avgProfit))) * 100, 100),
    'Consistency': Math.min((item.tradeCount * item.winRate) / 100, 100), // Calculated metric
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Asset Performance Radar</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={normalizedData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="asset" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Radar 
            name="Win Rate" 
            dataKey="Win Rate" 
            stroke="hsl(var(--primary))" 
            fill="hsl(var(--primary))" 
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar 
            name="ROI" 
            dataKey="ROI" 
            stroke="hsl(var(--secondary))" 
            fill="hsl(var(--secondary))" 
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar 
            name="Trade Volume" 
            dataKey="Trade Volume" 
            stroke="hsl(var(--accent))" 
            fill="hsl(var(--accent))" 
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar 
            name="Avg Profit" 
            dataKey="Avg Profit" 
            stroke="hsl(var(--chart-4))" 
            fill="hsl(var(--chart-4))" 
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar 
            name="Consistency" 
            dataKey="Consistency" 
            stroke="hsl(var(--chart-5))" 
            fill="hsl(var(--chart-5))" 
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};
