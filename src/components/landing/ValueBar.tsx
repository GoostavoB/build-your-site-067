import { motion } from "framer-motion";

export const ValueBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary/10 backdrop-blur-sm border-b border-primary/20 py-3 px-6"
    >
      <div className="container mx-auto max-w-7xl">
        <p className="text-center text-sm md:text-base font-medium">
          Clear data today, better decisions on your next trade
        </p>
      </div>
    </motion.div>
  );
};
