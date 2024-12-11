const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    port: 2525,
    host: "smtp.elasticemail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    secure: false,  // Use STARTTLS
    tls: {
        rejectUnauthorized: false,
    }
});

module.exports = transporter;
