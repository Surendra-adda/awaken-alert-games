import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Brain, Zap, CheckCircle } from 'lucide-react';
import MathChallenge from '@/components/challenges/MathChallenge';
import TicTacToeChallenge from '@/components/challenges/TicTacToeChallenge';
import MemoryGameChallenge from '@/components/challenges/MemoryGameChallenge';
import MatchObjectsChallenge from '@/components/challenges/MatchObjectsChallenge';
import ShakeToStopChallenge from '@/components/challenges/ShakeToStopChallenge';

interface Alarm {
  id: string;
  time: string;
  label: string;
  challengeType: 'math' | 'tictactoe' | 'memory' | 'match' | 'shake';
}

interface WakeUpChallengeProps {
  alarm: Alarm;
  onComplete: () => void;
}

const WakeUpChallenge: React.FC<WakeUpChallengeProps> = ({ alarm, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Simulate alarm sound effect (in real app, this would trigger actual alarm)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🚨 ALARM RINGING! Complete the challenge to dismiss.');
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleChallengeSuccess = () => {
    setIsCompleted(true);
    setProgress(100);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleChallengeFailure = () => {
    setAttempts(prev => prev + 1);
    setProgress(Math.min(attempts * 20, 80));
  };

  const renderChallenge = () => {
    const difficulty = Math.min(attempts + 1, 3); // Increase difficulty with failed attempts
    
    switch (alarm.challengeType) {
      case 'math':
        return (
          <MathChallenge
            difficulty={difficulty}
            onSuccess={handleChallengeSuccess}
            onFailure={handleChallengeFailure}
          />
        );
      case 'tictactoe':
        return (
          <TicTacToeChallenge
            difficulty={difficulty}
            onSuccess={handleChallengeSuccess}
            onFailure={handleChallengeFailure}
          />
        );
      case 'memory':
        return (
          <MemoryGameChallenge
            difficulty={difficulty}
            onSuccess={handleChallengeSuccess}
            onFailure={handleChallengeFailure}
          />
        );
      case 'match':
        return (
          <MatchObjectsChallenge
            difficulty={difficulty}
            onSuccess={handleChallengeSuccess}
            onFailure={handleChallengeFailure}
          />
        );
      case 'shake':
        return (
          <ShakeToStopChallenge
            difficulty={difficulty}
            onSuccess={handleChallengeSuccess}
            onFailure={handleChallengeFailure}
          />
        );
      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center animate-pulse">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-700 mb-2">Challenge Complete! 🎉</h1>
          <p className="text-gray-600 mb-4">Good morning! You're fully awake now.</p>
          <div className="text-4xl">☀️</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center p-4 animate-pulse">
      <div className="max-w-lg w-full">
        {/* Alert Header */}
        <Card className="p-6 mb-6 border-4 border-red-400 bg-red-50 animate-bounce">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold text-red-700">WAKE UP ALARM! 🚨</h1>
          </div>
          <p className="text-center text-red-600 font-semibold">
            {alarm.label} - {alarm.time}
          </p>
          <p className="text-center text-sm text-red-500 mt-2">
            Complete the challenge to dismiss the alarm
          </p>
        </Card>

        {/* Progress */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Wake-up Progress</span>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-xs text-gray-600">
            {attempts > 0 && `Attempts: ${attempts} - `}
            {attempts >= 2 ? 'Difficulty increased!' : 'Complete the challenge to prove you\'re awake'}
          </p>
        </Card>

        {/* Challenge */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-bold">Brain Challenge</h2>
          </div>
          {renderChallenge()}
        </Card>

        {/* Warning */}
        <div className="text-center mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
          <p className="text-sm text-yellow-800">
            🔒 This alarm cannot be snoozed or dismissed without completing the challenge
          </p>
        </div>
      </div>
    </div>
  );
};

export default WakeUpChallenge;
