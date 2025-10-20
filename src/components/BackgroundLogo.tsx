import { cn } from "@/lib/utils";

interface BackgroundLogoProps {
  position?: "left" | "right" | "center";
  className?: string;
  opacity?: number;
}

export const BackgroundLogo = ({ 
  position = "center", 
  className,
  opacity = 0.03 
}: BackgroundLogoProps) => {
  const positionClasses = {
    left: "left-0 -translate-x-1/3",
    right: "right-0 translate-x-1/3",
    center: "left-1/2 -translate-x-1/2"
  };

  return (
    <div 
      className={cn(
        "absolute top-1/2 -translate-y-1/2 pointer-events-none select-none z-0",
        positionClasses[position],
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Giant TD Monogram */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[800px] h-[800px] text-primary blur-[2px]"
      >
        <defs>
          {/* Gradient for premium feel */}
          <linearGradient id="bgLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        
        {/* T letter - vertical and horizontal bars */}
        {/* Horizontal top bar of T */}
        <rect
          x="8"
          y="10"
          width="24"
          height="5"
          fill="url(#bgLogoGradient)"
        />
        
        {/* Vertical stem of T */}
        <rect
          x="17"
          y="10"
          width="6"
          height="28"
          fill="url(#bgLogoGradient)"
        />
        
        {/* D letter - intertwined with T */}
        {/* Vertical bar of D */}
        <rect
          x="25"
          y="15"
          width="6"
          height="23"
          fill="url(#bgLogoGradient)"
        />
        
        {/* Curved part of D - using path for smooth curve */}
        <path
          d="M 31 15 L 38 15 Q 42 15 42 19 L 42 34 Q 42 38 38 38 L 31 38 Z"
          fill="url(#bgLogoGradient)"
        />
        
        {/* Inner curve cutout of D */}
        <path
          d="M 31 20 L 35 20 Q 37 20 37 22 L 37 31 Q 37 33 35 33 L 31 33 Z"
          fill="hsl(var(--background))"
        />
        
        {/* Subtle border for definition */}
        <rect
          x="7"
          y="9"
          width="36"
          height="30"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
      </svg>
    </div>
  );
};
