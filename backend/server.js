import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Fun messages for when no match is found
const NO_MATCH_MESSAGES = [
  "Chill! We're searching for your perfect conversation partner. The best things in life are worth waiting for! 🌟",
  "Hey there! We're on a mission to find someone as awesome as you. Hang tight! ✨",
  "The coffee's brewing, and so is your perfect match! Just taking a moment to find someone special. ☕",
  "Like finding the perfect song on a playlist, we're carefully selecting your ideal match! 🎵",
  "Great conversations are worth waiting for! We're searching for someone who matches your vibe. 🌈",
  "Your future friend is out there! We're just making sure it's the perfect match. 🎯",
  "Think of this as the calm before an amazing conversation! We're finding someone special. 🌅",
  "Quality takes time! We're carefully matching you with someone who shares your interests. 💫",
  "The best connections are worth waiting for! We're finding someone who'll make your day. 🌟",
  "Like a barista crafting the perfect latte, we're carefully preparing your match! ☕"
];

const getRandomNoMatchMessage = () => {
  return NO_MATCH_MESSAGES[Math.floor(Math.random() * NO_MATCH_MESSAGES.length)];
};

const calculateMatchScore = (user1, user2) => {
  let score = 0;
  const weights = {
    age: 25,
    interests: 35,
    personality: 40
  };
  
  // Age compatibility (max 25 points)
  const ageDiff = Math.abs(user1.age - user2.age);
  const ageScore = Math.exp(-Math.pow(ageDiff, 2) / 50) * weights.age;
  score += ageScore;
  
  // Interests compatibility (max 35 points)
  const user1Interests = new Set(user1.interests.map(i => i.toLowerCase()));
  const user2Interests = new Set(user2.interests.map(i => i.toLowerCase()));
  const intersectionSize = [...user1Interests].filter(x => user2Interests.has(x)).length;
  const unionSize = new Set([...user1Interests, ...user2Interests]).size;
  const interestScore = (intersectionSize / unionSize) * weights.interests;
  score += interestScore;
  
  // Personality compatibility (max 40 points)
  const personalityScore = calculatePersonalityScore(user1.personalityTags, user2.personalityTags);
  score += personalityScore * weights.personality;
  
  return Math.round(score);
};

const calculatePersonalityScore = (tags1, tags2) => {
  const compatibilityMatrix = {
    'introvert': { 'introvert': 0.8, 'extrovert': 0.6, 'creative': 0.7, 'analytical': 0.9, 'adventurous': 0.5, 'calm': 0.9, 'energetic': 0.4, 'thoughtful': 0.9 },
    'extrovert': { 'introvert': 0.6, 'extrovert': 0.9, 'creative': 0.8, 'analytical': 0.6, 'adventurous': 0.9, 'calm': 0.5, 'energetic': 0.9, 'thoughtful': 0.6 },
    'creative': { 'introvert': 0.7, 'extrovert': 0.8, 'creative': 0.9, 'analytical': 0.7, 'adventurous': 0.8, 'calm': 0.7, 'energetic': 0.8, 'thoughtful': 0.8 },
    'analytical': { 'introvert': 0.9, 'extrovert': 0.6, 'creative': 0.7, 'analytical': 0.9, 'adventurous': 0.6, 'calm': 0.8, 'energetic': 0.5, 'thoughtful': 0.9 },
    'adventurous': { 'introvert': 0.5, 'extrovert': 0.9, 'creative': 0.8, 'analytical': 0.6, 'adventurous': 0.9, 'calm': 0.5, 'energetic': 0.9, 'thoughtful': 0.6 },
    'calm': { 'introvert': 0.9, 'extrovert': 0.5, 'creative': 0.7, 'analytical': 0.8, 'calm': 0.9, 'energetic': 0.4, 'thoughtful': 0.9 },
    'energetic': { 'introvert': 0.4, 'extrovert': 0.9, 'creative': 0.8, 'analytical': 0.5, 'adventurous': 0.9, 'calm': 0.4, 'energetic': 0.9, 'thoughtful': 0.5 },
    'thoughtful': { 'introvert': 0.9, 'extrovert': 0.6, 'creative': 0.8, 'analytical': 0.9, 'adventurous': 0.6, 'calm': 0.9, 'energetic': 0.5, 'thoughtful': 0.9 }
  };

  let totalScore = 0;
  let comparisons = 0;

  for (const tag1 of tags1) {
    for (const tag2 of tags2) {
      if (compatibilityMatrix[tag1] && compatibilityMatrix[tag1][tag2]) {
        totalScore += compatibilityMatrix[tag1][tag2];
        comparisons++;
      }
    }
  }

  return comparisons > 0 ? totalScore / comparisons : 0;
};

