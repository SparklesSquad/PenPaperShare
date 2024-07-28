import nodemailer from 'nodemailer';

const transporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create transporter');
  }
};
