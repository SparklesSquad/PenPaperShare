import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res, next) => {
  try {
    const wholeToken = req.headers.authorization;
    const token = wholeToken.slice(7);

    const user = jwt.verify(token, process.env.JWT_SECRET_CODE);

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error, message: 'User not Loggged in!' });
  }
};
