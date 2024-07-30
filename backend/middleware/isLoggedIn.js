import express from 'express';
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET_CODE);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send('User not Loggged in!');
  }
};
