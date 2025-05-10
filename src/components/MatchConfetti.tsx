import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface MatchConfettiProps {
  isVisible: boolean;
}

export const MatchConfetti: React.FC<MatchConfettiProps> = ({ isVisible }) => {
  const { width, height } = useWindowSize();

  if (!isVisible) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      colors={['#F472B6', '#C084FC', '#818CF8', '#60A5FA']}
    />
  );
};