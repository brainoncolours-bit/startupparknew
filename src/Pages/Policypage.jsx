import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ─── Policy Content ────────────────────────────────────────────────────────────

const POLICIES = {
  'refund-policy': {
    title: 'Refund Policy',
    lastUpdated: 'June 2026',
    sections: [
      {
        body: 'Startup Park provides membership-based access, startup ecosystem services, events, networking opportunities, and community programs through the Founders Card membership program.'
      },
      {
        heading: 'Membership Purchases',
        body: 'All Founders Card memberships are considered digital service purchases. Once a membership has been successfully activated, fees are generally non-refundable.'
      },
      {
        heading: 'Eligible Refund Situations',
        body: 'Refund requests may be considered in the following situations:',
        list: [
          'Duplicate payment due to technical error',
          'Payment successfully completed but membership not activated',
          'Incorrect amount charged because of a system issue',
          'Transaction failure where funds were deducted but services were not provided'
        ]
      },
      {
        heading: 'Non-Refundable Situations',
        body: 'Refunds will not be provided for:',
        list: [
          'Change of mind',
          'Failure to attend events',
          'Failure to utilize membership benefits',
          'Personal scheduling conflicts',
          'Partial use of membership services',
          'Membership suspension due to policy violations'
        ]
      },
      {
        heading: 'Event Changes',
        body: 'Startup Park may occasionally reschedule, modify, or cancel events. In such cases, Startup Park may provide alternative access, rescheduled participation, or other reasonable accommodations at its discretion.'
      },
      {
        heading: 'Refund Processing',
        body: 'Approved refunds will be processed through the original payment method. Processing may take approximately 5–10 business days depending on the payment provider and banking institution.'
      },
      {
        heading: 'Contact Us',
        body: 'For refund-related inquiries, please contact:',
        contact: 'info@thestartuppark.com',
        contactNote: 'Please include:',
        list: [
          'Full Name',
          'Registered Email Address',
          'Transaction Reference Number',
          'Reason for Request'
        ]
      }
    ]
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'June 2026',
    sections: [
      {
        body: 'Startup Park ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, purchase a Founders Card membership, register for events, or use our services.'
      },
      {
        heading: 'Information We Collect',
        body: 'We may collect the following information:',
        subSections: [
          {
            subHeading: 'Personal Information',
            list: [
              'Full Name',
              'Email Address',
              'Phone Number',
              'Company or Startup Name',
              'Professional Information',
              'Membership Information',
              'Event Registration Details'
            ]
          },
          {
            subHeading: 'Technical Information',
            list: [
              'IP Address',
              'Browser Type',
              'Device Information',
              'Website Usage Data',
              'Cookies and Analytics Information'
            ]
          }
        ]
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use your information to:',
        list: [
          'Process memberships and registrations',
          'Provide access to Startup Park services and benefits',
          'Manage events and community programs',
          'Communicate important updates and announcements',
          'Improve our platform and user experience',
          'Prevent fraud and unauthorized activities',
          'Comply with legal obligations'
        ]
      },
      {
        heading: 'Payment Information',
        body: 'Payments are processed through secure third-party payment gateways. Startup Park does not store complete debit card, credit card, or banking information on its servers.'
      },
      {
        heading: 'Information Sharing',
        body: 'We do not sell, rent, or trade your personal information. Information may be shared with:',
        list: [
          'Trusted service providers supporting our operations',
          'Event partners when required for participation',
          'Legal authorities when required by applicable law'
        ]
      },
      {
        heading: 'Data Security',
        body: 'We implement reasonable technical and organizational measures to protect your information against unauthorized access, misuse, loss, or disclosure.'
      },
      {
        heading: 'Cookies',
        body: 'Our website may use cookies and similar technologies to improve functionality, analyze usage patterns, and enhance user experience. You may choose to disable cookies through your browser settings.'
      },
      {
        heading: 'Third-Party Links',
        body: 'Our website may contain links to external websites. Startup Park is not responsible for the privacy practices or content of third-party websites.'
      },
      {
        heading: 'Your Rights',
        body: 'You may request:',
        list: [
          'Access to your personal information',
          'Correction of inaccurate information',
          'Deletion of information where legally permitted'
        ]
      },
      {
        heading: 'Changes to This Policy',
        body: 'Startup Park reserves the right to update this Privacy Policy at any time. Updated versions will be posted on this page.'
      },
      {
        heading: 'Contact Us',
        body: 'Startup Park',
        contact: 'info@thestartuppark.com'
      }
    ]
  },

  'terms-and-conditions': {
    title: 'Terms & Conditions',
    lastUpdated: 'June 2026',
    sections: [
      {
        body: 'By accessing or using Startup Park, you agree to be bound by these Terms & Conditions.'
      },
      {
        heading: 'Acceptance of Terms',
        body: 'By using our website, registering for events, purchasing a Founders Card membership, or accessing any Startup Park services, you agree to comply with these Terms.'
      },
      {
        heading: 'About Startup Park',
        body: 'Startup Park is an entrepreneur-focused ecosystem providing networking opportunities, startup events, mentorship programs, educational resources, partnerships, and community engagement through various membership offerings.'
      },
      {
        heading: 'Founders Card Membership',
        body: 'Startup Park offers membership plans through the Founders Card program. Membership benefits may include:',
        list: [
          'Event access',
          'Networking opportunities',
          'Community participation',
          'Educational programs',
          'Partner benefits',
          'Exclusive startup ecosystem resources'
        ],
        listNote: 'Benefits may vary depending on the selected membership tier.'
      },
      {
        heading: 'User Responsibilities',
        body: 'You agree to:',
        list: [
          'Provide accurate information.',
          'Maintain the confidentiality of your account.',
          'Use Startup Park services lawfully.',
          'Refrain from fraudulent, abusive, or unauthorized activities.'
        ]
      },
      {
        heading: 'Events and Programs',
        body: 'Startup Park reserves the right to:',
        list: [
          'Modify event schedules',
          'Change speakers or facilitators',
          'Update event formats',
          'Reschedule events',
          'Cancel events when necessary'
        ]
      },
      {
        heading: 'Intellectual Property',
        body: 'All content, branding, logos, designs, graphics, text, videos, and materials available on Startup Park are the property of Startup Park unless otherwise stated. Unauthorized reproduction, distribution, or commercial use is prohibited.'
      },
      {
        heading: 'Membership Changes',
        body: 'Startup Park may update membership plans, pricing, features, benefits, and eligibility requirements from time to time.'
      },
      {
        heading: 'Limitation of Liability',
        body: 'Startup Park shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of its services, events, memberships, or website.'
      },
      {
        heading: 'Account Suspension',
        body: 'Startup Park reserves the right to suspend or terminate access for users who violate these Terms or engage in activities harmful to the community or platform.'
      },
      {
        heading: 'Governing Law',
        body: 'These Terms shall be governed by and interpreted in accordance with the laws of India.'
      },
      {
        heading: 'Contact Information',
        body: 'Startup Park',
        contact: 'info@thestartuppark.com'
      }
    ]
  }
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PolicyPage() {
  const { policySlug } = useParams();
  const navigate = useNavigate();
  const policy = POLICIES[policySlug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [policySlug]);

  if (!policy) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#040405',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Syne', 'DM Sans', sans-serif",
        color: 'rgba(255,255,255,0.5)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Policy not found.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(100,200,255,0.3)',
              color: '#64c8ff',
              padding: '0.6rem 1.4rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'inherit'
            }}
          >
            ← Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040405',
      fontFamily: "'Syne', 'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated top scanner bar — matches footer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #64c8ff, #ffffff, #3a8ecb, transparent)',
        backgroundSize: '200% 100%',
        animation: 'topScanMove 4s linear infinite',
        zIndex: 100
      }} />

      {/* Geometric grid overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.004) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.004) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Radial ambient glow */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(ellipse, rgba(100,200,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '6rem 2rem 5rem',
        position: 'relative',
        zIndex: 2
      }}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)',
            padding: '0.45rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'inherit',
            marginBottom: '3rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#64c8ff';
            e.currentTarget.style.borderColor = 'rgba(100,200,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          ← Back
        </button>

        {/* Title block */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '6px', height: '6px', background: '#64c8ff', flexShrink: 0 }} />
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 900,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#64c8ff'
            }}>
              Legal Documents //
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            {policy.title}
          </h1>

          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.25)',
            marginTop: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Last Updated: {policy.lastUpdated}
          </p>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(100,200,255,0.3), rgba(100,200,255,0.05), transparent)',
            marginTop: '2rem'
          }} />
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {policy.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 0.75rem',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}>
                  {section.heading}
                </h2>
              )}

              {section.body && (
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0 0 0.75rem'
                }}>
                  {section.body}
                </p>
              )}

              {/* Sub-sections (e.g. Privacy Policy — Personal Info & Technical Info) */}
              {section.subSections && section.subSections.map((sub, j) => (
                <div key={j} style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(100,200,255,0.15)' }}>
                  <h3 style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                    margin: '0 0 0.6rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {sub.subHeading}
                  </h3>
                  <ul style={{ margin: 0, padding: '0 0 0 1.2rem' }}>
                    {sub.list.map((item, k) => (
                      <li key={k} style={{
                        fontSize: '0.88rem',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.45)',
                        paddingLeft: '0.25rem'
                      }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Main list */}
              {section.list && (
                <ul style={{ margin: '0.25rem 0 0', padding: '0 0 0 1.2rem' }}>
                  {section.list.map((item, k) => (
                    <li key={k} style={{
                      fontSize: '0.88rem',
                      lineHeight: 1.8,
                      color: 'rgba(255,255,255,0.45)',
                      paddingLeft: '0.25rem'
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Optional note after list */}
              {section.listNote && (
                <p style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.35)',
                  margin: '0.75rem 0 0',
                  fontStyle: 'italic'
                }}>
                  {section.listNote}
                </p>
              )}

              {/* Contact note before contact email */}
              {section.contactNote && (
                <p style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0.75rem 0 0.25rem'
                }}>
                  {section.contactNote}
                </p>
              )}

              {/* Email contact */}
              {section.contact && (
                <a
                  href={`mailto:${section.contact}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    fontSize: '0.88rem',
                    color: '#64c8ff',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(100,200,255,0.3)',
                    paddingBottom: '1px',
                    transition: 'color 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64c8ff';
                    e.currentTarget.style.borderColor = 'rgba(100,200,255,0.3)';
                  }}
                >
                  {section.contact}
                </a>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes topScanMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}