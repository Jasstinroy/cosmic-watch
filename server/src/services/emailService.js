import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

export const sendRiskAlert = async (userEmail, username, asteroid) => {
  const mailOptions = {
    from: `"Cosmic Watch DSN" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🚨 CRITICAL ALERT: Asteroid ${asteroid.name} Approaching`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #ff4d4d; border-bottom: 2px solid #ff4d4d; padding-bottom: 10px;">⚠️ Hazardous Approach Detected</h2>
        <p>Hello <strong>${username}</strong>,</p>
        <p>Our Deep Space Network has detected an object matching your risk criteria:</p>
        
        <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #38bdf8;">☄️ ${asteroid.name}</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Risk Score:</strong> <span style="color: #ff4d4d;">${asteroid.riskScore}/100</span></li>
            <li><strong>Velocity:</strong> ${parseFloat(asteroid.velocity).toLocaleString()} km/h</li>
            <li><strong>Miss Distance:</strong> ${parseFloat(asteroid.distance).toLocaleString()} km</li>
            <li><strong>Diameter:</strong> ${asteroid.diameter} m</li>
          </ul>
        </div>

        <p style="font-size: 12px; color: #94a3b8;">
          You received this email because your Alert Threshold is set to <strong>Risk Score > ${asteroid.riskScore}</strong>.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173/dashboard" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Live Telemetry</a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};