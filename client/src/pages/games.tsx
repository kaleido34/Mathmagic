import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  grade: number | "all";
  category: string;
  difficulty: string;
  slug: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export default function Games() {
  const [, setLocation] = useLocation();
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: [
      "/api/games",
      selectedGrade !== "all" ? `grade=${selectedGrade}` : "",
      selectedCategory !== "all" ? `category=${selectedCategory}` : "",
    ],
  });

  // Filter games client-side for proper filtering
  const filteredGames = games?.filter(game => {
    const gradeMatch = selectedGrade === "all" ? 
      true : 
      game.grade === parseInt(selectedGrade) || game.grade === "all";
    
    const categoryMatch = selectedCategory === "all" ? 
      true : 
      game.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return gradeMatch && categoryMatch;
  });

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "algebra", name: "Algebra" },
    { id: "geometry", name: "Geometry" },
    { id: "fractions", name: "Fractions" },
    { id: "arithmetic", name: "Arithmetic" },
    { id: "logic", name: "Logic" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const getGradeTag = (grade: number | "all") => {
    if (grade === "all") {
      return {
        text: "All Grades",
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      };
    }

    switch (grade) {
      case 6:
        return {
          text: `Grade ${grade}`,
          color: "bg-primary/10 text-primary dark:bg-primary/20"
        };
      case 7:
        return {
          text: `Grade ${grade}`,
          color: "bg-secondary/10 text-secondary dark:bg-secondary/20"
        };
      case 8:
        return {
          text: `Grade ${grade}`,
          color: "bg-accent/10 text-accent dark:bg-accent/20"
        };
      default:
        return {
          text: `Grade ${grade}`,
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        };
    }
  };

  // Default games if API hasn't returned yet
  const defaultGames: Game[] = [
    {
      id: 1,
      title: "Fraction Match",
      description: "Match equivalent fractions against the clock!",
      image: "https://pixabay.com/get/gdea1083e9c6d43c11bbdad55698f45c3126a9403f28c1b1d0d274eef379b82f54a837e01b8635ab84ded5c3704eb61e595b20b9c83bc87178c2be02e259b5575_1280.jpg",
      grade: 6,
      category: "fractions",
      difficulty: "easy",
      slug: "fraction-match",
      isPopular: true
    },
    {
      id: 2,
      title: "Number Ninja",
      description: "Solve calculations quickly to level up your skills!",
      image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      grade: 7,
      category: "arithmetic",
      difficulty: "medium",
      slug: "number-ninja"
    },
    {
      id: 3,
      title: "Geometry Quest",
      description: "Navigate through geometric challenges to win!",
      image: "https://pixabay.com/get/g7173baa7cf464028491a1dc6b147f0cc1968c67cce622fb070da572f91daf9729fdc6074c47ad817641c1722a34fa616bf552033e2af056b30ac37a499564f0d_1280.jpg",
      grade: 8,
      category: "geometry",
      difficulty: "hard",
      slug: "geometry-quest"
    },
    {
      id: 4,
      title: "Algebra Explorer",
      description: "Solve equations in this fun adventure game!",
      image: "https://images.unsplash.com/photo-1635241161466-541f065683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      grade: "all",
      category: "algebra",
      difficulty: "medium",
      slug: "algebra-explorer",
      isNew: true
    }
  ];
  
  // Use the filtered games if available, otherwise use default games
  const mathGames = filteredGames || games || defaultGames;

  return (
    <>
      <Helmet>
        <title>Math Games | MathJoy</title>
        <meta
          name="description"
          content="Play fun, interactive math games designed to reduce anxiety and make learning enjoyable for students in grades 6-8."
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 dark:text-white">
            Math Games
          </h1>

          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade Level
              </label>
              <Select
                value={selectedGrade}
                onValueChange={setSelectedGrade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : mathGames && mathGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mathGames.map((game) => (
                <Card
                  key={game.id}
                  className="math-card bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-40 object-cover"
                    />
                    {game.isPopular && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        Popular
                      </div>
                    )}
                    {game.isNew && (
                      <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                        New
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold mb-1 dark:text-white">{game.title}</h3>
                    <p className="text-sm text-neutral-dark dark:text-gray-300 mb-3">
                      {game.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs ${getGradeTag(game.grade).color} px-2 py-1 rounded`}>
                        {getGradeTag(game.grade).text}
                      </span>
                      {game.category && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                          {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                        </span>
                      )}
                      {game.difficulty && (
                        <span className={`text-xs ${getDifficultyColor(game.difficulty)} px-2 py-1 rounded`}>
                          {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                        </span>
                      )}
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        // Different handling for different games
                        if (game.title.toLowerCase().includes("fraction")) {
                          // Launch memory game with fraction focus
                          setLocation(`/games/memory/${encodeURIComponent(game.title)}`);
                        } else if (game.category.toLowerCase() === "geometry") {
                          // Launch crossword with geometry focus
                          setLocation(`/games/crossword/${encodeURIComponent("Geometry Crossword")}`);
                        } else if (game.category.toLowerCase() === "algebra") {
                          // Launch crossword with algebra focus
                          setLocation(`/games/crossword/${encodeURIComponent("Algebra Crossword")}`);
                        } else if (game.category.toLowerCase() === "arithmetic") {
                          // Launch memory game with generic focus
                          setLocation("/games/memory");
                        } else {
                          // Generic fallback
                          setLocation("/games/memory");
                        }
                      }}
                    >
                      Play Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                No games found
              </h3>
              <p className="text-neutral-dark dark:text-gray-300 mb-4">
                Try selecting a different grade or category
              </p>
              <Button onClick={() => {
                setSelectedGrade("all");
                setSelectedCategory("all");
              }}>
                View All Games
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
