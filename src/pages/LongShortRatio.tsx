import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface LongShortData {
  symbol: string;
  longShortRatio: string;
  longAccount: string;
  shortAccount: string;
  timestamp: string;
}

const LongShortRatio = () => {
  const [data, setData] = useState<LongShortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1h");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=${period}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching long/short ratio:", error);
      toast({
        title: "Error",
        description: "Failed to fetch long/short ratio data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, symbol]);

  const chartData = data.map((item) => ({
    time: new Date(parseInt(item.timestamp)).toLocaleString(),
    longShortRatio: parseFloat(item.longShortRatio),
    longAccount: parseFloat(item.longAccount) * 100,
    shortAccount: parseFloat(item.shortAccount) * 100,
  }));

  const latestData = data[data.length - 1];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">BTC Long/Short Ratio</h1>
          <p className="text-muted-foreground mt-2">
            Monitor the long/short account ratio of all traders
          </p>
        </div>

        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                  <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                  <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Time Period</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="30m">30 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="2h">2 Hours</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="12h">12 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Long/Short Ratio</CardTitle>
                  <CardDescription>Current ratio</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {latestData ? parseFloat(latestData.longShortRatio).toFixed(4) : "N/A"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Long Accounts</CardTitle>
                  <CardDescription>Percentage of long positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-neon-green">
                    {latestData ? (parseFloat(latestData.longAccount) * 100).toFixed(2) : "N/A"}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Short Accounts</CardTitle>
                  <CardDescription>Percentage of short positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-neon-red">
                    {latestData ? (parseFloat(latestData.shortAccount) * 100).toFixed(2) : "N/A"}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Long/Short Ratio History</CardTitle>
                <CardDescription>Historical trend of long/short account ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs text-muted-foreground"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs text-muted-foreground"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="longShortRatio" 
                      stroke="hsl(var(--primary))" 
                      name="Long/Short Ratio"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Distribution</CardTitle>
                <CardDescription>Percentage of long vs short accounts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs text-muted-foreground"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs text-muted-foreground"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="longAccount" 
                      stroke="#10b981" 
                      name="Long Accounts %"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="shortAccount" 
                      stroke="#ef4444" 
                      name="Short Accounts %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default LongShortRatio;
