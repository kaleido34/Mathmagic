import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface GradeCard {
  grade: number;
  title: string;
  description: string;
  progress: number;
  color: string;
  bgColor: string;
}

export function GradeSelection() {
  const { data: grades } = useQuery({
    queryKey: ["/api/grades"],
  });

  // Default grade data if API hasn't returned yet
  const gradeCards: GradeCard[] = [
    {
      grade: 6,
      title: "Grade 6",
      description: "Fractions, decimals, intro to algebra, and more!",
      progress: grades?.find((g: any) => g.grade === 6)?.progress || 35,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      grade: 7,
      title: "Grade 7",
      description: "Proportional relationships, equations, statistics, and more!",
      progress: grades?.find((g: any) => g.grade === 7)?.progress || 15,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      grade: 8,
      title: "Grade 8",
      description: "Linear equations, functions, geometry, and more!",
      progress: grades?.find((g: any) => g.grade === 8)?.progress || 5,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 dark:text-white">
          Choose Your Grade
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gradeCards.map((card) => (
            <Link key={card.grade} href={`/topics?grade=${card.grade}`}>
              <Card
                className="math-card bg-neutral-light dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg p-6 text-center cursor-pointer"
              >
                <div
                  className={`w-20 h-20 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className={`text-3xl font-heading font-bold ${card.color}`}>
                    {card.grade}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-neutral-dark dark:text-gray-300 mb-4">
                  {card.description}
                </p>
                <div className="bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${card.grade === 6 ? 'bg-primary' : card.grade === 7 ? 'bg-secondary' : 'bg-accent'} h-full rounded-full`}
                    style={{ width: `${card.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2 text-neutral-dark dark:text-gray-300 font-semibold">
                  {card.progress}% Complete
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
