import { HeroSection } from "@/components/home/hero-section";
import { GradeSelection } from "@/components/home/grade-selection";
import { FeaturedModules } from "@/components/home/featured-modules";
import { InteractiveDemo } from "@/components/home/interactive-demo";
import { Features } from "@/components/home/features";
import { MathGames } from "@/components/home/math-games";
import { Testimonials } from "@/components/home/testimonials";
import { CallToAction } from "@/components/home/call-to-action";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>MathJoy - Fun Math Learning for Grades 6-8</title>
        <meta
          name="description"
          content="Interactive math lessons, games, and puzzles designed to reduce anxiety and make learning fun for students in grades 6-8."
        />
      </Helmet>
      <Header />
      <main>
        <HeroSection />
        <GradeSelection />
        <FeaturedModules />
        <InteractiveDemo />
        <Features />
        <MathGames />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
