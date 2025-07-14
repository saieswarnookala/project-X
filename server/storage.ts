import { 
  users, properties, transactions, tasks, documents, messages, messageRecipients,
  type User, type InsertUser, type Property, type InsertProperty,
  type Transaction, type InsertTransaction, type Task, type InsertTask,
  type Document, type InsertDocument, type Message, type InsertMessage,
  type MessageRecipient, type InsertMessageRecipient
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUåserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;

  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  getTransactionsByStatus(status: string): Promise<Transaction[]>;

  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  getAllTasks(): Promise<Task[]>;
  getTasksByTransaction(transactionId: number): Promise<Task[]>;
  getTasksByUser(userId: number): Promise<Task[]>;
  getTasksByStatus(status: string): Promise<Task[]>;

  // Document methods
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  getDocumentsByTransaction(transactionId: number): Promise<Document[]>;
  getDocumentsByUser(userId: number): Promise<Document[]>;

  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  getMessagesByTransaction(transactionId: number): Promise<Message[]>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  markMessageAsRead(messageId: number, userId: number): Promise<void>;

  // Message recipient methods
  createMessageRecipient(recipient: InsertMessageRecipient): Promise<MessageRecipient>;
  getMessageRecipients(messageId: number): Promise<MessageRecipient[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private properties: Map<number, Property> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private tasks: Map<number, Task> = new Map();
  private documents: Map<number, Document> = new Map();
  private messages: Map<number, Message> = new Map();
  private messageRecipients: Map<number, MessageRecipient> = new Map();
  
  private currentUserId = 1;
  private currentPropertyId = 1;
  private currentTransactionId = 1;
  private currentTaskId = 1;
  private currentDocumentId = 1;
  private currentMessageId = 1;
  private currentMessageRecipientId = 1;

  constructor() {
    // Create sample admin user
    this.createUser({
      username: "admin",
      email: "admin@project-x.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "555-0100",
      company: "Project-X",
      isActive: true,
    });

    // Create sample agent user
    this.createUser({
      username: "sarah.johnson",
      email: "sarah@project-x.com",
      password: "password123",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "agent",
      phone: "555-0101",
      company: "Premier Realty",
      isActive: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || 'agent',
      phone: insertUser.phone || null,
      company: insertUser.company || null,
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...updateUser, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = {
      ...insertProperty,
      id,
      purchasePrice: insertProperty.purchasePrice || null,
      squareFootage: insertProperty.squareFootage || null,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      yearBuilt: insertProperty.yearBuilt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateProperty: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updated = { ...property, ...updateProperty, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: insertTransaction.status || 'pending',
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updateTransaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { ...transaction, ...updateTransaction, updatedAt: new Date() };
    this.transactions.set(id, updated);
    return updated;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => 
      t.agentId === userId || t.buyerId === userId || t.sellerId === userId || 
      t.lenderId === userId || t.titleCompanyId === userId
    );
  }

  async getTransactionsByStatus(status: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.status === status);
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      status: insertTask.status || 'pending',
      priority: insertTask.priority || 'medium',
      transactionId: insertTask.transactionId || null,
      assignedToId: insertTask.assignedToId || null,
      createdById: insertTask.createdById || null,
      description: insertTask.description || null,
      dueDate: insertTask.dueDate || null,
      completedAt: insertTask.completedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateTask: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updated = { ...task, ...updateTask, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByTransaction(transactionId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(t => t.transactionId === transactionId);
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(t => t.assignedToId === userId);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(t => t.status === status);
  }

  // Document methods
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = {
      ...insertDocument,
      id,
      status: insertDocument.status || 'pending',
      transactionId: insertDocument.transactionId || null,
      uploadedById: insertDocument.uploadedById || null,
      isSigned: insertDocument.isSigned || false,
      signedAt: insertDocument.signedAt || null,
      signedById: insertDocument.signedById || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateDocument: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updated = { ...document, ...updateDocument, updatedAt: new Date() };
    this.documents.set(id, updated);
    return updated;
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByTransaction(transactionId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.transactionId === transactionId);
  }

  async getDocumentsByUser(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.uploadedById === userId);
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      status: insertMessage.status || 'sent',
      transactionId: insertMessage.transactionId || null,
      senderId: insertMessage.senderId || null,
      isRead: insertMessage.isRead || false,
      readAt: insertMessage.readAt || null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessagesByTransaction(transactionId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.transactionId === transactionId);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.senderId === userId);
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      message.isRead = true;
      message.readAt = new Date();
    }
  }

  // Message recipient methods
  async createMessageRecipient(insertRecipient: InsertMessageRecipient): Promise<MessageRecipient> {
    const id = this.currentMessageRecipientId++;
    const recipient: MessageRecipient = {
      ...insertRecipient,
      id,
      messageId: insertRecipient.messageId || null,
      recipientId: insertRecipient.recipientId || null,
      isRead: insertRecipient.isRead || false,
      readAt: insertRecipient.readAt || null,
    };
    this.messageRecipients.set(id, recipient);
    return recipient;
  }

  async getMessageRecipients(messageId: number): Promise<MessageRecipient[]> {
    return Array.from(this.messageRecipients.values()).filter(r => r.messageId === messageId);
  }
}

export const storage = new MemStorage();
