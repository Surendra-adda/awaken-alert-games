
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TicTacToeChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToeChallenge: React.FC<TicTacToeChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [winStreak, setWinStreak] = useState(0);
  const [gamesNeeded, setGamesNeeded] = useState(1);

  // Set games needed based on difficulty
  useEffect(() => {
    setGamesNeeded(difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3);
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onFailure();
    }
  }, [timeLeft, gameStatus]);

  const checkWinner = (board: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const makeAIMove = (currentBoard: Board): number => {
    const emptySpots = currentBoard.map((spot, index) => spot === null ? index : null).filter(val => val !== null) as number[];
    
    // Easy AI - random moves with some strategy
    if (difficulty === 1) {
      return emptySpots[Math.floor(Math.random() * emptySpots.length)];
    }
    
    // Medium AI - try to win or block
    if (difficulty >= 2) {
      // Check if AI can win
      for (const spot of emptySpots) {
        const testBoard = [...currentBoard];
        testBoard[spot] = 'O';
        if (checkWinner(testBoard) === 'O') return spot;
      }
      
      // Check if need to block player
      for (const spot of emptySpots) {
        const testBoard = [...currentBoard];
        testBoard[spot] = 'X';
        if (checkWinner(testBoard) === 'X') return spot;
      }
    }
    
    // Take center if available, otherwise random
    if (currentBoard[4] === null) return 4;
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner === 'X') {
      const newWinStreak = winStreak + 1;
      setWinStreak(newWinStreak);
      setGameStatus('won');
      
      if (newWinStreak >= gamesNeeded) {
        setTimeout(onSuccess, 1000);
      } else {
        setTimeout(resetGame, 1500);
      }
    } else if (newBoard.every(cell => cell !== null)) {
      setGameStatus('draw');
      setTimeout(resetGame, 1500);
    } else {
      // AI move
      setTimeout(() => {
        const aiMove = makeAIMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);
        
        const aiWinner = checkWinner(aiBoard);
        if (aiWinner === 'O') {
          setGameStatus('lost');
          setWinStreak(0);
          setTimeout(resetGame, 1500);
        } else if (aiBoard.every(cell => cell !== null)) {
          setGameStatus('draw');
          setTimeout(resetGame, 1500);
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
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
          {getDifficultyLabel()} Tic Tac Toe
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 30 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">
          ⭕ Win {gamesNeeded} game{gamesNeeded > 1 ? 's' : ''} to dismiss alarm
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          You are X, AI is O • Wins: {winStreak}/{gamesNeeded}
        </p>

        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
          {board.map((cell, index) => (
            <Button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`w-16 h-16 text-2xl font-bold ${
                cell === 'X' ? 'bg-blue-500 text-white' :
                cell === 'O' ? 'bg-red-500 text-white' :
                'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              disabled={!!cell || !isPlayerTurn || gameStatus !== 'playing'}
            >
              {cell}
            </Button>
          ))}
        </div>

        <div className="text-center">
          {gameStatus === 'won' && (
            <p className="text-green-600 font-semibold">🎉 You won this round!</p>
          )}
          {gameStatus === 'lost' && (
            <p className="text-red-600 font-semibold">😅 AI won this round</p>
          )}
          {gameStatus === 'draw' && (
            <p className="text-yellow-600 font-semibold">🤝 It's a draw!</p>
          )}
          {gameStatus === 'playing' && !isPlayerTurn && (
            <p className="text-blue-600 font-semibold">🤖 AI is thinking...</p>
          )}
          {gameStatus === 'playing' && isPlayerTurn && (
            <p className="text-gray-600">Your turn! Click a square</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToeChallenge;
