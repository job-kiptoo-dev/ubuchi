import { Resend } from 'resend';
import { NextResponse } from "next/server";
import { EmailTemplate } from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // console.log('📧 Received form data:', { name, email, subject });

    // Validate the data
    if (!name || !email || !subject || !message) {
      console.error('❌ Validation failed: Missing fields');
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

      // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    console.log(' Attempting to send email via Resend...');

    const { data, error } = await resend.emails.send({
      from: 'Ubuchi Tea <onboarding@resend.dev>',
      to: ['hello@ubuchi.com'],
      replyTo: email,
      subject: `Get in touch: ${subject}`,
      react: EmailTemplate({ 
        name: name,
        email: email,
        subject: subject,
        message: message
      }),
    });

    if (error) {
      console.error('❌ Resend API error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    // console.log('✅ Email sent successfully!', data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error(' Unexpected error in /api/send:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}