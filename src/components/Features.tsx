import { Upload, Zap, TrendingUp, Target, Smartphone } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Upload,
    title: "Smart Trade Logging",
    description: "Add trades in seconds with details, screenshots, and notes."
  },
  {
    icon: Zap,
    title: "Auto Imports",
    description: "Connect your exchange or broker for instant sync."
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Visualize win rates, risk ratios, and strategy performance."
  },
  {
    icon: Target,
    title: "Tag and Filter Everything",
    description: "Track setups, emotions, and mistakes with custom metrics."
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access your journal anywhere — phone, tablet, or desktop."
  }
];

const Features = () => {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Everything You Need to <span className="text-gradient-primary">Trade Better</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you make better decisions.
          </p>
        </motion.div>

        {/* 3-2 grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard
                className="p-5 group hover:shadow-lg transition-all duration-300 h-full"
                hover
              >
                <div className="mb-3 inline-block p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {features.slice(3, 5).map((feature, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index + 3) * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard
                className="p-5 group hover:shadow-lg transition-all duration-300 h-full"
                hover
              >
                <div className="mb-3 inline-block p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
