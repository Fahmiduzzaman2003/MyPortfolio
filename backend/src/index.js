// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const twoFactorRoutes = require('./routes/twoFactor');
const migrationRoutes = require('./routes/migration');
const quickSetupRoutes = require('./routes/quickSetup');
const profileRoutes = require('./routes/profile');
const educationRoutes = require('./routes/education');
const skillsRoutes = require('./routes/skills');
const projectsRoutes = require('./routes/projects');
const researchRoutes = require('./routes/research');
const achievementsRoutes = require('./routes/achievements');
const messagesRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const codingPlatformsRoutes = require('./routes/codingPlatforms');
const coCurricularRoutes = require('./routes/coCurricular');
const experienceRoutes = require('./routes/experience');
const codingStatsRoutes = require('./routes/codingStats');
const contactInfoRoutes = require('./routes/contactInfo');
const { startKeepAlive } = require('./utils/keepAlive');
const { isRedisReady } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'http://localhost:8081', 
    'http://localhost:8082', 
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://myportfolioweb-blond.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/setup', quickSetupRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coding-platforms', codingPlatformsRoutes);
app.use('/api/co-curricular', coCurricularRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/coding-stats', codingStatsRoutes);
app.use('/api/contact-info', contactInfoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const redisStatus = isRedisReady() ? 'connected' : 'not-configured';
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    redis: redisStatus,
    cache: redisStatus === 'connected' ? 'redis' : 'in-memory'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Start database keep-alive service (pings every 12 hours)
  startKeepAlive(12);
});
