import nodemailer from 'nodemailer';

/**
 * Sends an email with the specified subject and HTML content.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent or rejects with an error.
 */
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
