import React, { useState, useEffect } from 'react';
import { Coffee, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MatchAnimation from './components/MatchAnimation';
import { MatchMessages } from './components/MatchMessages';
import { FilledHeart } from './components/FilledHeart';
import { MatchConfetti } from './components/MatchConfetti';
import MatchCard from './components/MatchCard';
import NoMatchCard from './components/NoMatchCard';
import { PERSONALITY_TAGS, AVATARS, MESSAGES } from './constants';
import { User, TableInfo } from './types';

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<User>({
    name: '',
    age: 18,
    gender: '',
    avatar: AVATARS[0],
    bio: '',
    interests: [],
    personalityTags: [],
    preferredGenders: [],
    preferredAgeRange: {
      min: 18,
      max: 100
    },
    wantsToTalk: false
  });
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (tableInfo?.hasMatch) {
      setShowMatchAnimation(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowMatchAnimation(false);
        setShowConfetti(false);
      }, 5000);
    }
  }, [tableInfo]);

  useEffect(() => {
    if (tableInfo?.message) {
      const newMessage = tableInfo.message;
      setMessages(prev => [...prev, newMessage]);
      
      const timer = setTimeout(() => {
        setMessages(messages => messages.length > 0 ? messages.slice(1) : messages);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [tableInfo?.message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (formData.wantsToTalk) {
        const response = await fetch('https://cafe-unknown.onrender.com/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || MESSAGES.ERROR.SERVER_ERROR);
        }

        const data = await response.json();
        setTableInfo(data);
      } else {
        setTableInfo({
          tableNumber: Math.floor(Math.random() * 20) + 1,
          hasMatch: false,
          message: MESSAGES.PRIVATE_TABLE()
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : MESSAGES.ERROR.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(i => i.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, interests }));
  };

  const handlePreferenceChange = (gender: string) => {
    setFormData(prev => {
      const currentPreferences = [...prev.preferredGenders];
      const index = currentPreferences.indexOf(gender);
      
      if (index === -1) {
        currentPreferences.push(gender);
      } else {
        currentPreferences.splice(index, 1);
      }
      
      return { ...prev, preferredGenders: currentPreferences };
    });
  };

  const handlePersonalityTagChange = (tag: string) => {
    setFormData(prev => {
      const currentTags = [...prev.personalityTags];
      const index = currentTags.indexOf(tag);
      
      if (index === -1 && currentTags.length < 3) {
        currentTags.push(tag);
      } else if (index !== -1) {
        currentTags.splice(index, 1);
      }
      
      return { ...prev, personalityTags: currentTags };
    });
  };

  const handleInitialChoice = (wantsToTalk: boolean) => {
    setFormData(prev => ({ ...prev, wantsToTalk }));
    if (!wantsToTalk) {
      setTableInfo({
        tableNumber: Math.floor(Math.random() * 20) + 1,
        hasMatch: false,
        message: MESSAGES.PRIVATE_TABLE()
      });
    } else {
      setStep(1);
    }
  };

  const handleReset = () => {
    setTableInfo(null);
    setError(null);
    setStep(0);
    setFormData({
      name: '',
      age: 18,
      gender: '',
      avatar: AVATARS[0],
      bio: '',
      interests: [],
      personalityTags: [],
      preferredGenders: [],
      preferredAgeRange: {
        min: 18,
        max: 100
      },
      wantsToTalk: false
    });
    setMessages([]);
    setShowConfetti(false);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.age) {
        setError(MESSAGES.ERROR.REQUIRED_FIELDS);
        return;
      }
    } else if (step === 2) {
      if (!formData.gender || formData.preferredGenders.length === 0) {
        setError(MESSAGES.ERROR.GENDER_SELECTION);
        return;
      }
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  return (
    <>
      <MatchAnimation 
        isVisible={showMatchAnimation} 
        message={tableInfo?.hasMatch ? MESSAGES.MATCH_FOUND : ""}
      />
      <MatchConfetti isVisible={showConfetti} />
      <MatchMessages messages={messages} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: `
            linear-gradient(135deg, rgba(88, 28, 135, 0.95), rgba(67, 56, 202, 0.8)),
            url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1700&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-xl">
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <img src='/cafe_final.jpg' className='w-20 h-20  rounded-full mx-auto'/>
            </motion.div>
            <h1 className="mt-6 text-5xl font-bold text-white">
              Cafe Unknown
            </h1>
            <p className="mt-3 text-xl text-purple-200">Find your perfect conversation partner</p>
          </motion.div>

          <motion.div 
            className="glass-morphism rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-8">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-center"
                >
                  {error}
                </motion.div>
              )}

              {step === 0 && !tableInfo && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-white">How would you like to spend your time?</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => handleInitialChoice(true)}
                      className="btn-primary"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      I'd like to meet someone
                    </button>
                    <button
                      onClick={() => handleInitialChoice(false)}
                      className="btn-secondary"
                    >
                      <Coffee className="mr-2 h-5 w-5 inline" />
                      I prefer a private table
                    </button>
                  </div>
                </div>
              )}

              {((step >= 1 && step <= 3) && !tableInfo) && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {step === 1 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-purple-100">Name</label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-purple-100">Age</label>
                          <input
                            type="number"
                            required
                            min="18"
                            max="100"
                            className="input-field"
                            value={formData.age}
                            onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value, 10) }))}
                            placeholder="Your age"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-100">Choose your avatar</label>
                        <div className="grid grid-cols-5 gap-4">
                          {AVATARS.map((avatar, index) => (
                            <button
                              key={index}
                              type="button"
                              className={`relative rounded-xl overflow-hidden aspect-square ${
                                formData.avatar === avatar ? 'ring-4 ring-purple-500' : ''
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                            >
                              <img
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-100">Bio</label>
                        <textarea
                          className="input-field"
                          value={formData.bio}
                          onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us a bit about yourself..."
                          maxLength={200}
                          rows={3}
                        />
                        <p className="text-xs text-purple-300/70">{200 - formData.bio.length} characters remaining</p>
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        <span className="flex items-center">
                          Next Step
                          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-purple-100">Gender</label>
                          <select
                            required
                            className="input-field bg-purple-900/50"
                            value={formData.gender}
                            onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                          >
                            <option value="" className="bg-purple-900 text-white">Select gender</option>
                            <option value="male" className="bg-purple-900 text-white">Male</option>
                            <option value="female" className="bg-purple-900 text-white">Female</option>
                            <option value="other" className="bg-purple-900 text-white">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-purple-100">Preferred Match (Select multiple if interested)</label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="male-preference"
                                checked={formData.preferredGenders.includes('male')}
                                onChange={() => handlePreferenceChange('male')}
                                className="checkbox-field"
                              />
                              <label htmlFor="male-preference" className="text-purple-100">Male</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="female-preference"
                                checked={formData.preferredGenders.includes('female')}
                                onChange={() => handlePreferenceChange('female')}
                                className="checkbox-field"
                              />
                              <label htmlFor="female-preference" className="text-purple-100">Female</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="other-preference"
                                checked={formData.preferredGenders.includes('other')}
                                onChange={() => handlePreferenceChange('other')}
                                className="checkbox-field"
                              />
                              <label htmlFor="other-preference" className="text-purple-100">Other</label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-purple-100">Preferred Age Range</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input
                                type="number"
                                min="18"
                                max={formData.preferredAgeRange.max}
                                className="input-field"
                                value={formData.preferredAgeRange.min}
                                onChange={e => setFormData(prev => ({
                                  ...prev,
                                  preferredAgeRange: {
                                    ...prev.preferredAgeRange,
                                    min: parseInt(e.target.value)
                                  }
                                }))}
                                placeholder="Min age"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                min={formData.preferredAgeRange.min}
                                max="100"
                                className="input-field"
                                value={formData.preferredAgeRange.max}
                                onChange={e => setFormData(prev => ({
                                  ...prev,
                                  preferredAgeRange: {
                                    ...prev.preferredAgeRange,
                                    max: parseInt(e.target.value)
                                  }
                                }))}
                                placeholder="Max age"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn-primary"
                        >
                          <span className="flex items-center">
                            Next Step
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-100">
                          Interests
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="coffee, books, music, travel, art..."
                          className="input-field"
                          onChange={handleInterestChange}
                        />
                        <p className="text-xs text-purple-300/70">Separate multiple interests with commas</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-100">
                          Personality Tags (Choose up to 3)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {PERSONALITY_TAGS.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handlePersonalityTagChange(tag)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                formData.personalityTags.includes(tag)
                                  ? 'bg-purple-800 text-white'
                                  : ' bg-violet-500 text-purple-100 hover:bg-purple-900/70'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Finding your match...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Find My Match
                              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {tableInfo && (
                <div className="text-center py-8">
                  <div className="space-y-8">
                    <div className="flex justify-center">
                      {tableInfo.hasMatch ? (
                        <FilledHeart />
                      ) : (
                        <div className="relative">
                          <Users className="h-24 w-24 text-purple-400" />
                          {!tableInfo.hasMatch && formData.wantsToTalk && (
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                              className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                            >
                              <span className="text-white text-xl">✨</span>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-white"
                    >
                      {tableInfo.hasMatch ? 'Perfect Match!' : 'Table Assignment'}
                    </motion.h2>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-morphism p-6 rounded-xl mb-6"
                    >
                      <p className="text-3xl text-white">
                        Your Table: <span className="font-bold">{tableInfo.tableNumber}</span>
                      </p>
                    </motion.div>

                    {tableInfo.hasMatch && tableInfo.matchDetails && (
                      <MatchCard
                        matchDetails={tableInfo.matchDetails}
                        matchScore={tableInfo.matchScore || 0}
                        commonInterests={tableInfo.commonInterests || []}
                      />
                    )}

                    {!tableInfo.hasMatch && tableInfo.message && (
                      <NoMatchCard
                        message={tableInfo.message}
                        isSearching={formData.wantsToTalk}
                      />
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="mt-6 px-6 py-3 text-sm font-medium bg-gradient-to-r from-pink-200/10 to-purple-200/10 hover:from-pink-200/20 hover:to-purple-200/20 rounded-full transition-all duration-200 text-purple-200 hover:text-white"
                    >
                      Start Over
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default App;