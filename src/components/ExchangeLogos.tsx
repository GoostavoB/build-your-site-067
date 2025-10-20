import { motion } from "framer-motion";

const ExchangeLogos = () => {
  const exchanges = [
    { name: "Binance", icon: "💱" },
    { name: "Bybit", icon: "🔷" },
    { name: "Coinbase", icon: "🔵" },
    { name: "OKX", icon: "⚫" },
    { name: "Kraken", icon: "🐙" },
  ];

  return (
    <section className="py-16 md:py-20 px-6 relative overflow-hidden bg-gray-900/30">
      <div className="absolute inset-0 border-t border-b border-primary/10"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Built for <span className="text-gradient-primary">crypto traders</span> who take performance seriously.
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you scalp, day trade, or swing — track what's working and what's costing you.
          </p>

          {/* Exchange logos */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 pt-4">
            {exchanges.map((exchange, index) => (
              <motion.div
                key={exchange.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all duration-300">
                    {exchange.icon}
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {exchange.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExchangeLogos;
