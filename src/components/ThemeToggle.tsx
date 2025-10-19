import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Toggle theme">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong backdrop-blur-xl border-accent/20 z-[100]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`cursor-pointer ${theme === 'light' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light Mode</span>
          {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`cursor-pointer ${theme === 'dark' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark Mode</span>
          {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`cursor-pointer ${theme === 'system' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Follow System</span>
          {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