const findMatch = async (user) => {
  const potentialMatches = await User.find({
    $and: [
      {
        age: { 
          $gte: user.preferredAgeRange.min, 
          $lte: user.preferredAgeRange.max 
        }
      },
      { gender: { $in: user.preferredGenders } },
      { preferredGenders: user.gender },
      { isWaiting: true },
      { _id: { $ne: user._id } },
      {
        $or: [
          { interests: { $in: user.interests.map(i => new RegExp(i, 'i')) } },
          { personalityTags: { $in: user.personalityTags } }
        ]
      }
    ]
  }).sort({ createdAt: 1 });

  let bestMatch = null;
  let highestScore = 0;

  for (const potentialMatch of potentialMatches) {
    const score = calculateMatchScore(user, potentialMatch);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = potentialMatch;
    }
  }

  return bestMatch ? { ...bestMatch.toObject(), matchScore: highestScore } : null;
};

const getTableNumber = async () => {
  const usedTables = await User.distinct('tableNumber');
  let tableNum = Math.floor(Math.random() * 20) + 1;
  
  for (let attempts = 0; attempts < 20; attempts++) {
    if (!usedTables.includes(tableNum)) {
      return tableNum;
    }
    tableNum = Math.floor(Math.random() * 20) + 1;
  }
  
  const oldestUser = await User.findOne().sort({ createdAt: 1 });
  return oldestUser ? oldestUser.tableNumber : Math.floor(Math.random() * 20) + 1;
};

// Custom messages for solo tables
const SOLO_TABLE_MESSAGES = [
  "Enjoy your peaceful corner of the café! Sometimes the best company is a good cup of coffee and your own thoughts. ☕",
  "Your private table awaits! Take this moment to relax and enjoy the ambiance. 🌟",
  "A table just for you! Perfect for some quality me-time with your favorite brew. ✨",
  "Sometimes solitude is the best luxury! Enjoy your private space in our cozy café. 🍵",
  "Your peaceful retreat is ready! Enjoy the tranquil atmosphere of your private table. 🌿"
];

const getRandomSoloTableMessage = () => {
  return SOLO_TABLE_MESSAGES[Math.floor(Math.random() * SOLO_TABLE_MESSAGES.length)];
};

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    const tableNumber = await getTableNumber();
    
    if (userData.wantsToTalk) {
      const match = await findMatch(userData);
      
      if (match) {
        const user = new User({
          ...userData,
          tableNumber: match.tableNumber,
          isWaiting: false,
          matchScore: match.matchScore
        });
        await user.save();
        
        await User.findByIdAndUpdate(match._id, { 
          isWaiting: false,
          matchScore: match.matchScore
        });
        
        const commonInterests = userData.interests.filter(interest => 
          match.interests.some(matchInterest => 
            matchInterest.toLowerCase() === interest.toLowerCase()
          )
        );
        
        res.json({ 
          tableNumber: match.tableNumber, 
          hasMatch: true,
          matchScore: match.matchScore,
          commonInterests,
          matchDetails: {
            name: match.name,
            age: match.age,
            avatar: match.avatar,
            bio: match.bio,
            personalityTags: match.personalityTags
          }
        });
      } else {
        const user = new User({
          ...userData,
          tableNumber,
          isWaiting: true
        });
        await user.save();
        
        res.json({ 
          tableNumber, 
          hasMatch: false,
          message: getRandomNoMatchMessage()
        });
      }
    } else {
      res.json({ 
        tableNumber, 
        hasMatch: false,
        message: getRandomSoloTableMessage()
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});