export const PERSONALITY_TAGS = [
    'introvert',
    'extrovert',
    'creative',
    'analytical',
    'adventurous',
    'calm',
    'energetic',
    'thoughtful'
  ];
  
  export const AVATARS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop'
  ];
  
  export const NO_MATCH_MESSAGES = [
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
  
  export const SOLO_TABLE_MESSAGES = [
    "Enjoy your peaceful corner of the café! Sometimes the best company is a good cup of coffee and your own thoughts. ☕",
    "Your private table awaits! Take this moment to relax and enjoy the ambiance. 🌟",
    "A table just for you! Perfect for some quality me-time with your favorite brew. ✨",
    "Sometimes solitude is the best luxury! Enjoy your private space in our cozy café. 🍵",
    "Your peaceful retreat is ready! Enjoy the tranquil atmosphere of your private table. 🌿"
  ];
  
  export const MESSAGES = {
    NO_MATCH: () => NO_MATCH_MESSAGES[Math.floor(Math.random() * NO_MATCH_MESSAGES.length)],
    PRIVATE_TABLE: () => SOLO_TABLE_MESSAGES[Math.floor(Math.random() * SOLO_TABLE_MESSAGES.length)],
    MATCH_FOUND: "Perfect match found! Head to your assigned table for a great conversation. ✨",
    WAITING: "Looking for your perfect match... This might take a moment. ☕",
    ERROR: {
      REQUIRED_FIELDS: "Please fill in all required fields",
      GENDER_SELECTION: "Please select your gender and preferred match gender(s)",
      PERSONALITY_LIMIT: "Please select up to 3 personality tags",
      SERVER_ERROR: "Unable to connect to the server. Please try again later.",
      NETWORK_ERROR: "Network error. Please check your connection and try again."
    }
  };