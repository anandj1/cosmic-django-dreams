export interface User {
    id?: string;
    name: string;
    age: number;
    gender: string;
    avatar: string;
    bio: string;
    interests: string[];
    personalityTags: string[];
    preferredGenders: string[];
    preferredAgeRange: {
      min: number;
      max: number;
    };
    wantsToTalk: boolean;
  }
  
  export interface MatchDetails {
    name: string;
    age: number;
    avatar: string;
    bio: string;
    personalityTags: string[];
  }
  
  export interface TableInfo {
    tableNumber: number;
    hasMatch: boolean;
    message?: string;
    matchScore?: number;
    commonInterests?: string[];
    matchDetails?: MatchDetails;
  }
  
  export interface MatchResult {
    score: number;
    commonInterests: string[];
    compatibilityFactors: {
      age: number;
      interests: number;
      personality: number;
      preferences: number;
    };
  }