import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-neutral-dark dark:text-white mb-4">
              Making Math <span className="text-primary">Fun</span> and{" "}
              <span className="text-secondary">Stress-Free</span>
            </h1>
            <p className="text-lg text-neutral-dark dark:text-gray-300 mb-6">
              Interactive lessons, games, and puzzles designed especially for students 
              in grades 6-8 who feel anxious about math.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/topics">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-lg"
                >
                  Start Learning
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white dark:bg-transparent hover:bg-gray-50 text-primary border border-primary rounded-full font-semibold text-lg"
                >
                  Take a Tour
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500"
              alt="Students enjoying math activities"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
