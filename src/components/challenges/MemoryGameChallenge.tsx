
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MemoryGameChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGameChallenge: React.FC<MemoryGameChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameStarted, setGameStarted] = useState(false);

  const emojis = ['🎯', '🎮', '🎨', '🎪', '🎭', '🎲', '🎸', '🎺', '🎻', '🎹', '🏆', '🏅', '⚽', '🏀', '🎾', '🏐'];
  
  const initializeGame = () => {
    const pairCount = difficulty === 1 ? 6 : difficulty === 2 ? 8 : 10;
    const gameEmojis = emojis.slice(0, pairCount);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false
      }));
      
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameStarted(false);
    setTimeLeft(difficulty === 1 ? 90 : difficulty === 2 ? 105 : 120);
  };

  useEffect(() => {
    initializeGame();
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
    const totalPairs = cards.length / 2;
    if (matches === totalPairs && totalPairs > 0) {
      setTimeout(onSuccess, 1000);
    }
  }, [matches, cards.length]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards;
      
      if (cards[firstCard].value === cards[secondCard].value) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard || card.id === secondCard
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(matches + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard || card.id === secondCard
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return 'Easy (6 pairs)';
      case 2: return 'Medium (8 pairs)';
      case 3: return 'Hard (10 pairs)';
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

  const gridCols = difficulty === 1 ? 'grid-cols-4' : difficulty === 2 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge className={getDifficultyColor()}>
          {getDifficultyLabel()}
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 30 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">
          🧠 Memory Card Game
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Find all matching pairs • Matches: {matches}/{cards.length / 2} • Moves: {moves}
        </p>

        <div className={`grid ${gridCols} gap-2 max-w-sm mx-auto`}>
          {cards.map((card) => (
            <Button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`w-12 h-12 text-lg font-bold transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? card.isMatched
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
              }`}
              disabled={card.isMatched || flippedCards.length === 2}
            >
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </Button>
          ))}
        </div>

        <div className="mt-4">
          <Button
            onClick={initializeGame}
            variant="outline"
            className="text-sm"
          >
            🔄 New Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryGameChallenge;
