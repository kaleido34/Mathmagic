import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Calculator, Target, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {/* Math symbols floating in background */}
        <div className="absolute top-1/4 left-1/4 text-primary/10 text-7xl animate-float">+</div>
        <div className="absolute top-2/3 right-1/4 text-secondary/10 text-7xl animate-float-slow">÷</div>
        <div className="absolute bottom-1/4 left-2/3 text-primary/10 text-7xl animate-float-slower">×</div>
        <div className="absolute top-1/3 right-1/3 text-secondary/10 text-7xl animate-float-reverse">−</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-secondary mr-2" />
              <span className="text-white text-sm">Math can be enjoyable!</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 leading-tight">
              Making Math <span className="text-primary">Fun</span> and{" "}
              <span className="text-secondary">Stress-Free</span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Interactive lessons, games, and puzzles designed especially for students 
              in grades 6-8 who feel anxious about math, now with vibrant visualizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/topics">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-lg px-8 py-6"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/games">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:bg-white/10 text-white border-2 border-secondary rounded-full font-semibold text-lg px-8 py-6"
                >
                  Play Math Games
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center mt-8 space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-black" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-gray-400 text-sm">Join thousands of students learning math the fun way</p>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-secondary/20 rounded-3xl blur-xl transform -rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500"
              alt="Students enjoying interactive math learning"
              className="rounded-3xl shadow-2xl border-4 border-white/10 relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
