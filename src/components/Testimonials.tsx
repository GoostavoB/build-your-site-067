import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quoteKey: "landing.testimonials.testimonial3.quote",
      authorKey: "landing.testimonials.testimonial3.author",
      roleKey: "landing.testimonials.testimonial3.role",
      exchangeKey: "landing.testimonials.testimonial3.exchange",
      timeframeKey: "landing.testimonials.testimonial3.timeframe"
    },
    {
      quoteKey: "landing.testimonials.testimonial4.quote",
      authorKey: "landing.testimonials.testimonial4.author",
      roleKey: "landing.testimonials.testimonial4.role",
      exchangeKey: "landing.testimonials.testimonial4.exchange",
      timeframeKey: "landing.testimonials.testimonial4.timeframe"
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-20 md:py-28 px-6" aria-labelledby="testimonials-heading">
      <div className="container mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="testimonials-heading" className="text-2xl md:text-3xl font-bold mb-3">
            {t('landing.testimonials.sectionTitle')}
          </h2>
          <div className="flex items-center justify-center gap-1 text-primary" aria-label="5 star rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-primary" aria-hidden="true" />
            ))}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" role="list">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={index}
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card border border-primary/20 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                {/* Avatar with Initials */}
                <div 
                  className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm"
                  aria-hidden="true"
                >
                  {getInitials(t(testimonial.authorKey))}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Quote */}
                  <blockquote className="text-sm md:text-base text-foreground mb-4 italic leading-relaxed line-clamp-3">
                    "{t(testimonial.quoteKey)}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sm text-foreground">
                      {t(testimonial.authorKey)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(testimonial.roleKey)} • {t(testimonial.exchangeKey)} • {t(testimonial.timeframeKey)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
