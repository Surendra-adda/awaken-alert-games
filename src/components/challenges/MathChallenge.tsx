
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface MathChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

const MathChallenge: React.FC<MathChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [problem, setProblem] = useState({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  const generateProblem = () => {
    let question = '';
    let answer = 0;

    if (difficulty === 1) {
      // Easy: Single digit addition/subtraction
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const operation = Math.random() > 0.5 ? '+' : '-';
      
      if (operation === '+') {
        question = `${a} + ${b}`;
        answer = a + b;
      } else {
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        question = `${larger} - ${smaller}`;
        answer = larger - smaller;
      }
    } else if (difficulty === 2) {
      // Medium: Two digit operations
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 20) + 5;
      const operations = ['+', '-', '×'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      
      switch (operation) {
        case '+':
          question = `${a} + ${b}`;
          answer = a + b;
          break;
        case '-':
          question = `${a} - ${b}`;
          answer = a - b;
          break;
        case '×':
          const smallA = Math.floor(Math.random() * 12) + 2;
          const smallB = Math.floor(Math.random() * 12) + 2;
          question = `${smallA} × ${smallB}`;
          answer = smallA * smallB;
          break;
      }
    } else {
      // Hard: Multi-step problems
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 10) + 2;
      const c = Math.floor(Math.random() * 10) + 1;
      
      question = `(${a} + ${b}) × ${c}`;
      answer = (a + b) * c;
    }

    setProblem({ question, answer });
    setTimeLeft(difficulty === 3 ? 45 : 30);
  };

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onFailure();
      generateProblem();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    const userNum = parseInt(userAnswer);
    
    if (userNum === problem.answer) {
      onSuccess();
    } else {
      onFailure();
      setUserAnswer('');
      generateProblem();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
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

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Easy';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge className={getDifficultyColor()}>
          {getDifficultyLabel()} Math
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold mb-4 p-6 bg-gray-50 rounded-lg">
          {problem.question} = ?
        </div>
        
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your answer"
          className="text-2xl text-center mb-4 h-14"
          autoFocus
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!userAnswer}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-3"
        >
          Submit Answer
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-600">
        💡 Solve the math problem to dismiss the alarm
      </p>
    </div>
  );
};

export default MathChallenge;
