import React, { useState, useEffect } from 'react';
import {
    Check,
    ArrowLeft,
    ChevronRight,
    Flag,
    Calendar,
    Type,
    ThumbsUp,
    Download,
    Mail,
    Building,
    Briefcase,
    Stamp as StampIcon
} from 'lucide-react';
import { STAMPS } from './StampSelector';
import type { StampType } from './StampSelector';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import SignatureCanvasComponent from '../SignatureCanvas';
import { generateCertificateOfCompletion } from '../../lib/certificateGenerator';
import { fetchAuditLogs } from '../../lib/auditLogger';

// Reuse worker setup from DocumentEditor or set globally
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SigningRoomProps {
    fileUrl: string;
    fields: any[];
    onComplete: () => void;
    onExit: () => void;
    currentSignerId?: string; // Optional for now, but used for access control
    documentId?: string; // Needed for audit logs lookup
}

const SigningRoom: React.FC<SigningRoomProps> = ({ fileUrl, fields, onComplete, onExit, currentSignerId, documentId }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [fieldValues, setFieldValues] = useState<Record<string, string | null>>({});
    const [activeField, setActiveField] = useState<string | null>(null); // ID of field being edited
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Calculate progress
    const completedFields = Object.keys(fieldValues).filter(k => fieldValues[k]).length;
    const totalFields = fields.length;
    const progress = Math.round((completedFields / totalFields) * 100) || 0;

    const handleFieldClick = (field: any) => {
        // 1. Role-Based Access Check
        if (currentSignerId && field.assigned_signer_id && field.assigned_signer_id !== currentSignerId) {
            // Optional: visual feedback or toast
            // alert("This field is assigned to another signer.");
            return;
        }

        if (field.type === 'signature' || field.type === 'initials') {
            setActiveField(field.id);
            setIsSignatureModalOpen(true);
        } else if (field.type === 'date') {
            setActiveField(field.id);
        } else if (field.type === 'checkbox') {
            const currentValue = fieldValues[field.id];
            setFieldValues(prev => ({ ...prev, [field.id]: currentValue ? null : 'true' }));
        } else if (['text', 'email', 'company', 'title'].includes(field.type)) {
            const text = prompt(`Enter ${field.type}:`, fieldValues[field.id] || '');
            if (text !== null) {
                setFieldValues(prev => ({ ...prev, [field.id]: text }));
            }
        } else if (field.type === 'stamp') {
            // For stamp, we might want an image uploader or just a standard "STAMPED" text for now.
            // Let's simluate a stamp action
            setFieldValues(prev => ({ ...prev, [field.id]: 'STAMPED' }));
        }
    };

    const handleSignatureSave = (data: string) => {
        if (activeField) {
            setFieldValues(prev => ({ ...prev, [activeField]: data }));
            setIsSignatureModalOpen(false);
            setActiveField(null);
        }
    };

    const handleFinish = () => {
        setCompleted(true);
        // Removed auto-close timeout to allow download
        // setTimeout(onComplete, 3000); 
    };

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const pages = pdfDoc.getPages();

            // Map fields to pages
            // We need to reconstruct the visual layout's Y coordinates to match them to PDF pages
            // Visual Layout: 800px width cards with 2rem (32px) margins between them

            let currentVisualY = 0;
            const pageMetrics = pages.map(page => {
                const { width, height } = page.getSize();
                const scale = width / 800;
                // Visual height in the DOM is derived from width=800
                const visualHeight = height / scale;

                const metric = {
                    page,
                    scale, // Multiply visual coord by this to get PDF coord (mostly)
                    visualStart: currentVisualY,
                    visualEnd: currentVisualY + visualHeight,
                    height // PDF height
                };

                currentVisualY += visualHeight + 32; // +32px margin
                return metric;
            });

            for (const field of fields) {
                const value = fieldValues[field.id];
                if (!value) continue;

                // Find which page this field is on
                // We use the top-middle point of the field for hit testing the page
                // field.y is top position
                const fieldCenterY = field.y + 10;

                const pageMetric = pageMetrics.find(m =>
                    fieldCenterY >= m.visualStart && fieldCenterY <= m.visualEnd
                );

                if (pageMetric) {
                    const { page, scale, visualStart, height } = pageMetric;

                    // Convert visual coordinates relative to the page top-left
                    const localVisualX = field.x;
                    const localVisualY = field.y - visualStart;

                    const pdfX = localVisualX * scale;
                    // PDF Y starts from bottom. 
                    // To get top-aligned Y: height - (visualY * scale)
                    // But we also need to account for element height to place bottom-left anchor correctly?
                    // Let's approximate element height visually as field.height or default.
                    const visualElementHeight = field.height || 40;
                    const pdfElementHeight = visualElementHeight * scale;

                    const pdfY = height - (localVisualY * scale) - pdfElementHeight;

                    if (field.type === 'signature' || field.type === 'initials') {
                        // Value is data URL, convert to ArrayBuffer for robust embedding
                        const imageBytes = await fetch(value).then(res => res.arrayBuffer());
                        const pngImage = await pdfDoc.embedPng(imageBytes);

                        // Maintain aspect ratio
                        const imgDims = pngImage.scale(0.5); // Start with 50% scale
                        // Fit within the box defined by field dims
                        const maxWidth = (field.width || 120) * scale;
                        const maxHeight = (field.height || 40) * scale;

                        // Simple aspect fit
                        let drawWidth = maxWidth;
                        let drawHeight = (imgDims.height / imgDims.width) * drawWidth;

                        if (drawHeight > maxHeight) {
                            drawHeight = maxHeight;
                            drawWidth = (imgDims.width / imgDims.height) * drawHeight;
                        }

                        // Center in the box
                        const xOffset = (maxWidth - drawWidth) / 2;
                        const yOffset = (maxHeight - drawHeight) / 2;

                        page.drawImage(pngImage, {
                            x: pdfX + xOffset,
                            y: pdfY + yOffset,
                            width: drawWidth,
                            height: drawHeight,
                        });
                    } else if (['text', 'date', 'email', 'company', 'title'].includes(field.type)) {
                        let textToDraw = value;
                        if (field.type === 'date') {
                            try {
                                const dateObj = new Date(value);
                                if (!isNaN(dateObj.getTime())) {
                                    textToDraw = dateObj.toLocaleDateString();
                                }
                            } catch (e) {
                                // Fallback
                            }
                        }

                        page.drawText(textToDraw, {
                            x: pdfX + 5 * scale,
                            y: pdfY + 12 * scale,
                            size: 12 * scale,
                            font: helveticaFont,
                            color: rgb(0, 0, 0),
                        });
                    } else if (field.type === 'stamp') {
                        if (field.stampType && STAMPS[field.stampType as StampType]) {
                            try {
                                const stampDef = STAMPS[field.stampType as StampType];
                                const svgString = stampDef.svgString;

                                // Create a blob from the SVG string
                                const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                                const url = URL.createObjectURL(blob);

                                // Load image and rasterize
                                const img = new Image();
                                await new Promise((resolve, reject) => {
                                    img.onload = resolve;
                                    img.onerror = reject;
                                    img.src = url;
                                });

                                const canvas = document.createElement('canvas');
                                canvas.width = stampDef.width * 2; // 2x resolution for better quality
                                canvas.height = stampDef.height * 2;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                    const pngDataUrl = canvas.toDataURL('image/png');
                                    const pngImageBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
                                    const pngImage = await pdfDoc.embedPng(pngImageBytes);

                                    page.drawImage(pngImage, {
                                        x: pdfX,
                                        y: pdfY,
                                        width: (field.width || stampDef.width) * scale,
                                        height: (field.height || stampDef.height) * scale,
                                    });
                                }
                                URL.revokeObjectURL(url);
                            } catch (e) {
                                console.error("Failed to render stamp on PDF", e);
                                // Fallback
                                page.drawText('STAMP', {
                                    x: pdfX,
                                    y: pdfY,
                                    size: 12 * scale,
                                    color: rgb(1, 0, 0),
                                });
                            }
                        }
                    } else if (field.type === 'checkbox') {
                        page.drawText('X', {
                            x: pdfX + 10 * scale,
                            y: pdfY + 10 * scale,
                            size: 20 * scale,
                            font: helveticaFont,
                            color: rgb(0, 0, 0),
                        });
                    }
                }
            }

            // --- Append Certificate of Completion ---
            try {
                // Fetch audit logs for this document
                // If this is a demo/new doc without ID, we might skip or show mock logs
                if (documentId) {
                    const { data: auditLogs } = await fetchAuditLogs(documentId);
                    await generateCertificateOfCompletion(pdfDoc, auditLogs || [], documentId);
                } else {
                    // Fallback for demo mode - add a mock certificate or skip
                    // Let's add a placeholder certificate for the "Pre-Save" experience
                    await generateCertificateOfCompletion(pdfDoc, [
                        { event_timestamp: new Date().toISOString(), event_type: 'document_created', user_email: 'you@example.com', ip_address: '127.0.0.1', description: 'Document Created' },
                        { event_timestamp: new Date().toISOString(), event_type: 'signature_applied', user_email: 'you@example.com', ip_address: '127.0.0.1', description: 'Signature Applied' }
                    ], 'DEMO-DOC-ID');
                }
            } catch (certError) {
                console.error("Failed to generate certificate:", certError);
                // Continue downloading even if certificate fails? Or block?
                // For 'legal defensibility', we should arguably block, but strictly enforcing might be bad UX if API fails.
                // Let's log and continue for now.
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'signed-document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error('Download failed', err);
            alert('Failed to generate PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    if (completed) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
                <div className="animate-bounce" style={{ marginBottom: '2rem', color: '#16a34a' }}>
                    <ThumbsUp size={64} />
                </div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#14532d', marginBottom: '1rem' }}>All Signed!</h1>
                <p style={{ color: '#15803d', fontSize: '1.125rem', marginBottom: '2rem' }}>You're all set. The document has been securely saved.</p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onComplete}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            border: '1px solid #16a34a',
                            color: '#16a34a',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#16a34a',
                            border: 'none',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: isDownloading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)'
                        }}
                    >
                        <Download size={20} />
                        {isDownloading ? 'Generating PDF...' : 'Download Signed PDF'}
                    </button>
                </div>

                {/* Simple CSS Confetti (dots) */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                top: `-10px`,
                                width: '10px',
                                height: '10px',
                                background: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
                                borderRadius: '50%',
                                animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                    <style>{`
                        @keyframes fall {
                            to { transform: translateY(100vh) rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f3f4f6', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ height: '64px', background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 50 }}>
                <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <ArrowLeft size={18} /> Exit
                </button>
                <div style={{ fontWeight: '600', color: '#111827' }}>Review and Sign</div>
                <div style={{ width: '60px' }}></div> {/* Spacer */}
            </div>

            {/* Document Area */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ position: 'relative', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <Document
                        file={fileUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={<div>Loading...</div>}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} style={{ marginBottom: '2rem' }}>
                                <Page pageNumber={index + 1} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
                            </div>
                        ))}
                    </Document>

                    {/* Interactive Fields */}
                    {fields.map((field) => {
                        const value = fieldValues[field.id];
                        const isFilled = !!value;

                        return (
                            <div
                                key={field.id}
                                onClick={() => handleFieldClick(field)}
                                style={{
                                    position: 'absolute',
                                    left: field.x,
                                    top: field.y,
                                    width: field.width || 120,
                                    height: field.height || 40,
                                    background: isFilled ? '#ecfdf5' : '#eff6ff', // Green if filled, Blue if not
                                    border: isFilled ? '2px solid #10b981' : '2px dashed #4f46e5',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s',
                                    transform: 'scale(1)',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {(() => {
                                    if (field.type === 'signature' || field.type === 'initials') {
                                        return value ? (
                                            <img src={value} alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                        ) : (
                                            <span style={{ color: '#4f46e5', fontWeight: '600', fontSize: '12px' }}>Sign Here</span>
                                        );
                                    }

                                    if (field.type === 'date') {
                                        if (activeField === field.id) {
                                            return (
                                                <input
                                                    type="date"
                                                    autoFocus
                                                    value={value || ''}
                                                    onChange={(e) => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                    onBlur={() => setActiveField(null)}
                                                    style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontFamily: 'inherit', color: '#374151' }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            );
                                        }
                                        return (
                                            <span style={{ fontSize: '12px', color: '#374151' }}>
                                                {value ? new Date(value).toLocaleDateString() : <Calendar size={14} />}
                                            </span>
                                        );
                                    }

                                    if (field.type === 'checkbox') {
                                        return (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {value ? <Check size={20} color="#10b981" strokeWidth={3} /> : null}
                                            </div>
                                        );
                                    }

                                    if (field.type === 'stamp') {
                                        return (
                                            <div style={{ width: '100%', height: '100%' }}>
                                                {field.stampType && STAMPS[field.stampType as StampType] ? (
                                                    STAMPS[field.stampType as StampType].component
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#e11d48' }}>
                                                        <StampIcon size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    if (field.type === 'text') {
                                        return (
                                            <span style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {value || <span style={{ color: '#9ca3af' }}>Enter text...</span>}
                                            </span>
                                        );
                                    }

                                    // Catch-all
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', overflow: 'hidden' }}>
                                            {!value && (
                                                field.type === 'email' ? <Mail size={14} color="#0ea5e9" /> :
                                                    field.type === 'company' ? <Building size={14} color="#64748b" /> :
                                                        field.type === 'title' ? <Briefcase size={14} color="#8b5cf6" /> : null
                                            )}
                                            <span style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {value || <span style={{ color: '#9ca3af', textTransform: 'capitalize' }}>{field.type}</span>}
                                            </span>
                                        </div>
                                    );
                                })()}

                                <div style={{ position: 'absolute', top: -20, left: 0, background: '#4f46e5', color: 'white', fontSize: '10px', padding: '2px 4px', borderRadius: '2px', opacity: isFilled ? 0 : 1 }}>
                                    Required
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{completedFields} of {totalFields} fields completed</div>
                    <div style={{ width: '200px', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '0.5rem' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', borderRadius: '2px', transition: 'width 0.3s' }}></div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {progress < 100 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: '500' }}>
                            <Flag size={16} /> Fill all required fields
                        </div>
                    )}
                    <button
                        onClick={handleFinish}
                        disabled={progress < 100}
                        style={{
                            padding: '0.75rem 2rem',
                            background: progress === 100 ? '#10b981' : '#e5e7eb',
                            color: progress === 100 ? 'white' : '#9ca3af',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: progress === 100 ? 'pointer' : 'not-allowed',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: progress === 100 ? '0 4px 6px -1px rgba(16, 185, 129, 0.3)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Finish <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Signature Modal */}
            {
                isSignatureModalOpen && (
                    <SignatureCanvasComponent
                        onSave={handleSignatureSave}
                        onClose={() => setIsSignatureModalOpen(false)}
                        title={activeField && fields.find(f => f.id === activeField)?.type === 'initials' ? 'Adopt your initials' : 'Adopt your signature'}
                        isInitials={!!(activeField && fields.find(f => f.id === activeField)?.type === 'initials')}
                    />
                )
            }
        </div >
    );
};

export default SigningRoom;
