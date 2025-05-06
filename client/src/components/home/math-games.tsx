import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  grade: number | "all";
  slug: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export function MathGames() {
  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  // Default games if API hasn't returned yet
  const mathGames: Game[] = games.length > 0 ? games : [
    {
      id: 1,
      title: "Fraction Match",
      description: "Match equivalent fractions against the clock!",
      image: "https://pixabay.com/get/gdea1083e9c6d43c11bbdad55698f45c3126a9403f28c1b1d0d274eef379b82f54a837e01b8635ab84ded5c3704eb61e595b20b9c83bc87178c2be02e259b5575_1280.jpg",
      grade: 6,
      slug: "fraction-match",
      isPopular: true
    },
    {
      id: 2,
      title: "Number Ninja",
      description: "Solve calculations quickly to level up your skills!",
      image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      grade: 7,
      slug: "number-ninja"
    },
    {
      id: 3,
      title: "Geometry Quest",
      description: "Navigate through geometric challenges to win!",
      image: "https://pixabay.com/get/g7173baa7cf464028491a1dc6b147f0cc1968c67cce622fb070da572f91daf9729fdc6074c47ad817641c1722a34fa616bf552033e2af056b30ac37a499564f0d_1280.jpg",
      grade: 8,
      slug: "geometry-quest"
    },
    {
      id: 4,
      title: "Algebra Explorer",
      description: "Solve equations in this fun adventure game!",
      image: "https://images.unsplash.com/photo-1635241161466-541f065683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      grade: "all",
      slug: "algebra-explorer",
      isNew: true
    }
  ];

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

  const getButtonColor = (grade: number | "all") => {
    if (grade === "all") {
      return "text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20";
    }
    
    switch (grade) {
      case 6:
        return "text-primary hover:bg-primary/10 dark:hover:bg-primary/20";
      case 7:
        return "text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20";
      case 8:
        return "text-accent hover:bg-accent/10 dark:hover:bg-accent/20";
      default:
        return "text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20";
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-heading font-bold dark:text-white">
            Math Games
          </h2>
          <Link href="/games" className="text-primary font-semibold flex items-center hover:underline dark:text-primary cursor-pointer">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mathGames.map((game) => (
            <Card
              key={game.id}
              className="math-card bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-36 object-cover"
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
                <h3 className="font-heading font-bold dark:text-white">{game.title}</h3>
                <p className="text-sm text-neutral-dark dark:text-gray-300 mb-3">
                  {game.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${getGradeTag(game.grade).color} px-2 py-1 rounded`}>
                    {getGradeTag(game.grade).text}
                  </span>
                  <button
                    className={`${getButtonColor(game.grade)} font-semibold px-3 py-1 rounded text-sm transition cursor-pointer`}
                    onClick={() => window.alert(`Coming soon: ${game.title} will be playable in a future update!`)}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
