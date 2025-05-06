import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

interface Testimonial {
  id: number;
  content: string;
  name: string;
  age: number;
  grade: number;
  initial: string;
  stars: number;
}

export function Testimonials() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Default testimonials if API hasn't returned yet
  const studentTestimonials: Testimonial[] = testimonials.length > 0 ? testimonials : [
    {
      id: 1,
      content: "I used to hate math class, but now I actually look forward to it! The games make learning so much more fun than just doing worksheets.",
      name: "Aiden",
      age: 12,
      grade: 6,
      initial: "A",
      stars: 5
    },
    {
      id: 2,
      content: "The visual examples really helped me understand fractions. Now I can see how they work instead of just trying to memorize rules.",
      name: "Sophia",
      age: 13,
      grade: 7,
      initial: "S",
      stars: 5
    },
    {
      id: 3,
      content: "I was struggling with algebra until I found this website. The step-by-step explanations and practice problems helped me boost my grade from a C to an A-!",
      name: "Ethan",
      age: 14,
      grade: 8,
      initial: "E",
      stars: 4.5
    }
  ];

  const getStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="text-yellow-400 flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} fill="currentColor" className="h-4 w-4" />
        ))}
        {hasHalfStar && <StarHalf fill="currentColor" className="h-4 w-4" />}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        ))}
      </div>
    );
  };

  const getInitialBgColor = (grade: number) => {
    switch (grade) {
      case 6:
        return "bg-primary/20";
      case 7:
        return "bg-secondary/20";
      case 8:
        return "bg-accent/20";
      default:
        return "bg-gray-200";
    }
  };

  const getInitialTextColor = (grade: number) => {
    switch (grade) {
      case 6:
        return "text-primary";
      case 7:
        return "text-secondary";
      case 8:
        return "text-accent";
      default:
        return "text-gray-700";
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12 dark:text-white">
          What Students Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {studentTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                {getStars(testimonial.stars)}
              </div>
              <p className="text-neutral-dark dark:text-gray-300 mb-4">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${getInitialBgColor(
                    testimonial.grade
                  )} flex items-center justify-center`}
                >
                  <span
                    className={`${getInitialTextColor(
                      testimonial.grade
                    )} font-bold`}
                  >
                    {testimonial.initial}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold dark:text-white">
                    {testimonial.name}, {testimonial.age}
                  </p>
                  <p className="text-sm text-neutral-dark dark:text-gray-400">
                    Grade {testimonial.grade} Student
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
