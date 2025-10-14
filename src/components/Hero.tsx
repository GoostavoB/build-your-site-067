import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, LineChart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
      </div>

      {/* Animated Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-green/20 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex justify-center mb-6 gap-4 animate-glow">
          <TrendingUp className="text-neon-green" size={48} />
          <BarChart3 className="text-neon-cyan" size={48} />
          <LineChart className="text-neon-green" size={48} />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="gradient-text">BullBear</span>
          <br />
          Journal
        </h1>
        
        <p className="text-2xl md:text-3xl font-light mb-4 text-muted-foreground">
          Your trades. Your data. Your edge.
        </p>
        
        <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
          The premium trading journal for serious traders. Track performance, analyze patterns, 
          and gain the competitive edge you need to consistently win.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-neon hover:opacity-90 text-primary-foreground font-semibold shadow-lg shadow-neon-green/50"
          >
            Start Trading Smarter
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
          >
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-muted-foreground">Active Traders</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">2M+</div>
            <div className="text-muted-foreground">Trades Logged</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
