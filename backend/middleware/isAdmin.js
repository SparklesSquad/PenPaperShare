import dotenv from 'dotenv';
import User from '../schemas/user.js';

dotenv.config();

export default async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    
    if (user.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      res.status(500).json({
        message: 'Not an admin !!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Not an admin in catch!!',
    });
  }
};
