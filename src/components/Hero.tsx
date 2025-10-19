import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bullBearRealistic from "@/assets/bull-bear-realistic.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bullBearRealistic} 
          alt="Trading background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[30px]"></div>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[180px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content - Centered Column */}
      <div className="relative z-10 w-full max-w-[720px] mx-auto px-6 text-center py-[8vh] md:py-[12vh] flex flex-col items-center gap-6">
        {/* Icons Row */}
        <div className="flex justify-center gap-4 md:gap-6 animate-fade-in">
          <div className="p-3 md:p-4 glass rounded-xl hover-lift transition-all">
            <TrendingUp className="text-primary" size={32} />
          </div>
          <div className="p-3 md:p-4 glass rounded-xl hover-lift transition-all">
            <BarChart3 className="text-primary" size={32} />
          </div>
          <div className="p-3 md:p-4 glass rounded-xl hover-lift transition-all">
            <Upload className="text-primary" size={32} />
          </div>
        </div>
        
        {/* Headline */}
        <h1 
          className="font-bold tracking-tight leading-tight animate-fade-in"
          style={{ 
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            animationDelay: '0.1s' 
          }}
        >
          <span className="text-gradient-primary">
            The Trading Diary
          </span>
        </h1>
        
        {/* Subtitle */}
        <p 
          className="font-medium animate-fade-in"
          style={{ 
            fontSize: '1.1rem',
            color: 'hsl(var(--foreground) / 0.7)',
            animationDelay: '0.2s' 
          }}
        >
          Upload your trade. Track your performance.
        </p>
        
        {/* Description */}
        <p 
          className="text-muted-foreground max-w-[540px] leading-relaxed animate-fade-in"
          style={{ 
            lineHeight: '1.5',
            animationDelay: '0.3s' 
          }}
        >
          Built for traders who demand precision and clarity.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto px-7 py-6 text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto px-7 py-6 text-base font-medium rounded-xl glass backdrop-blur-[10px] border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all shadow-md hover:shadow-lg hover:scale-105"
            variant="outline"
          >
            Try for Free
          </Button>
        </div>

        {/* Stats Row - Glass Cards */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto animate-fade-in mt-8" style={{ animationDelay: '0.5s' }}>
          <div className="glass backdrop-blur-[12px] rounded-2xl p-5 text-center min-w-[180px] shadow-sm hover-lift transition-all">
            <div className="text-3xl font-semibold mb-1" style={{ color: 'hsl(var(--primary))' }}>
              10K+
            </div>
            <div className="text-sm text-muted-foreground">Active Traders</div>
          </div>
          <div className="glass backdrop-blur-[12px] rounded-2xl p-5 text-center min-w-[180px] shadow-sm hover-lift transition-all">
            <div className="text-3xl font-semibold mb-1" style={{ color: 'hsl(var(--primary))' }}>
              2M+
            </div>
            <div className="text-sm text-muted-foreground">Trades Logged</div>
          </div>
          <div className="glass backdrop-blur-[12px] rounded-2xl p-5 text-center min-w-[180px] shadow-sm hover-lift transition-all">
            <div className="text-3xl font-semibold mb-1" style={{ color: 'hsl(var(--primary))' }}>
              98%
            </div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
