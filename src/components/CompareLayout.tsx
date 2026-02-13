import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Logo from './Logo';
import SEO from './SEO';
import { CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

export interface CompareFeature {
    feature: string;
    docTransfer: 'yes' | 'no' | 'partial';
    docTransferNote?: string;
    competitor: 'yes' | 'no' | 'partial';
    competitorNote?: string;
}

interface CompareLayoutProps {
    competitorName: string;
    title: string;
    description: string;
    keywords: string;
    heroSubtitle: string;
    features: CompareFeature[];
    verdict: string;
    verdictDetails: string[];
    children?: React.ReactNode;
}

const StatusIcon: React.FC<{ status: 'yes' | 'no' | 'partial' }> = ({ status }) => {
    if (status === 'yes') return <CheckCircle size={20} color="#10b981" />;
    if (status === 'no') return <XCircle size={20} color="#ef4444" />;
    return <AlertCircle size={20} color="#f59e0b" />;
};

const CompareLayout: React.FC<CompareLayoutProps> = ({
    competitorName,
    title,
    description,
    keywords,
    heroSubtitle,
    features,
    verdict,
    verdictDetails,
    children,
}) => {
    const otherComparisons = [
        { name: 'DocSend', slug: 'docsend-alternative' },
        { name: 'DocuSign', slug: 'docusign-alternative' },
        { name: 'Google Drive', slug: 'google-drive-alternative' },
        { name: 'Dropbox', slug: 'dropbox-alternative' },
    ].filter(c => c.name !== competitorName);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <SEO title={title} description={description} keywords={keywords} url={`https://doctransfer.io/compare`} />

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
                        <Link to="/blog" style={{ color: '#6b7280', fontWeight: 500, textDecoration: 'none', fontSize: '0.95rem' }}>Blog</Link>
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

            {/* Breadcrumb */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                    <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: '#6366f1' }}>Compare</span>
                </div>
            </div>

            {/* Hero */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 0', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.2,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                }}>
                    DocTransfer vs {competitorName}
                </h1>
                <p style={{ fontSize: '1.15rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                    {heroSubtitle}
                </p>
            </section>

            {/* Comparison Table */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 2rem' }}>
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                        <div style={{ padding: '1.25rem', fontWeight: 700, color: '#374151', fontSize: '0.95rem' }}>Feature</div>
                        <div style={{ padding: '1.25rem', fontWeight: 700, color: '#6366f1', fontSize: '0.95rem', textAlign: 'center' }}>DocTransfer</div>
                        <div style={{ padding: '1.25rem', fontWeight: 700, color: '#374151', fontSize: '0.95rem', textAlign: 'center' }}>{competitorName}</div>
                    </div>
                    {/* Table rows */}
                    {features.map((f, i) => (
                        <div key={i} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            borderBottom: i < features.length - 1 ? '1px solid #f3f4f6' : 'none',
                            background: i % 2 === 0 ? 'white' : '#fafbfc'
                        }}>
                            <div style={{ padding: '1rem 1.25rem', color: '#374151', fontWeight: 500, fontSize: '0.9rem' }}>{f.feature}</div>
                            <div style={{ padding: '1rem 1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                <StatusIcon status={f.docTransfer} />
                                {f.docTransferNote && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{f.docTransferNote}</span>}
                            </div>
                            <div style={{ padding: '1rem 1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                <StatusIcon status={f.competitor} />
                                {f.competitorNote && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{f.competitorNote}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Verdict */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 2rem 2rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)', borderRadius: '16px', padding: '2.5rem', border: '1px solid #e0e7ff' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Our Verdict</h2>
                    <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{verdict}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {verdictDetails.map((d, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#4b5563', fontSize: '0.95rem' }}>
                                <CheckCircle size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} /> {d}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {children}

            {/* CTA */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 2rem 3rem', textAlign: 'center' }}>
                <div style={{ background: '#111827', borderRadius: '16px', padding: '3rem 2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>Ready to switch?</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>10 uploads/day free forever. No credit card required.</p>
                    <Link to="/pricing" style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                        fontSize: '1rem'
                    }}>Try DocTransfer Free →</Link>
                </div>
            </section>

            {/* Other Comparisons */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 3rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>Other Comparisons</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {otherComparisons.map(c => (
                        <Link key={c.slug} to={`/compare/${c.slug}`} style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '10px',
                            padding: '0.75rem 1.25rem',
                            textDecoration: 'none',
                            color: '#374151',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            transition: 'border-color 0.2s'
                        }}>
                            DocTransfer vs {c.name} →
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

export default CompareLayout;
