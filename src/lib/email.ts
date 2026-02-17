import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendCertificateEmailParams {
  to: string;
  studentName: string;
  taskTitle: string;
  certificateUrl: string;
}

export async function sendCertificateEmail({
  to,
  studentName,
  taskTitle,
  certificateUrl,
}: SendCertificateEmailParams) {
  try {
    console.log('Sending certificate email with params:', {
      to,
      studentName,
      taskTitle,
      certificateUrl,
      apiKeyExists: !!process.env.RESEND_API_KEY,
      apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8)
    });

    const { data, error } = await resend.emails.send({
      from: 'Student Programs <onboarding@resend.dev>',
      to: [to],
      subject: `🎉 Congratulations! Your Certificate for ${taskTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Certificate</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Congratulations!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear ${studentName},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                We're thrilled to inform you that you have successfully completed <strong>${taskTitle}</strong>!
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                Your hard work and dedication have paid off. Your certificate is now ready!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${certificateUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 40px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          font-size: 16px; 
                          font-weight: bold;
                          display: inline-block;">
                  Download Certificate
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Keep up the great work!
              </p>
              
              <p style="font-size: 14px; color: #666;">
                Best regards,<br>
                Student Programs Team
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', {
        name: error.name,
        message: error.message,
        error: JSON.stringify(error, null, 2)
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully via Resend:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Email service error:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack
    });
    throw error;
  }
}
