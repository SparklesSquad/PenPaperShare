export const emailTemplateOTP = (otp, username) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <p>
          Thank you for registering with us. To complete your registration,
          please use the One-Time Password (OTP) below:
        </p>
        <span class="otp">${otp}</span>
        <p>
          This OTP is valid for the next 10 minutes. Please do not share this
          OTP with anyone.
        </p>
        <p>
          If you did not request this OTP, please ignore this email or contact
          our support team leader Mr. Sai.
        </p>
        <p>Best regards,</p>
        <p>PenPaperShare</p>
      </div>
      <div class="footer">
        <p>PenPaperShare | Ganapavaram Colony | Call Sai : +91 9182462829</p>
      </div>
    </div>
  </body>
</html>`;
};

export const emailGeneralTemplate = (username) => {
  return ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <h1>Congratulations!! Your Document has been uploaded.</h1>
      </div>
      <div class="content">
        <p>Dear ${username},</p>
        <p>
          Thank you for trusting with us. Your Document has been uploaded Successfully.
          Your document is public, and you can view your document at ${`www.penpaparshare.com`}
        </p>
        <p>Best regards,</p>
        <p>PenPaperShare</p>
      </div>
      <div class="footer">
        <p>PenPaperShare | Ganapavaram Colony | Call Sai : +91 9182462829</p>
      </div>
    </div>
  </body>
</html>`;
};
