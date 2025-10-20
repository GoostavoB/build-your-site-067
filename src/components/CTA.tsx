import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Start journaling smarter today.
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Create your free account and see your trading with clarity.
          </p>
          
          <div>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="px-10 py-7 text-base font-medium rounded-xl"
            >
              Get Started Free
            </Button>
            
            <p className="mt-4 text-xs text-muted-foreground">
              Free forever • No credit card • 2 minute setup
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
