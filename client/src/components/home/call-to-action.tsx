import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
          Ready to Make Math Fun?
        </h2>
        <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-white/80">
          Join thousands of students who've transformed their relationship with
          math through interactive, stress-free learning.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/topics">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-primary rounded-full font-bold text-lg"
            >
              Get Started Free
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-700 hover:bg-primary-800 text-white border border-white rounded-full font-bold text-lg"
            >
              See Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
