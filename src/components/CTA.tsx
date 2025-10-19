import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl glass-strong backdrop-blur-[20px] p-8 md:p-16 shadow-xl animate-fade-in">
          {/* Subtle Glow Effects */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              Ready to <span className="text-gradient-primary">Level Up</span><br className="hidden sm:block" />
              Your Trading?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of traders who are already using The Trading Diary to track, 
              analyze, and improve their trading performance.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="px-7 py-6 text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 group"
            >
              <span className="flex items-center">
                Get Started Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <p className="mt-5 text-xs md:text-sm text-muted-foreground">
              Free 14-day trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
