import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

interface NoMatchCardProps {
  message: string;
  isSearching: boolean;
}

const NoMatchCard: React.FC<NoMatchCardProps> = ({ message, isSearching }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-8 rounded-xl"
    >
      <div className="flex flex-col items-center space-y-6">
        {isSearching ? (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Coffee className="h-16 w-16 text-pink-400" />
          </motion.div>
        ) : (
          <Coffee className="h-16 w-16 text-purple-400" />
        )}
        
        <motion.div
          animate={isSearching ? {
            y: [0, -10, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-center"
        >
          <p className="text-2xl font-light leading-relaxed bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
            {message}
          </p>
        </motion.div>

        {isSearching && (
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NoMatchCard;