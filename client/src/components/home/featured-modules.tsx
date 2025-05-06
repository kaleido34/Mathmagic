import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  grade: number;
  difficulty: string;
  activities: number;
  slug: string;
}

export function FeaturedModules() {
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ["/api/modules/featured"],
  });

  // Default modules if API hasn't returned yet
  const featuredModules: Module[] = modules.length > 0 ? modules : [
    {
      id: 1,
      title: "Fractions Made Fun",
      description: "Learn how to add, subtract, and compare fractions using visual models.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      grade: 6,
      difficulty: "Easy",
      activities: 8,
      slug: "fractions-made-fun",
    },
    {
      id: 2,
      title: "Geometry Explorer",
      description: "Discover properties of shapes, angles, and transformations with interactive tools.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      grade: 7,
      difficulty: "Medium",
      activities: 12,
      slug: "geometry-explorer",
    },
    {
      id: 3,
      title: "Algebra Adventure",
      description: "Solve equations and graph functions through interactive challenges and games.",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      grade: 8,
      difficulty: "Challenging",
      activities: 10,
      slug: "algebra-adventure",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "challenging":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 6:
        return "bg-primary/10 text-primary";
      case 7:
        return "bg-secondary/10 text-secondary";
      case 8:
        return "bg-accent/10 text-accent";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const getButtonColor = (grade: number) => {
    switch (grade) {
      case 6:
        return "bg-primary hover:bg-primary/90";
      case 7:
        return "bg-secondary hover:bg-secondary/90";
      case 8:
        return "bg-accent hover:bg-accent/90";
      default:
        return "bg-purple-600 hover:bg-purple-700";
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-neutral-light dark:from-primary/10 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-heading font-bold dark:text-white">
            Featured Modules
          </h2>
          <Link href="/topics" className="text-primary font-semibold flex items-center hover:underline cursor-pointer">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredModules.map((module) => (
            <Card
              key={module.id}
              className="math-card bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg overflow-hidden"
            >
              <img
                src={module.image}
                alt={module.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span
                    className={`${getGradeColor(module.grade)} text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    Grade {module.grade}
                  </span>
                  <span
                    className={`${getDifficultyColor(module.difficulty)} text-xs font-semibold px-3 py-1 rounded-full ml-2`}
                  >
                    {module.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                  {module.title}
                </h3>
                <p className="text-neutral-dark dark:text-gray-300 text-sm mb-4">
                  {module.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-dark dark:text-gray-300">
                    {module.activities} activities
                  </span>
                  <Link href={`/modules/${module.slug}`}>
                    <Button
                      className={`${getButtonColor(module.grade)} text-white`}
                      size="sm"
                    >
                      Start Learning
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
