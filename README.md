# Library System

A full-stack library management system built with NestJS, Prisma, PostgreSQL, and React.

## Features

- **Books Management**: CRUD operations with filtering by author, availability, and search
- **Authors Management**: Full CRUD operations
- **Users Management**: Create and list users
- **Borrowing System**: Borrow and return books, track due dates
- **JWT Authentication**: Secure API endpoints with JWT tokens

## Tech Stack

### Backend
- **NestJS 11** - Node.js framework
- **Prisma 7** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **class-validator** - Request validation

### Frontend
- **React 18** (TypeScript) - UI framework
- **Vite 7** - Build tool
- **React Router 7** - Client-side routing
- **Axios** - HTTP client

## Project Structure

```
library_system/
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── authors/       # Authors CRUD module
│   │   ├── books/         # Books CRUD module
│   │   ├── borrows/       # Borrowing module
│   │   ├── users/         # Users module
│   │   └── prisma/        # Prisma service
│   └── prisma/
│       └── schema.prisma  # Database schema
├── frontend/              # React frontend
│   └── src/
│       ├── components/    # Reusable components
│       ├── context/       # Auth context
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── types/         # TypeScript types
└── docker-compose.yml     # Docker configuration
```

---

## Running the Application

### Option 1: Run Locally (Without Docker)

#### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (installed and running)
- npm or yarn

#### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Update the `DATABASE_URL` in `.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/library_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="24h"
   PORT=3000
   ```

5. Run database migrations (see Migrations section below)

6. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`

#### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Contents:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

---

### Option 2: Run with Docker

#### Prerequisites
- Docker and Docker Compose installed

#### Steps

1. Start all services:
   ```bash
   docker compose up -d
   ```

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api

3. Stop services:
   ```bash
   docker compose down
   ```

---

### Option 3: Run with Supabase (Cloud PostgreSQL)

1. Create a free account at [Supabase](https://supabase.com)

2. Create a new project and get the connection string from:
   `Settings > Database > Connection string > URI`

3. Update `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"
   ```

4. Run migrations and start the backend:
   ```bash
   cd backend
   npx prisma migrate deploy
   npm run start:dev
   ```

5. Start the frontend as described in Option 1.

---

## Migrations and Seed Data

### Running Migrations

#### Development (creates migration files)
```bash
cd backend
npx prisma migrate dev --name init
```

#### Production (applies existing migrations)
```bash
cd backend
npx prisma migrate deploy
```

#### Reset Database (drops all data and re-runs migrations)
```bash
cd backend
npx prisma migrate reset
```

### Generate Prisma Client
After any schema changes:
```bash
cd backend
npx prisma generate
```

### Seed the Database
Populate the database with sample data:
```bash
cd backend
npx prisma db seed
```

This creates:
- 3 sample authors
- 5 sample books
- 1 admin user (email: `admin@library.com`, password: `admin123`)

---

## Authentication & Testing Protected Routes

### How JWT Authentication Works

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns a JWT token (valid for 24 hours)
3. Client includes token in `Authorization` header for protected routes
4. Server validates token and processes request

### Getting a Token

#### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Login to get token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Testing Protected Routes

Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

**Example: Create an Author (Protected)**
```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "name": "J.K. Rowling",
    "bio": "British author best known for Harry Potter"
  }'
```

**Example: Create a Book (Protected)**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "title": "Harry Potter and the Sorcerer'\''s Stone",
    "isbn": "978-0747532699",
    "description": "The first book in the Harry Potter series",
    "publishedAt": "1997-06-26",
    "quantity": 5,
    "authorId": 1
  }'
```

**Example: Borrow a Book (Protected)**
```bash
curl -X POST http://localhost:3000/api/borrows/borrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "userId": 1,
    "bookId": 1
  }'
```

### Using Postman/Insomnia

1. Create a request to `POST http://localhost:3000/api/auth/login`
2. Copy the `access_token` from the response
3. In subsequent requests, go to `Authorization` tab
4. Select `Bearer Token` and paste your token

---

