const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

//Test Email Configuration
transporter.verify((error, success) => {
    if (error) {
        console.log("Email configuration error:");
        console.log(error);
    } else {
        console.log("Email server is ready");
    }
});

module.exports = transporter;