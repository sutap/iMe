import { pgTable, text, serial, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
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
  type: text("type").notNull(), // work, personal, health, etc.
  isCompleted: boolean("is_completed").default(false),
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
});

// Health tracking schema
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  steps: integer("steps").default(0),
  waterIntake: integer("water_intake").default(0), // in glasses
  sleepHours: real("sleep_hours").default(0),
  notes: text("notes"),
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).pick({
  userId: true,
  date: true,
  steps: true,
  waterIntake: true,
  sleepHours: true,
  notes: true,
});

// Finance schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull(), // e.g., groceries, utilities, income
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

// Discovery/Recommendations schema
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // health, finance, schedule, etc.
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

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

// Dashboard stats types
export type DashboardStats = {
  todayEventsCount: number,
  nextEvent: Event | null,
  stepsToday: number,
  stepsGoal: number,
  waterIntake: number,
  waterGoal: number,
  sleepHours: number,
  sleepGoal: number,
  expenseThisMonth: number,
  budgetThisMonth: number,
  recommendationsCount: number
};
