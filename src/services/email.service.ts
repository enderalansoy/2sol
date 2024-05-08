import nodemailer from 'nodemailer';

export const sendEmail = async (
  subject: string,
  html: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    // For well known services like Gmail, there is no further configuration
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USERNAME,
      // For Gmail, this is the generated App Password
      pass: process.env.MAIL_SECRET,
    },
  });

  transporter.sendMail(
    {
      from: process.env.MAIL_FROM,
      // This would be the actual mail for the user if we had user auth
      to: process.env.MAIL_TO,
      subject,
      html,
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info('Email sent: ' + info.response);
      }
    }
  );
};
