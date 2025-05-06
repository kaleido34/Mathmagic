import { db } from "@db";
import {
  users,
  grades,
  categories,
  modules,
  activities,
  questions,
  games,
  userProgress,
  activityCompletions,
  testimonials,
  achievements,
  userAchievements,
  type InsertUser,
  type InsertGrade,
  type InsertCategory,
  type InsertModule,
  type InsertActivity,
  type InsertQuestion,
  type InsertGame,
  type InsertUserProgress,
  type InsertActivityCompletion,
  type InsertTestimonial,
  type InsertAchievement,
  type InsertUserAchievement,
} from "@shared/schema";
import { eq, and, like, desc, or, asc, isNull, gt, lt, not, between } from "drizzle-orm";

export const storage = {
  // Users
  async getUsers() {
    return await db.query.users.findMany({
      orderBy: asc(users.username)
    });
  },

  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },

  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },

  async insertUser(userData: InsertUser) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  async updateUser(id: number, userData: Partial<InsertUser>) {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  },

  // Grades
  async getGrades() {
    return await db.query.grades.findMany({
      orderBy: asc(grades.grade)
    });
  },

  async getGradeById(id: number) {
    return await db.query.grades.findFirst({
      where: eq(grades.id, id)
    });
  },

  async getGradeByGradeNumber(gradeNumber: number) {
    return await db.query.grades.findFirst({
      where: eq(grades.grade, gradeNumber)
    });
  },

  async insertGrade(gradeData: InsertGrade) {
    const [grade] = await db.insert(grades).values(gradeData).returning();
    return grade;
  },

  // Categories
  async getCategories() {
    return await db.query.categories.findMany({
      orderBy: asc(categories.name)
    });
  },

  async getCategoryById(id: number) {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id)
    });
  },

  async getCategoryBySlug(slug: string) {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug)
    });
  },

  async insertCategory(categoryData: InsertCategory) {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  },

  // Modules
  async getModules(filters?: { 
    grade?: number;
    category?: string;
    difficulty?: string;
    featured?: boolean;
  }) {
    let query = db.select().from(modules);
    
    if (filters?.grade) {
      query = query.where(eq(modules.grade, filters.grade));
    }
    
    if (filters?.category) {
      const category = await this.getCategoryBySlug(filters.category);
      if (category) {
        query = query.where(eq(modules.categoryId, category.id));
      }
    }
    
    if (filters?.difficulty) {
      query = query.where(eq(modules.difficulty, filters.difficulty));
    }
    
    if (filters?.featured !== undefined) {
      query = query.where(eq(modules.isFeatured, filters.featured));
    }
    
    return await query.orderBy(desc(modules.createdAt));
  },

  async getModuleById(id: number) {
    return await db.query.modules.findFirst({
      where: eq(modules.id, id),
      with: {
        category: true
      }
    });
  },

  async getModuleBySlug(slug: string) {
    return await db.query.modules.findFirst({
      where: eq(modules.slug, slug),
      with: {
        category: true
      }
    });
  },

  async getFeaturedModules() {
    return await db.query.modules.findMany({
      where: eq(modules.isFeatured, true),
      orderBy: desc(modules.createdAt),
      limit: 3
    });
  },

  async insertModule(moduleData: InsertModule) {
    const [module] = await db.insert(modules).values(moduleData).returning();
    return module;
  },

  // Activities
  async getActivitiesByModuleId(moduleId: number) {
    return await db.query.activities.findMany({
      where: eq(activities.moduleId, moduleId),
      orderBy: asc(activities.order)
    });
  },

  async getActivityById(id: number) {
    return await db.query.activities.findFirst({
      where: eq(activities.id, id),
      with: {
        module: true
      }
    });
  },

  async insertActivity(activityData: InsertActivity) {
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  },

  // Questions
  async getQuestionsByActivityId(activityId: number) {
    return await db.query.questions.findMany({
      where: eq(questions.activityId, activityId),
      orderBy: asc(questions.order)
    });
  },

  async getQuestionById(id: number) {
    return await db.query.questions.findFirst({
      where: eq(questions.id, id)
    });
  },

  async insertQuestion(questionData: InsertQuestion) {
    const [question] = await db.insert(questions).values(questionData).returning();
    return question;
  },

  // Games
  async getGames(filters?: {
    grade?: string | number;
    category?: string;
    difficulty?: string;
  }) {
    let query = db.select().from(games);
    
    if (filters?.grade && filters.grade !== 'all') {
      query = query.where(or(
        eq(games.grade, String(filters.grade)),
        eq(games.grade, 'all')
      ));
    }
    
    if (filters?.category && filters.category !== 'all') {
      const category = await this.getCategoryBySlug(filters.category);
      if (category) {
        query = query.where(eq(games.categoryId, category.id));
      }
    }
    
    if (filters?.difficulty) {
      query = query.where(eq(games.difficulty, filters.difficulty));
    }
    
    return await query.orderBy(desc(games.createdAt));
  },

  async getGameById(id: number) {
    return await db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        category: true
      }
    });
  },

  async getGameBySlug(slug: string) {
    return await db.query.games.findFirst({
      where: eq(games.slug, slug),
      with: {
        category: true
      }
    });
  },

  async getPopularGames(limit = 4) {
    return await db.query.games.findMany({
      where: eq(games.isPopular, true),
      orderBy: desc(games.createdAt),
      limit
    });
  },

  async insertGame(gameData: InsertGame) {
    const [game] = await db.insert(games).values(gameData).returning();
    return game;
  },

  // User Progress
  async getUserProgress(userId: number) {
    return await db.query.userProgress.findMany({
      where: eq(userProgress.userId, userId),
      with: {
        module: true,
        lastActivity: true
      }
    });
  },

  async getUserProgressByModule(userId: number, moduleId: number) {
    return await db.query.userProgress.findFirst({
      where: and(
        eq(userProgress.userId, userId),
        eq(userProgress.moduleId, moduleId)
      ),
      with: {
        lastActivity: true
      }
    });
  },

  async insertUserProgress(progressData: InsertUserProgress) {
    const [progress] = await db.insert(userProgress).values(progressData).returning();
    return progress;
  },

  async updateUserProgress(id: number, progressData: Partial<InsertUserProgress>) {
    const [updatedProgress] = await db
      .update(userProgress)
      .set({
        ...progressData,
        updatedAt: new Date()
      })
      .where(eq(userProgress.id, id))
      .returning();
    return updatedProgress;
  },

  // Activity Completions
  async getActivityCompletions(userId: number) {
    return await db.query.activityCompletions.findMany({
      where: eq(activityCompletions.userId, userId),
      with: {
        activity: {
          with: {
            module: true
          }
        }
      },
      orderBy: desc(activityCompletions.completedAt)
    });
  },

  async getActivityCompletion(userId: number, activityId: number) {
    return await db.query.activityCompletions.findFirst({
      where: and(
        eq(activityCompletions.userId, userId),
        eq(activityCompletions.activityId, activityId)
      )
    });
  },

  async insertActivityCompletion(completionData: InsertActivityCompletion) {
    const [completion] = await db.insert(activityCompletions).values(completionData).returning();
    return completion;
  },

  // Testimonials
  async getTestimonials() {
    return await db.query.testimonials.findMany({
      where: eq(testimonials.isActive, true),
      orderBy: desc(testimonials.createdAt)
    });
  },

  async getTestimonialById(id: number) {
    return await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id)
    });
  },

  async insertTestimonial(testimonialData: InsertTestimonial) {
    const [testimonial] = await db.insert(testimonials).values(testimonialData).returning();
    return testimonial;
  },

  // Achievements
  async getAchievements() {
    return await db.query.achievements.findMany();
  },

  async getAchievementById(id: number) {
    return await db.query.achievements.findFirst({
      where: eq(achievements.id, id)
    });
  },

  async insertAchievement(achievementData: InsertAchievement) {
    const [achievement] = await db.insert(achievements).values(achievementData).returning();
    return achievement;
  },

  // User Achievements
  async getUserAchievements(userId: number) {
    return await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId),
      with: {
        achievement: true
      },
      orderBy: desc(userAchievements.earnedAt)
    });
  },

  async getUserAchievement(userId: number, achievementId: number) {
    return await db.query.userAchievements.findFirst({
      where: and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      )
    });
  },

  async insertUserAchievement(achievementData: InsertUserAchievement) {
    const [userAchievement] = await db.insert(userAchievements).values(achievementData).returning();
    return userAchievement;
  },

  // User Learning Stats
  async getUserLearningStats(userId: number) {
    // Get total progress across all modules
    const moduleProgress = await db.query.userProgress.findMany({
      where: eq(userProgress.userId, userId)
    });
    
    // Calculate overall progress
    const totalModules = await db.query.modules.findMany();
    const completedModules = moduleProgress.filter(p => p.completed).length;
    
    const completions = await db.query.activityCompletions.findMany({
      where: eq(activityCompletions.userId, userId)
    });
    
    // Calculate streak (assuming one activity per day for simplicity)
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const hasActivity = completions.some(c => {
        const completedDate = new Date(c.completedAt);
        return completedDate >= date && completedDate < nextDay;
      });
      
      if (hasActivity && i === 0) {
        // Count today
        streak++;
      } else if (hasActivity && streak > 0) {
        // Continue streak for previous days
        streak++;
      } else if (i > 0 && !hasActivity) {
        // Break the streak
        break;
      }
    }
    
    return {
      overall: Math.round((completedModules / totalModules.length) * 100) || 0,
      streak,
      totalPoints: completions.reduce((sum, c) => sum + (c.score || 0), 0),
      activitiesCompleted: completions.length,
      // Assuming average of 30 minutes per activity
      timeSpent: Math.round((completions.length * 30) / 60 * 10) / 10,
    };
  },
  
  // Grade Progress
  async getGradeProgress(userId: number) {
    const gradeProgress = [];
    
    for (let gradeLevel = 6; gradeLevel <= 8; gradeLevel++) {
      // Get modules for this grade
      const gradeModules = await db.query.modules.findMany({
        where: eq(modules.grade, gradeLevel)
      });
      
      if (gradeModules.length === 0) continue;
      
      // Get user progress for these modules
      const moduleIds = gradeModules.map(m => m.id);
      const progress = await db.query.userProgress.findMany({
        where: and(
          eq(userProgress.userId, userId),
          moduleIds.length > 0 ? modules.id in moduleIds : undefined
        )
      });
      
      // Calculate average progress for this grade
      const gradeProgressValue = progress.length > 0
        ? Math.round(progress.reduce((sum, p) => sum + p.progress, 0) / progress.length)
        : 0;
      
      gradeProgress.push({
        grade: gradeLevel,
        progress: gradeProgressValue
      });
    }
    
    return gradeProgress;
  },
  
  // Category Progress
  async getCategoryProgress(userId: number) {
    const allCategories = await db.query.categories.findMany();
    const categoryProgress = [];
    
    for (const category of allCategories) {
      // Get modules for this category
      const categoryModules = await db.query.modules.findMany({
        where: eq(modules.categoryId, category.id)
      });
      
      if (categoryModules.length === 0) continue;
      
      // Get user progress for these modules
      const moduleIds = categoryModules.map(m => m.id);
      const progress = await db.query.userProgress.findMany({
        where: and(
          eq(userProgress.userId, userId),
          moduleIds.length > 0 ? modules.id in moduleIds : undefined
        )
      });
      
      // Calculate average progress for this category
      const categoryProgressValue = progress.length > 0
        ? Math.round(progress.reduce((sum, p) => sum + p.progress, 0) / progress.length)
        : 0;
      
      categoryProgress.push({
        name: category.name,
        progress: categoryProgressValue,
        value: categoryProgressValue
      });
    }
    
    return categoryProgress;
  },
  
  // Weekly Activity
  async getWeeklyActivity(userId: number) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];
    
    // Get today's weekday index (0 = Sunday, 1 = Monday, etc.)
    const today = new Date();
    const currentDay = today.getDay();
    
    // Start from Monday of current week
    for (let i = 0; i < 7; i++) {
      // Calculate date for this day of the week
      const date = new Date(today);
      const dayDiff = i - ((currentDay + 6) % 7); // Convert to Monday-based index
      date.setDate(date.getDate() + dayDiff);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Count completed activities on this day
      const completions = await db.query.activityCompletions.findMany({
        where: and(
          eq(activityCompletions.userId, userId),
          between(
            activityCompletions.completedAt,
            date,
            nextDay
          )
        )
      });
      
      result.push({
        name: days[i],
        completed: completions.length
      });
    }
    
    return result;
  },
  
  // Recent Activities
  async getRecentActivities(userId: number, limit = 5) {
    const completions = await db.query.activityCompletions.findMany({
      where: eq(activityCompletions.userId, userId),
      with: {
        activity: {
          with: {
            module: true
          }
        }
      },
      orderBy: desc(activityCompletions.completedAt),
      limit
    });
    
    return completions.map(completion => ({
      id: completion.id,
      title: completion.activity.title,
      type: completion.activity.type,
      score: completion.score || 0,
      date: completion.completedAt.toISOString(),
      moduleTitle: completion.activity.module.title
    }));
  }
};
