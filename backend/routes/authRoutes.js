import {
  sendOtpController,
  registerController,
  loginController,
  forgotPasswordController,
} from '../controller/authController.js';
import { Router } from 'express';

const router = Router();

router.post('/login', loginController);
router.post('/send-otp', sendOtpController);
router.post('/register', registerController);

// TODO:
// We need to forward the user id to the forgot password router through the params.
router.put('/forgot-password', forgotPasswordController);

export default router;
