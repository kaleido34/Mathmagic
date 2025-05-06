import {
  Gamepad,
  Eye,
  Award,
  Users,
  Brain,
  BookOpen
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export function Features() {
  const features: Feature[] = [
    {
      icon: <Gamepad className="text-primary text-2xl" />,
      title: "Learn Through Play",
      description: "Math games and puzzles that make learning feel like playtime, not homework.",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: <Eye className="text-secondary text-2xl" />,
      title: "Visual Learning",
      description: "Interactive diagrams and animations that make abstract concepts concrete and easy to grasp.",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary"
    },
    {
      icon: <Award className="text-accent text-2xl" />,
      title: "Track Progress",
      description: "Earn badges and see your skills grow to build confidence in your math abilities.",
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      icon: <Users className="text-purple-600 text-2xl" />,
      title: "Personalized Learning",
      description: "Adaptive lessons that adjust to your pace and style of learning for maximum understanding.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: <Brain className="text-blue-600 text-2xl" />,
      title: "No-Stress Approach",
      description: "Designed to reduce math anxiety with friendly interfaces and positive reinforcement.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <BookOpen className="text-green-600 text-2xl" />,
      title: "Curriculum Aligned",
      description: "All content follows grade 6-8 curriculum standards to ensure classroom success.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-secondary/5 to-accent/5 dark:from-secondary/10 dark:to-accent/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-2 dark:text-white">
          Why Students Love MathJoy
        </h2>
        <p className="text-center text-neutral-dark dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Our platform is specially designed to make math approachable, engaging, and stress-free.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-neutral-dark dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
