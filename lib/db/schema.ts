import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password"),
  image: text("image"),
  balance: integer("balance").default(0),
  currency: text("currency").default("IDR"),
  budgetStartDay: integer("budget_start_day").default(1),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).default(false),
  emailNotifications: integer("email_notifications", { mode: "boolean" }).default(true),
  pushNotifications: integer("push_notifications", { mode: "boolean" }).default(true),
  weeklyReport: integer("weekly_report", { mode: "boolean" }).default(true),
  hasOnboarding: integer("has_onboarding", { mode: "boolean" }).default(false),
  createdAt: text("created_at"),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").$type<"income" | "expense">().notNull(),
  color: text("color"),
  icon: text("icon"),
  priority: text("priority")
    .$type<"Kebutuhan" | "Keinginan" | "Tabungan" | "Lainnya">()
    .default("Lainnya"),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  amount: integer("amount").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  type: text("type").$type<"income" | "expense">().notNull(),
  description: text("description"),
  store: text("store"),
  date: text("date").notNull(), // ISO format or YYYY-MM-DD
  userId: text("user_id").references(() => users.id),
  billId: integer("bill_id").references(() => bills.id),
  goalId: integer("goal_id").references(() => savingsGoals.id),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  bill: one(bills, {
    fields: [transactions.billId],
    references: [bills.id],
  }),
  goal: one(savingsGoals, {
    fields: [transactions.goalId],
    references: [savingsGoals.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  budgets: many(budgets),
  bills: many(bills),
}));

export const budgets = sqliteTable("budgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id),
  amountLimit: integer("amount_limit").notNull(),
  period: text("period").notNull(), // e.g., "2024-05"
  userId: text("user_id").references(() => users.id),
});

export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
}));

export const bills = sqliteTable("bills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  provider: text("provider"),
  amount: integer("amount").notNull(),
  dueDate: text("due_date").notNull(),
  isPaid: integer("is_paid", { mode: "boolean" }).default(false),
  urgent: integer("urgent", { mode: "boolean" }).default(false),
  iconName: text("icon_name"),
  userId: text("user_id").references(() => users.id),
});

export const billsRelations = relations(bills, ({ one }) => ({
  user: one(users, {
    fields: [bills.userId],
    references: [users.id],
  }),
}));

export const savingsGoals = sqliteTable("savings_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  targetAmount: integer("target_amount").notNull(),
  currentAmount: integer("current_amount").default(0),
  iconName: text("icon_name").default("Target"),
  color: text("color").default("#10b981"),
  dueDate: text("due_date"),
  userId: text("user_id").references(() => users.id),
});

export const savingsGoalsRelations = relations(savingsGoals, ({ one }) => ({
  user: one(users, {
    fields: [savingsGoals.userId],
    references: [users.id],
  }),
}));

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
  category: text("category").notNull(), // Should match transaction category names or 'Umum'
  readTime: text("read_time").default("5 min"),
  videoUrl: text("video_url"),
  color: text("color").default("primary"),
  featured: integer("featured", { mode: "boolean" }).default(false),
});

export const userLearningProgress = sqliteTable("user_learning_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  articleId: integer("article_id").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const userBookmarks = sqliteTable("user_bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  articleId: integer("article_id").notNull(),
  createdAt: text("created_at").notNull(),
});
