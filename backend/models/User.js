import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxLength: 200,
    default: ''
  },
  interests: [{
    type: String,
    required: true
  }],
  personalityTags: [{
    type: String,
    enum: ['introvert', 'extrovert', 'creative', 'analytical', 'adventurous', 'calm', 'energetic', 'thoughtful']
  }],
  preferredGenders: [{
    type: String,
    enum: ['male', 'female', 'other']
  }],
  preferredAgeRange: {
    min: {
      type: Number,
      default: 18
    },
    max: {
      type: Number,
      default: 100
    }
  },
  wantsToTalk: {
    type: Boolean,
    required: true
  },
  tableNumber: {
    type: Number
  },
  isWaiting: {
    type: Boolean,
    default: true
  },
  matchScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 
  }
});

export const User = mongoose.model('User', userSchema);