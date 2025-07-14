import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  loginSchema, insertUserSchema, insertPropertySchema, insertTransactionSchema,
  insertTaskSchema, insertDocumentSchema, insertMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<number, WebSocket>();

  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'auth' && data.userId) {
          clients.set(data.userId, ws);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      for (const [userId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(userId);
          break;
        }
      }
    });
  });

  // Broadcast function
  const broadcast = (data: any, excludeUserId?: number) => {
    const message = JSON.stringify(data);
    clients.forEach((client, userId) => {
      if (client.readyState === WebSocket.OPEN && userId !== excludeUserId) {
        client.send(message);
      }
    });
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      // In a real app, you would set up proper session management
      const userResponse = { ...user, password: undefined };
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      const userResponse = { ...user, password: undefined };
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersResponse = users.map(user => ({ ...user, password: undefined }));
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userResponse = { ...user, password: undefined };
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/role/:role", async (req, res) => {
    try {
      const role = req.params.role;
      const users = await storage.getUsersByRole(role);
      const usersResponse = users.map(user => ({ ...user, password: undefined }));
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users by role" });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
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

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      
      // Broadcast new transaction to all clients
      broadcast({ type: 'transaction_created', transaction });
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
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

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const transaction = await storage.updateTransaction(id, updateData);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Broadcast transaction update
      broadcast({ type: 'transaction_updated', transaction });
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  app.get("/api/transactions/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });

  app.get("/api/transactions/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const transactions = await storage.getTransactionsByStatus(status);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions by status" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      
      // Broadcast new task to relevant users
      broadcast({ type: 'task_created', task });
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
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

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const task = await storage.updateTask(id, updateData);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Broadcast task update
      broadcast({ type: 'task_updated', task });
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.get("/api/tasks/transaction/:transactionId", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const tasks = await storage.getTasksByTransaction(transactionId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction tasks" });
    }
  });

  app.get("/api/tasks/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks = await storage.getTasksByUser(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tasks" });
    }
  });

  app.get("/api/tasks/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const tasks = await storage.getTasksByStatus(status);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks by status" });
    }
  });

  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      
      // Broadcast new document to relevant users
      broadcast({ type: 'document_created', document });
      
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
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

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const document = await storage.updateDocument(id, updateData);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Broadcast document update
      broadcast({ type: 'document_updated', document });
      
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.get("/api/documents/transaction/:transactionId", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const documents = await storage.getDocumentsByTransaction(transactionId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction documents" });
    }
  });

  app.get("/api/documents/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const documents = await storage.getDocumentsByUser(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user documents" });
    }
  });

  // Message routes
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Broadcast new message to relevant users
      broadcast({ type: 'message_created', message }, message.senderId || undefined);
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/messages/:id", async (req, res) => {
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

  app.get("/api/messages/transaction/:transactionId", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const messages = await storage.getMessagesByTransaction(transactionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction messages" });
    }
  });

  app.get("/api/messages/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user messages" });
    }
  });

  app.post("/api/messages/:id/read", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const { userId } = req.body;
      
      await storage.markMessageAsRead(messageId, userId);
      
      // Broadcast message read status
      broadcast({ type: 'message_read', messageId, userId });
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Failed to mark message as read" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      const tasks = await storage.getAllTasks();
      const documents = await storage.getAllDocuments();
      
      const activeTransactions = transactions.filter(t => t.status === 'active').length;
      const pendingDocuments = documents.filter(d => d.status === 'pending').length;
      const monthlyClosings = transactions.filter(t => 
        t.status === 'completed' && 
        t.closingDate && 
        new Date(t.closingDate).getMonth() === new Date().getMonth()
      ).length;
      
      // Calculate average close time
      const completedTransactions = transactions.filter(t => t.status === 'completed' && t.contractDate && t.closingDate);
      const avgCloseTime = completedTransactions.length > 0 
        ? completedTransactions.reduce((sum, t) => {
            const contractDate = new Date(t.contractDate!);
            const closingDate = new Date(t.closingDate!);
            return sum + (closingDate.getTime() - contractDate.getTime());
          }, 0) / completedTransactions.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

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
