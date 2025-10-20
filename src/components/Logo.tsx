import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "horizontal";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "h-6 w-6", text: "text-sm" },
  md: { icon: "h-8 w-8", text: "text-base" },
  lg: { icon: "h-10 w-10", text: "text-lg" },
  xl: { icon: "h-12 w-12", text: "text-xl" },
};

export const Logo = ({ 
  size = "md", 
  variant = "full", 
  showText = true,
  className 
}: LogoProps) => {
  const { icon, text } = sizeMap[size];
  const iconOnly = variant === "icon" || !showText;

  return (
    <div className={cn(
      "flex items-center gap-3",
      variant === "full" && "flex-col",
      variant === "horizontal" && "flex-row",
      className
    )}>
      {/* Book + Chart Hybrid Icon */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(icon, "shrink-0")}
        aria-label="The Trading Diary Logo"
      >
        {/* Book outline */}
        <rect
          x="8"
          y="6"
          width="32"
          height="36"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-primary"
        />
        
        {/* Book spine */}
        <line
          x1="12"
          y1="6"
          x2="12"
          y2="42"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-primary opacity-60"
        />
        
        {/* Candlestick chart pattern inside book */}
        {/* Candle 1 - Bearish */}
        <line x1="18" y1="28" x2="18" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
        <rect x="16.5" y="24" width="3" height="4" fill="currentColor" className="text-destructive" />
        <line x1="18" y1="20" x2="18" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
        
        {/* Candle 2 - Bullish */}
        <line x1="24" y1="26" x2="24" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-success" />
        <rect x="22.5" y="18" width="3" height="8" fill="currentColor" className="text-success" />
        <line x1="24" y1="14" x2="24" y2="18" stroke="currentColor" strokeWidth="1.5" className="text-success" />
        
        {/* Candle 3 - Bullish */}
        <line x1="30" y1="22" x2="30" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-success" />
        <rect x="28.5" y="16" width="3" height="6" fill="currentColor" className="text-success" />
        <line x1="30" y1="12" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-success" />
        
        {/* Candle 4 - Bullish (highest) */}
        <line x1="36" y1="20" x2="36" y2="26" stroke="currentColor" strokeWidth="1.5" className="text-success" />
        <rect x="34.5" y="14" width="3" height="6" fill="currentColor" className="text-success" />
        <line x1="36" y1="10" x2="36" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-success" />
        
        {/* Subtle gradient overlay for premium feel */}
        <defs>
          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" className="text-primary" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" className="text-primary" />
          </linearGradient>
        </defs>
        <rect
          x="12"
          y="6"
          width="28"
          height="36"
          rx="1"
          fill="url(#bookGradient)"
        />
      </svg>

      {/* Brand text */}
      {!iconOnly && (
        <span className={cn(
          "font-semibold tracking-tight",
          text,
          variant === "full" ? "text-center" : ""
        )}>
          The Trading Diary
        </span>
      )}
    </div>
  );
};
