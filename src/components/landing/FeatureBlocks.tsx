import { motion } from "framer-motion";
import { Zap, DollarSign, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

const FeatureBlocks = () => {
  const features = [
    {
      icon: Zap,
      title: "40× Faster Uploads",
      description: "Batch upload from screenshots. No manual logging.",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: DollarSign,
      title: "Know Every Fee",
      description: "Compare exchanges and uncover hidden costs.",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: Palette,
      title: "Your Dashboard, Your Rules",
      description: "Customize layout, metrics, and colors.",
      gradient: "from-purple-500/20 to-purple-500/5"
    }
  ];

  return (
    <section className="py-16 px-4 lg:hidden">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`p-6 glass-strong border-primary/20 bg-gradient-to-br ${feature.gradient}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureBlocks;
