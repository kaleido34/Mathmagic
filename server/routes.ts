import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // Grades endpoints
  app.get(`${apiPrefix}/grades`, async (req, res) => {
    try {
      const grades = await storage.getGrades();
      
      // Mock progress data for frontend (in a real app, this would come from the database)
      const gradesWithProgress = grades.map(grade => ({
        ...grade,
        progress: grade.grade === 6 ? 35 : grade.grade === 7 ? 15 : 5
      }));
      
      res.json(gradesWithProgress);
    } catch (error) {
      console.error("Error fetching grades:", error);
      res.status(500).json({ message: "Failed to fetch grades" });
    }
  });

  // Featured modules endpoints
  app.get(`${apiPrefix}/modules/featured`, async (req, res) => {
    try {
      const featuredModules = await storage.getFeaturedModules();
      res.json(featuredModules);
    } catch (error) {
      console.error("Error fetching featured modules:", error);
      res.status(500).json({ message: "Failed to fetch featured modules" });
    }
  });

  // All modules with optional filters
  app.get(`${apiPrefix}/modules`, async (req, res) => {
    try {
      const { grade, category, difficulty } = req.query;
      
      const filters: any = {};
      if (grade) filters.grade = Number(grade);
      if (category) filters.category = category as string;
      if (difficulty) filters.difficulty = difficulty as string;
      
      const modules = await storage.getModules(filters);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // Single module by slug
  app.get(`${apiPrefix}/modules/:slug`, async (req, res) => {
    try {
      const module = await storage.getModuleBySlug(req.params.slug);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Fetch activities for this module
      const activities = await storage.getActivitiesByModuleId(module.id);
      
      // Return module with activities
      res.json({
        ...module,
        activities,
        progress: 20 // Mocked progress for demo
      });
    } catch (error) {
      console.error("Error fetching module:", error);
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  // Questions for a module
  app.get(`${apiPrefix}/modules/:slug/questions`, async (req, res) => {
    try {
      const module = await storage.getModuleBySlug(req.params.slug);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Fetch quiz activities for this module
      const activities = await storage.getActivitiesByModuleId(module.id);
      const quizActivity = activities.find(a => a.type === "quiz");
      
      if (!quizActivity) {
        return res.json([]);
      }
      
      // Fetch questions for this quiz
      const questions = await storage.getQuestionsByActivityId(quizActivity.id);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching module questions:", error);
      res.status(500).json({ message: "Failed to fetch module questions" });
    }
  });

  // Games endpoints
  app.get(`${apiPrefix}/games`, async (req, res) => {
    try {
      const games = await storage.getPopularGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // All games with optional filters
  app.get(`${apiPrefix}/games/all`, async (req, res) => {
    try {
      const { grade, category, difficulty } = req.query;
      
      const filters: any = {};
      if (grade) filters.grade = grade;
      if (category) filters.category = category as string;
      if (difficulty) filters.difficulty = difficulty as string;
      
      const games = await storage.getGames(filters);
      res.json(games);
    } catch (error) {
      console.error("Error fetching all games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Testimonials endpoint
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // User progress endpoint
  app.get(`${apiPrefix}/user/progress`, async (req, res) => {
    try {
      // In a real app, we would get the user ID from the authenticated session
      const userId = 1; // Mock user ID
      
      // Get basic user stats
      const stats = await storage.getUserLearningStats(userId);
      
      // Get grade progress
      const gradeProgress = await storage.getGradeProgress(userId);
      
      // Get category progress
      const categoryProgress = await storage.getCategoryProgress(userId);
      
      // Get weekly activity
      const weeklyActivity = await storage.getWeeklyActivity(userId);
      
      // Get user achievements
      const userAchievements = await storage.getUserAchievements(userId);
      const achievements = await storage.getAchievements();
      
      const achievementsData = achievements.map(achievement => {
        const earned = userAchievements.find(ua => ua.achievementId === achievement.id);
        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          earnedAt: earned ? earned.earnedAt.toISOString() : null
        };
      });
      
      // Get recent activities
      const recentActivities = await storage.getRecentActivities(userId);
      
      res.json({
        ...stats,
        gradeProgress,
        categoryProgress,
        weeklyActivity,
        achievements: achievementsData,
        recentActivities
      });
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
