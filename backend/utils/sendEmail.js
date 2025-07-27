const nodemailer = require('nodemailer');

     const transporter = nodemailer.createTransport({
       host: process.env.BREVO_SMTP_SERVER,
       port: process.env.BREVO_SMTP_PORT,
       secure: false,
       auth: {
         user: process.env.BREVO_SMTP_USER,
         pass: process.env.BREVO_SMTP_KEY,
       },
     });

     exports.sendEmail = async (to, subject, text) => {
       const mailOptions = {
         from: process.env.BREVO_SENDER,
         to,
         subject,
         text,
       };

       try {
         await transporter.sendMail(mailOptions);
         console.log(`Email sent to ${to}`);
       } catch (error) {
         console.error('Brevo SMTP error:', error);
         throw new Error('Email sending failed');
       }
     };