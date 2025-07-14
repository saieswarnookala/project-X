# Project-X: Real Estate Transaction Management Platform

A comprehensive real estate transaction management web application that replicates Qualia's functionality, built with modern web technologies and designed for seamless collaboration between all parties involved in real estate transactions.

## 🚀 Live Demo

You can access the live application at: `https://your-replit-url.replit.app`

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Project-X is a full-featured real estate transaction management platform that digitalizes and streamlines the entire real estate closing process. It provides comprehensive tools for managing transactions, documents, tasks, and communications between all stakeholders including agents, buyers, sellers, lenders, and title companies.

### Key Objectives

- **Streamline Operations**: Reduce manual processes and paperwork
- **Enhance Communication**: Real-time messaging and updates
- **Improve Transparency**: Track transaction progress in real-time
- **Ensure Compliance**: Document management with e-signature support
- **Automate Workflows**: Task automation and deadline management

## ✨ Features

### 🔐 User Management
- **Role-based Access Control**: Support for multiple user types (agents, buyers, sellers, lenders, title companies, admins)
- **Authentication System**: Secure login with session management
- **User Profiles**: Complete profile management with company affiliations

### 📊 Transaction Management
- **Complete Lifecycle Tracking**: From initial listing to closing
- **Multi-party Support**: Manage all stakeholders in one place
- **Status Tracking**: Real-time updates on transaction progress
- **Property Information**: Comprehensive property details and specifications

### 📄 Document Management
- **File Upload & Storage**: Secure document storage with version control
- **E-signature Support**: Digital signing capabilities
- **Document Status Tracking**: Monitor approval workflows
- **Type Categorization**: Organized document classification

### ✅ Task Management
- **Automated Workflows**: Predefined task sequences for common processes
- **Priority Management**: Urgent, high, medium, and low priority levels
- **Assignment System**: Assign tasks to specific team members
- **Deadline Tracking**: Monitor due dates and overdue items

### 💬 Communication Hub
- **Real-time Messaging**: WebSocket-powered instant messaging
- **Transaction-specific Threads**: Organized communication channels
- **Message Status Tracking**: Delivery and read receipts
- **Broadcast Notifications**: System-wide announcements

### 📈 Dashboard & Analytics
- **Real-time Dashboard**: Key metrics and performance indicators
- **Transaction Overview**: Visual progress tracking
- **Recent Activity**: Activity feeds and notifications
- **Reporting Tools**: Generate custom reports

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (TypeScript)                                   │
│  ├── Components (Shadcn/UI + Radix)                           │
│  ├── Pages (Wouter Router)                                    │
│  ├── State Management (TanStack Query)                        │
│  ├── Styling (Tailwind CSS)                                   │
│  └── WebSocket Client (Real-time Updates)                     │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server (TypeScript)                               │
│  ├── REST API Endpoints                                       │
│  ├── WebSocket Server (Real-time)                            │
│  ├── Authentication Middleware                                │
│  ├── Request Validation (Zod)                                │
│  └── Error Handling                                          │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  Storage Interface (IStorage)                                 │
│  ├── In-Memory Storage (Development)                          │
│  ├── PostgreSQL + Drizzle ORM (Production)                   │
│  ├── Database Migrations                                      │
│  └── Schema Validation                                        │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                  │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Supabase)                                        │
│  ├── Users & Authentication                                   │
│  ├── Transactions & Properties                                │
│  ├── Tasks & Workflows                                        │
│  ├── Documents & Files                                        │
│  └── Messages & Communications                                │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────┐    HTTP/WebSocket    ┌─────────────┐
│   Client    │ ◄──────────────────► │   Server    │
│  (React)    │                      │ (Express)   │
└─────────────┘                      └─────────────┘
                                            │
                                            ▼
                                    ┌─────────────┐
                                    │   Storage   │
                                    │ Interface   │
                                    └─────────────┘
                                            │
                                            ▼
                                    ┌─────────────┐
                                    │ PostgreSQL  │
                                    │ (Supabase)  │
                                    └─────────────┘
```

### Component Structure

```
client/src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/             # Layout components (sidebar, topbar)
│   ├── transactions/       # Transaction management components
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configurations
├── pages/                  # Page components
└── types/                  # TypeScript type definitions
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe JavaScript with enhanced IDE support
- **Vite** - Fast build tool and development server
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management and caching
- **Shadcn/UI** - Modern UI components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side development
- **WebSocket (ws)** - Real-time communication
- **Zod** - Schema validation and type inference
- **Drizzle ORM** - Type-safe database operations
- **TSX** - TypeScript execution for development

### Database
- **PostgreSQL** - Relational database management system
- **Supabase** - Database hosting and management
- **Drizzle Kit** - Database migrations and schema management

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS post-processing
- **Autoprefixer** - CSS vendor prefixing
- **Git** - Version control system

