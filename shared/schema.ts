import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  grade: integer("grade"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  grade: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Grades table
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  grade: integer("grade").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

export const insertGradeSchema = createInsertSchema(grades);
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Modules table
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  grade: integer("grade").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  difficulty: text("difficulty").notNull(),
  slug: text("slug").notNull().unique(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertModuleSchema = createInsertSchema(modules);
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Relations for modules
export const modulesRelations = relations(modules, ({ one }) => ({
  category: one(categories, {
    fields: [modules.categoryId],
    references: [categories.id],
  }),
}));

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'lesson', 'exercise', 'game', 'quiz'
  content: json("content"),
  duration: integer("duration").notNull(), // in minutes
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities);
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Relations for activities
export const activitiesRelations = relations(activities, ({ one }) => ({
  module: one(modules, {
    fields: [activities.moduleId],
    references: [modules.id],
  }),
}));

// Questions table for quizzes and exercises
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // [{ id: 'a', text: 'Option A' }, ...]
  correctOption: text("correct_option").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions);
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Relations for questions
export const questionsRelations = relations(questions, ({ one }) => ({
  activity: one(activities, {
    fields: [questions.activityId],
    references: [activities.id],
  }),
}));

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  grade: text("grade").notNull(), // Can be a specific grade (6, 7, 8) or 'all'
  categoryId: integer("category_id").references(() => categories.id),
  difficulty: text("difficulty"),
  slug: text("slug").notNull().unique(),
  isPopular: boolean("is_popular").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSchema = createInsertSchema(games);
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Relations for games
export const gamesRelations = relations(games, ({ one }) => ({
  category: one(categories, {
    fields: [games.categoryId],
    references: [categories.id],
  }),
}));

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  moduleId: integer("module_id").references(() => modules.id).notNull(),
  progress: integer("progress").notNull().default(0),
  lastActivityId: integer("last_activity_id").references(() => activities.id),
  completed: boolean("completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress);
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Relations for user progress
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [userProgress.moduleId],
    references: [modules.id],
  }),
  lastActivity: one(activities, {
    fields: [userProgress.lastActivityId],
    references: [activities.id],
  }),
}));

// Activity Completion table
export const activityCompletions = pgTable("activity_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  score: integer("score"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertActivityCompletionSchema = createInsertSchema(activityCompletions);
export type InsertActivityCompletion = z.infer<typeof insertActivityCompletionSchema>;
export type ActivityCompletion = typeof activityCompletions.$inferSelect;

// Relations for activity completions
export const activityCompletionsRelations = relations(activityCompletions, ({ one }) => ({
  user: one(users, {
    fields: [activityCompletions.userId],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [activityCompletions.activityId],
    references: [activities.id],
  }),
}));

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  grade: integer("grade").notNull(),
  stars: integer("stars").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials);
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  condition: json("condition").notNull(), // { type: 'module_completion', count: 10 }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements);
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// User Achievements table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

// Relations for user achievements
export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));
