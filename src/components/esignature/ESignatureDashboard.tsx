import React, { useState, useEffect } from 'react';
import {
    PenTool,
    FileText,
    Clock,
    CheckCircle,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    TrendingUp,
    Users,
    UploadCloud,
    File,
    ArrowLeft,
    FolderOpen
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../lib/supabase';
import useSubscription from '../../hooks/useSubscription';
import UsageLimitBanner from '../UsageLimitBanner';
import DocumentEditor from './DocumentEditor';
import RecipientManager from './RecipientManager';
import SigningRoom from './SigningRoom';

interface ESignatureDashboardProps {
    // Add props if needed
}

const ESignatureDashboard: React.FC<ESignatureDashboardProps> = () => {
    // Add keyframes for animation
    const styles = `
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    const { user } = useUser();
    const {
        subscription,
        dailyESignatureCount,
        canCreateESignature,
        isFeatureLocked
    } = useSubscription();
    const [view, setView] = useState<'dashboard' | 'create'>('dashboard');
    const [wizardStep, setWizardStep] = useState<'upload' | 'prepare' | 'recipients' | 'signing'>('upload');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [recipients, setRecipients] = useState<any[]>([]);
    const [demoFields, setDemoFields] = useState<any[]>([]);

    // Real Data State
    const [dashboardStats, setDashboardStats] = useState({
        pending: 0,
        completed: 0,
        totalSigners: 0,
        avgTurnaround: 'N/A'
    });
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch documents with e-signature enabled
            const { data: docs, error } = await supabase
                .from('documents')
                .select(`
                    id,
                    name,
                    created_at,
                    all_signed,
                    file_size,
                    document_signers (
                        id,
                        status,
                        signer_email,
                        signed_at
                    )
                `)
                .eq('requires_signature', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (docs) {
                // Calculate Stats
                const pendingCount = docs.filter(d => !d.all_signed).length;
                const completedCount = docs.filter(d => d.all_signed).length;

                // Calculate total unique active signers (just for show, total signers in pending docs)
                const totalActiveSigners = docs.reduce((acc, doc) => {
                    return acc + (doc.document_signers?.filter((s: any) => s.status !== 'signed').length || 0);
                }, 0);

                setDashboardStats({
                    pending: pendingCount,
                    completed: completedCount,
                    totalSigners: totalActiveSigners,
                    avgTurnaround: '1.2 days' // Hardcoded for now as it requires complex calculation
                });

                setRecentRequests(docs);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setUploadedFile(acceptedFiles[0]);
            setTimeout(() => setWizardStep('prepare'), 800);
        }
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    if (view === 'create') {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 100px)' }}>

                <button
                    onClick={() => {
                        setView('dashboard');
                        setWizardStep('upload');
                        setUploadedFile(null);
                        fetchDashboardData(); // Refresh on back
                    }}
                    style={{
                        marginBottom: '1.5rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        color: '#374151',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                    }}
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>

                {wizardStep === 'upload' && (
                    <div style={{
                        padding: '4rem 2rem',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                        borderRadius: '32px',
                        border: '1px solid #f3f4f6',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.05)'
                    }}>
                        {/* Decorative Background Elements */}
                        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

                        <div
                            {...getRootProps()}
                            style={{
                                border: `3px dashed ${isDragActive ? '#6366f1' : '#e5e7eb'}`,
                                borderRadius: '24px',
                                padding: '5rem 3rem',
                                width: '100%',
                                maxWidth: '700px',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: isDragActive ? 'rgba(238, 242, 255, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(10px)',
                                transform: isDragActive ? 'scale(1.01) translateY(-4px)' : 'scale(1)',
                                boxShadow: isDragActive ? '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)' : 'none',
                                position: 'relative',
                                zIndex: 10
                            }}
                        >
                            <input {...getInputProps()} />

                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: isDragActive ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'white',
                                borderRadius: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem auto',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                boxShadow: isDragActive ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                border: isDragActive ? 'none' : '1px solid #f3f4f6',
                                transform: isDragActive ? 'scale(1.1) rotate(6deg)' : 'scale(1)'
                            }}>
                                <UploadCloud
                                    size={48}
                                    color={isDragActive ? 'white' : '#4f46e5'}
                                    strokeWidth={1.5}
                                    style={{ transition: 'all 0.3s' }}
                                />
                            </div>

                            <h3 style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#111827',
                                marginBottom: '1rem',
                                letterSpacing: '-0.025em',
                                background: 'linear-gradient(to right, #111827, #4b5563)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {isDragActive ? 'Drop your masterpiece here' : 'Upload Document'}
                            </h3>

                            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
                                Drag & drop your PDF or Word document here
                            </p>

                            <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500' }}>OR</span>
                                <button
                                    type="button"
                                    onClick={open}
                                    style={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 2rem',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        transform: 'translateY(0)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.1)';
                                    }}
                                >
                                    <FolderOpen size={20} />
                                    Browse Files
                                </button>
                            </div>

                            <div style={{
                                display: 'inline-flex',
                                gap: '1.5rem',
                                padding: '0.75rem 1.5rem',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #f3f4f6',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                                    <div style={{ padding: '4px', background: '#eff6ff', borderRadius: '6px', color: '#3b82f6' }}><FileText size={14} /></div>
                                    PDF Support
                                </div>
                                <div style={{ width: '1px', height: '24px', background: '#f3f4f6' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                                    <div style={{ padding: '4px', background: '#f0fdf4', borderRadius: '6px', color: '#16a34a' }}><File size={14} /></div>
                                    Word Docs
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.7 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                                <CheckCircle size={14} className="text-emerald-500" /> Secure Encryption
                            </div>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d1d5db' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                                <CheckCircle size={14} className="text-emerald-500" /> Virus Scan
                            </div>
                        </div>
                    </div>
                )}

                {wizardStep === 'prepare' && uploadedFile && (
                    <DocumentEditor
                        fileUrl={URL.createObjectURL(uploadedFile)}
                        onSave={(fields) => {
                            setDemoFields(fields);
                            setWizardStep('recipients');
                        }}
                        onCancel={() => setWizardStep('upload')}
                    />
                )}

                {wizardStep === 'recipients' && (
                    <RecipientManager
                        recipients={recipients}
                        onUpdate={setRecipients}
                        onNext={() => {
                            setWizardStep('signing');
                        }}
                        onBack={() => setWizardStep('prepare')}
                    />
                )}

                {wizardStep === 'signing' && uploadedFile && (
                    <SigningRoom
                        fileUrl={URL.createObjectURL(uploadedFile)}
                        fields={demoFields}
                        onComplete={() => setView('dashboard')}
                        onExit={() => setView('dashboard')}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', minHeight: '80vh', paddingBottom: '5rem' }}>
            <style>{styles}</style>
            {/* Decorative Background */}
            <div style={{ position: 'fixed', top: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', bottom: '10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }}></div>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', marginBottom: '0.5rem', background: 'linear-gradient(to right, #111827, #4b5563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        E-Signature
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                        Manage your digital agreements with ease.
                    </p>
                </div>

            </div>



            {/* Recent Activity List - Modernized */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em' }}>Recent Activity</h2>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <Search size={18} />
                        </button>
                        <button style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {subscription?.plan_type === 'free' && (
                    <UsageLimitBanner
                        currentUploads={dailyESignatureCount}
                        maxUploads={10}
                        planType="free"
                        type="signatures"
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6' }}>Loading requests...</div>
                    ) : recentRequests.length === 0 ? (
                        <div style={{
                            padding: '4rem',
                            textAlign: 'center',
                            color: '#6b7280',
                            background: 'white',
                            borderRadius: '24px',
                            border: '1px dashed #e5e7eb'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#f3f4f6',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem auto',
                                color: '#9ca3af'
                            }}>
                                <FileText size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No signatures yet</h3>
                            <p style={{ marginBottom: '1.5rem' }}>Get started by creating your first document request.</p>
                            <button
                                onClick={() => canCreateESignature() ? setView('create') : window.location.href = '/pricing'}
                                style={{
                                    background: !canCreateESignature() ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto',
                                    boxShadow: !canCreateESignature() ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: 'translateY(0)'
                                }}
                                onMouseEnter={(e) => {
                                    if (canCreateESignature()) {
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (canCreateESignature()) {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)';
                                    }
                                }}
                            >
                                <Plus size={18} /> {!canCreateESignature() ? 'Limit Reached - Upgrade' : 'Create Request'}
                            </button>
                        </div>
                    ) : (
                        recentRequests.map((doc, index) => {
                            const isCompleted = doc.all_signed;
                            const isViewed = !isCompleted && doc.document_signers?.some((s: any) => s.status === 'viewed');
                            const statusLabel = isCompleted ? 'Completed' : isViewed ? 'Viewed' : 'Pending Signature';
                            const statusColor = isCompleted ? '#059669' : isViewed ? '#0284c7' : '#d97706';
                            const statusBg = isCompleted ? '#ecfdf5' : isViewed ? '#f0f9ff' : '#fffbeb';
                            const statusBorder = isCompleted ? '#a7f3d0' : isViewed ? '#bae6fd' : '#fde68a';

                            // Determine primary recipient email for display
                            const recipientEmail = doc.document_signers?.[0]?.signer_email || 'Multiple Recipients';

                            return (
                                <div key={doc.id} style={{
                                    padding: '1.25rem 1.75rem',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid #f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '1.5rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    opacity: 0, // Start invisible for animation
                                    animation: 'slideUp 0.5s ease-out forwards',
                                    animationDelay: `${index * 0.1}s`
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                        e.currentTarget.style.borderColor = '#f3f4f6';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%)',
                                            borderRadius: '14px',
                                            color: '#6b7280',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>{doc.name}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>To: <span style={{ color: '#374151', fontWeight: '500' }}>{recipientEmail}</span></span>
                                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d1d5db' }}></span>
                                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{
                                            padding: '0.35rem 1rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            background: statusBg,
                                            color: statusColor,
                                            border: `1px solid ${statusBorder}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }}></span>
                                            {statusLabel}
                                        </div>
                                        <button style={{
                                            background: 'white',
                                            border: '1px solid #f3f4f6',
                                            borderRadius: '8px',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#9ca3af',
                                            cursor: 'pointer'
                                        }}>
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* View All Button */}
                    {recentRequests.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button style={{
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                color: '#4b5563',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                                className="hover:bg-gray-50"
                            >
                                View All Activity <ArrowUpRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => canCreateESignature() ? setView('create') : window.location.href = '/pricing'}
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '24px',
                    background: !canCreateESignature() ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    border: 'none',
                    color: 'white',
                    boxShadow: !canCreateESignature() ? 'none' : '0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 100,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onMouseEnter={(e) => {
                    if (canCreateESignature()) {
                        e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                        e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(79, 70, 229, 0.5), 0 15px 15px -5px rgba(79, 70, 229, 0.3)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (canCreateESignature()) {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.2)';
                    }
                }}
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default ESignatureDashboard;