## 📦 Installation

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database (Supabase recommended)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/project-x.git
cd project-x
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development
```

### Step 4: Database Setup
```bash
# Push schema to database
npm run db:push

# Generate migrations (if needed)
npm run db:generate
```

### Step 5: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 Usage

### Getting Started

1. **Login**: Use the demo credentials or create a new account
2. **Dashboard**: View your transaction overview and recent activity
3. **Transactions**: Create and manage real estate transactions
4. **Tasks**: Track and complete workflow tasks
5. **Documents**: Upload and manage transaction documents
6. **Messages**: Communicate with transaction parties
7. **Contacts**: Manage your professional network

### User Roles

- **Admin**: Full system access and user management
- **Agent**: Transaction creation and management
- **Buyer/Seller**: Transaction participation and document access
- **Lender**: Loan-related task management
- **Title Company**: Closing coordination and document management

### Common Workflows

1. **Transaction Creation**
   - Agent creates new transaction
   - Adds property details and parties
   - System generates initial task list

2. **Document Management**
   - Upload required documents
   - Request signatures from parties
   - Track approval status

3. **Task Completion**
   - View assigned tasks
   - Update task status
   - Set due dates and priorities

4. **Communication**
   - Send messages to transaction parties
   - Receive real-time notifications
   - Track message history

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login with username and password
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### POST `/api/auth/logout`
Logout current user

#### GET `/api/auth/user`
Get current user information

### Transaction Endpoints

#### GET `/api/transactions`
Get all transactions for the current user

#### POST `/api/transactions`
Create a new transaction
```json
{
  "propertyId": 1,
  "agentId": 1,
  "buyerId": 2,
  "sellerId": 3,
  "status": "pending",
  "purchasePrice": "$500,000"
}
```

#### GET `/api/transactions/:id`
Get specific transaction details

#### PATCH `/api/transactions/:id`
Update transaction information

### Task Endpoints

#### GET `/api/tasks`
Get all tasks

#### POST `/api/tasks`
Create a new task
```json
{
  "title": "Review Purchase Agreement",
  "description": "Review and approve the purchase agreement",
  "priority": "high",
  "dueDate": "2024-01-15",
  "assignedToId": 1,
  "transactionId": 1
}
```

#### PATCH `/api/tasks/:id`
Update task status

### Document Endpoints

#### GET `/api/documents`
Get all documents

#### POST `/api/documents`
Upload a new document
```json
{
  "name": "Purchase Agreement",
  "type": "contract",
  "size": 1024,
  "url": "/uploads/agreement.pdf",
  "transactionId": 1
}
```

### WebSocket Events

#### Connection
Connect to WebSocket server at `/ws`

#### Events
- `transaction_created` - New transaction created
- `transaction_updated` - Transaction status changed
- `task_created` - New task assigned
- `task_updated` - Task status changed
- `document_created` - New document uploaded
- `message_created` - New message sent

## 🗄️ Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Transactions
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  agent_id INTEGER REFERENCES users(id),
  buyer_id INTEGER REFERENCES users(id),
  seller_id INTEGER REFERENCES users(id),
  lender_id INTEGER REFERENCES users(id),
  title_company_id INTEGER REFERENCES users(id),
  status transaction_status NOT NULL,
  contract_date DATE,
  closing_date DATE,
  expected_close_date DATE,
  purchase_price DECIMAL(12,2),
  loan_amount DECIMAL(12,2),
  earnest_money DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tasks
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  assigned_to_id INTEGER REFERENCES users(id),
  created_by_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status NOT NULL,
  priority task_priority NOT NULL,
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships

- Users can have multiple roles in different transactions
- Transactions are linked to properties and multiple users
- Tasks are assigned to users and linked to transactions
- Documents belong to transactions and are uploaded by users
- Messages are sent between users within transaction contexts

## 🤝 Contributing

We welcome contributions to Project-X! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Add screenshots for UI changes
4. Request review from maintainers
5. Address feedback promptly

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Qualia** - Inspiration for the real estate transaction management concept
- **Shadcn/UI** - Beautiful and accessible UI components
- **Supabase** - Database hosting and management
- **Replit** - Development and hosting platform
- **The React Team** - For the amazing React library

## 📞 Support

For support, please contact:
- Email: support@project-x.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/project-x/issues)
- Documentation: [View docs](https://github.com/yourusername/project-x/wiki)

## 🔮 Roadmap

### Phase 1 (Current) ✅
- User authentication and role management
- Transaction creation and management
- Task tracking and workflow automation
- Document upload and management
- Real-time messaging system

### Phase 2 (Planned) 🚧
- Advanced reporting and analytics
- Integration with MLS systems
- Mobile application development
- Advanced document e-signature workflows
- Automated compliance checking

### Phase 3 (Future) 🔮
- AI-powered task recommendations
- Predictive analytics for closing timelines
- Integration with accounting systems
- Advanced workflow customization
- Third-party API integrations

---

**Built with ❤️ by the Project-X Team**