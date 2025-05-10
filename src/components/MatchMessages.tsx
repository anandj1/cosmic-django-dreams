import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchMessagesProps {
  messages: string[];
}

export const MatchMessages: React.FC<MatchMessagesProps> = ({ messages }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-2 max-w-sm z-40">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-purple-300/20"
          >
            <p className="text-white text-center text-lg">{message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}