import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const VideoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 lg:hidden">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Section Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">See It in Action</h2>
            <p className="text-muted-foreground">
              Watch how TD transforms your trading workflow in under 2 minutes
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
            {/* Placeholder for video embed - Replace with actual video */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm">
              <button
                onClick={() => navigate('/demo')}
                className="p-6 rounded-full bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-all duration-300 hover:scale-110 group"
                aria-label="Play demo video"
              >
                <Play className="h-12 w-12 text-primary group-hover:text-primary/90 fill-current" />
              </button>
            </div>
            
            {/* Thumbnail text */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="text-sm font-medium text-foreground/90">
                2-Minute Trading Diary Demo
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-xl"
          >
            Start Free Trial Now
          </Button>

          {/* Trust Badge */}
          <p className="text-center text-xs text-muted-foreground">
            No credit card required • 10 free trades to get started
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
