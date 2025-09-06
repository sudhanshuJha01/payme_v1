import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailOTP = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({

            from: process.env.FROM_EMAIL,
            to: [email],
            subject: 'Verify your PAYME Account',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: auto;">
                <h2 style="color: #2c3e50; text-align: center;">PAYME Email Verification</h2>
                <p>Hi there,</p>
                <p>Thanks for signing up with <strong>PAYME</strong>! Please use the code below to verify your email address:</p>
                <p style="font-size: 28px; font-weight: bold; color: #27ae60; text-align: center; letter-spacing: 4px; background-color: #f2f2f2; padding: 10px; border-radius: 5px;">${otp}</p>
                <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
                <br />
                <p>— The PAYME Team</p>
              </div>
            `,
        });

        if (error) {
            throw new Error(`Resend error: ${error.message}`);
        }
        
        console.log("Email sent successfully:", data);

    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Could not send verification email');
    }
};