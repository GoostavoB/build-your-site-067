import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for beginners getting started",
    features: [
      "Up to 50 trades per month",
      "Basic analytics & charts",
      "Manual trade entry",
      "7-day data retention",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious traders who need more",
    features: [
      "Unlimited trades",
      "Advanced analytics & forecasting",
      "AI-powered trade extraction",
      "Unlimited data retention",
      "Priority support",
      "Custom setups & tags",
      "Export reports",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Elite",
    price: "$49",
    period: "per month",
    description: "For professional traders & teams",
    features: [
      "Everything in Pro",
      "Multi-account tracking",
      "API access",
      "White-label reports",
      "Dedicated account manager",
      "Early access to features",
      "Team collaboration tools",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your trading style. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass backdrop-blur-[12px] rounded-2xl p-6 md:p-7 relative hover-lift transition-all shadow-sm animate-fade-in ${
                plan.popular ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl md:text-2xl font-bold mb-1.5">{plan.name}</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-3">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold" style={{ color: 'hsl(var(--primary))' }}>{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/auth')}
                className={`w-full mb-5 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                    : "glass border border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-2.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check
                      size={18}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-primary" : "text-foreground"
                      }`}
                    />
                    <span className="text-xs md:text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-xs md:text-sm mt-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          All plans include 14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default Pricing;
