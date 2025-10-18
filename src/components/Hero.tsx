import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, LineChart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bullBearRealistic from "@/assets/bull-bear-realistic.png";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0C0E]">
      {/* Base Background with Gradient Light Effects */}
      <div className="absolute inset-0 bg-[#0B0C0E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
      </div>

      {/* Bull vs Bear - Full Scene with Parallax */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{
          transform: `scale(${1 + scrollY * 0.0002}) translateY(${scrollY * 0.15}px)`,
          opacity: Math.max(0.15 - scrollY * 0.00015, 0.05),
          transition: 'transform 0.1s ease-out',
        }}
      >
        <img 
          src={bullBearRealistic} 
          alt="Bull vs Bear battle"
          className="w-full h-full object-cover"
          style={{
            minWidth: '100vw',
            minHeight: '100vh',
            objectPosition: 'center',
          }}
        />
      </div>

      {/* Subtle Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[180px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="hidden md:flex justify-center mb-8 gap-6 opacity-70">
          <TrendingUp className="text-foreground/70 hover:text-accent transition-all duration-300 hover:scale-110" size={48} />
          <BarChart3 className="text-foreground/70 hover:text-accent transition-all duration-300 hover:scale-110" size={48} />
          <LineChart className="text-foreground/70 hover:text-accent transition-all duration-300 hover:scale-110" size={48} />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            The Trading Diary
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-4 text-foreground/90">
          Upload your trade. Track your performance.
        </p>
        
        <p className="text-base md:text-lg mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The premium trading journal built for serious traders who demand precision, 
          clarity, and the competitive edge to consistently outperform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-10 py-7 bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/auth')}
            className="text-lg px-10 py-7 border-2 border-border/50 text-foreground hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:scale-105"
          >
            Try for Free
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center group cursor-default">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              10K+
            </div>
            <div className="text-sm md:text-base text-muted-foreground">Active Traders</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              2M+
            </div>
            <div className="text-sm md:text-base text-muted-foreground">Trades Logged</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              98%
            </div>
            <div className="text-sm md:text-base text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
