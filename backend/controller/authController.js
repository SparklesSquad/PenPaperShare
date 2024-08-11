import User from '../schemas/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const emailDescription = (otp, username) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
         body {
            font-family: Arial, sans-serif;
            background-color: #f7f4ef;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        .header {
            background-color: #2e4a62;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .footer {
            background-color: #2e4a62;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            font-size: 12px;
        }
        .otp {
            display: block;
            margin: 20px 0;
            font-size: 24px;
            font-weight: bold;
            color: #2e4a62;
            text-align: center;
        }
        a {
            color: #2e4a62;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Dear ${username},</p>
            <p>Thank you for registering with us. To complete your registration, please use the One-Time Password (OTP) below:</p>
            <span class="otp">${otp}</span>
            <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
            <p>If you did not request this OTP, please ignore this email or contact our support team leader Mr. Sai.</p>
            <p>Best regards,</p>
            <p>PenPaperShare</p>
        </div>
        <div class="footer">
            <p>PenPaperShare | Ganapavaram Colony  | Call Sai : +91 9182462829</p>
        </div>
    </div>
</body>
</html>

`;

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
      return res.status(400).send('User already existed!!');
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP

    // Store OTP temporarily for the session
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 15 minutes
    req.session.otp = { otp, expires: otpExpires };

    // Send OTP email
    await transporter.sendMail({
      from: 'penpapershare@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      html: emailDescription(otp, username),
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Please verify it.',
    });
  } catch (error) {
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

    const storedOtp = req.session.otp;

    if (!storedOtp || storedOtp.expires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: ' OTP is invalid or expired!' });
    }

    if (storedOtp.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: ' OTP is invalid !!' });
    }

    // If OTP is valid, complete user registration
    const { username, password, mobile } = req.body;

    if (!username || !password || mobile) {
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
    return res
      .status(500)
      .json({
        success: false,
        message: 'Server error while updating password',
        error,
      });
  }
};