## API Endpoints Reference

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Authors
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/authors` | No | List all authors |
| GET | `/api/authors/:id` | No | Get author by ID |
| POST | `/api/authors` | ✅ Yes | Create new author |
| PATCH | `/api/authors/:id` | ✅ Yes | Update author |
| DELETE | `/api/authors/:id` | ✅ Yes | Delete author |

### Books
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/books` | No | List books (with filters) |
| GET | `/api/books/:id` | No | Get book by ID |
| POST | `/api/books` | ✅ Yes | Create new book |
| PATCH | `/api/books/:id` | ✅ Yes | Update book |
| DELETE | `/api/books/:id` | ✅ Yes | Delete book |

**Book Query Parameters:**
- `search` - Search in title, ISBN, description
- `authorId` - Filter by author ID
- `available` - Filter by availability (`true`/`false`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Users (All Protected ✅)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |

### Borrowing (All Protected ✅)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrows` | List all borrowings |
| GET | `/api/borrows/user/:userId` | Get user's borrowed books |
| GET | `/api/borrows/:id` | Get borrow by ID |
| POST | `/api/borrows/borrow` | Borrow a book |
| POST | `/api/borrows/return` | Return a book |

---

## Database Schema

```
┌─────────────┐       ┌─────────────┐
│   Author    │       │    User     │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ name        │       │ email       │
│ bio         │       │ password    │
│ createdAt   │       │ name        │
│ updatedAt   │       │ role        │
└──────┬──────┘       │ createdAt   │
       │              └──────┬──────┘
       │ 1:N                 │ 1:N
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│    Book     │◄──────│   Borrow    │
├─────────────┤  N:1  ├─────────────┤
│ id          │       │ id          │
│ title       │       │ userId      │
│ isbn        │       │ bookId      │
│ description │       │ borrowedAt  │
│ publishedAt │       │ dueAt       │
│ quantity    │       │ returnedAt  │
│ available   │       └─────────────┘
│ authorId    │
└─────────────┘
```

---

## Assumptions and Design Notes

### Architecture Decisions

1. **JWT Stateless Authentication**
   - Tokens are self-contained and validated without database lookup
   - 24-hour expiration for balance between security and UX
   - Tokens stored in localStorage on frontend (acceptable for this scope)

2. **Role-based Access Control (RBAC)**
   - User roles defined (USER, ADMIN) but not fully enforced
   - Prepared for future role-based restrictions
   - Currently all authenticated users have same permissions

3. **Book Availability Tracking**
   - `quantity`: Total copies owned by library
   - `available`: Copies currently available for borrowing
   - Automatically decremented on borrow, incremented on return

4. **Borrowing Rules**
   - Default 14-day loan period if `dueAt` not specified
   - Users cannot borrow same book twice simultaneously
   - Books with 0 availability cannot be borrowed
   - Books with active borrows cannot be deleted

5. **Cascade Behavior**
   - Deleting an author cascades to delete all their books
   - This is intentional for data integrity

### Assumptions Made

1. **Single Library System**: No multi-tenant support; single library instance
2. **No Fines/Penalties**: Overdue books tracked but no fine calculation
3. **No Reservations**: Users cannot reserve unavailable books
4. **Basic Search**: Text search is case-insensitive substring matching
5. **No Image Upload**: Book covers/author photos not supported
6. **Email Uniqueness**: Emails are unique identifiers for users
7. **ISBN Uniqueness**: Each book has a unique ISBN
8. **No Soft Deletes**: Records are permanently deleted

### Security Considerations

1. Passwords hashed with bcrypt (10 rounds)
2. JWT secret should be changed in production
3. CORS enabled for development (configure for production)
4. Input validation on all endpoints using class-validator
5. No rate limiting implemented (add for production)

### Known Limitations

1. No pagination on authors list
2. No email verification on registration
3. No password reset functionality
4. No refresh token mechanism
5. No audit logging

---

## Troubleshooting

### Common Issues

**"Can't reach database server"**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify port 5432 is not blocked

**"Authentication failed"**
- Verify PostgreSQL username/password in DATABASE_URL
- For local PostgreSQL, default user is often `postgres`

**"Prisma Client not generated"**
```bash
npx prisma generate
```

**"Migration failed"**
```bash
npx prisma migrate reset  # Warning: drops all data
npx prisma migrate dev
```

**"JWT Token Invalid"**
- Token may have expired (24h lifetime)
- Re-login to get a fresh token

**"CORS Error"**
- Backend is configured for localhost:5173
- For other origins, update `main.ts` CORS config

---

## License

MIT
