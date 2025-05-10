import { User, MatchResult } from '../types';

const PERSONALITY_COMPATIBILITY: Record<string, Record<string, number>> = {
  'introvert': { 'introvert': 0.9, 'extrovert': 0.6, 'creative': 0.8, 'analytical': 0.9, 'adventurous': 0.6, 'calm': 0.9, 'energetic': 0.5, 'thoughtful': 0.9 },
  'extrovert': { 'introvert': 0.6, 'extrovert': 0.9, 'creative': 0.8, 'analytical': 0.6, 'adventurous': 0.9, 'calm': 0.5, 'energetic': 0.9, 'thoughtful': 0.6 },
  'creative': { 'introvert': 0.8, 'extrovert': 0.8, 'creative': 0.9, 'analytical': 0.7, 'adventurous': 0.8, 'calm': 0.7, 'energetic': 0.8, 'thoughtful': 0.8 },
  'analytical': { 'introvert': 0.9, 'extrovert': 0.6, 'creative': 0.7, 'analytical': 0.9, 'adventurous': 0.6, 'calm': 0.8, 'energetic': 0.5, 'thoughtful': 0.9 },
  'adventurous': { 'introvert': 0.6, 'extrovert': 0.9, 'creative': 0.8, 'analytical': 0.6, 'adventurous': 0.9, 'calm': 0.5, 'energetic': 0.9, 'thoughtful': 0.6 },
  'calm': { 'introvert': 0.9, 'extrovert': 0.5, 'creative': 0.7, 'analytical': 0.8, 'calm': 0.9, 'energetic': 0.4, 'thoughtful': 0.9 },
  'energetic': { 'introvert': 0.5, 'extrovert': 0.9, 'creative': 0.8, 'analytical': 0.5, 'adventurous': 0.9, 'calm': 0.4, 'energetic': 0.9, 'thoughtful': 0.5 },
  'thoughtful': { 'introvert': 0.9, 'extrovert': 0.6, 'creative': 0.8, 'analytical': 0.9, 'adventurous': 0.6, 'calm': 0.9, 'energetic': 0.5, 'thoughtful': 0.9 }
};

export const calculateMatchScore = (user1: User, user2: User): MatchResult => {
  // Age compatibility (0-25 points)
  const ageDiff = Math.abs(user1.age - user2.age);
  const maxAgeDiff = Math.max(
    user1.preferredAgeRange.max - user1.preferredAgeRange.min,
    user2.preferredAgeRange.max - user2.preferredAgeRange.min
  );
  const ageScore = Math.max(0, 25 * (1 - ageDiff / maxAgeDiff));

  // Interests compatibility (0-35 points)
  const user1Interests = new Set(user1.interests.map(i => i.toLowerCase()));
  const user2Interests = new Set(user2.interests.map(i => i.toLowerCase()));
  const commonInterests = [...user1Interests].filter(x => user2Interests.has(x));
  const interestScore = (commonInterests.length / Math.max(user1Interests.size, user2Interests.size)) * 35;

  // Personality compatibility (0-25 points)
  let personalityScore = 0;
  let personalityComparisons = 0;
  
  user1.personalityTags.forEach(tag1 => {
    user2.personalityTags.forEach(tag2 => {
      if (PERSONALITY_COMPATIBILITY[tag1]?.[tag2]) {
        personalityScore += PERSONALITY_COMPATIBILITY[tag1][tag2] * 25;
        personalityComparisons++;
      }
    });
  });
  
  const finalPersonalityScore = personalityComparisons > 0 
    ? personalityScore / personalityComparisons 
    : 0;

  // Gender preferences (0-15 points)
  const genderScore = (
    user1.preferredGenders.includes(user2.gender) && 
    user2.preferredGenders.includes(user1.gender)
  ) ? 15 : 0;

  // Calculate total score and normalize to 100
  const totalScore = Math.min(100, ageScore + interestScore + finalPersonalityScore + genderScore);

  return {
    score: Math.round(totalScore),
    commonInterests,
    compatibilityFactors: {
      age: Math.round(ageScore),
      interests: Math.round(interestScore),
      personality: Math.round(finalPersonalityScore),
      preferences: genderScore
    }
  };
};