import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminAnalyticsRoutes from './routes/adminAnalyticsRoutes.js';
import userAnalyticsRoutes from './routes/userAnalyticsRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // Middleware to parse JSON data
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(cors());

// Session Management
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

const port = 5001;

//database connection
mongoose
  .connect(
    'mongodb+srv://penpapershare:pps$rjms@penpapersharecluster.cenh6n2.mongodb.net/penpapershare?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log('DB Connection Failed', err));

// Redirection
app.use('/auth', authRoutes);
app.use('/document', documentRoutes);
app.use('/rating', ratingRoutes);
app.use('/admin', adminRoutes);
app.use('/user/analytics', userAnalyticsRoutes);
app.use('/admin/analytics', adminAnalyticsRoutes);

// API
app.get('/', async (req, res) => {
  try {
    res.status(500).json({
      message: 'Welcome to PenPaperShare !! ',
    });
  } catch (error) {
    return res.status(500).json({ error, message: 'Server Error!!' });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
