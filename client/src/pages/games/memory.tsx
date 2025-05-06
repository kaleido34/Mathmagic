import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface MemoryCard {
  id: number;
  content: string;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryGame() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/games/memory/:title?");
  const gameTitle = params?.title ? decodeURIComponent(params.title) : "Fraction Match";
  
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCount, setFlippedCount] = useState(0);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Generate cards data based on game title
  useEffect(() => {
    if (gameStarted) {
      generateCards();
    }
  }, [gameStarted]);
  
  const generateCards = () => {
    let cardData: MemoryCard[] = [];
    
    if (gameTitle.toLowerCase().includes("fraction")) {
      // Fraction pairs
      const fractionPairs = [
        { id: 1, content: "1/2" },
        { id: 2, content: "2/4" },
        { id: 3, content: "1/3" },
        { id: 4, content: "2/6" },
        { id: 5, content: "3/4" },
        { id: 6, content: "6/8" },
        { id: 7, content: "2/5" },
        { id: 8, content: "4/10" },
        { id: 9, content: "5/8" },
        { id: 10, content: "10/16" },
        { id: 11, content: "3/5" },
        { id: 12, content: "6/10" }
      ];
      
      // Create pairs - first 6 pairs
      const selectedPairs = fractionPairs.slice(0, 6);
      
      // Create pairs
      cardData = selectedPairs.reduce((result: MemoryCard[], pair, index) => {
        // Add the original fraction
        result.push({
          id: index * 2,
          content: pair.content,
          flipped: false,
          matched: false
        });
        
        // Add the equivalent fraction
        result.push({
          id: index * 2 + 1,
          content: fractionPairs[index + 1].content,
          flipped: false,
          matched: false
        });
        
        return result;
      }, []);
    } else {
      // Generic math pairs
      const pairs = [
        { a: "2 × 4", b: "8" },
        { a: "15 ÷ 3", b: "5" },
        { a: "7 + 9", b: "16" },
        { a: "20 - 7", b: "13" },
        { a: "3²", b: "9" },
        { a: "√25", b: "5" }
      ];
      
      // Create pairs
      cardData = pairs.reduce((result: MemoryCard[], pair, index) => {
        result.push({
          id: index * 2,
          content: pair.a,
          flipped: false,
          matched: false
        });
        
        result.push({
          id: index * 2 + 1,
          content: pair.b,
          flipped: false,
          matched: false
        });
        
        return result;
      }, []);
    }
    
    // Shuffle cards
    for (let i = cardData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
    }
    
    setCards(cardData);
  };
  
  const handleCardClick = (index: number) => {
    // Can't flip more than 2 cards at once or already matched/flipped cards
    if (flippedCount >= 2 || cards[index].flipped || cards[index].matched) {
      return;
    }
    
    // Flip the card
    let newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    // Track flipped cards
    let newIndexes = [...flippedIndexes];
    newIndexes.push(index);
    setFlippedIndexes(newIndexes);
    
    // Increment flipped count
    setFlippedCount(flippedCount + 1);
    
    // If this is the second card, check for a match
    if (flippedCount === 1) {
      // Increment moves
      setMoves(moves + 1);
      
      const index1 = flippedIndexes[0];
      const index2 = index;
      
      // Check if it's a match
      checkForMatch(newCards, index1, index2);
    }
  };
  
  const checkForMatch = (cardData: MemoryCard[], index1: number, index2: number) => {
    setTimeout(() => {
      let newCards = [...cardData];
      
      // Check for match based on game type
      let isMatch = false;
      
      if (gameTitle.toLowerCase().includes("fraction")) {
        // For fractions, check if they're equivalent
        const fraction1 = parseFraction(newCards[index1].content);
        const fraction2 = parseFraction(newCards[index2].content);
        
        // Check if the fractions are equivalent
        if (fraction1 && fraction2) {
          isMatch = (fraction1.num / fraction1.denom) === (fraction2.num / fraction2.denom);
        }
      } else {
        // For generic pairs, just check if the indices belong to the same pair
        isMatch = Math.floor(index1 / 2) === Math.floor(index2 / 2);
      }
      
      if (isMatch) {
        // If it's a match, mark both cards as matched
        newCards[index1].matched = true;
        newCards[index2].matched = true;
      } else {
        // If it's not a match, flip both cards back
        newCards[index1].flipped = false;
        newCards[index2].flipped = false;
      }
      
      setCards(newCards);
      setFlippedCount(0);
      setFlippedIndexes([]);
      
      // Check if the game is over
      checkGameOver(newCards);
    }, 1000);
  };
  
  const parseFraction = (fractionStr: string) => {
    const parts = fractionStr.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0]);
      const denom = parseInt(parts[1]);
      if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
        return { num, denom };
      }
    }
    return null;
  };
  
  const checkGameOver = (cardData: MemoryCard[]) => {
    const isGameOver = cardData.every(card => card.matched);
    if (isGameOver) {
      setGameOver(true);
    }
  };
  
  const resetGame = () => {
    setFlippedCount(0);
    setFlippedIndexes([]);
    setMoves(0);
    setGameOver(false);
    generateCards();
  };
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  const goBack = () => {
    setLocation("/games");
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="flex items-center text-primary hover:underline mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 dark:text-white">
              {gameTitle}
            </h1>
            <p className="text-neutral-dark dark:text-gray-300 mb-6">
              {gameTitle.toLowerCase().includes("fraction") 
                ? "Match the equivalent fractions to win! Click on two cards to flip them and find pairs." 
                : "Match the expressions with their results to win! Click on two cards to flip them and find pairs."}
            </p>
          </div>
          
          {!gameStarted ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-heading font-bold mb-4 dark:text-white">
                  Memory Match Game
                </h2>
                <p className="text-neutral-dark dark:text-gray-300 mb-6">
                  {gameTitle.toLowerCase().includes("fraction") 
                    ? "Test your fraction knowledge by matching equivalent fractions. Find all pairs to win!" 
                    : "Test your math skills by matching expressions with their results. Find all pairs to win!"}
                </p>
                <Button 
                  onClick={startGame}
                  className="bg-primary hover:bg-primary/90"
                >
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-neutral-dark dark:text-gray-300">
                  Moves: <span className="font-bold">{moves}</span>
                </div>
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="text-primary"
                >
                  Reset Game
                </Button>
              </div>
              
              {gameOver ? (
                <div className="my-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <h2 className="text-2xl font-heading font-bold mb-2 text-green-800 dark:text-green-300">
                    Congratulations!
                  </h2>
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    You completed the game in {moves} moves.
                  </p>
                  <Button 
                    onClick={resetGame}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Play Again
                  </Button>
                </div>
              ) : null}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                  <div 
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`
                      aspect-square cursor-pointer flex items-center justify-center rounded-lg shadow transition-all
                      ${card.flipped || card.matched ? "bg-white dark:bg-gray-700" : "bg-primary"}
                      ${card.matched ? "ring-2 ring-green-500 dark:ring-green-400" : ""}
                    `}
                  >
                    {(card.flipped || card.matched) ? (
                      <span className="text-xl font-bold dark:text-white">{card.content}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}