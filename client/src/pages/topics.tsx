import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  grade: number;
  category: string;
  difficulty: string;
  activities: number;
  slug: string;
}

export default function Topics() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()
  );
  const [selectedGrade, setSelectedGrade] = useState<number | null>(
    searchParams.has("grade") ? Number(searchParams.get("grade")) : null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );

  const { data: modules, isLoading } = useQuery<Module[]>({
    queryKey: [
      "/api/modules",
      selectedGrade ? `grade=${selectedGrade}` : "",
      selectedCategory !== "all" ? `category=${selectedCategory}` : "",
    ],
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGrade) params.set("grade", selectedGrade.toString());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    
    setSearchParams(params);
    
    // Update the URL without causing a navigation
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
    window.history.replaceState({}, "", newUrl);
  }, [selectedGrade, selectedCategory]);

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "algebra", name: "Algebra" },
    { id: "geometry", name: "Geometry" },
    { id: "fractions", name: "Fractions" },
    { id: "statistics", name: "Statistics" },
    { id: "decimals", name: "Decimals" },
  ];

  const grades = [6, 7, 8];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "challenging":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const handleGradeChange = (grade: number | null) => {
    setSelectedGrade(grade);
  };

  return (
    <>
      <Helmet>
        <title>Math Topics | MathJoy</title>
        <meta
          name="description"
          content="Explore math topics organized by grade level and category. Find interactive lessons on fractions, algebra, geometry, and more for grades 6-8."
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 dark:text-white">
            Math Topics {selectedGrade ? `for Grade ${selectedGrade}` : ""}
          </h1>

          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              variant={selectedGrade === null ? "secondary" : "outline"}
              onClick={() => handleGradeChange(null)}
              className="rounded-full"
            >
              All Grades
            </Button>
            {grades.map((grade) => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? "secondary" : "outline"}
                onClick={() => handleGradeChange(grade)}
                className="rounded-full"
              >
                Grade {grade}
              </Button>
            ))}
          </div>

          <Tabs
            defaultValue={selectedCategory}
            onValueChange={setSelectedCategory}
            className="mb-8"
          >
            <TabsList className="mb-4 flex flex-wrap h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : modules && modules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                      <Card
                        key={module.id}
                        className="math-card bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg overflow-hidden"
                      >
                        <img
                          src={module.image}
                          alt={module.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex items-center mb-3 flex-wrap gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                              Grade {module.grade}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${getDifficultyColor(module.difficulty)} border-none`}
                            >
                              {module.difficulty}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-none">
                              {module.category}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                            {module.title}
                          </h3>
                          <p className="text-neutral-dark dark:text-gray-300 text-sm mb-4">
                            {module.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-dark dark:text-gray-400">
                              {module.activities} activities
                            </span>
                            <Link href={`/module/${module.slug}`}>
                              <Button size="sm">Start Learning</Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                      No modules found
                    </h3>
                    <p className="text-neutral-dark dark:text-gray-300 mb-4">
                      Try selecting a different grade or category
                    </p>
                    <Button onClick={() => {
                      setSelectedGrade(null);
                      setSelectedCategory("all");
                    }}>
                      View All Topics
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
