import User from '../schemas/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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
      return res.status(400).send('Request body is missing or malformed');
    }
    let { email, username } = req.body;
    username = username || 'User';
    const exist = await User.findOne({ email });

    if (!req.body.email) {
      return res.status(400).send('Email cannot be empty!');
    }

    if (exist) {
      return res.status(400).send('User already existed!!');
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP

    // Store OTP temporarily for the session
    const otpExpires = Date.now() + 1 * 60 * 1000; // OTP expires in 15 minutes
    req.session.otp = { otp, expires: otpExpires };

    // Send OTP email
    await transporter.sendMail({
      from: 'penpapershare@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      html: emailDescription(otp, username),
    });

    res.status(200).send('OTP sent successfully. Please verify it.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while sending OTP');
  }
};

//Register API
// export const registerController = async (req, res) => {
//   try {
//     const { username, email, password, mobile } = req.body;

//     //To generate unique userid
//     const maxUser = await User.findOne({}, {}, { sort: { userid: -1 } });
//     let newUserId = 1;
//     if (maxUser) {
//       newUserId = maxUser.userid + 1;
//     }

//     //Password encryption
//     let encryptPwd = password;
//     bcrypt.hash(password, 10, async function (err, hash) {
//       if (err) {
//         console.error(err);
//         return res.status(400).send('Error while encrypting the password!');
//       }
//       encryptPwd = hash;

//       let newUser = new User({
//         userid: newUserId,
//         username: username,
//         email: email,
//         password: encryptPwd,
//         mobile: mobile,
//       });
//       await newUser.save();
//       return res.status(200).send('Registered Successfully');
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send('Server Error!!');
//   }
// };

export const registerController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send('Email and OTP are required!');
    }

    const storedOtp = req.session.otp;

    if (!storedOtp || storedOtp.expires < Date.now()) {
      return res.status(400).send('OTP is invalid or expired.');
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).send('Invalid OTP.');
    }

    // If OTP is valid, complete user registration
    const { username, password, mobile } = req.body;
    const hash = await bcrypt.hash(password, 10);

    //   To generate unique userid
    const maxUser = await User.findOne({}, {}, { sort: { userid: -1 } });
    let newUserId = 1;
    if (maxUser) {
      newUserId = maxUser.userid + 1;
    }

    const newUser = new User({
      userid: newUserId,
      username,
      email,
      password: hash,
      mobile,
    });

    await newUser.save();
    req.session.otp = null; // Clear OTP from session
    res.status(200).send('Registered successfully!');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error!');
  }
};

//Login API
export const loginController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send('Request body is missing or malformed');
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!req.body.email) {
      return res.status(400).send('Email cannot be empty!');
    }

    if (!user) {
      return res.status(404).send("User doesn't exists!");
    }

    //To verify the password
    const decryptPwd = bcrypt.compareSync(password, user.password);
    if (decryptPwd) {
      let payload = {
        user: {
          id: user.id,
        },
      };

      //Sents token when user logged in
      jwt.sign(payload, 'jwtPassword', { expiresIn: 3600000 }, (err, token) => {
        if (err) throw err;
        return res.json({ token, message: 'Logged in Successfully' });
      });
    } else {
      return res.status(404).send('Invalid Credentials !!');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error!!');
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;
    console.log('Forgot Password API called');
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).send('User not found');
    }
    // We need to verify the user
    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    await user.save();
    res.status(200).send('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while updating password');
  }
};
