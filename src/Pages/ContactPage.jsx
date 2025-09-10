import React from 'react';
import '../index.css';


function ContactPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="AboutPage"
        style={{
          width: '100%',
          maxWidth: 700,
          margin: '0 1rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h1>Contact Us</h1>
        <p>
          Have questions, feedback, or partnership inquiries? We’d love to hear from you! Our team is dedicated to helping you get the most out of Festival Finder and making your festival experience unforgettable.
        </p>
        <p>
          <strong>Email:</strong> support@festfinder.com<br />
          <strong>Phone:</strong> (555) 123-4567<br />
          <strong>Address:</strong> 123 Festival Lane, Music City, USA
        </p>
        <p>
          We value your feedback and are always looking for ways to improve. Reach out to us for support, suggestions, or just to say hello!
        </p>
        <p>
          Stay connected with us for the latest updates, news, and festival highlights.
        </p>
      </div>
    </div>
  );
}

export default ContactPage;