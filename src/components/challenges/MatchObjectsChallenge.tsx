import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MatchObjectsChallengeProps {
  difficulty: number;
  onSuccess: () => void;
  onFailure: () => void;
}

interface MatchItem {
  id: number;
  category: string;
  item: string;
  emoji: string;
  isSelected: boolean;
  isMatched: boolean;
}

const MatchObjectsChallenge: React.FC<MatchObjectsChallengeProps> = ({ difficulty, onSuccess, onFailure }) => {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameStarted, setGameStarted] = useState(false);

  const allCategories = {
    'Fruits': ['🍎 Apple', '🍌 Banana', '🍊 Orange', '🍇 Grapes', '🍓 Strawberry', '🥝 Kiwi', '🍑 Cherry', '🥭 Mango'],
    'Animals': ['🐱 Cat', '🐶 Dog', '🐰 Rabbit', '🐻 Bear', '🦁 Lion', '🐯 Tiger', '🐼 Panda', '🐨 Koala'],
    'Sports': ['⚽ Soccer', '🏀 Basketball', '🎾 Tennis', '🏈 Football', '🏐 Volleyball', '🏓 Ping Pong', '🏸 Badminton', '🏒 Hockey'],
    'Vehicles': ['🚗 Car', '🚲 Bike', '✈️ Plane', '🚢 Ship', '🚌 Bus', '🚂 Train', '🏍️ Motorcycle', '🚁 Helicopter'],
    'Food': ['🍕 Pizza', '🍔 Burger', '🌮 Taco', '🍜 Noodles', '🍣 Sushi', '🥗 Salad', '🍝 Pasta', '🥪 Sandwich'],
    'Objects': ['📱 Phone', '💻 Laptop', '⌚ Watch', '🎧 Headphones', '📚 Book', '✏️ Pencil', '🔑 Key', '💡 Bulb'],
    'Nature': ['🌳 Tree', '🌸 Flower', '🍄 Mushroom', '🌊 Wave', '⛰️ Mountain', '🌙 Moon', '⭐ Star', '☀️ Sun']
  };

  const initializeGame = () => {
    const categoryCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
    const itemsPerCategory = difficulty === 1 ? 3 : difficulty === 2 ? 3 : 4;
    
    // Randomly select categories for this game
    const availableCategories = Object.keys(allCategories);
    const shuffledCategories = availableCategories.sort(() => Math.random() - 0.5);
    const selectedCategories = shuffledCategories.slice(0, categoryCount);
    
    const gameItems: MatchItem[] = [];
    
    selectedCategories.forEach((category, catIndex) => {
      const categoryItems = allCategories[category as keyof typeof allCategories];
      // Randomly select items from this category
      const shuffledItems = categoryItems.sort(() => Math.random() - 0.5);
      const selectedItems = shuffledItems.slice(0, itemsPerCategory);
      
      selectedItems.forEach((item, itemIndex) => {
        const [emoji, name] = item.split(' ');
        gameItems.push({
          id: catIndex * 10 + itemIndex,
          category,
          item: name,
          emoji,
          isSelected: false,
          isMatched: false
        });
      });
    });
    
    // Shuffle items
    const shuffledItems = gameItems.sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    setSelectedItems([]);
    setMatches(0);
    setGameStarted(false);
    setTimeLeft(difficulty === 1 ? 60 : difficulty === 2 ? 75 : 90);
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
    const totalCategories = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
    if (matches === totalCategories) {
      setTimeout(onSuccess, 1000);
    }
  }, [matches, difficulty]);

  const handleItemClick = (itemId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    const item = items.find(i => i.id === itemId);
    if (!item || item.isMatched || selectedItems.includes(itemId)) return;

    const newSelectedItems = [...selectedItems, itemId];
    setSelectedItems(newSelectedItems);

    setItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId ? { ...i, isSelected: true } : i
      )
    );

    // Check if we have items from the same category selected
    const selectedItemsData = items.filter(i => newSelectedItems.includes(i.id));
    const categoriesSelected = [...new Set(selectedItemsData.map(i => i.category))];
    
    if (categoriesSelected.length === 1 && selectedItemsData.length >= (difficulty === 1 ? 3 : difficulty === 2 ? 3 : 4)) {
      // Match found!
      setTimeout(() => {
        setItems(prevItems =>
          prevItems.map(i =>
            i.category === categoriesSelected[0] 
              ? { ...i, isMatched: true, isSelected: false }
              : { ...i, isSelected: false }
          )
        );
        setMatches(matches + 1);
        setSelectedItems([]);
      }, 500);
    } else if (newSelectedItems.length >= 4 || categoriesSelected.length > 1) {
      // Too many selections or wrong category mix
      setTimeout(() => {
        setItems(prevItems =>
          prevItems.map(i => ({ ...i, isSelected: false }))
        );
        setSelectedItems([]);
      }, 1000);
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return 'Easy (2 categories)';
      case 2: return 'Medium (3 categories)';
      case 3: return 'Hard (4 categories)';
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
          {getDifficultyLabel()}
        </Badge>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          timeLeft <= 20 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">
          🎯 Match Objects by Category
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Group items from the same category together • Matches: {matches}/{difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4}
        </p>

        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {items.map((item) => (
            <Button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`h-16 text-xs font-medium transition-all duration-300 ${
                item.isMatched
                  ? 'bg-green-500 text-white'
                  : item.isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              disabled={item.isMatched}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-xs">{item.item}</span>
              </div>
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

export default MatchObjectsChallenge;