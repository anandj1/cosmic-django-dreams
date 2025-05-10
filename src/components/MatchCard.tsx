import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MatchCardProps {
  matchDetails: any;
  matchScore: number;
  commonInterests: string[];
}

const MatchCard: React.FC<MatchCardProps> = ({ matchDetails, matchScore, commonInterests }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-8 rounded-xl"
    >
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(236, 72, 153, 0)",
              "0 0 0 10px rgba(236, 72, 153, 0.1)",
              "0 0 0 20px rgba(236, 72, 153, 0)",
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 rounded-xl"
        />
        
        <div className="relative">
          <div className="flex items-center space-x-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-500/30">
                <img
                  src={matchDetails.avatar}
                  alt={matchDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl"
              />
            </motion.div>
            
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent"
              >
                {matchDetails.name}
              </motion.h3>
              <p className="text-xl text-purple-300 mt-1">{matchDetails.age} years old</p>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3"
            >
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <div className="flex items-center space-x-2">
                <span className="text-purple-200">Match Score:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                  {matchScore}%
                </span>
              </div>
            </motion.div>

            {commonInterests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-sm font-medium text-purple-200 mb-3">Common Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {commonInterests.map((interest, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-purple-200 border border-purple-500/20"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {matchDetails.personalityTags && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-sm font-medium text-purple-200 mb-3">Personality</h4>
                <div className="flex flex-wrap gap-2">
                  {matchDetails.personalityTags.map((tag: string, index: number) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/20"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {matchDetails.bio && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-sm font-medium text-purple-200 mb-3">Bio</h4>
                <p className="text-purple-200 text-lg leading-relaxed italic">
                  "{matchDetails.bio}"
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;