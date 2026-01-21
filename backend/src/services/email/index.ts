import { Resend } from 'resend';
import { config } from '../../config';

const resend = config.resend.apiKey ? new Resend(config.resend.apiKey) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private async send(options: EmailOptions): Promise<void> {
    if (!resend) {
      console.log('Email service not configured. Would send:', options.subject, 'to', options.to);
      return;
    }

    try {
      await resend.emails.send({
        from: config.resend.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .feature:last-child { border-bottom: none; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to CV Builder!</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for joining CV Builder! You're now ready to create professional, ATS-optimized CVs and cover letters tailored to any job.</p>
            
            <div class="features">
              <h3>🚀 Get started with your free credits:</h3>
              <div class="feature">✨ <strong>3 Free AI Generations</strong> - Create tailored CVs and cover letters</div>
              <div class="feature">📄 <strong>Professional Templates</strong> - Choose from multiple designs</div>
              <div class="feature">🎯 <strong>ATS Optimization</strong> - Beat applicant tracking systems</div>
              <div class="feature">📥 <strong>PDF Downloads</strong> - Export your documents instantly</div>
            </div>
            
            <center>
              <a href="${config.frontendUrl}/dashboard" class="button">Go to Dashboard →</a>
            </center>
            
            <p>Need help? Just reply to this email and we'll assist you.</p>
            <p>Best of luck with your job search! 🍀</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CV Builder. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: '🎉 Welcome to CV Builder - Your AI-Powered Career Assistant',
      html,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Please click the button below to verify your email address:</p>
            <center>
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </center>
            <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
            <p style="color: #64748b; font-size: 14px;">
              This link will expire in 24 hours.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: 'Verify your CV Builder account',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
              If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #64748b; font-size: 14px;">
              This link will expire in 1 hour.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: 'Reset your CV Builder password',
      html,
    });
  }

  async sendLowCreditsWarning(email: string, name: string, balance: number): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .balance { font-size: 48px; font-weight: bold; color: #f59e0b; text-align: center; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Low Credits Warning</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Your CV Builder credit balance is running low:</p>
            <p class="balance">${balance} credits</p>
            <p>Top up now to continue creating professional CVs and cover letters without interruption.</p>
            <center>
              <a href="${config.frontendUrl}/dashboard/credits" class="button">Buy Credits</a>
            </center>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: '⚠️ Your CV Builder credits are running low',
      html,
    });
  }

  async sendPurchaseConfirmation(
    email: string,
    name: string,
    credits: number,
    amount: number,
    currency: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .row:last-child { border-bottom: none; font-weight: bold; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Successful!</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for your purchase! Your credits have been added to your account.</p>
            
            <div class="receipt">
              <h3>Receipt</h3>
              <div class="row">
                <span>Credits Purchased</span>
                <span>${credits} credits</span>
              </div>
              <div class="row">
                <span>Amount Paid</span>
                <span>${currency} ${amount.toFixed(2)}</span>
              </div>
              <div class="row">
                <span>Date</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <center>
              <a href="${config.frontendUrl}/dashboard" class="button">Start Creating</a>
            </center>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: '✅ CV Builder - Payment Confirmation',
      html,
    });
  }

  async sendDocumentReadyEmail(email: string, name: string, documentType: string, documentName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Your ${documentType} is Ready!</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Great news! Your ${documentType.toLowerCase()} "<strong>${documentName}</strong>" has been generated and is ready for download.</p>
            <center>
              <a href="${config.frontendUrl}/dashboard/documents" class="button">View Document</a>
            </center>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: `📄 Your ${documentType} is ready - ${documentName}`,
      html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
