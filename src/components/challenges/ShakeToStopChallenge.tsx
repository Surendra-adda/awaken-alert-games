import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ShakeToStopChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

const ShakeToStopChallenge: React.FC<ShakeToStopChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [shakeCount, setShakeCount] = useState(0);
  const [targetShakes, setTargetShakes] = useState(20);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    // Set target shakes based on difficulty
    const target = difficulty === 1 ? 15 : difficulty === 2 ? 25 : 35;
    setTargetShakes(target);
    setTimeLeft(difficulty === 1 ? 45 : difficulty === 2 ? 60 : 75);
  }, [difficulty]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onFailure();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (shakeCount >= targetShakes) {
      setTimeout(onSuccess, 1000);
    }
  }, [shakeCount, targetShakes]);

  const handleShake = () => {
    if (!gameStarted) setGameStarted(true);
    
    setIsShaking(true);
    setShakeCount(prev => prev + 1);
    
    setTimeout(() => setIsShaking(false), 200);
  };

  const handleReset = () => {
    setShakeCount(0);
    setGameStarted(false);
    setIsShaking(false);
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return `Easy (${targetShakes} shakes)`;
      case 2: return `Medium (${targetShakes} shakes)`;
      case 3: return `Hard (${targetShakes} shakes)`;
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

  const progress = (shakeCount / targetShakes) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge className={getDifficultyColor()}>
          {getDifficultyLabel()}
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 15 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">
          📱 Shake to Stop Alarm
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Tap the shake button rapidly to dismiss the alarm
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {shakeCount} / {targetShakes}
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              {targetShakes - shakeCount} more shakes needed
            </p>
          </div>

          <div className="py-8">
            <Button
              onClick={handleShake}
              className={`w-32 h-32 rounded-full text-4xl transition-all duration-200 ${
                isShaking 
                  ? 'scale-110 bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white shadow-lg`}
              disabled={shakeCount >= targetShakes}
            >
              {isShaking ? '💥' : '📱'}
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              {shakeCount >= targetShakes 
                ? '🎉 Great job! Alarm stopping...' 
                : 'Tap rapidly to shake!'
              }
            </p>
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="text-sm"
          >
            🔄 Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShakeToStopChallenge;