import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Logo from './Logo';
import SEO from './SEO';
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';

interface BlogLayoutProps {
    title: string;
    description: string;
    keywords: string;
    publishDate: string;
    readTime: string;
    category: string;
    children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
    title,
    description,
    keywords,
    publishDate,
    readTime,
    category,
    children,
}) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <SEO
                title={title}
                description={description}
                keywords={keywords}
                url={`https://doctransfer.io/blog`}
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
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Logo size={28} />
                    </Link>
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
                            }}>
                                Try Free
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link to="/dataroom" style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '0.5rem 1.25rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}>Dashboard</Link>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>

            {/* Breadcrumb */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                    <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/blog" style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: '#6366f1' }}>{category}</span>
                </div>
            </div>

            {/* Article */}
            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
                {/* Category badge */}
                <span style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                    color: '#4f46e5',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '1rem'
                }}>{category}</span>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.2,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                }}>{title}</h1>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={15} /> {publishDate}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={15} /> {readTime}
                    </span>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
                    {/* Description/intro */}
                    <p style={{ fontSize: '1.15rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '2rem' }}>
                        {description}
                    </p>
                </div>

                {/* Content */}
                <div className="blog-content">
                    {children}
                </div>

                {/* CTA */}
                <div style={{
                    marginTop: '3rem',
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    border: '1px solid #e0e7ff'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                        Ready to share documents securely?
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1rem' }}>
                        10 uploads/day free forever. No credit card required.
                    </p>
                    <Link to="/pricing" style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                    }}>
                        Try DocTransfer Free →
                    </Link>
                </div>
            </article>

            {/* Footer */}
            <footer style={{
                background: '#111827',
                color: '#9ca3af',
                padding: '3rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
                        <Link to="/blog" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</Link>
                        <Link to="/pricing" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</Link>
                        <Link to="/compare/doctransfer-vs-docsend" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>vs DocSend</Link>
                        <Link to="/compare/doctransfer-vs-docusign" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>vs DocuSign</Link>
                    </div>
                    <p style={{ fontSize: '0.8rem' }}>© 2026 DocTransfer. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default BlogLayout;
