# Local Development Setup Guide

Complete guide to run this portfolio application locally with Express.js backend and MySQL database.

## Prerequisites

- **Node.js** v18 or higher
- **MySQL** v8 or higher
- **npm** or **yarn**

## Project Structure

```
├── backend/                    # Express.js Backend
│   ├── database/
│   │   └── schema.sql          # MySQL database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # MySQL connection config
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Login/Register endpoints
│   │   │   ├── profile.js      # Profile CRUD
│   │   │   ├── education.js    # Education CRUD
│   │   │   ├── skills.js       # Skills & categories CRUD
│   │   │   ├── projects.js     # Projects CRUD
│   │   │   ├── research.js     # Research CRUD
│   │   │   ├── achievements.js # Achievements CRUD
│   │   │   ├── messages.js     # Contact messages CRUD
│   │   │   ├── codingPlatforms.js # Coding stats CRUD
│   │   │   └── upload.js       # File upload handling
│   │   └── index.js            # Express server entry point
│   ├── uploads/                # Uploaded files directory
│   ├── .env.example            # Environment template
│   └── package.json            # Backend dependencies
│
├── src/                        # React Frontend
│   ├── components/
│   │   ├── admin/              # Admin panel components
│   │   │   ├── AdminProfile.tsx
│   │   │   ├── AdminEducation.tsx
│   │   │   ├── AdminSkills.tsx
│   │   │   ├── AdminProjects.tsx
│   │   │   ├── AdminResearch.tsx
│   │   │   ├── AdminAchievements.tsx
│   │   │   ├── AdminCodingPlatforms.tsx
│   │   │   ├── AdminMessages.tsx
│   │   │   └── AdminCV.tsx
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── HeroSection.tsx     # Landing hero
│   │   ├── AboutSection.tsx    # About with coding stats
│   │   ├── SkillsSection.tsx   # Skills display
│   │   ├── ProjectsSection.tsx # Projects gallery
│   │   ├── ResearchSection.tsx # Research papers
│   │   ├── AchievementsSection.tsx
│   │   ├── EducationSection.tsx
│   │   └── ContactSection.tsx  # Contact form
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── hooks/
│   │   └── usePortfolioData.ts # React Query data hooks
│   ├── lib/
│   │   ├── api.ts              # API client (all backend calls)
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── Index.tsx           # Main portfolio page
│   │   ├── Auth.tsx            # Login/Register page
│   │   ├── Admin.tsx           # Admin dashboard
│   │   └── NotFound.tsx        # 404 page
│   └── index.css               # Global styles & design tokens
│
├── .env.example                # Frontend env template
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Frontend dependencies
```

## Quick Start

### Step 1: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source backend/database/schema.sql

# Exit MySQL
exit
```

### Step 2: Backend Setup

```bash
cd backend

# Create environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=portfolio_db
# JWT_SECRET=your-secret-key-change-this
# PORT=5000

# Install dependencies
npm install

# Start server
npm start
```

Backend runs at: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# In project root (not backend folder)
cd ..

# Create environment file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Step 4: Create Admin Account

1. Go to `http://localhost:5173/auth`
2. Register a new account
3. Promote to admin in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

4. Login and access `/admin`

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000

# File uploads
UPLOAD_PATH=./uploads
```

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile` | Get profile | No |
| PUT | `/api/profile` | Update profile | Yes |

### Education
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/education` | List all | No |
| POST | `/api/education` | Create | Yes |
| PUT | `/api/education/:id` | Update | Yes |
| DELETE | `/api/education/:id` | Delete | Yes |

### Skills
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/skills/categories` | List categories with skills | No |
| POST | `/api/skills/categories` | Create category | Yes |
| PUT | `/api/skills/categories/:id` | Update category | Yes |
| DELETE | `/api/skills/categories/:id` | Delete category | Yes |
| POST | `/api/skills` | Create skill | Yes |
| PUT | `/api/skills/:id` | Update skill | Yes |
| DELETE | `/api/skills/:id` | Delete skill | Yes |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | List all | No |
| POST | `/api/projects` | Create | Yes |
| PUT | `/api/projects/:id` | Update | Yes |
| DELETE | `/api/projects/:id` | Delete | Yes |

### Research
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/research` | List all | No |
| POST | `/api/research` | Create | Yes |
| PUT | `/api/research/:id` | Update | Yes |
| DELETE | `/api/research/:id` | Delete | Yes |

### Achievements
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/achievements` | List all | No |
| POST | `/api/achievements` | Create | Yes |
| PUT | `/api/achievements/:id` | Update | Yes |
| DELETE | `/api/achievements/:id` | Delete | Yes |

### Coding Platforms
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/coding-platforms` | List all | No |
| POST | `/api/coding-platforms` | Create | Yes |
| PUT | `/api/coding-platforms/:id` | Update | Yes |
| DELETE | `/api/coding-platforms/:id` | Delete | Yes |

### Messages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/messages` | List all | Yes |
| POST | `/api/messages` | Submit (from contact form) | No |
| PATCH | `/api/messages/:id/read` | Mark as read | Yes |
| DELETE | `/api/messages/:id` | Delete | Yes |

### File Upload
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload` | Upload file | Yes |
| DELETE | `/api/upload/:filename` | Delete file | Yes |

## Key Files for Customization

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | All API calls - modify endpoints here |
| `src/hooks/usePortfolioData.ts` | React Query hooks for data fetching |
| `src/contexts/AuthContext.tsx` | Authentication logic |
| `src/index.css` | Global styles & design system tokens |
| `tailwind.config.ts` | Tailwind theme configuration |
| `src/components/HeroSection.tsx` | Hero section customization |
| `src/components/AboutSection.tsx` | About & coding stats section |
| `backend/database/schema.sql` | Database structure |

## Troubleshooting

### Backend won't start
- Check MySQL is running: `systemctl status mysql` or `brew services list`
- Verify database credentials in `backend/.env`
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify `VITE_API_URL` in `.env` matches backend URL
- Check CORS settings in `backend/src/index.js`
- Ensure backend is running

### Database errors
- Run schema again: `mysql -u root -p < backend/database/schema.sql`
- Check MySQL user has proper permissions

### Authentication issues
- Clear localStorage in browser
- Check JWT_SECRET is set in backend `.env`
- Verify user role in database

### File uploads not working
- Create `backend/uploads/` folder if missing
- Check write permissions on uploads folder

## Production Deployment

### Build Frontend
```bash
npm run build
# Output in dist/ folder
```

### Backend Considerations
- Set secure `JWT_SECRET`
- Configure proper CORS origins
- Use environment variables for all secrets
- Enable HTTPS
- Use connection pooling for MySQL

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React Query (data fetching)
- React Router (routing)

### Backend
- Express.js
- MySQL
- JWT Authentication
- Multer (file uploads)
- bcrypt (password hashing)
