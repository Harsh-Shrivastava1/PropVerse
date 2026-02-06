const nodemailer = require('nodemailer');

// Configure transporter (Mock for now, or replace with SendGrid/SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Placeholder
    auth: {
        user: 'notifications@estateos.app',
        pass: 'your-app-password'
    }
});

exports.sendEmail = async (to, subject, text) => {
    try {
        console.log(`Sending email to ${to}: ${subject}`);
        // await transporter.sendMail({ from: 'Propvera Team <no-reply@propvera.app>', to, subject, text });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};
