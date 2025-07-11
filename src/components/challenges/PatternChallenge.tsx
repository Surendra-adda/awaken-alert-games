
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PatternChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

const PatternChallenge: React.FC<PatternChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gamePhase, setGamePhase] = useState<'show' | 'input'>('show');

  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
  ];

  const generatePattern = () => {
    const length = difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7;
    const maxColors = difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8;
    
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * maxColors));
    setPattern(newPattern);
    setUserSequence([]);
    setGamePhase('show');
    setShowPattern(true);
    setTimeLeft(difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);
  };

  useEffect(() => {
    generatePattern();
  }, [difficulty]);

  useEffect(() => {
    if (gamePhase === 'show' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'show' && timeLeft === 0) {
      setShowPattern(false);
      setGamePhase('input');
      setTimeLeft(30);
    } else if (gamePhase === 'input' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'input' && timeLeft === 0) {
      onFailure();
      generatePattern();
    }
  }, [timeLeft, gamePhase]);

  const handleColorClick = (colorIndex: number) => {
    if (gamePhase !== 'input') return;

    const newSequence = [...userSequence, colorIndex];
    setUserSequence(newSequence);

    // Check if the sequence matches so far
    if (pattern[newSequence.length - 1] !== colorIndex) {
      onFailure();
      generatePattern();
      return;
    }

    // Check if sequence is complete
    if (newSequence.length === pattern.length) {
      onSuccess();
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Easy';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge className={getDifficultyColor()}>
          {getDifficultyLabel()} Pattern
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center">
        {gamePhase === 'show' ? (
          <div>
            <h3 className="text-lg font-bold mb-4">
              📚 Memorize this pattern
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              {pattern.map((colorIndex, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg ${colors[colorIndex]} 
                    ${showPattern ? 'opacity-100' : 'opacity-30'} 
                    transition-opacity duration-300 border-2 border-white shadow-lg`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Watch carefully! You'll need to repeat this sequence.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold mb-4">
              🎯 Click the colors in the correct order
            </h3>
            
            {/* User's current sequence */}
            <div className="flex justify-center gap-2 mb-4 min-h-[3rem]">
              {userSequence.map((colorIndex, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg ${colors[colorIndex]} border-2 border-white shadow-lg`}
                />
              ))}
              {/* Placeholder for remaining */}
              {Array.from({ length: pattern.length - userSequence.length }).map((_, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-gray-300 opacity-50"
                />
              ))}
            </div>

            {/* Color palette */}
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
              {colors.slice(0, difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8).map((color, index) => (
                <Button
                  key={index}
                  onClick={() => handleColorClick(index)}
                  className={`w-12 h-12 ${color} hover:scale-110 transition-transform border-2 border-white shadow-lg`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-center text-sm text-gray-600">
        Progress: {userSequence.length} / {pattern.length}
      </p>
    </div>
  );
};

export default PatternChallenge;
