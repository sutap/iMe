import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  healthMetrics, type HealthMetric, type InsertHealthMetric,
  goals, type Goal, type InsertGoal,
  transactions, type Transaction, type InsertTransaction,
  budgetCategories, type BudgetCategory, type InsertBudgetCategory,
  recommendations, type Recommendation, type InsertRecommendation,
  type DashboardStats
} from "@shared/schema";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, isToday } from "date-fns";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  ready: Promise<void>;
  sessionStore?: session.Store;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: number, profileData: { profilePicture?: string; displayName?: string; email?: string; darkMode?: boolean; notificationsEnabled?: boolean }): Promise<User | undefined>;

  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(userId: number): Promise<Event[]>;
  getEventsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Event[]>;
  getTodayEvents(userId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  searchEvents(userId: number, query: string): Promise<Event[]>;

  // Health metric operations
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getHealthMetrics(userId: number): Promise<HealthMetric[]>;
  getHealthMetricsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<HealthMetric[]>;
  getTodayHealthMetric(userId: number): Promise<HealthMetric | undefined>;
  updateHealthMetric(id: number, metric: Partial<HealthMetric>): Promise<HealthMetric | undefined>;

  // Goals operations
  getGoals(userId: number): Promise<Goal | undefined>;
  createGoals(goal: InsertGoal): Promise<Goal>;
  updateGoals(userId: number, goal: Partial<Goal>): Promise<Goal | undefined>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  searchTransactions(userId: number, query: string): Promise<Transaction[]>;

  // Budget category operations
  getBudgetCategories(userId: number): Promise<BudgetCategory[]>;
  createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory>;
  updateBudgetCategory(id: number, category: Partial<BudgetCategory>): Promise<BudgetCategory | undefined>;
  deleteBudgetCategory(id: number): Promise<boolean>;

  // Recommendation operations
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecommendations(userId: number): Promise<Recommendation[]>;
  getRecommendationsByType(userId: number, type: string): Promise<Recommendation[]>;
  getNewRecommendations(userId: number): Promise<Recommendation[]>;
  markRecommendationViewed(id: number): Promise<boolean>;
  searchRecommendations(userId: number, query: string): Promise<Recommendation[]>;

  // Dashboard stats
  getDashboardStats(userId: number): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private healthMetrics: Map<number, HealthMetric>;
  private goalsByUser: Map<number, Goal>;
  private transactions: Map<number, Transaction>;
  private budgetCategoriesMap: Map<number, BudgetCategory>;
  private recommendations: Map<number, Recommendation>;
  
  private userCurrentId: number;
  private eventCurrentId: number;
  private healthMetricCurrentId: number;
  private goalCurrentId: number;
  private transactionCurrentId: number;
  private budgetCategoryCurrentId: number;
  private recommendationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.healthMetrics = new Map();
    this.goalsByUser = new Map();
    this.transactions = new Map();
    this.budgetCategoriesMap = new Map();
    this.recommendations = new Map();
    
    this.userCurrentId = 1;
    this.eventCurrentId = 1;
    this.healthMetricCurrentId = 1;
    this.goalCurrentId = 1;
    this.transactionCurrentId = 1;
    this.budgetCategoryCurrentId = 1;
    this.recommendationCurrentId = 1;

    this.ready = this.initDemoUser();
  }

  ready: Promise<void>;
  sessionStore?: session.Store;

  private async initDemoUser() {
    const hashedPassword = await hashPassword("demo123");
    await this.createUser({
      username: "demo",
      password: hashedPassword,
      displayName: "Alex Morgan",
      email: "alex@example.com",
      darkMode: false,
      notificationsEnabled: true,
      isPremium: false,
    });
    this.seedInitialData(1);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName ?? null,
      email: insertUser.email ?? null,
      profilePicture: insertUser.profilePicture ?? null,
      darkMode: insertUser.darkMode ?? false,
      notificationsEnabled: insertUser.notificationsEnabled ?? true,
      isPremium: insertUser.isPremium ?? false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(id: number, profileData: { profilePicture?: string; displayName?: string; email?: string; darkMode?: boolean; notificationsEnabled?: boolean }): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    const updatedUser = { ...existingUser, ...profileData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event operations
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { 
      id,
      userId: insertEvent.userId,
      title: insertEvent.title,
      description: insertEvent.description ?? null,
      startTime: insertEvent.startTime instanceof Date ? insertEvent.startTime : new Date(insertEvent.startTime),
      endTime: insertEvent.endTime instanceof Date ? insertEvent.endTime : new Date(insertEvent.endTime),
      location: insertEvent.location ?? null,
      type: insertEvent.type,
      isCompleted: insertEvent.isCompleted ?? false,
      reminder: insertEvent.reminder ?? 0,
    };
    this.events.set(id, event);
    return event;
  }

  async getEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getEventsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Event[]> {
    return Array.from(this.events.values()).filter(e => {
      const eventDate = new Date(e.startTime);
      return e.userId === userId && eventDate >= startDate && eventDate <= endDate;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getTodayEvents(userId: number): Promise<Event[]> {
    const today = new Date();
    return this.getEventsByDateRange(userId, startOfDay(today), endOfDay(today));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined> {
    const existing = this.events.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  async searchEvents(userId: number, query: string): Promise<Event[]> {
    const q = query.toLowerCase();
    return Array.from(this.events.values()).filter(e =>
      e.userId === userId && (
        e.title.toLowerCase().includes(q) ||
        (e.description?.toLowerCase().includes(q)) ||
        (e.location?.toLowerCase().includes(q))
      )
    );
  }

  // Health metric operations
  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricCurrentId++;
    const metric: HealthMetric = {
      id,
      userId: insertMetric.userId,
      date: insertMetric.date instanceof Date ? insertMetric.date : new Date(insertMetric.date),
      steps: insertMetric.steps ?? 0,
      waterIntake: insertMetric.waterIntake ?? 0,
      sleepHours: insertMetric.sleepHours ?? 0,
      calories: insertMetric.calories ?? 0,
      notes: insertMetric.notes ?? null,
    };
    this.healthMetrics.set(id, metric);
    return metric;
  }

  async getHealthMetrics(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getHealthMetricsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(m => {
      const d = new Date(m.date);
      return m.userId === userId && d >= startDate && d <= endDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getTodayHealthMetric(userId: number): Promise<HealthMetric | undefined> {
    return Array.from(this.healthMetrics.values()).find(m =>
      m.userId === userId && isToday(new Date(m.date))
    );
  }

  async updateHealthMetric(id: number, metric: Partial<HealthMetric>): Promise<HealthMetric | undefined> {
    const existing = this.healthMetrics.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...metric };
    this.healthMetrics.set(id, updated);
    return updated;
  }

  // Goals operations
  async getGoals(userId: number): Promise<Goal | undefined> {
    return this.goalsByUser.get(userId);
  }

  async createGoals(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.goalCurrentId++;
    const goal: Goal = {
      id,
      userId: insertGoal.userId,
      stepsGoal: insertGoal.stepsGoal ?? 10000,
      waterGoal: insertGoal.waterGoal ?? 8,
      sleepGoal: insertGoal.sleepGoal ?? 8,
      caloriesGoal: insertGoal.caloriesGoal ?? 2000,
      savingsGoal: insertGoal.savingsGoal ?? 500,
      monthlyBudget: insertGoal.monthlyBudget ?? 1500,
    };
    this.goalsByUser.set(insertGoal.userId, goal);
    return goal;
  }

  async updateGoals(userId: number, goalData: Partial<Goal>): Promise<Goal | undefined> {
    const existing = this.goalsByUser.get(userId);
    if (!existing) return undefined;
    const updated = { ...existing, ...goalData };
    this.goalsByUser.set(userId, updated);
    return updated;
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = {
      id,
      userId: insertTransaction.userId,
      amount: insertTransaction.amount,
      description: insertTransaction.description,
      date: insertTransaction.date instanceof Date ? insertTransaction.date : new Date(insertTransaction.date),
      category: insertTransaction.category,
      isIncome: insertTransaction.isIncome ?? false,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => {
      const d = new Date(t.date);
      return t.userId === userId && d >= startDate && d <= endDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...transaction };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async searchTransactions(userId: number, query: string): Promise<Transaction[]> {
    const q = query.toLowerCase();
    return Array.from(this.transactions.values()).filter(t =>
      t.userId === userId && (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    );
  }

  // Budget category operations
  async getBudgetCategories(userId: number): Promise<BudgetCategory[]> {
    return Array.from(this.budgetCategoriesMap.values()).filter(c => c.userId === userId);
  }

  async createBudgetCategory(insertCategory: InsertBudgetCategory): Promise<BudgetCategory> {
    const id = this.budgetCategoryCurrentId++;
    const category: BudgetCategory = {
      id,
      userId: insertCategory.userId,
      name: insertCategory.name,
      limit: insertCategory.limit,
      color: insertCategory.color ?? "#7d9b6f",
      icon: insertCategory.icon ?? "tag",
    };
    this.budgetCategoriesMap.set(id, category);
    return category;
  }

  async updateBudgetCategory(id: number, category: Partial<BudgetCategory>): Promise<BudgetCategory | undefined> {
    const existing = this.budgetCategoriesMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...category };
    this.budgetCategoriesMap.set(id, updated);
    return updated;
  }

  async deleteBudgetCategory(id: number): Promise<boolean> {
    return this.budgetCategoriesMap.delete(id);
  }

  // Recommendation operations
  async createRecommendation(insertRec: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationCurrentId++;
    const rec: Recommendation = {
      id,
      userId: insertRec.userId,
      title: insertRec.title,
      description: insertRec.description,
      type: insertRec.type,
      imageUrl: insertRec.imageUrl ?? null,
      actionLabel: insertRec.actionLabel ?? null,
      actionUrl: insertRec.actionUrl ?? null,
      isNew: insertRec.isNew ?? true,
      createdAt: insertRec.createdAt instanceof Date ? insertRec.createdAt : new Date(insertRec.createdAt),
    };
    this.recommendations.set(id, rec);
    return rec;
  }

  async getRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecommendationsByType(userId: number, type: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(r => r.userId === userId && r.type === type);
  }

  async getNewRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(r => r.userId === userId && r.isNew);
  }

  async markRecommendationViewed(id: number): Promise<boolean> {
    const rec = this.recommendations.get(id);
    if (!rec) return false;
    this.recommendations.set(id, { ...rec, isNew: false });
    return true;
  }

  async searchRecommendations(userId: number, query: string): Promise<Recommendation[]> {
    const q = query.toLowerCase();
    return Array.from(this.recommendations.values()).filter(r =>
      r.userId === userId && (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      )
    );
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const todayEvents = await this.getTodayEvents(userId);
    const upcomingEvents = await this.getEvents(userId);
    const now = new Date();
    const nextEvent = upcomingEvents.find(e => new Date(e.startTime) > now) || null;
    const todayHealthMetric = await this.getTodayHealthMetric(userId);
    
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthTransactions = await this.getTransactionsByDateRange(userId, monthStart, monthEnd);
    const expenses = monthTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0);
    const newRecommendations = await this.getNewRecommendations(userId);
    const userGoals = await this.getGoals(userId);
    
    return {
      todayEventsCount: todayEvents.length,
      nextEvent,
      stepsToday: todayHealthMetric?.steps || 0,
      stepsGoal: userGoals?.stepsGoal || 10000,
      waterIntake: todayHealthMetric?.waterIntake || 0,
      waterGoal: userGoals?.waterGoal || 8,
      sleepHours: todayHealthMetric?.sleepHours || 0,
      sleepGoal: userGoals?.sleepGoal || 8,
      expenseThisMonth: expenses,
      budgetThisMonth: userGoals?.monthlyBudget || 1500,
      recommendationsCount: newRecommendations.length
    };
  }

  private seedInitialData(userId: number) {
    // Default goals
    this.createGoals({
      userId,
      stepsGoal: 10000,
      waterGoal: 8,
      sleepGoal: 8,
      caloriesGoal: 2000,
      savingsGoal: 500,
      monthlyBudget: 1500,
    });

    // Default budget categories
    const categories = [
      { name: "Food & Dining", limit: 400, color: "#e07b54", icon: "utensils" },
      { name: "Transport", limit: 150, color: "#7d9b6f", icon: "car" },
      { name: "Entertainment", limit: 100, color: "#c4a882", icon: "film" },
      { name: "Bills & Utilities", limit: 300, color: "#8a7aad", icon: "zap" },
      { name: "Shopping", limit: 200, color: "#5b9bd5", icon: "shopping-bag" },
      { name: "Health", limit: 100, color: "#e84393", icon: "heart" },
    ];
    categories.forEach(c => this.createBudgetCategory({ userId, ...c }));

    // Sample events
    const now = new Date();
    const events = [
      { title: "Team Standup", type: "work", description: "Daily sync with the team", startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30), location: "Zoom", reminder: 10 },
      { title: "Lunch with Sarah", type: "personal", description: "Catch up over lunch", startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 30), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30), location: "The Green Cafe", reminder: 30 },
      { title: "Gym Session", type: "health", description: "Leg day workout", startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0), location: "FitLife Gym", reminder: 15 },
      { title: "Project Review", type: "work", description: "Q1 project review meeting", startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0), location: "Conference Room B", reminder: 30 },
      { title: "Doctor Appointment", type: "health", description: "Annual check-up", startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0), location: "City Medical Center", reminder: 60 },
      { title: "Birthday Party", type: "personal", description: "Mark's birthday celebration", startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 19, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 22, 0), location: "Mark's Place", reminder: 60 },
    ];
    events.forEach(e => this.createEvent({ userId, isCompleted: false, ...e }));

    // Sample health metrics - last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      this.createHealthMetric({
        userId, date,
        steps: Math.floor(6000 + Math.random() * 6000),
        waterIntake: Math.floor(5 + Math.random() * 5),
        sleepHours: Math.round((5.5 + Math.random() * 3) * 2) / 2,
        calories: Math.floor(1600 + Math.random() * 800),
        notes: "",
      });
    }

    // Sample transactions - last 30 days
    const txData = [
      { description: "Grocery Store", category: "Food & Dining", amount: 67.50, isIncome: false, daysAgo: 0 },
      { description: "Salary", category: "Income", amount: 3200, isIncome: true, daysAgo: 1 },
      { description: "Netflix", category: "Entertainment", amount: 15.99, isIncome: false, daysAgo: 2 },
      { description: "Gas Station", category: "Transport", amount: 48.20, isIncome: false, daysAgo: 2 },
      { description: "Coffee Shop", category: "Food & Dining", amount: 12.50, isIncome: false, daysAgo: 3 },
      { description: "Electric Bill", category: "Bills & Utilities", amount: 89.00, isIncome: false, daysAgo: 4 },
      { description: "Gym Membership", category: "Health", amount: 45.00, isIncome: false, daysAgo: 5 },
      { description: "Restaurant", category: "Food & Dining", amount: 78.30, isIncome: false, daysAgo: 5 },
      { description: "Amazon", category: "Shopping", amount: 124.99, isIncome: false, daysAgo: 6 },
      { description: "Freelance Project", category: "Income", amount: 850, isIncome: true, daysAgo: 7 },
      { description: "Internet Bill", category: "Bills & Utilities", amount: 59.99, isIncome: false, daysAgo: 8 },
      { description: "Uber", category: "Transport", amount: 22.40, isIncome: false, daysAgo: 9 },
      { description: "Pharmacy", category: "Health", amount: 31.25, isIncome: false, daysAgo: 10 },
      { description: "Movie Tickets", category: "Entertainment", amount: 28.00, isIncome: false, daysAgo: 11 },
      { description: "Supermarket", category: "Food & Dining", amount: 92.10, isIncome: false, daysAgo: 12 },
      { description: "Clothing Store", category: "Shopping", amount: 156.00, isIncome: false, daysAgo: 14 },
      { description: "Phone Bill", category: "Bills & Utilities", amount: 75.00, isIncome: false, daysAgo: 15 },
      { description: "Bonus", category: "Income", amount: 500, isIncome: true, daysAgo: 16 },
      { description: "Sushi Restaurant", category: "Food & Dining", amount: 64.80, isIncome: false, daysAgo: 17 },
      { description: "Bus Pass", category: "Transport", amount: 85.00, isIncome: false, daysAgo: 20 },
    ];
    txData.forEach(tx => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - tx.daysAgo);
      this.createTransaction({ userId, date, description: tx.description, category: tx.category, amount: tx.amount, isIncome: tx.isIncome });
    });

    // Sample recommendations
    const recs = [
      { title: "Morning Walk", description: "You're 2,000 steps behind your weekly average. A 20-minute walk can help close the gap!", type: "health", actionLabel: "Track Steps", isNew: true },
      { title: "Budget Alert", description: "You've spent 85% of your Food & Dining budget this month. Consider cooking at home more.", type: "finance", actionLabel: "View Budget", isNew: true },
      { title: "Sleep Better", description: "Your average sleep this week is 6.2 hours — try going to bed 30 minutes earlier.", type: "health", actionLabel: "Set Reminder", isNew: true },
      { title: "Local Farmers Market", description: "There's a farmers market near you every Saturday — great for fresh produce on a budget!", type: "discover", actionLabel: "Get Directions", isNew: false },
      { title: "Free Yoga Class", description: "City Park is hosting free outdoor yoga sessions every Sunday morning at 8am.", type: "discover", actionLabel: "Learn More", isNew: false },
      { title: "Savings Opportunity", description: "You have $340 unspent this month. Consider moving it to your savings goal.", type: "finance", actionLabel: "Transfer Now", isNew: true },
    ];
    const createdAt = new Date();
    recs.forEach(r => this.createRecommendation({ userId, ...r, imageUrl: null, actionUrl: null, createdAt }));
  }
}

export const storage = new MemStorage();
