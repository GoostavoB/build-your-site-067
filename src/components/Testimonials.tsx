import { Star, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Day Trader",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    rating: 5,
    text: "Win rate went from 52% to 68% in 3 months."
  },
  {
    name: "Sarah Mitchell",
    role: "Crypto Investor",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    text: "The emotional tags feature is genius... My consistency has never been better."
  },
  {
    name: "Marcus Rodriguez",
    role: "Swing Trader",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    rating: 5,
    text: "AI extraction saves me 2 hours per week... Worth every penny."
  }
];

const Testimonials = () => {
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
            Trusted by <span className="text-gradient-primary">Thousands</span> of Traders
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real traders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm truncate">{testimonial.name}</h4>
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  "{testimonial.text}"
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
