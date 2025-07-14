// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/storage.ts
var MemStorage = class {
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.tasks = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.messageRecipients = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentTransactionId = 1;
    this.currentTaskId = 1;
    this.currentDocumentId = 1;
    this.currentMessageId = 1;
    this.currentMessageRecipientId = 1;
    this.createUser({
      username: "admin",
      email: "admin@project-x.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "555-0100",
      company: "Project-X",
      isActive: true
    });
    this.createUser({
      username: "sarah.johnson",
      email: "sarah@project-x.com",
      password: "password123",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "agent",
      phone: "555-0101",
      company: "Premier Realty",
      isActive: true
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      role: insertUser.role || "agent",
      phone: insertUser.phone || null,
      company: insertUser.company || null,
      isActive: insertUser.isActive ?? true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updateUser) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updated = { ...user, ...updateUser, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(id, updated);
    return updated;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  async getUsersByRole(role) {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }
  // Property methods
  async getProperty(id) {
    return this.properties.get(id);
  }
  async createProperty(insertProperty) {
    const id = this.currentPropertyId++;
    const property = {
      ...insertProperty,
      id,
      purchasePrice: insertProperty.purchasePrice || null,
      squareFootage: insertProperty.squareFootage || null,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      yearBuilt: insertProperty.yearBuilt || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.properties.set(id, property);
    return property;
  }
  async updateProperty(id, updateProperty) {
    const property = this.properties.get(id);
    if (!property) return void 0;
    const updated = { ...property, ...updateProperty, updatedAt: /* @__PURE__ */ new Date() };
    this.properties.set(id, updated);
    return updated;
  }
  async getAllProperties() {
    return Array.from(this.properties.values());
  }
  // Transaction methods
  async getTransaction(id) {
    return this.transactions.get(id);
  }
  async createTransaction(insertTransaction) {
    const id = this.currentTransactionId++;
    const transaction = {
      ...insertTransaction,
      id,
      status: insertTransaction.status || "pending",
      propertyId: insertTransaction.propertyId || null,
      agentId: insertTransaction.agentId || null,
      buyerId: insertTransaction.buyerId || null,
      sellerId: insertTransaction.sellerId || null,
      lenderId: insertTransaction.lenderId || null,
      titleCompanyId: insertTransaction.titleCompanyId || null,
      contractDate: insertTransaction.contractDate || null,
      closingDate: insertTransaction.closingDate || null,
      expectedCloseDate: insertTransaction.expectedCloseDate || null,
      purchasePrice: insertTransaction.purchasePrice || null,
      loanAmount: insertTransaction.loanAmount || null,
      earnestMoney: insertTransaction.earnestMoney || null,
      notes: insertTransaction.notes || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  async updateTransaction(id, updateTransaction) {
    const transaction = this.transactions.get(id);
    if (!transaction) return void 0;
    const updated = { ...transaction, ...updateTransaction, updatedAt: /* @__PURE__ */ new Date() };
    this.transactions.set(id, updated);
    return updated;
  }
  async getAllTransactions() {
    return Array.from(this.transactions.values());
  }
  async getTransactionsByUser(userId) {
    return Array.from(this.transactions.values()).filter(
      (t) => t.agentId === userId || t.buyerId === userId || t.sellerId === userId || t.lenderId === userId || t.titleCompanyId === userId
    );
  }
  async getTransactionsByStatus(status) {
    return Array.from(this.transactions.values()).filter((t) => t.status === status);
  }
  // Task methods
  async getTask(id) {
    return this.tasks.get(id);
  }
  async createTask(insertTask) {
    const id = this.currentTaskId++;
    const task = {
      ...insertTask,
      id,
      status: insertTask.status || "pending",
      priority: insertTask.priority || "medium",
      transactionId: insertTask.transactionId || null,
      assignedToId: insertTask.assignedToId || null,
      createdById: insertTask.createdById || null,
      description: insertTask.description || null,
      dueDate: insertTask.dueDate || null,
      completedAt: insertTask.completedAt || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tasks.set(id, task);
    return task;
  }
  async updateTask(id, updateTask) {
    const task = this.tasks.get(id);
    if (!task) return void 0;
    const updated = { ...task, ...updateTask, updatedAt: /* @__PURE__ */ new Date() };
    this.tasks.set(id, updated);
    return updated;
  }
  async getAllTasks() {
    return Array.from(this.tasks.values());
  }
  async getTasksByTransaction(transactionId) {
    return Array.from(this.tasks.values()).filter((t) => t.transactionId === transactionId);
  }
  async getTasksByUser(userId) {
    return Array.from(this.tasks.values()).filter((t) => t.assignedToId === userId);
  }
  async getTasksByStatus(status) {
    return Array.from(this.tasks.values()).filter((t) => t.status === status);
  }
  // Document methods
  async getDocument(id) {
    return this.documents.get(id);
  }
  async createDocument(insertDocument) {
    const id = this.currentDocumentId++;
    const document = {
      ...insertDocument,
      id,
      status: insertDocument.status || "pending",
      transactionId: insertDocument.transactionId || null,
      uploadedById: insertDocument.uploadedById || null,
      isSigned: insertDocument.isSigned || false,
      signedAt: insertDocument.signedAt || null,
      signedById: insertDocument.signedById || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.documents.set(id, document);
    return document;
  }
  async updateDocument(id, updateDocument) {
    const document = this.documents.get(id);
    if (!document) return void 0;
    const updated = { ...document, ...updateDocument, updatedAt: /* @__PURE__ */ new Date() };
    this.documents.set(id, updated);
    return updated;
  }
  async getAllDocuments() {
    return Array.from(this.documents.values());
  }
  async getDocumentsByTransaction(transactionId) {
    return Array.from(this.documents.values()).filter((d) => d.transactionId === transactionId);
  }
  async getDocumentsByUser(userId) {
    return Array.from(this.documents.values()).filter((d) => d.uploadedById === userId);
  }
  // Message methods
  async getMessage(id) {
    return this.messages.get(id);
  }
  async createMessage(insertMessage) {
    const id = this.currentMessageId++;
    const message = {
      ...insertMessage,
      id,
      status: insertMessage.status || "sent",
      transactionId: insertMessage.transactionId || null,
      senderId: insertMessage.senderId || null,
      isRead: insertMessage.isRead || false,
      readAt: insertMessage.readAt || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.messages.set(id, message);
    return message;
  }
  async getAllMessages() {
    return Array.from(this.messages.values());
  }
  async getMessagesByTransaction(transactionId) {
    return Array.from(this.messages.values()).filter((m) => m.transactionId === transactionId);
  }
  async getMessagesByUser(userId) {
    return Array.from(this.messages.values()).filter((m) => m.senderId === userId);
  }
  async markMessageAsRead(messageId, userId) {
    const message = this.messages.get(messageId);
    if (message) {
      message.isRead = true;
      message.readAt = /* @__PURE__ */ new Date();
    }
  }
  // Message recipient methods
  async createMessageRecipient(insertRecipient) {
    const id = this.currentMessageRecipientId++;
    const recipient = {
      ...insertRecipient,
      id,
      messageId: insertRecipient.messageId || null,
      recipientId: insertRecipient.recipientId || null,
      isRead: insertRecipient.isRead || false,
      readAt: insertRecipient.readAt || null
    };
    this.messageRecipients.set(id, recipient);
    return recipient;
  }
  async getMessageRecipients(messageId) {
    return Array.from(this.messageRecipients.values()).filter((r) => r.messageId === messageId);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var userRoleEnum = pgEnum("user_role", ["agent", "buyer", "seller", "lender", "title_company", "admin"]);
var transactionStatusEnum = pgEnum("transaction_status", ["pending", "active", "under_review", "completed", "cancelled"]);
var taskStatusEnum = pgEnum("task_status", ["pending", "in_progress", "completed", "overdue"]);
var taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);
var documentStatusEnum = pgEnum("document_status", ["pending", "signed", "under_review", "approved", "rejected"]);
var messageStatusEnum = pgEnum("message_status", ["sent", "delivered", "read"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default("agent"),
  phone: text("phone"),
  company: text("company"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  propertyType: text("property_type").notNull(),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  squareFootage: integer("square_footage"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  yearBuilt: integer("year_built"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  agentId: integer("agent_id").references(() => users.id),
  buyerId: integer("buyer_id").references(() => users.id),
  sellerId: integer("seller_id").references(() => users.id),
  lenderId: integer("lender_id").references(() => users.id),
  titleCompanyId: integer("title_company_id").references(() => users.id),
  status: transactionStatusEnum("status").notNull().default("pending"),
  contractDate: timestamp("contract_date"),
  closingDate: timestamp("closing_date"),
  expectedCloseDate: timestamp("expected_close_date"),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  loanAmount: decimal("loan_amount", { precision: 12, scale: 2 }),
  earnestMoney: decimal("earnest_money", { precision: 12, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  createdById: integer("created_by_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("pending"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  status: documentStatusEnum("status").notNull().default("pending"),
  isSigned: boolean("is_signed").notNull().default(false),
  signedAt: timestamp("signed_at"),
  signedById: integer("signed_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  senderId: integer("sender_id").references(() => users.id),
  content: text("content").notNull(),
  status: messageStatusEnum("status").notNull().default("sent"),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var messageRecipients = pgTable("message_recipients", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id),
  recipientId: integer("recipient_id").references(() => users.id),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at")
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});
var insertMessageRecipientSchema = createInsertSchema(messageRecipients).omit({
  id: true
});
var loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

// server/routes.ts
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = /* @__PURE__ */ new Map();
  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "auth" && data.userId) {
          clients.set(data.userId, ws);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      console.log("Client disconnected");
      for (const [userId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(userId);
          break;
        }
      }
    });
  });
  const broadcast = (data, excludeUserId) => {
    const message = JSON.stringify(data);
    clients.forEach((client, userId) => {
      if (client.readyState === WebSocket.OPEN && userId !== excludeUserId) {
        client.send(message);
      }
    });
  };
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }
      const userResponse = { ...user, password: void 0 };
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser(userData);
      const userResponse = { ...user, password: void 0 };
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersResponse = users2.map((user) => ({ ...user, password: void 0 }));
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userResponse = { ...user, password: void 0 };
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/users/role/:role", async (req, res) => {
    try {
      const role = req.params.role;
      const users2 = await storage.getUsersByRole(role);
      const usersResponse = users2.map((user) => ({ ...user, password: void 0 }));
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users by role" });
    }
  });
  app2.get("/api/properties", async (req, res) => {
    try {
      const properties2 = await storage.getAllProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });
  app2.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const transactions2 = await storage.getAllTransactions();
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      broadcast({ type: "transaction_created", transaction });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });
  app2.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });
  app2.patch("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const transaction = await storage.updateTransaction(id, updateData);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      broadcast({ type: "transaction_updated", transaction });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });
  app2.get("/api/transactions/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions2 = await storage.getTransactionsByUser(userId);
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });
  app2.get("/api/transactions/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const transactions2 = await storage.getTransactionsByStatus(status);
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions by status" });
    }
  });
  app2.get("/api/tasks", async (req, res) => {
    try {
      const tasks2 = await storage.getAllTasks();
      res.json(tasks2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  app2.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      broadcast({ type: "task_created", task });
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });
  app2.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });
  app2.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const task = await storage.updateTask(id, updateData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      broadcast({ type: "task_updated", task });
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });
  app2.get("/api/tasks/transaction/:transactionId", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const tasks2 = await storage.getTasksByTransaction(transactionId);
      res.json(tasks2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction tasks" });
    }
  });
  app2.get("/api/tasks/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks2 = await storage.getTasksByUser(userId);
      res.json(tasks2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tasks" });
    }
  });
  app2.get("/api/tasks/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const tasks2 = await storage.getTasksByStatus(status);
      res.json(tasks2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks by status" });
    }
  });
  app2.get("/api/documents", async (req, res) => {
    try {
      const documents2 = await storage.getAllDocuments();
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      broadcast({ type: "document_created", document });
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });
  app2.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });
  app2.patch("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const document = await storage.updateDocument(id, updateData);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      broadcast({ type: "document_updated", document });
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });
  app2.get("/api/documents/transaction/:transactionId", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const documents2 = await storage.getDocumentsByTransaction(transactionId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction documents" });
    }
  });
  app2.get("/api/documents/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const documents2 = await storage.getDocumentsByUser(userId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user documents" });
    }
  });
  app2.get("/api/messages", async (req, res) => {
    try {
      const messages2 = await storage.getAllMessages();
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      broadcast({ type: "message_created", message }, message.senderId || void 0);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });
  app2.get("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch message" });
    }
  });
  app2.get("/api/messages/transaction/:transactionId", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const messages2 = await storage.getMessagesByTransaction(transactionId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction messages" });
    }
  });
  app2.get("/api/messages/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages2 = await storage.getMessagesByUser(userId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user messages" });
    }
  });
  app2.post("/api/messages/:id/read", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const { userId } = req.body;
      await storage.markMessageAsRead(messageId, userId);
      broadcast({ type: "message_read", messageId, userId });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Failed to mark message as read" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const transactions2 = await storage.getAllTransactions();
      const tasks2 = await storage.getAllTasks();
      const documents2 = await storage.getAllDocuments();
      const activeTransactions = transactions2.filter((t) => t.status === "active").length;
      const pendingDocuments = documents2.filter((d) => d.status === "pending").length;
      const monthlyClosings = transactions2.filter(
        (t) => t.status === "completed" && t.closingDate && new Date(t.closingDate).getMonth() === (/* @__PURE__ */ new Date()).getMonth()
      ).length;
      const completedTransactions = transactions2.filter((t) => t.status === "completed" && t.contractDate && t.closingDate);
      const avgCloseTime = completedTransactions.length > 0 ? completedTransactions.reduce((sum, t) => {
        const contractDate = new Date(t.contractDate);
        const closingDate = new Date(t.closingDate);
        return sum + (closingDate.getTime() - contractDate.getTime());
      }, 0) / completedTransactions.length / (1e3 * 60 * 60 * 24) : 0;
      res.json({
        activeTransactions,
        pendingDocuments,
        monthlyClosings,
        averageCloseTime: Math.round(avgCloseTime)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "localhost", () => {
    log(`serving on port ${port}`);
  });
})();
