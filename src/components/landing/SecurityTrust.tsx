import { Shield, Lock, Database } from "lucide-react";
import { motion } from "framer-motion";

const SecurityTrust = () => {
  const features = [
    {
      icon: Shield,
      title: "Encrypted data",
      description: "Bank-level encryption"
    },
    {
      icon: Database,
      title: "Local imports",
      description: "Process data securely"
    },
    {
      icon: Lock,
      title: "Access control",
      description: "Per account security"
    }
  ];

  return (
    <section className="py-16 px-6 bg-primary/5" aria-label="Security features">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;
