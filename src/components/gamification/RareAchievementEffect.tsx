import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrophyAnimation } from './TrophyAnimation';

export const RareAchievementEffect = () => {
  const [showEffect, setShowEffect] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);

  useEffect(() => {
    const handleRareAchievement = () => {
      setShowEffect(true);
      setShowTrophy(true);
      
      setTimeout(() => {
        setShowEffect(false);
      }, 2000);
    };

    window.addEventListener('rare-achievement', handleRareAchievement);
    return () => window.removeEventListener('rare-achievement', handleRareAchievement);
  }, []);

  return (
    <>
      <TrophyAnimation show={showTrophy} size="large" onComplete={() => setShowTrophy(false)} />
      
      {showEffect && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 1.5, times: [0, 0.3, 1], ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />
        </motion.div>
      )}
    </>
  );
};
