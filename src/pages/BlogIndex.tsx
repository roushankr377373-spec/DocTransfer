import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Logo from '../components/Logo';
import SEO from '../components/SEO';
import { Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
    date: string;
}

const blogPosts: BlogPost[] = [
    {
        slug: 'best-docsend-alternatives',
        title: '7 Best Free DocSend Alternatives in 2026',
        description: 'Looking for a DocSend alternative? Compare the top 7 free options with features like analytics, encryption, and e-signatures.',
        category: 'Comparison',
        readTime: '12 min read',
        date: 'Feb 2026'
    },
    {
        slug: 'how-to-share-documents-securely',
        title: 'How to Share Documents Securely in 2026: The Complete Guide',
        description: 'Learn the 7 must-have features for secure document sharing and step-by-step instructions to protect your files.',
        category: 'Security',
        readTime: '10 min read',
        date: 'Feb 2026'
    },
    {
        slug: 'what-is-end-to-end-encryption',
        title: 'What Is End-to-End Encryption (And Why Your Files Need It)',
        description: 'A non-technical guide to how E2E encryption works, why it matters for your documents, and how to use it today.',
        category: 'Security',
        readTime: '8 min read',
        date: 'Feb 2026'
    },
    {
        slug: 'secure-document-sharing-real-estate',
        title: 'How Real Estate Agents Can Share Contracts Securely',
        description: 'Protect client financials, contracts, and NDAs with the right document-sharing tools built for real estate.',
        category: 'Real Estate',
        readTime: '8 min read',
        date: 'Feb 2026'
    },
    {
        slug: 'document-analytics-tracking',
        title: 'Document Analytics: How to Track Who Views Your Files',
        description: 'See exactly who opened your document, which pages they read, and how long they spent on each one.',
        category: 'Features',
        readTime: '7 min read',
        date: 'Mar 2026'
    },
    {
        slug: 'best-free-e-signature-tools',
        title: '5 Best Free E-Signature Tools in 2026',
        description: 'Sign contracts, NDAs, and agreements online for free. Compare the top e-signature tools for small businesses.',
        category: 'Comparison',
        readTime: '10 min read',
        date: 'Mar 2026'
    },
    {
        slug: 'how-to-watermark-documents',
        title: 'How to Watermark Documents to Prevent Leaks',
        description: 'Dynamic watermarking stamps the viewer\'s identity on every page, making unauthorized sharing traceable.',
        category: 'Security',
        readTime: '7 min read',
        date: 'Mar 2026'
    },
    {
        slug: 'virtual-data-rooms-guide',
        title: 'Virtual Data Rooms: What They Are and 5 Free Options',
        description: 'Virtual data rooms explained for M&A, fundraising, and legal due diligence. Find the best free VDR for your needs.',
        category: 'Guide',
        readTime: '10 min read',
        date: 'Mar 2026'
    },
    {
        slug: 'pitch-deck-sharing-for-startups',
        title: 'How VCs and Founders Share Pitch Decks Securely',
        description: 'Track investor engagement slide-by-slide and protect your pitch deck from unauthorized forwarding.',
        category: 'Startups',
        readTime: '8 min read',
        date: 'Apr 2026'
    },
    {
        slug: 'nda-signing-guide',
        title: 'NDA Signing Made Simple: A Guide for Small Businesses',
        description: 'Create, send, and e-sign NDAs in minutes — no lawyer needed. A practical guide for freelancers and startups.',
        category: 'Legal',
        readTime: '8 min read',
        date: 'Apr 2026'
    },
    {
        slug: 'document-security-law-firms',
        title: 'Document Security for Law Firms: A 2026 Guide',
        description: 'How law firms can protect privileged documents with encryption, audit trails, and access controls.',
        category: 'Legal',
        readTime: '10 min read',
        date: 'Apr 2026'
    },
    {
        slug: 'email-attachment-security-risks',
        title: 'Why Email Attachments Are a Security Risk (And What to Use Instead)',
        description: 'Email attachments can be intercepted, forwarded, and leaked. Discover safer alternatives for sending sensitive files.',
        category: 'Security',
        readTime: '7 min read',
        date: 'May 2026'
    },
];

const categoryColors: Record<string, string> = {
    'Comparison': '#f59e0b',
    'Security': '#ef4444',
    'Real Estate': '#10b981',
    'Features': '#6366f1',
    'Guide': '#8b5cf6',
    'Startups': '#3b82f6',
    'Legal': '#14b8a6',
};

const BlogIndex: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <SEO
                title="Blog — Secure Document Sharing Tips & Guides"
                description="Learn how to share documents securely, compare tools, and discover best practices for document security, analytics, and e-signatures."
                keywords="secure document sharing blog, DocSend alternative, document security tips, e-signature guide"
            />

            {/* Header */}
            <header style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e5e7eb',
                padding: '1rem 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}><Logo size={28} /></Link>
                    <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/blog" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>Blog</Link>
                        <Link to="/pricing" style={{ color: '#6b7280', fontWeight: 500, textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</Link>
                    </nav>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem 1.25rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>Try Free</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link to="/dataroom" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '4rem 2rem 2rem' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
                    DocTransfer Blog
                </h1>
                <p style={{ fontSize: '1.15rem', color: '#6b7280', maxWidth: '550px', margin: '0 auto' }}>
                    Tips, guides, and comparisons on secure document sharing, analytics, and e-signatures.
                </p>
            </section>

            {/* Compare banner */}
            <section style={{ maxWidth: '1000px', margin: '1rem auto 2rem', padding: '0 2rem' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #111827, #1e293b)',
                    borderRadius: '14px',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>Compare DocTransfer</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>See how we stack up against the competition</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {['DocSend', 'DocuSign', 'Google Drive', 'Dropbox'].map(name => (
                            <Link key={name} to={`/compare/doctransfer-vs-${name.toLowerCase().replace(' ', '-')}`} style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                padding: '0.4rem 0.85rem',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontWeight: 500
                            }}>vs {name}</Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 4rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {blogPosts.map(post => (
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            style={{
                                background: 'white',
                                borderRadius: '14px',
                                padding: '1.75rem',
                                textDecoration: 'none',
                                border: '1px solid #e5e7eb',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                        >
                            <div>
                                <span style={{
                                    display: 'inline-block',
                                    background: `${categoryColors[post.category] || '#6366f1'}18`,
                                    color: categoryColors[post.category] || '#6366f1',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.75rem'
                                }}>{post.category}</span>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', lineHeight: 1.35, marginBottom: '0.5rem' }}>{post.title}</h2>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>{post.description}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', color: '#9ca3af', fontSize: '0.8rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {post.readTime}</span>
                                <span style={{ color: '#6366f1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Read <ArrowRight size={14} /></span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#111827', color: '#9ca3af', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
                        <Link to="/blog" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</Link>
                        <Link to="/pricing" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</Link>
                    </div>
                    <p style={{ fontSize: '0.8rem' }}>© 2026 DocTransfer. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default BlogIndex;
