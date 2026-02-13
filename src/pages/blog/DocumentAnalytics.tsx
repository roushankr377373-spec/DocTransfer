import React from 'react';
import { Link } from 'react-router-dom';
import BlogLayout from '../../components/BlogLayout';

const DocumentAnalytics: React.FC = () => {
    return (
        <BlogLayout
            title="Document Analytics: How to Track Who Views Your Files"
            description="Stop guessing if your client read your proposal. Learn how document analytics reveal engagement, time spent per page, and exactly when to follow up."
            keywords="document analytics, track document views, file tracking software, proposal tracking, sales enablement analytics"
            publishDate="March 2026"
            readTime="7 min read"
            category="Features"
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2rem', marginBottom: '1rem' }}>The Black Box of Email</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '1rem' }}>
                You send a proposal. You wait. Did they open it? Did they hate the pricing page? Did they forward it to their boss?
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Without analytics, you are selling blind. You might follow up too early (annoying them) or too late (losing the deal).
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' }}>What Document Analytics Look Like</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Modern platforms like DocTransfer give you a dashboard that looks like Google Analytics, but for a single PDF. You can see:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                    <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Open Rates</strong>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Know exactly when they clicked the link.</span>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                    <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Time Per Page</strong>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>"They spent 4 minutes on Pricing but only 10 seconds on About Us."</span>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                    <strong style={{ color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Forwarding Tracking</strong>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>"A new device in London just opened the file."</span>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '1rem' }}>How to Use This Data to Close Deals</h2>
            <ul style={{ color: '#4b5563', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                <li style={{ marginBottom: '0.75rem' }}><strong>The "Magic" Follow-up:</strong> Call them 5 minutes after they open the document. "Hey, I was just thinking about you." It works.</li>
                <li style={{ marginBottom: '0.75rem' }}><strong>Objection Handling:</strong> If they spent 10 minutes on the "Competitors" slide, you know they are comparison shopping. Bring up your competitive advantages in the next call.</li>
                <li style={{ marginBottom: '0.75rem' }}><strong>Stakeholder Mapping:</strong> If the document is forwarded 3 times, you know there are 3 other decision-makers you haven't met yet. Ask to be introduced.</li>
            </ul>

            <p>
                <Link to="/" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Get free document analytics with DocTransfer →</Link>
            </p>
        </BlogLayout>
    );
};

export default DocumentAnalytics;
