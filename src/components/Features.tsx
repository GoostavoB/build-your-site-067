import { TrendingUp, PieChart, Target, Zap, Shield, BarChart } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track ROI, win rates, and profit evolution with powerful real-time analytics and visualizations.",
  },
  {
    icon: PieChart,
    title: "Trade Journaling",
    description: "Document every trade with emotional tags, setups, and screenshots for comprehensive analysis.",
  },
  {
    icon: Target,
    title: "Equity Forecasting",
    description: "Project future equity based on historical performance with advanced forecasting models.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Get actionable insights from your trading patterns and emotional states during trades.",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Bank-level encryption keeps your trading data secure and private at all times.",
  },
  {
    icon: BarChart,
    title: "Advanced Charts",
    description: "Visualize performance with hourly heatmaps, asset analysis, and setup distribution charts.",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Built for <span className="text-gradient-primary">Elite Traders</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to analyze, improve, and dominate your trading game.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass backdrop-blur-[12px] rounded-2xl p-6 md:p-7 hover-lift transition-all shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-3 inline-block p-2.5 glass-subtle rounded-xl">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
