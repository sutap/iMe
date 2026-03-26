import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertEventSchema, 
  insertHealthMetricSchema, 
  insertTransactionSchema, 
  insertRecommendationSchema,
  insertGoalSchema,
  insertBudgetCategorySchema,
} from "@shared/schema";
import { setupAuth } from "./auth";
import fs from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  
  // User endpoints
  app.get("/api/users/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.put("/api/users/:userId/profile", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    try {
      const updatedUser = await storage.updateUserProfile(userId, req.body);
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Dashboard
  app.get("/api/dashboard/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const stats = await storage.getDashboardStats(userId);
    res.json(stats);
  });

  // Events
  app.get("/api/events/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const events = await storage.getEvents(userId);
    res.json(events);
  });
  
  app.get("/api/events/:userId/today", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const events = await storage.getTodayEvents(userId);
    res.json(events);
  });
  
  app.get("/api/events/:userId/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ message: "Start and end dates are required" });
    try {
      const events = await storage.getEventsByDateRange(userId, new Date(start as string), new Date(end as string));
      res.json(events);
    } catch (error) {
      res.status(400).json({ message: "Invalid date format" });
    }
  });

  app.get("/api/events/:userId/search", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { q } = req.query;
    if (!q) return res.json([]);
    const events = await storage.searchEvents(userId, q as string);
    res.json(events);
  });
  
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create event" });
    }
  });
  
  app.put("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid event ID" });
    try {
      const updatedEvent = await storage.updateEvent(id, req.body);
      if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });
  
  app.delete("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid event ID" });
    const success = await storage.deleteEvent(id);
    if (!success) return res.status(404).json({ message: "Event not found" });
    res.status(204).end();
  });

  // Health metrics
  app.get("/api/health/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const metrics = await storage.getHealthMetrics(userId);
    res.json(metrics);
  });
  
  app.get("/api/health/:userId/today", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const metric = await storage.getTodayHealthMetric(userId);
    if (!metric) return res.status(404).json({ message: "No health metric found for today" });
    res.json(metric);
  });
  
  app.get("/api/health/:userId/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ message: "Start and end dates are required" });
    try {
      const metrics = await storage.getHealthMetricsByDateRange(userId, new Date(start as string), new Date(end as string));
      res.json(metrics);
    } catch (error) {
      res.status(400).json({ message: "Invalid date format" });
    }
  });
  
  app.post("/api/health", async (req, res) => {
    try {
      const metricData = insertHealthMetricSchema.parse(req.body);
      const metric = await storage.createHealthMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create health metric" });
    }
  });
  
  app.put("/api/health/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid health metric ID" });
    try {
      const updatedMetric = await storage.updateHealthMetric(id, req.body);
      if (!updatedMetric) return res.status(404).json({ message: "Health metric not found" });
      res.json(updatedMetric);
    } catch (error) {
      res.status(500).json({ message: "Failed to update health metric" });
    }
  });

  // Goals
  app.get("/api/goals/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const goal = await storage.getGoals(userId);
    if (!goal) return res.status(404).json({ message: "Goals not found" });
    res.json(goal);
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoals(goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create goals" });
    }
  });

  app.put("/api/goals/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    try {
      const updatedGoal = await storage.updateGoals(userId, req.body);
      if (!updatedGoal) return res.status(404).json({ message: "Goals not found" });
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update goals" });
    }
  });

  // Transactions
  app.get("/api/transactions/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  });
  
  app.get("/api/transactions/:userId/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ message: "Start and end dates are required" });
    try {
      const transactions = await storage.getTransactionsByDateRange(userId, new Date(start as string), new Date(end as string));
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ message: "Invalid date format" });
    }
  });

  app.get("/api/transactions/:userId/search", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { q } = req.query;
    if (!q) return res.json([]);
    const transactions = await storage.searchTransactions(userId, q as string);
    res.json(transactions);
  });
  
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });
  
  app.put("/api/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });
    try {
      const updatedTransaction = await storage.updateTransaction(id, req.body);
      if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });
  
  app.delete("/api/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });
    const success = await storage.deleteTransaction(id);
    if (!success) return res.status(404).json({ message: "Transaction not found" });
    res.status(204).end();
  });

  // Budget Categories
  app.get("/api/budget-categories/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const categories = await storage.getBudgetCategories(userId);
    res.json(categories);
  });

  app.post("/api/budget-categories", async (req, res) => {
    try {
      const categoryData = insertBudgetCategorySchema.parse(req.body);
      const category = await storage.createBudgetCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create budget category" });
    }
  });

  app.put("/api/budget-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });
    try {
      const updated = await storage.updateBudgetCategory(id, req.body);
      if (!updated) return res.status(404).json({ message: "Category not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/budget-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });
    const success = await storage.deleteBudgetCategory(id);
    if (!success) return res.status(404).json({ message: "Category not found" });
    res.status(204).end();
  });

  // Recommendations
  app.get("/api/recommendations/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const recommendations = await storage.getRecommendations(userId);
    res.json(recommendations);
  });
  
  app.get("/api/recommendations/:userId/type/:type", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const recommendations = await storage.getRecommendationsByType(userId, req.params.type);
    res.json(recommendations);
  });
  
  app.get("/api/recommendations/:userId/new", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const recommendations = await storage.getNewRecommendations(userId);
    res.json(recommendations);
  });

  app.get("/api/recommendations/:userId/search", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { q } = req.query;
    if (!q) return res.json([]);
    const recommendations = await storage.searchRecommendations(userId, q as string);
    res.json(recommendations);
  });
  
  app.post("/api/recommendations/view/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid recommendation ID" });
    const success = await storage.markRecommendationViewed(id);
    if (!success) return res.status(404).json({ message: "Recommendation not found" });
    res.status(204).end();
  });
  
  app.post("/api/recommendations", async (req, res) => {
    try {
      const recommendationData = insertRecommendationSchema.parse(req.body);
      const recommendation = await storage.createRecommendation(recommendationData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  // Global search
  app.get("/api/search/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const { q } = req.query;
    if (!q || (q as string).length < 2) return res.json({ events: [], transactions: [], recommendations: [] });
    const [events, transactions, recommendations] = await Promise.all([
      storage.searchEvents(userId, q as string),
      storage.searchTransactions(userId, q as string),
      storage.searchRecommendations(userId, q as string),
    ]);
    res.json({ events, transactions, recommendations });
  });

  // Theme
  app.post("/api/theme", async (req, res) => {
    try {
      const themeSchema = z.object({
        variant: z.enum(['professional', 'tint', 'vibrant']),
        primary: z.string(),
        appearance: z.enum(['light', 'dark', 'system']),
        radius: z.number().min(0).max(2)
      });
      const themeData = themeSchema.parse(req.body);
      const themePath = path.resolve('./theme.json');
      fs.writeFileSync(themePath, JSON.stringify(themeData, null, 2));
      res.status(200).json({ message: "Theme updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to update theme" });
    }
  });
  
  app.get("/api/theme", async (req, res) => {
    try {
      const themePath = path.resolve('./theme.json');
      if (!fs.existsSync(themePath)) return res.status(404).json({ message: "Theme file not found" });
      const themeContent = fs.readFileSync(themePath, 'utf8');
      res.status(200).json(JSON.parse(themeContent));
    } catch (error) {
      res.status(500).json({ message: "Failed to read theme file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
