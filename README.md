# Developer Portfolio

A modern, animated portfolio website with a complete admin panel for managing content.

## Features

- **Animated Hero Section** with floating tech logos
- **About Section** with competitive programming stats (LeetCode, Codeforces, CodeChef)
- **Skills Section** organized by categories
- **Projects Gallery** with tech stack badges
- **Research Papers** showcase
- **Achievements & Awards** display
- **Education Timeline**
- **Contact Form** with message management
- **Full Admin Panel** for content management
- **JWT Authentication** for secure access

## Quick Start

```bash
# 1. Setup MySQL database
mysql -u root -p < backend/database/schema.sql

# 2. Start backend
cd backend
cp .env.example .env   # Edit with your MySQL credentials
npm install
npm start              # Runs on http://localhost:5000

# 3. Start frontend (new terminal, from project root)
cp .env.example .env   # Edit if needed
npm install
npm run dev            # Runs on http://localhost:5173

# 4. Create admin account
# - Register at http://localhost:5173/auth
# - Run SQL: UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
# - Access admin panel at http://localhost:5173/admin
```

## Project Structure

```
├── backend/                  # Express.js + MySQL API
│   ├── database/schema.sql   # Database schema
│   ├── src/routes/           # API endpoints
│   └── .env.example          # Backend env template
│
├── src/                      # React Frontend
│   ├── components/           # UI components
│   │   ├── admin/            # Admin panel
│   │   └── ui/               # Shadcn components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/api.ts            # API client
│   └── pages/                # Page components
│
└── LOCAL_SETUP.md            # Detailed setup guide
```

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, React Query

**Backend:** Express.js, MySQL, JWT, Multer

## Documentation

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for comprehensive setup instructions and API reference.

---

Built with React, Express.js, and MySQL
