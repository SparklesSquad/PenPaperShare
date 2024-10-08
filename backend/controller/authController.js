import User from '../schemas/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { emailTemplateOTP } from '../utils/email-template.js';

let otpStore = {};

dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: 'penpapershare@gmail.com', // Your email
    pass: 'dolj cinb pgxg ynld', // Your email password
  },
});

export const sendOtpController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing or malformed',
      });
    }
    let { email, username } = req.body;

    if (!req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing or malformed',
      });
    }

    username = username || 'User';
    const exist = await User.findOne({ email });

    if (exist) {
      return res
        .status(400)
        .json({ sucess: false, message: 'User already existed!!' });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP

    // Store OTP temporarily for the session
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 15 minutes

    otpStore[email] = { otp, otpExpires };

    // Send OTP email
    transporter.sendMail({
      from: 'penpapershare@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      html: emailTemplateOTP(otp, username),
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Please verify it.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending OTP',
      error,
    });
  }
};

export const registerController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and OTP are required!' });
    }

    // const storedOtp = req.session.otp;
    // const storedOtp = await redisClient.get(`otp:${email}`);
    const { otp: storedOtp, otpExpires } = otpStore[email];

    console.log(storedOtp, otp);

    if (!storedOtp || otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: ' OTP is invalid or expired!' });
    }

    if (storedOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: ' OTP is invalid !!' });
    }

    // If OTP is valid, complete user registration
    const { username, password, mobile } = req.body;

    if (!username || !password || !mobile) {
      return res
        .status(400)
        .json({ success: false, message: ' All the fields are required' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hash,
      mobile,
    });

    await newUser.save();

    req.session.otp = null; // Clear OTP from session

    res.status(200).json({
      success: true,
      message: 'Registered Successfully',
      data: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error while Creating user', error });
  }
};

//Login API
export const loginController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing or malformed',
      });
    }
    const { email, password } = req.body;

    if (!req.body.email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email cannot be empty!' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exists!" });
    }

    //To verify the password
    const decryptPwd = bcrypt.compareSync(password, user.password);
    if (decryptPwd) {
      let payload = {
        id: user._id,
      };
      //Sents token when user logged in
      jwt.sign(
        payload,
        process.env.JWT_SECRET_CODE,
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          return res
            .status(200)
            .json({ success: true, token, message: 'Logged in Successfully' });
        }
      );
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid Credentials !!' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Server Error!!', error });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { password, user_id } = req.body;

    if (!req.body.password || !req.body.user_id) {
      return res.status(400).json({
        success: false,
        message: 'Password and user id cannot be empty!',
      });
    }

    const user = await User.findOne({ user_id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    // We need to verify the user
    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating password',
      error,
    });
  }
};
