# Personal Notes API

A RESTful backend API for managing personal notes with JWT authentication, built using Node.js, Express, and Prisma ORM.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete notes
- Search notes by title
- Filter notes by tags
- Pin/Unpin notes
- Archive/Unarchive notes
- Soft delete and restore notes
- Sort by creation or last updated date

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken + bcryptjs)
- **Validation:** express-validator

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aakashamy777/Personal_notes_ApProject.git
   cd Personal_notes_ApProject
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database URL and JWT secret.

5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the server:
   ```bash
   npm start
   ```

The API will be running at `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### Notes (all require JWT)
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| POST   | `/api/notes`              | Create a note        |
| GET    | `/api/notes`              | Get all notes        |
| GET    | `/api/notes/:id`          | Get a note by ID     |
| PUT    | `/api/notes/:id`          | Update a note        |
| DELETE | `/api/notes/:id`          | Soft delete a note   |
| PATCH  | `/api/notes/:id/restore`  | Restore deleted note |
| PATCH  | `/api/notes/:id/pin`      | Toggle pin status    |
| PATCH  | `/api/notes/:id/archive`  | Toggle archive status|
