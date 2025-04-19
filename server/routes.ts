import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertEventSchema, 
  insertHealthMetricSchema, 
  insertTransactionSchema, 
  insertRecommendationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication placeholder - in a real app this would be more robust
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // In a real app, you would use sessions or JWT
    res.json({ id: user.id, username: user.username, displayName: user.displayName });
  });
  
  // User endpoint to get user by ID
  app.get("/api/users/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Dashboard endpoints
  app.get("/api/dashboard/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const stats = await storage.getDashboardStats(userId);
    res.json(stats);
  });

  // Events endpoints
  app.get("/api/events/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const events = await storage.getEvents(userId);
    res.json(events);
  });
  
  app.get("/api/events/:userId/today", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const events = await storage.getTodayEvents(userId);
    res.json(events);
  });
  
  app.get("/api/events/:userId/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }
    
    try {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      const events = await storage.getEventsByDateRange(userId, startDate, endDate);
      res.json(events);
    } catch (error) {
      res.status(400).json({ message: "Invalid date format" });
    }
  });
  
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });
  
  app.put("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    
    try {
      const updatedEvent = await storage.updateEvent(id, req.body);
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });
  
  app.delete("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    
    const success = await storage.deleteEvent(id);
    if (!success) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(204).end();
  });

  // Health metrics endpoints
  app.get("/api/health/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const metrics = await storage.getHealthMetrics(userId);
    res.json(metrics);
  });
  
  app.get("/api/health/:userId/today", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const metric = await storage.getTodayHealthMetric(userId);
    if (!metric) {
      return res.status(404).json({ message: "No health metric found for today" });
    }
    res.json(metric);
  });
  
  app.get("/api/health/:userId/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }
    
    try {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      const metrics = await storage.getHealthMetricsByDateRange(userId, startDate, endDate);
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create health metric" });
    }
  });
  
  app.put("/api/health/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid health metric ID" });
    }
    
    try {
      const updatedMetric = await storage.updateHealthMetric(id, req.body);
      if (!updatedMetric) {
        return res.status(404).json({ message: "Health metric not found" });
      }
      res.json(updatedMetric);
    } catch (error) {
      res.status(500).json({ message: "Failed to update health metric" });
    }
  });

  // Finance endpoints
  app.get("/api/transactions/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  });
  
  app.get("/api/transactions/:userId/range", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }
    
    try {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      const transactions = await storage.getTransactionsByDateRange(userId, startDate, endDate);
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ message: "Invalid date format" });
    }
  });
  
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });
  
  app.put("/api/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }
    
    try {
      const updatedTransaction = await storage.updateTransaction(id, req.body);
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });
  
  app.delete("/api/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }
    
    const success = await storage.deleteTransaction(id);
    if (!success) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(204).end();
  });

  // Recommendations endpoints
  app.get("/api/recommendations/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const recommendations = await storage.getRecommendations(userId);
    res.json(recommendations);
  });
  
  app.get("/api/recommendations/:userId/type/:type", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const type = req.params.type;
    const recommendations = await storage.getRecommendationsByType(userId, type);
    res.json(recommendations);
  });
  
  app.get("/api/recommendations/:userId/new", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const recommendations = await storage.getNewRecommendations(userId);
    res.json(recommendations);
  });
  
  app.post("/api/recommendations/view/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid recommendation ID" });
    }
    
    const success = await storage.markRecommendationViewed(id);
    if (!success) {
      return res.status(404).json({ message: "Recommendation not found" });
    }
    res.status(204).end();
  });
  
  app.post("/api/recommendations", async (req, res) => {
    try {
      const recommendationData = insertRecommendationSchema.parse(req.body);
      const recommendation = await storage.createRecommendation(recommendationData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
