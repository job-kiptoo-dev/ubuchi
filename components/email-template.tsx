import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#1f2937', marginTop: '0' }}>New Contact Form Submission</h2>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginTop: '20px' }}>
        <p style={{ margin: '10px 0' }}>
          <strong style={{ color: '#4b5563' }}>From:</strong> {name}
        </p>
        
        <p style={{ margin: '10px 0' }}>
          <strong style={{ color: '#4b5563' }}>Email:</strong>{' '}
          <a href={`mailto:${email}`} style={{ color: '#059669' }}>
            {email}
          </a>
        </p>
        
        <p style={{ margin: '10px 0' }}>
          <strong style={{ color: '#4b5563' }}>Subject:</strong> {subject}
        </p>
        
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <strong style={{ color: '#4b5563', display: 'block', marginBottom: '10px' }}>
            Message:
          </strong>
          <p style={{ color: '#1f2937', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {message}
          </p>
        </div>
      </div>
      
      <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
        This email was sent from the Ubuchi Tea contact form
      </p>
    </div>
  </div>
);