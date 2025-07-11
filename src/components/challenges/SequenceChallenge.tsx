
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SequenceChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

const SequenceChallenge: React.FC<SequenceChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [answer, setAnswer] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [sequenceType, setSequenceType] = useState<'arithmetic' | 'fibonacci' | 'geometric'>('arithmetic');

  const generateSequence = () => {
    let newSequence: number[] = [];
    let correctAnswer = 0;

    if (difficulty === 1) {
      // Easy: Simple arithmetic sequences
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 5) + 1;
      newSequence = [start, start + diff, start + 2 * diff, start + 3 * diff];
      correctAnswer = start + 4 * diff;
      setSequenceType('arithmetic');
    } else if (difficulty === 2) {
      // Medium: Mix of arithmetic and simple patterns
      const patternType = Math.random() > 0.5 ? 'arithmetic' : 'geometric';
      
      if (patternType === 'arithmetic') {
        const start = Math.floor(Math.random() * 15) + 2;
        const diff = Math.floor(Math.random() * 8) + 2;
        newSequence = [start, start + diff, start + 2 * diff, start + 3 * diff, start + 4 * diff];
        correctAnswer = start + 5 * diff;
        setSequenceType('arithmetic');
      } else {
        const start = 2;
        const ratio = 2;
        newSequence = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
        correctAnswer = start * Math.pow(ratio, 4);
        setSequenceType('geometric');
      }
    } else {
      // Hard: Fibonacci or complex patterns
      const patternType = Math.random() > 0.6 ? 'fibonacci' : 'geometric';
      
      if (patternType === 'fibonacci') {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 2;
        newSequence = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
        correctAnswer = 3 * a + 5 * b;
        setSequenceType('fibonacci');
      } else {
        const start = Math.floor(Math.random() * 4) + 2;
        const ratio = 3;
        newSequence = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
        correctAnswer = start * Math.pow(ratio, 4);
        setSequenceType('geometric');
      }
    }

    setSequence(newSequence);
    setAnswer(correctAnswer);
    setUserAnswer('');
    setTimeLeft(difficulty === 3 ? 45 : 30);
  };

  useEffect(() => {
    generateSequence();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onFailure();
      generateSequence();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    const userNum = parseInt(userAnswer);
    
    if (userNum === answer) {
      onSuccess();
    } else {
      onFailure();
      generateSequence();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getSequenceTypeHint = () => {
    switch (sequenceType) {
      case 'arithmetic':
        return '➕ Look for a constant difference';
      case 'geometric':
        return '✖️ Look for a constant ratio';
      case 'fibonacci':
        return '🔄 Each number is the sum of previous numbers';
      default:
        return '🧠 Find the pattern';
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
          {getDifficultyLabel()} Sequence
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-4">
          🔢 Complete the sequence
        </h3>
        
        <div className="flex justify-center items-center gap-3 mb-4 flex-wrap">
          {sequence.map((num, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center text-xl font-bold text-blue-800"
            >
              {num}
            </div>
          ))}
          <div className="text-2xl font-bold text-gray-500">→</div>
          <div className="w-16 h-16 bg-orange-100 border-2 border-orange-300 border-dashed rounded-lg flex items-center justify-center text-xl font-bold text-orange-600">
            ?
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{getSequenceTypeHint()}</p>
        </div>
        
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What comes next?"
          className="text-2xl text-center mb-4 h-14"
          autoFocus
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!userAnswer}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-3"
        >
          Submit Answer
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-600">
        🧩 Find the pattern and complete the sequence
      </p>
    </div>
  );
};

export default SequenceChallenge;
