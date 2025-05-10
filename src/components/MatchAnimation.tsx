import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';

interface MatchAnimationProps {
  isVisible: boolean;
  message: string;
}

const FloatingHeart = ({ delay = 0, scale = 1 }) => (
  <motion.div
    initial={{ y: 100, opacity: 0, scale: 0 }}
    animate={{
      y: -100,
      opacity: [0, 1, 1, 0],
      scale: [0, scale, scale, 0],
      rotate: [0, 15, -15, 0]
    }}
    transition={{
      duration: 4,
      delay,
      times: [0, 0.2, 0.8, 1],
      ease: "easeInOut"
    }}
    className="absolute"
    style={{
      left: `${Math.random() * 80 + 10}%`,
      filter: "drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))"
    }}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#heart-gradient)"
      />
      <defs>
        <linearGradient id="heart-gradient" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

const MatchAnimation: React.FC<MatchAnimationProps> = ({ isVisible, message }) => {
  const [playMatchSound] = useSound('https://assets.codepen.io/189524/match-sound.mp3', { volume: 20 });

  useEffect(() => {
    if (isVisible) {
      playMatchSound();
    }
  }, [isVisible, playMatchSound]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-black/90 to-purple-900/90 backdrop-blur-sm"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {Array.from({ length: 15 }).map((_, i) => (
              <FloatingHeart
                key={i}
                delay={i * 0.2}
                scale={0.5 + Math.random() * 1.5}
              />
            ))}
            
            <motion.div
              initial={{ scale: 0, y: 0 }}
              animate={{
                scale: 1,
                y: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
              className="text-center px-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    "drop-shadow(0 0 20px rgba(236, 72, 153, 0.3))",
                    "drop-shadow(0 0 40px rgba(236, 72, 153, 0.5))",
                    "drop-shadow(0 0 20px rgba(236, 72, 153, 0.3))"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4 filter drop-shadow-lg">
                  {message}
                </h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-light text-purple-200"
                >
                  Your perfect match is waiting at your table!
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchAnimation;