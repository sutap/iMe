import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  healthMetrics, type HealthMetric, type InsertHealthMetric,
  transactions, type Transaction, type InsertTransaction,
  recommendations, type Recommendation, type InsertRecommendation,
  type DashboardStats
} from "@shared/schema";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO, isToday } from "date-fns";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(userId: number): Promise<Event[]>;
  getEventsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Event[]>;
  getTodayEvents(userId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Health metric operations
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getHealthMetrics(userId: number): Promise<HealthMetric[]>;
  getHealthMetricsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<HealthMetric[]>;
  getTodayHealthMetric(userId: number): Promise<HealthMetric | undefined>;
  updateHealthMetric(id: number, metric: Partial<HealthMetric>): Promise<HealthMetric | undefined>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;

  // Recommendation operations
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecommendations(userId: number): Promise<Recommendation[]>;
  getRecommendationsByType(userId: number, type: string): Promise<Recommendation[]>;
  getNewRecommendations(userId: number): Promise<Recommendation[]>;
  markRecommendationViewed(id: number): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(userId: number): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private healthMetrics: Map<number, HealthMetric>;
  private transactions: Map<number, Transaction>;
  private recommendations: Map<number, Recommendation>;
  
  private userCurrentId: number;
  private eventCurrentId: number;
  private healthMetricCurrentId: number;
  private transactionCurrentId: number;
  private recommendationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.healthMetrics = new Map();
    this.transactions = new Map();
    this.recommendations = new Map();
    
    this.userCurrentId = 1;
    this.eventCurrentId = 1;
    this.healthMetricCurrentId = 1;
    this.transactionCurrentId = 1;
    this.recommendationCurrentId = 1;

    // Add demo user
    this.createUser({
      username: "demo",
      password: "demo123",
      displayName: "Alex Morgan",
      email: "alex@example.com"
    });

    // Seed with initial data for testing
    this.seedInitialData(1);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Event operations
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async getEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId
    ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getEventsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => 
        event.userId === userId && 
        new Date(event.startTime) >= startDate && 
        new Date(event.startTime) <= endDate
    ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getTodayEvents(userId: number): Promise<Event[]> {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    
    return this.getEventsByDateRange(userId, start, end);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async updateEvent(id: number, eventUpdate: Partial<Event>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Health metric operations
  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricCurrentId++;
    const metric: HealthMetric = { ...insertMetric, id };
    this.healthMetrics.set(id, metric);
    return metric;
  }

  async getHealthMetrics(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => metric.userId === userId
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getHealthMetricsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => 
        metric.userId === userId && 
        new Date(metric.date) >= startDate && 
        new Date(metric.date) <= endDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getTodayHealthMetric(userId: number): Promise<HealthMetric | undefined> {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    
    const metrics = await this.getHealthMetricsByDateRange(userId, start, end);
    return metrics.length > 0 ? metrics[0] : undefined;
  }

  async updateHealthMetric(id: number, metricUpdate: Partial<HealthMetric>): Promise<HealthMetric | undefined> {
    const existingMetric = this.healthMetrics.get(id);
    if (!existingMetric) return undefined;
    
    const updatedMetric = { ...existingMetric, ...metricUpdate };
    this.healthMetrics.set(id, updatedMetric);
    return updatedMetric;
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => 
        transaction.userId === userId && 
        new Date(transaction.date) >= startDate && 
        new Date(transaction.date) <= endDate
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async updateTransaction(id: number, transactionUpdate: Partial<Transaction>): Promise<Transaction | undefined> {
    const existingTransaction = this.transactions.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction = { ...existingTransaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Recommendation operations
  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationCurrentId++;
    const recommendation: Recommendation = { ...insertRecommendation, id };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async getRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (recommendation) => recommendation.userId === userId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecommendationsByType(userId: number, type: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (recommendation) => recommendation.userId === userId && recommendation.type === type
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getNewRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (recommendation) => recommendation.userId === userId && recommendation.isNew
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markRecommendationViewed(id: number): Promise<boolean> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return false;
    
    recommendation.isNew = false;
    this.recommendations.set(id, recommendation);
    return true;
  }

  // Dashboard stats
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    // Get today's events
    const todayEvents = await this.getTodayEvents(userId);
    
    // Get next upcoming event
    const now = new Date();
    const upcomingEvents = todayEvents.filter(event => new Date(event.startTime) > now);
    const nextEvent = upcomingEvents.length > 0 ? 
      upcomingEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] : 
      null;
    
    // Get today's health metrics
    const todayHealthMetric = await this.getTodayHealthMetric(userId);
    
    // Get this month's transactions
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const thisMonthTransactions = await this.getTransactionsByDateRange(userId, startOfCurrentMonth, endOfCurrentMonth);
    
    // Calculate this month's expenses
    const expenses = thisMonthTransactions
      .filter(transaction => !transaction.isIncome)
      .reduce((total, transaction) => total + transaction.amount, 0);
    
    // Get new recommendations count
    const newRecommendations = await this.getNewRecommendations(userId);
    
    return {
      todayEventsCount: todayEvents.length,
      nextEvent,
      stepsToday: todayHealthMetric?.steps || 0,
      stepsGoal: 10000,
      waterIntake: todayHealthMetric?.waterIntake || 0,
      waterGoal: 8,
      sleepHours: todayHealthMetric?.sleepHours || 0,
      sleepGoal: 8,
      expenseThisMonth: expenses,
      budgetThisMonth: 1500,
      recommendationsCount: newRecommendations.length
    };
  }

  // Seed initial data for testing
  private seedInitialData(userId: number) {
    const today = new Date();
    
    // Seed events
    this.createEvent({
      userId,
      title: "Team Standup",
      description: "Virtual Meeting - 30 min",
      startTime: new Date(today.setHours(9, 0, 0, 0)),
      endTime: new Date(today.setHours(9, 30, 0, 0)),
      location: "Virtual Meeting",
      type: "work",
      isCompleted: false
    });
    
    this.createEvent({
      userId,
      title: "Client Presentation",
      description: "Conference Room A - 1 hour",
      startTime: new Date(today.setHours(14, 0, 0, 0)),
      endTime: new Date(today.setHours(15, 0, 0, 0)),
      location: "Conference Room A",
      type: "work",
      isCompleted: false
    });
    
    this.createEvent({
      userId,
      title: "Gym Workout",
      description: "Downtown Fitness - 1 hour",
      startTime: new Date(today.setHours(17, 30, 0, 0)),
      endTime: new Date(today.setHours(18, 30, 0, 0)),
      location: "Downtown Fitness",
      type: "health",
      isCompleted: false
    });

    // Seed health metrics for the past week
    for(let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Only create metrics for past days and today
      if (i > 0 || i === 0) {
        this.createHealthMetric({
          userId,
          date: i === 0 ? new Date() : date,
          steps: i === 0 ? 7842 : Math.floor(Math.random() * 4000) + 6000,
          waterIntake: i === 0 ? 5 : Math.floor(Math.random() * 4) + 4,
          sleepHours: i === 0 ? 6.5 : Math.random() * 2 + 6,
          notes: ""
        });
      }
    }

    // Seed transactions
    this.createTransaction({
      userId,
      amount: 65.40,
      description: "Grocery Store",
      date: new Date(today.setHours(10, 30, 0, 0)),
      category: "groceries",
      isIncome: false
    });
    
    this.createTransaction({
      userId,
      amount: 2450.00,
      description: "Salary Deposit",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      category: "income",
      isIncome: true
    });
    
    this.createTransaction({
      userId,
      amount: 42.50,
      description: "Restaurant",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 19, 30),
      category: "dining",
      isIncome: false
    });

    // Add several more transactions for the monthly chart
    for(let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i - 1);
      
      this.createTransaction({
        userId,
        amount: Math.floor(Math.random() * 80) + 20,
        description: "Daily Expense " + i,
        date,
        category: ["groceries", "dining", "entertainment", "shopping"][Math.floor(Math.random() * 4)],
        isIncome: false
      });
    }

    // Seed recommendations
    this.createRecommendation({
      userId,
      title: "5-Minute Meditation",
      description: "Based on your sleep patterns, a quick meditation could help improve your rest quality.",
      type: "health",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      actionLabel: "Try Now",
      actionUrl: "/health/meditation",
      isNew: true,
      createdAt: new Date()
    });
    
    this.createRecommendation({
      userId,
      title: "Dining Budget Review",
      description: "You've spent 35% more on restaurants this month. Here's a plan to help adjust your budget.",
      type: "finance",
      imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d",
      actionLabel: "View Details",
      actionUrl: "/finance/budget-review",
      isNew: true,
      createdAt: new Date()
    });
    
    this.createRecommendation({
      userId,
      title: "New Running Route",
      description: "We found a new 5k route near your home that matches your running preferences.",
      type: "health",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
      actionLabel: "See Route",
      actionUrl: "/health/routes",
      isNew: true,
      createdAt: new Date()
    });
  }
}

export const storage = new MemStorage();
