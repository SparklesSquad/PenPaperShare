import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import User from './schemas/user.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// app.use();
// Middleware to parse JSON data
app.use(cors());
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

app.use('/auth', authRoutes);
app.use('/document', documentRoutes);
app.use('/rating', ratingRoutes)

// API
app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error!!');
  }
});

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
