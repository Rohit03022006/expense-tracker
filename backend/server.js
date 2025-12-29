const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean); 
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin === allowedOrigin + '/' ||
      origin.replace(/\/$/, '') === allowedOrigin.replace(/\/$/, '')
    )) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Expense Tracker API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    cors: {
      frontendUrl: process.env.FRONTEND_URL,
      allowedOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173']
    }
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is connected successfully!',
    data: {
      server: 'Express.js',
      database: 'MongoDB',
      status: 'Active',
      cors: {
        frontendUrl: process.env.FRONTEND_URL,
        allowed: true
      }
    }
  });
});

app.use(errorHandler);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception thrown:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Frontend: ${process.env.FRONTEND_URL}`);
    console.log(`CORS configured for: ${process.env.FRONTEND_URL}`);
    console.log(`Backend ready!`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});