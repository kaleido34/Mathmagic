import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Insert grades
    console.log("Seeding grades...");
    const grades = [
      {
        grade: 6,
        description: "Fractions, decimals, intro to algebra, and more!",
        imageUrl: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500"
      },
      {
        grade: 7,
        description: "Proportional relationships, equations, statistics, and more!",
        imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        grade: 8,
        description: "Linear equations, functions, geometry, and more!",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      }
    ];

    for (const grade of grades) {
      const existing = await db.query.grades.findFirst({
        where: eq(schema.grades.grade, grade.grade)
      });

      if (!existing) {
        await db.insert(schema.grades).values(grade);
        console.log(`Added grade ${grade.grade}`);
      }
    }

    // Insert categories
    console.log("Seeding categories...");
    const categories = [
      {
        name: "Algebra",
        description: "Learn equations, variables, and algebraic thinking",
        slug: "algebra"
      },
      {
        name: "Geometry",
        description: "Explore shapes, angles, and spatial relationships",
        slug: "geometry"
      },
      {
        name: "Fractions",
        description: "Master fractions, decimals, and percentages",
        slug: "fractions"
      },
      {
        name: "Statistics",
        description: "Learn data analysis, probability, and statistics",
        slug: "statistics"
      },
      {
        name: "Arithmetic",
        description: "Build skills in basic operations and number sense",
        slug: "arithmetic"
      }
    ];

    for (const category of categories) {
      const existing = await db.query.categories.findFirst({
        where: eq(schema.categories.slug, category.slug)
      });

      if (!existing) {
        await db.insert(schema.categories).values(category);
        console.log(`Added category ${category.name}`);
      }
    }

    // Get categories for reference
    const allCategories = await db.query.categories.findMany();
    const categoryMap = allCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {} as Record<string, number>);

    // Insert modules
    console.log("Seeding modules...");
    const modules = [
      {
        title: "Fractions Made Fun",
        description: "Learn how to add, subtract, and compare fractions using visual models.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        grade: 6,
        categoryId: categoryMap["fractions"],
        difficulty: "Easy",
        slug: "fractions-made-fun",
        isFeatured: true
      },
      {
        title: "Geometry Explorer",
        description: "Discover properties of shapes, angles, and transformations with interactive tools.",
        imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        grade: 7,
        categoryId: categoryMap["geometry"],
        difficulty: "Medium",
        slug: "geometry-explorer",
        isFeatured: true
      },
      {
        title: "Algebra Adventure",
        description: "Solve equations and graph functions through interactive challenges and games.",
        imageUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        grade: 8,
        categoryId: categoryMap["algebra"],
        difficulty: "Challenging",
        slug: "algebra-adventure",
        isFeatured: true
      },
      {
        title: "Decimal Detectives",
        description: "Understand decimal place value and operations through engaging activities.",
        imageUrl: "https://images.unsplash.com/photo-1594392175511-30eca83d51c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        grade: 6,
        categoryId: categoryMap["arithmetic"],
        difficulty: "Easy",
        slug: "decimal-detectives",
        isFeatured: false
      },
      {
        title: "Statistics Simplified",
        description: "Learn to collect, analyze, and interpret data through fun experiments.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        grade: 7,
        categoryId: categoryMap["statistics"],
        difficulty: "Medium",
        slug: "statistics-simplified",
        isFeatured: false
      }
    ];

    for (const module of modules) {
      const existing = await db.query.modules.findFirst({
        where: eq(schema.modules.slug, module.slug)
      });

      if (!existing) {
        await db.insert(schema.modules).values(module);
        console.log(`Added module ${module.title}`);
      }
    }

    // Get modules for reference
    const allModules = await db.query.modules.findMany();
    const moduleMap = allModules.reduce((acc, mod) => {
      acc[mod.slug] = mod.id;
      return acc;
    }, {} as Record<string, number>);

    // Insert activities for Fractions Made Fun module
    console.log("Seeding activities...");
    const fractionActivities = [
      {
        moduleId: moduleMap["fractions-made-fun"],
        title: "Understanding Fractions",
        description: "Learn the basics of what fractions are and how they represent parts of a whole.",
        type: "lesson",
        content: {},
        duration: 10,
        order: 1
      },
      {
        moduleId: moduleMap["fractions-made-fun"],
        title: "Equivalent Fractions",
        description: "Discover how different fractions can represent the same value.",
        type: "lesson",
        content: {},
        duration: 15,
        order: 2
      },
      {
        moduleId: moduleMap["fractions-made-fun"],
        title: "Adding Fractions",
        description: "Practice adding fractions with the same denominator.",
        type: "exercise",
        content: {},
        duration: 12,
        order: 3
      },
      {
        moduleId: moduleMap["fractions-made-fun"],
        title: "Fraction Match Game",
        description: "Match equivalent fractions in this fun memory game.",
        type: "game",
        content: {},
        duration: 8,
        order: 4
      },
      {
        moduleId: moduleMap["fractions-made-fun"],
        title: "Fractions Quiz",
        description: "Test your knowledge of fractions with this quiz.",
        type: "quiz",
        content: {},
        duration: 15,
        order: 5
      }
    ];

    // Check if activities already exist for the module
    const existingActivities = await db.query.activities.findMany({
      where: eq(schema.activities.moduleId, moduleMap["fractions-made-fun"])
    });

    if (existingActivities.length === 0) {
      for (const activity of fractionActivities) {
        await db.insert(schema.activities).values(activity);
        console.log(`Added activity ${activity.title}`);
      }
    }

    // Get the quiz activity for reference
    const quizActivity = await db.query.activities.findFirst({
      where: eq(schema.activities.title, "Fractions Quiz")
    });

    // Insert questions for the quiz
    if (quizActivity) {
      console.log("Seeding questions...");
      const questions = [
        {
          activityId: quizActivity.id,
          question: "Which of these fractions is equivalent to 1/2?",
          options: [
            { id: "a", text: "2/4" },
            { id: "b", text: "1/4" },
            { id: "c", text: "3/4" },
            { id: "d", text: "1/3" }
          ],
          correctOption: "a",
          explanation: "1/2 = 2/4 because if you multiply both the numerator and denominator of 1/2 by 2, you get 2/4.",
          order: 1
        },
        {
          activityId: quizActivity.id,
          question: "What is 1/3 + 1/3?",
          options: [
            { id: "a", text: "1/3" },
            { id: "b", text: "2/3" },
            { id: "c", text: "1/6" },
            { id: "d", text: "3/3" }
          ],
          correctOption: "b",
          explanation: "When adding fractions with the same denominator, you add the numerators and keep the denominator the same. So 1/3 + 1/3 = 2/3.",
          order: 2
        },
        {
          activityId: quizActivity.id,
          question: "Which fraction is greater: 3/4 or 2/3?",
          options: [
            { id: "a", text: "3/4" },
            { id: "b", text: "2/3" },
            { id: "c", text: "They are equal" },
            { id: "d", text: "It depends" }
          ],
          correctOption: "a",
          explanation: "To compare fractions with different denominators, you can convert them to a common denominator. 3/4 = 9/12 and 2/3 = 8/12, so 3/4 is greater.",
          order: 3
        }
      ];

      // Check if questions already exist for the activity
      const existingQuestions = await db.query.questions.findMany({
        where: eq(schema.questions.activityId, quizActivity.id)
      });

      if (existingQuestions.length === 0) {
        for (const question of questions) {
          await db.insert(schema.questions).values(question);
          console.log(`Added question: ${question.question}`);
        }
      }
    }

    // Insert games
    console.log("Seeding games...");
    const games = [
      {
        title: "Fraction Match",
        description: "Match equivalent fractions against the clock!",
        imageUrl: "https://pixabay.com/get/gdea1083e9c6d43c11bbdad55698f45c3126a9403f28c1b1d0d274eef379b82f54a837e01b8635ab84ded5c3704eb61e595b20b9c83bc87178c2be02e259b5575_1280.jpg",
        grade: "6",
        categoryId: categoryMap["fractions"],
        difficulty: "easy",
        slug: "fraction-match",
        isPopular: true,
        isNew: false
      },
      {
        title: "Number Ninja",
        description: "Solve calculations quickly to level up your skills!",
        imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        grade: "7",
        categoryId: categoryMap["arithmetic"],
        difficulty: "medium",
        slug: "number-ninja",
        isPopular: false,
        isNew: false
      },
      {
        title: "Geometry Quest",
        description: "Navigate through geometric challenges to win!",
        imageUrl: "https://pixabay.com/get/g7173baa7cf464028491a1dc6b147f0cc1968c67cce622fb070da572f91daf9729fdc6074c47ad817641c1722a34fa616bf552033e2af056b30ac37a499564f0d_1280.jpg",
        grade: "8",
        categoryId: categoryMap["geometry"],
        difficulty: "hard",
        slug: "geometry-quest",
        isPopular: false,
        isNew: false
      },
      {
        title: "Algebra Explorer",
        description: "Solve equations in this fun adventure game!",
        imageUrl: "https://images.unsplash.com/photo-1635241161466-541f065683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        grade: "all",
        categoryId: categoryMap["algebra"],
        difficulty: "medium",
        slug: "algebra-explorer",
        isPopular: false,
        isNew: true
      }
    ];

    for (const game of games) {
      const existing = await db.query.games.findFirst({
        where: eq(schema.games.slug, game.slug)
      });

      if (!existing) {
        await db.insert(schema.games).values(game);
        console.log(`Added game ${game.title}`);
      }
    }

    // Insert testimonials
    console.log("Seeding testimonials...");
    const testimonials = [
      {
        content: "I used to hate math class, but now I actually look forward to it! The games make learning so much more fun than just doing worksheets.",
        name: "Aiden",
        age: 12,
        grade: 6,
        stars: 5,
        isActive: true
      },
      {
        content: "The visual examples really helped me understand fractions. Now I can see how they work instead of just trying to memorize rules.",
        name: "Sophia",
        age: 13,
        grade: 7,
        stars: 5,
        isActive: true
      },
      {
        content: "I was struggling with algebra until I found this website. The step-by-step explanations and practice problems helped me boost my grade from a C to an A-!",
        name: "Ethan",
        age: 14,
        grade: 8,
        stars: 4,
        isActive: true
      }
    ];

    // Check if testimonials already exist
    const existingTestimonials = await db.query.testimonials.findMany();

    if (existingTestimonials.length === 0) {
      for (const testimonial of testimonials) {
        await db.insert(schema.testimonials).values(testimonial);
        console.log(`Added testimonial from ${testimonial.name}`);
      }
    }

    // Insert achievements
    console.log("Seeding achievements...");
    const achievements = [
      {
        title: "First Steps",
        description: "Complete your first lesson",
        icon: "star",
        condition: { type: "activity_completion", count: 1 }
      },
      {
        title: "Math Wizard",
        description: "Complete 10 exercises with 100% score",
        icon: "trophy",
        condition: { type: "perfect_exercises", count: 10 }
      },
      {
        title: "Geometry Master",
        description: "Complete all geometry modules",
        icon: "shapes",
        condition: { type: "category_completion", category: "geometry" }
      },
      {
        title: "Persistent Learner",
        description: "Maintain a 7-day streak",
        icon: "calendar",
        condition: { type: "streak", days: 7 }
      }
    ];

    // Check if achievements already exist
    const existingAchievements = await db.query.achievements.findMany();

    if (existingAchievements.length === 0) {
      for (const achievement of achievements) {
        await db.insert(schema.achievements).values(achievement);
        console.log(`Added achievement: ${achievement.title}`);
      }
    }

    // Insert a demo user
    console.log("Seeding demo user...");
    const demoUser = {
      username: "demo_student",
      password: "password123", // In a real app, this would be properly hashed
      displayName: "Demo Student",
      email: "student@mathjoy.edu",
      grade: 6
    };

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, demoUser.username)
    });

    if (!existingUser) {
      await db.insert(schema.users).values(demoUser);
      console.log(`Added demo user: ${demoUser.username}`);
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
