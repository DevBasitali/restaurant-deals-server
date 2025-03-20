const nodemailer = require("nodemailer");
require('dotenv').config();

async function sendApprovalEmail(restaurant) {
    const adminEmail = process.env.ADMIN_EMAIL; // Replace with your admin's email
    const approvalLink = `http://localhost:5000/admin/approve/${restaurant._id}`;
    const rejectionLink = `http://localhost:5000/admin/reject/${restaurant._id}`;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or another email service
        auth: {
            user: process.env.USERS_EMAIL,
            pass: process.env.USERS_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.USERS_EMAIL,
        to: adminEmail,
        subject: 'New Restaurant Registration Approval Needed',
        html: `
            <p>A new restaurant has signed up. Please review their information:</p>
            <p><strong>Restaurant Name:</strong> ${restaurant.name}</p>
            <p><strong>Owner Email:</strong> ${restaurant.email}</p>
            <p>
                <a href="${approvalLink}">Approve</a> | 
                <a href="${rejectionLink}">Reject</a>
            </p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent to admin.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
