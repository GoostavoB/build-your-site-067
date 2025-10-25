import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const IntegrationsBlock = () => {
  const exchanges = [
    "Binance", "Bybit", "OKX", "Bitget", "Coinbase", 
    "Kucoin", "Bitfinex", "Deribit", "BingX"
  ];

  return (
    <section className="py-20 md:py-28 px-6" aria-label="Supported exchanges">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Works with Your Exchange
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Supported platforms
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {exchanges.map((exchange, index) => (
              <motion.div
                key={exchange}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-6 py-3 bg-background/60 backdrop-blur-md border border-primary/20 rounded-xl font-medium hover:border-primary/40 transition-all"
              >
                {exchange}
              </motion.div>
            ))}
          </div>

          <Link 
            to="/exchanges"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            See all integrations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsBlock;
