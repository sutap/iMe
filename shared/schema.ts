import { pgTable, text, serial, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  profilePicture: text("profile_picture"),
  darkMode: boolean("dark_mode").default(false),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  isPremium: boolean("is_premium").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  profilePicture: true,
  darkMode: true,
  notificationsEnabled: true,
  isPremium: true,
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  type: text("type").notNull(),
  isCompleted: boolean("is_completed").default(false),
  reminder: integer("reminder").default(0), // minutes before event
});

export const insertEventSchema = createInsertSchema(events).pick({
  userId: true,
  title: true,
  description: true,
  startTime: true,
  endTime: true,
  location: true,
  type: true,
  isCompleted: true,
  reminder: true,
});

// Health tracking schema
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  steps: integer("steps").default(0),
  waterIntake: integer("water_intake").default(0),
  sleepHours: real("sleep_hours").default(0),
  calories: integer("calories").default(0),
  notes: text("notes"),
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).pick({
  userId: true,
  date: true,
  steps: true,
  waterIntake: true,
  sleepHours: true,
  calories: true,
  notes: true,
});

// Goals schema
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  stepsGoal: integer("steps_goal").default(10000),
  waterGoal: integer("water_goal").default(8),
  sleepGoal: real("sleep_goal").default(8),
  caloriesGoal: integer("calories_goal").default(2000),
  savingsGoal: real("savings_goal").default(500),
  monthlyBudget: real("monthly_budget").default(1500),
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  stepsGoal: true,
  waterGoal: true,
  sleepGoal: true,
  caloriesGoal: true,
  savingsGoal: true,
  monthlyBudget: true,
});

// Finance schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull(),
  isIncome: boolean("is_income").default(false),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  amount: true,
  description: true,
  date: true,
  category: true,
  isIncome: true,
});

// Budget categories schema
export const budgetCategories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  limit: real("limit").notNull(),
  color: text("color").default("#7d9b6f"),
  icon: text("icon").default("tag"),
});

export const insertBudgetCategorySchema = createInsertSchema(budgetCategories).pick({
  userId: true,
  name: true,
  limit: true,
  color: true,
  icon: true,
});

// Discovery/Recommendations schema
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url"),
  actionLabel: text("action_label"),
  actionUrl: text("action_url"),
  isNew: boolean("is_new").default(true),
  createdAt: timestamp("created_at").notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  userId: true,
  title: true,
  description: true,
  type: true,
  imageUrl: true,
  actionLabel: true,
  actionUrl: true,
  isNew: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type DashboardStats = {
  todayEventsCount: number;
  nextEvent: Event | null;
  stepsToday: number;
  stepsGoal: number;
  waterIntake: number;
  waterGoal: number;
  sleepHours: number;
  sleepGoal: number;
  expenseThisMonth: number;
  budgetThisMonth: number;
  recommendationsCount: number;
};

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  events: many(events),
  healthMetrics: many(healthMetrics),
  transactions: many(transactions),
  recommendations: many(recommendations),
  goal: one(goals, { fields: [users.id], references: [goals.userId] }),
  budgetCategories: many(budgetCategories),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
}));

export const healthMetricsRelations = relations(healthMetrics, ({ one }) => ({
  user: one(users, { fields: [healthMetrics.userId], references: [users.id] }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
}));

export const budgetCategoriesRelations = relations(budgetCategories, ({ one }) => ({
  user: one(users, { fields: [budgetCategories.userId], references: [users.id] }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  user: one(users, { fields: [recommendations.userId], references: [users.id] }),
}));
