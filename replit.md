# Real Estate Transaction Management Platform

## Overview

This is a comprehensive real estate transaction management web application built with React and Express, similar to Qualia. The platform digitizes and streamlines the entire real estate closing process, providing end-to-end management for all stakeholders involved in real estate transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Real-time Communication**: WebSocket server for live updates
- **API Design**: RESTful API with real-time enhancements

### Project Structure
- **Client**: React frontend located in `/client` directory
- **Server**: Express backend located in `/server` directory
- **Shared**: Common schemas and types in `/shared` directory
- **Monorepo**: Single package.json managing both frontend and backend

## Key Components

### User Management
- Role-based access control (agent, buyer, seller, lender, title_company, admin)
- Authentication system with localStorage-based session management
- User profile management with company affiliations

### Transaction Management
- Complete transaction lifecycle tracking
- Property information management
- Multi-party transaction support (agents, buyers, sellers, lenders, title companies)
- Status tracking (pending, active, under_review, completed, cancelled)

### Document Management
- File upload and storage capabilities
- Document status tracking (pending, signed, under_review, approved, rejected)
- Document type categorization
- Version control and audit trails

### Task Management
- Task assignment and tracking
- Priority levels (low, medium, high, urgent)
- Due date management and overdue tracking
- Status progression (pending, in_progress, completed, overdue)

### Communication System
- Real-time messaging between transaction participants
- Message status tracking (sent, delivered, read)
- WebSocket integration for live updates
- Transaction-specific message threads

### Dashboard and Analytics
- Real-time dashboard with key metrics
- Transaction progress visualization
- Task management overview
- Recent activity feeds

## Data Flow

### Database Schema
- **Users**: Core user information with role-based permissions
- **Properties**: Property details and specifications
- **Transactions**: Central transaction management with multi-party references
- **Tasks**: Task management with assignment and tracking
- **Documents**: File management with status tracking
- **Messages**: Communication system with recipient tracking

### Real-time Updates
- WebSocket connections for live data synchronization
- Client-side state updates via TanStack Query
- Automatic UI refreshes on data changes
- Multi-user collaboration support

### API Architecture
- RESTful endpoints for CRUD operations
- WebSocket endpoints for real-time features
- Standardized response formats
- Error handling and validation

## External Dependencies

### Core Libraries
- **React**: UI framework
- **Express**: Backend framework
- **Drizzle ORM**: Database ORM with PostgreSQL
- **TanStack Query**: Server state management
- **Shadcn/ui**: UI component library
- **Tailwind CSS**: Styling framework
- **Wouter**: Client-side routing

### Database and Storage
- **PostgreSQL**: Primary database
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migration and schema management

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Build tool and development server
- **ESBuild**: Production bundling
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development
- **Dev Server**: Vite development server with hot module replacement
- **Backend**: TSX for running TypeScript directly
- **Database**: Drizzle Kit for schema management and migrations
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: Vite build with optimized bundling
- **Backend**: ESBuild compilation to ESM format
- **Database**: Drizzle migrations for schema deployment
- **Deployment**: Single Node.js process serving both frontend and API

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Build Output**: `/dist` directory for production files
- **Static Assets**: Served from `/dist/public`
- **API Routes**: Mounted on `/api` prefix

The application follows a modern full-stack architecture with real-time capabilities, designed to handle the complex workflows and multi-party interactions typical in real estate transactions. The system emphasizes user experience, data integrity, and real-time collaboration across all transaction participants.

## Recent Changes

### January 13, 2025 - Final Production Build ✅
- Fixed all TypeScript compilation errors and type mismatches
- Updated tsconfig.json with proper ES2015 target and downlevelIteration
- Corrected storage layer type handling for all entities (Users, Properties, Transactions, Tasks, Documents, Messages)
- Created comprehensive README.md with architecture diagrams and detailed documentation
- Added MIT LICENSE file for open-source distribution
- Enhanced .gitignore with comprehensive exclusions for production deployment
- Application fully functional with real-time WebSocket communication
- All API endpoints working correctly with proper error handling
- Database schema properly defined with Drizzle ORM integration

### Previous Implementation (December 2024)
- Built complete full-stack React application with TypeScript using Express.js backend
- Implemented user authentication with role-based access control for all user types
- Created comprehensive transaction management system with document handling and e-signature support
- Developed task tracking and workflow automation for closing processes
- Built real-time communication hub with WebSocket integration and messaging system