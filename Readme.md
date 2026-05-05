# TaskFlow – Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

## 🚀 Live Demo
[https://team-task-manager-1-yls6.onrender.com](https://team-task-manager-1-yls6.onrender.com)

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React.js (Vite)         |
| Backend    | Node.js + Express.js    |
| Database   | MongoDB Atlas           |
| Auth       | JWT (JSON Web Tokens)   |
| Deployment | Railway.app             |

## ✨ Features

- 🔐 Authentication – Signup & Login with JWT
- 👥 Role-Based Access – Admin and Member roles
- 📁 Project Management – Create, edit, delete projects (Admin only)
- ✅ Task Management – Create, assign, update, delete tasks
- 📊 Dashboard – Live stats: total tasks, overdue, completed
- 🔍 Task Filtering – Filter by status (Todo, In Progress, Done)
- ↩️ Undo Delete – 5-second undo on task deletion
- ⚠️ Overdue Detection – Highlights tasks past due date

## 👤 Role Permissions

| Feature                  | Admin | Member |
|--------------------------|-------|--------|
| View Projects            | ✅    | ✅     |
| Create/Edit/Delete Projects | ✅ | ❌     |
| Create/Assign Tasks      | ✅    | ❌     |
| Update Task Status       | ✅    | ✅     |
| View Dashboard           | ✅    | ✅     |

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### 1. Clone the repository
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager

### 2. Backend Setup
cd backend
npm install

Create a .env file:
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key

npm run dev

### 3. Frontend Setup
cd frontend
npm install
npm run dev

### 4. Open in browser
http://localhost:5173

## 📁 Project Structure

team-task-manager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Projects.jsx
        │   ├── Tasks.jsx
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── App.jsx

## 🔗 API Endpoints

### Auth
| Method | Endpoint           | Description        | Access |
|--------|--------------------|--------------------|--------|
| POST   | /api/auth/signup   | Register user      | Public |
| POST   | /api/auth/login    | Login user         | Public |
| GET    | /api/auth/me       | Get current user   | Auth   |
| GET    | /api/auth/users    | Get all users      | Auth   |

### Projects
| Method | Endpoint           | Description        | Access |
|--------|--------------------|--------------------|--------|
| GET    | /api/projects      | Get all projects   | Auth   |
| POST   | /api/projects      | Create project     | Admin  |
| PUT    | /api/projects/:id  | Update project     | Admin  |
| DELETE | /api/projects/:id  | Delete project     | Admin  |

### Tasks
| Method | Endpoint           | Description        | Access |
|--------|--------------------|--------------------|--------|
| GET    | /api/tasks         | Get all tasks      | Auth   |
| POST   | /api/tasks         | Create task        | Admin  |
| PUT    | /api/tasks/:id     | Update task        | Auth   |
| DELETE | /api/tasks/:id     | Delete task        | Admin  |

## 🌐 Deployment
Deployed on Railway.app

## 👨‍💻 Author
Ayush – Full Stack Developer
