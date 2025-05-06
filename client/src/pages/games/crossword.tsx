import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";

// Define types for our crossword puzzle
interface CrosswordWord {
  word: string;
  clue: string;
  position: {
    x: number;
    y: number;
  };
  direction: "across" | "down";
}

interface CrosswordData {
  id: string;
  title: string;
  size: {
    width: number;
    height: number;
  };
  words: CrosswordWord[];
}

interface CellData {
  letter: string;
  userInput: string;
  number?: number;
  wordIndices: number[]; // Indices of words that include this cell
  x: number;
  y: number;
}

export default function CrosswordGame() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/games/crossword/:title?");
  const gameTitle = params?.title ? decodeURIComponent(params.title) : "Math Terms Crossword";
  
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [words, setWords] = useState<CrosswordWord[]>([]);
  const [currentClue, setCurrentClue] = useState<string>("");
  const [selectedCell, setSelectedCell] = useState<{x: number, y: number} | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [solvedWords, setSolvedWords] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Initialize the puzzle based on the game title
  useEffect(() => {
    if (gameStarted) {
      const puzzleData = getPuzzleData(gameTitle);
      initializePuzzle(puzzleData);
    }
  }, [gameStarted, gameTitle]);
  
  // Get puzzle data based on the game title
  const getPuzzleData = (title: string): CrosswordData => {
    // Default to the math terms crossword
    let puzzleData: CrosswordData = {
      id: "math-terms",
      title: "Math Terms Crossword",
      size: { width: 10, height: 10 },
      words: [
        {
          word: "ADDITION",
          clue: "The process of combining numbers to find their sum",
          position: { x: 1, y: 0 },
          direction: "across"
        },
        {
          word: "SUBTRACT",
          clue: "To take away one number from another",
          position: { x: 0, y: 3 },
          direction: "across"
        },
        {
          word: "MULTIPLY",
          clue: "To add a number to itself a specified number of times",
          position: { x: 7, y: 1 },
          direction: "down"
        },
        {
          word: "DIVIDE",
          clue: "To split into equal parts",
          position: { x: 3, y: 2 },
          direction: "down"
        },
        {
          word: "FRACTION",
          clue: "A part of a whole, represented by a numerator and denominator",
          position: { x: 2, y: 7 },
          direction: "across"
        }
      ]
    };
    
    // Check for specific puzzles based on title
    if (title.toLowerCase().includes("algebra")) {
      puzzleData = {
        id: "algebra-terms",
        title: "Algebra Terms Crossword",
        size: { width: 12, height: 12 },
        words: [
          {
            word: "EQUATION",
            clue: "A mathematical statement that two expressions are equal",
            position: { x: 1, y: 0 },
            direction: "across"
          },
          {
            word: "VARIABLE",
            clue: "A symbol, usually a letter, that represents a value",
            position: { x: 6, y: 1 },
            direction: "down"
          },
          {
            word: "EXPONENT",
            clue: "A number that indicates how many times a base is multiplied by itself",
            position: { x: 0, y: 5 },
            direction: "across"
          },
          {
            word: "FACTOR",
            clue: "A number that divides another number without a remainder",
            position: { x: 3, y: 3 },
            direction: "down"
          },
          {
            word: "EVALUATE",
            clue: "To find the value of an expression",
            position: { x: 2, y: 9 },
            direction: "across"
          }
        ]
      };
    } else if (title.toLowerCase().includes("geometry")) {
      puzzleData = {
        id: "geometry-terms",
        title: "Geometry Terms Crossword",
        size: { width: 12, height: 12 },
        words: [
          {
            word: "TRIANGLE",
            clue: "A polygon with three sides",
            position: { x: 0, y: 2 },
            direction: "across"
          },
          {
            word: "CIRCLE",
            clue: "A round plane figure whose boundary consists of points equidistant from a fixed point",
            position: { x: 4, y: 0 },
            direction: "down"
          },
          {
            word: "RECTANGLE",
            clue: "A quadrilateral with four right angles",
            position: { x: 7, y: 3 },
            direction: "down"
          },
          {
            word: "PERIMETER",
            clue: "The total distance around a shape",
            position: { x: 1, y: 7 },
            direction: "across"
          },
          {
            word: "AREA",
            clue: "The size of a surface, measured in square units",
            position: { x: 9, y: 8 },
            direction: "down"
          }
        ]
      };
    }
    
    return puzzleData;
  };
  
  // Initialize the puzzle grid and words
  const initializePuzzle = (puzzleData: CrosswordData) => {
    const { size, words } = puzzleData;
    
    // Create an empty grid
    const emptyGrid: CellData[][] = Array(size.height)
      .fill(null)
      .map((_, y) => 
        Array(size.width)
          .fill(null)
          .map((_, x) => ({
            letter: "",
            userInput: "",
            wordIndices: [],
            x,
            y
          }))
      );
    
    // Add words to the grid
    const numberedWords = addWordsToGrid(emptyGrid, words);
    
    setGrid(emptyGrid);
    setWords(numberedWords);
  };
  
  // Add words to the grid and assign numbers to them
  const addWordsToGrid = (grid: CellData[][], words: CrosswordWord[]): CrosswordWord[] => {
    let cellNumber = 1;
    const numberedWords: CrosswordWord[] = [];
    const numberedCells: {x: number, y: number}[] = [];
    
    // Process each word
    words.forEach((word, wordIndex) => {
      const { position, direction, word: wordText } = word;
      const { x, y } = position;
      
      // Check if we need to assign a number to this position
      const needNumber = !numberedCells.some(pos => pos.x === x && pos.y === y);
      
      if (needNumber) {
        grid[y][x].number = cellNumber++;
        numberedCells.push({ x, y });
      }
      
      // Add the word to the grid
      for (let i = 0; i < wordText.length; i++) {
        const letter = wordText[i];
        const newX = direction === "across" ? x + i : x;
        const newY = direction === "down" ? y + i : y;
        
        grid[newY][newX].letter = letter;
        grid[newY][newX].wordIndices.push(wordIndex);
      }
      
      // Add the word to the numbered words array
      numberedWords.push({
        ...word,
        word: wordText
      });
    });
    
    return numberedWords;
  };
  
  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    // Check if the cell is part of a word
    if (grid[y][x].letter === "") {
      return;
    }
    
    // If the same cell is clicked, toggle direction
    if (selectedCell?.x === x && selectedCell?.y === y) {
      setDirection(direction === "across" ? "down" : "across");
    } else {
      setSelectedCell({ x, y });
      
      // Find words that include this cell
      const wordIndices = grid[y][x].wordIndices;
      
      // Try to set the direction based on available words
      if (wordIndices.length === 1) {
        setDirection(words[wordIndices[0]].direction);
      } else if (wordIndices.length > 1) {
        // If there are multiple words, prefer the current direction
        // but switch if needed
        const hasCurrentDirection = wordIndices.some(index => 
          words[index].direction === direction
        );
        
        if (!hasCurrentDirection) {
          setDirection(direction === "across" ? "down" : "across");
        }
      }
    }
    
    // Find the current clue
    const wordIndices = grid[y][x].wordIndices;
    const targetDirection = direction;
    const wordIndex = wordIndices.find(index => words[index].direction === targetDirection);
    
    if (wordIndex !== undefined) {
      setCurrentClue(words[wordIndex].clue);
    }
  };
  
  // Handle key press
  const handleKeyPress = (key: string) => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    // Handle letter input
    if (/^[A-Za-z]$/.test(key)) {
      const newGrid = [...grid];
      newGrid[y][x].userInput = key.toUpperCase();
      setGrid(newGrid);
      
      // Move to the next cell
      moveToNextCell();
      
      // Check if words are completed
      checkCompletedWords();
    }
    // Handle backspace
    else if (key === "Backspace") {
      const newGrid = [...grid];
      newGrid[y][x].userInput = "";
      setGrid(newGrid);
      
      // Move to the previous cell
      moveToPrevCell();
    }
    // Handle arrow keys
    else if (key === "ArrowRight") {
      setDirection("across");
      moveRight();
    }
    else if (key === "ArrowLeft") {
      setDirection("across");
      moveLeft();
    }
    else if (key === "ArrowDown") {
      setDirection("down");
      moveDown();
    }
    else if (key === "ArrowUp") {
      setDirection("down");
      moveUp();
    }
  };
  
  // Move to the next cell based on the current direction
  const moveToNextCell = () => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    if (direction === "across") {
      moveRight();
    } else {
      moveDown();
    }
  };
  
  // Move to the previous cell based on the current direction
  const moveToPrevCell = () => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    if (direction === "across") {
      moveLeft();
    } else {
      moveUp();
    }
  };
  
  // Move right if possible
  const moveRight = () => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    // Check if the next cell exists and has a letter
    if (x + 1 < grid[0].length && grid[y][x + 1].letter !== "") {
      setSelectedCell({ x: x + 1, y });
      updateCurrentClue(x + 1, y);
    }
  };
  
  // Move left if possible
  const moveLeft = () => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    // Check if the previous cell exists and has a letter
    if (x - 1 >= 0 && grid[y][x - 1].letter !== "") {
      setSelectedCell({ x: x - 1, y });
      updateCurrentClue(x - 1, y);
    }
  };
  
  // Move down if possible
  const moveDown = () => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    // Check if the cell below exists and has a letter
    if (y + 1 < grid.length && grid[y + 1][x].letter !== "") {
      setSelectedCell({ x, y: y + 1 });
      updateCurrentClue(x, y + 1);
    }
  };
  
  // Move up if possible
  const moveUp = () => {
    if (!selectedCell) return;
    
    const { x, y } = selectedCell;
    
    // Check if the cell above exists and has a letter
    if (y - 1 >= 0 && grid[y - 1][x].letter !== "") {
      setSelectedCell({ x, y: y - 1 });
      updateCurrentClue(x, y - 1);
    }
  };
  
  // Update the current clue based on the selected cell
  const updateCurrentClue = (x: number, y: number) => {
    // Find the word indices for this cell
    const wordIndices = grid[y][x].wordIndices;
    
    // Find a word that matches the current direction
    const wordIndex = wordIndices.find(index => words[index].direction === direction);
    
    if (wordIndex !== undefined) {
      setCurrentClue(words[wordIndex].clue);
    }
  };
  
  // Check if any words are completed
  const checkCompletedWords = () => {
    const newSolvedWords: number[] = [];
    
    // Check each word
    words.forEach((word, wordIndex) => {
      const { position, direction, word: wordText } = word;
      const { x, y } = position;
      
      // Check if all letters match
      let isComplete = true;
      
      for (let i = 0; i < wordText.length; i++) {
        const newX = direction === "across" ? x + i : x;
        const newY = direction === "down" ? y + i : y;
        
        if (grid[newY][newX].userInput !== wordText[i]) {
          isComplete = false;
          break;
        }
      }
      
      if (isComplete) {
        newSolvedWords.push(wordIndex);
      }
    });
    
    setSolvedWords(newSolvedWords);
    
    // Check if the game is complete
    if (newSolvedWords.length === words.length) {
      setGameComplete(true);
    }
  };
  
  // Reset the game
  const resetGame = () => {
    // Clear user inputs
    const newGrid = grid.map(row => 
      row.map(cell => ({
        ...cell,
        userInput: ""
      }))
    );
    
    setGrid(newGrid);
    setSolvedWords([]);
    setGameComplete(false);
  };
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };
  
  // Go back to the games page
  const goBack = () => {
    setLocation("/games");
  };
  
  // Check if a word is solved
  const isWordSolved = (wordIndex: number) => {
    return solvedWords.includes(wordIndex);
  };
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      
      // Handle letters, backspace, and arrow keys
      if (/^[A-Za-z]$/.test(e.key) || 
          e.key === "Backspace" || 
          ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        handleKeyPress(e.key);
      }
    };
    
    // Add event listener for keyboard input
    window.addEventListener("keydown", handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, grid, direction]);
  
  // Get clue numbers and directions
  const getClues = () => {
    const across: {number: number, clue: string, wordIndex: number}[] = [];
    const down: {number: number, clue: string, wordIndex: number}[] = [];
    
    words.forEach((word, wordIndex) => {
      const { position, direction, clue } = word;
      const cellNumber = grid[position.y][position.x].number;
      
      if (cellNumber) {
        if (direction === "across") {
          across.push({ number: cellNumber, clue, wordIndex });
        } else {
          down.push({ number: cellNumber, clue, wordIndex });
        }
      }
    });
    
    // Sort by number
    across.sort((a, b) => a.number - b.number);
    down.sort((a, b) => a.number - b.number);
    
    return { across, down };
  };
  
  const clues = getClues();
  
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
              Fill in the crossword puzzle with the correct math terms based on the clues.
            </p>
          </div>
          
          {!gameStarted ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-heading font-bold mb-4 dark:text-white">
                  Math Crossword Puzzle
                </h2>
                <p className="text-neutral-dark dark:text-gray-300 mb-6">
                  Test your knowledge of mathematical terms by completing this crossword puzzle. Click on a square to begin and use the keyboard to enter letters.
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-neutral-dark dark:text-gray-300">
                        {currentClue && (
                          <p className="font-medium">
                            <span className="font-bold">Clue:</span> {currentClue}
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={resetGame}
                        variant="outline"
                        className="text-primary"
                      >
                        Reset
                      </Button>
                    </div>
                    
                    {gameComplete ? (
                      <div className="my-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                        <h2 className="text-2xl font-heading font-bold mb-2 text-green-800 dark:text-green-300">
                          Congratulations!
                        </h2>
                        <p className="text-green-700 dark:text-green-400 mb-4">
                          You've successfully completed the crossword puzzle!
                        </p>
                        <Button 
                          onClick={resetGame}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Play Again
                        </Button>
                      </div>
                    ) : null}
                    
                    <div className="overflow-x-auto">
                      <div 
                        className="grid gap-[1px] bg-gray-300 dark:bg-gray-600 mt-4 mx-auto"
                        style={{
                          gridTemplateColumns: `repeat(${grid.length > 0 ? grid[0].length : 10}, 40px)`,
                          width: `fit-content`
                        }}
                      >
                        {grid.map((row, rowIndex) => 
                          row.map((cell, colIndex) => (
                            <div 
                              key={`${rowIndex}-${colIndex}`}
                              className={`
                                w-10 h-10 flex items-center justify-center relative
                                ${cell.letter === "" ? "bg-gray-800 dark:bg-gray-900" : "bg-white dark:bg-gray-800"}
                                ${selectedCell?.x === colIndex && selectedCell?.y === rowIndex ? "bg-blue-100 dark:bg-blue-900/30" : ""}
                                ${cell.letter !== "" ? "cursor-pointer" : ""}
                              `}
                              onClick={() => cell.letter !== "" && handleCellClick(colIndex, rowIndex)}
                            >
                              {cell.number && (
                                <span className="absolute top-0.5 left-1 text-xs text-gray-600 dark:text-gray-400">
                                  {cell.number}
                                </span>
                              )}
                              {cell.letter !== "" && (
                                <span className="text-lg font-medium text-center dark:text-white">
                                  {cell.userInput}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading font-bold mb-4 dark:text-white">
                      Clues
                    </h3>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-bold mb-2 dark:text-white">Across</h4>
                      <ul className="space-y-2">
                        {clues.across.map(({ number, clue, wordIndex }) => (
                          <li 
                            key={`across-${number}`}
                            className={`flex items-start ${isWordSolved(wordIndex) ? "text-green-600 dark:text-green-400" : "text-neutral-dark dark:text-gray-300"}`}
                          >
                            <span className="font-bold mr-2">{number}.</span>
                            <span>{clue}</span>
                            {isWordSolved(wordIndex) && (
                              <CheckCircle className="ml-2 h-4 w-4 flex-shrink-0 mt-1" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold mb-2 dark:text-white">Down</h4>
                      <ul className="space-y-2">
                        {clues.down.map(({ number, clue, wordIndex }) => (
                          <li 
                            key={`down-${number}`}
                            className={`flex items-start ${isWordSolved(wordIndex) ? "text-green-600 dark:text-green-400" : "text-neutral-dark dark:text-gray-300"}`}
                          >
                            <span className="font-bold mr-2">{number}.</span>
                            <span>{clue}</span>
                            {isWordSolved(wordIndex) && (
                              <CheckCircle className="ml-2 h-4 w-4 flex-shrink-0 mt-1" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}