import React, { useState } from 'react';
import {
    Type,
    Calendar,
    CheckSquare,
    Save,
    ArrowLeft,
    Eye,
    Trash2,
    Settings,
    Grid,
    Plus,
    X,
    User
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DndContext, useDraggable, useDroppable, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentEditorProps {
    fileUrl: string; // URL of the PDF to edit
    onSave: (fields: any[]) => void;
    onCancel: () => void;
}

interface Signer {
    id: string;
    name: string;
    email: string;
    color: string;
}

const snapToGrid = (value: number, gridSize: number = 20) => Math.round(value / gridSize) * gridSize;

const DraggableTool = ({ icon, label, color, type }: { icon: any, label: string, color: string, type: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `tool-${type}`,
        data: { type, origin: 'sidebar', label, icon, color }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                padding: '0.875rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px -2px ${color}33`; // 33 is approx 20% opacity hex
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }}
        >
            <div style={{
                color: 'white',
                background: color,
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 2px 4px ${color}40`
            }}>
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1f2937' }}>{label}</span>
            <div style={{ marginLeft: 'auto', opacity: 0 }} className="group-hover:opacity-100">
                <Grid size={12} color="#9ca3af" />
            </div>
        </div>
    );
};

// Canvas Field Component
const CanvasField = ({ field, isSelected, onSelect, onDelete, onResize }: { field: any, isSelected: boolean, onSelect: () => void, onDelete: () => void, onResize: (width: number, height: number) => void }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `field-${field.id}`,
        data: { ...field, origin: 'canvas' }
    });

    const style = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        position: 'absolute' as const,
        left: field.x,
        top: field.y,
        width: field.width,
        height: field.height,
        zIndex: isDragging ? 100 : 10,
        opacity: isDragging ? 0 : 1
    };

    const handleResize = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag from starting
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = field.width;
        const startHeight = field.height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(30, startWidth + (moveEvent.clientX - startX));
            const newHeight = Math.max(30, startHeight + (moveEvent.clientY - startY));
            onResize(newWidth, newHeight);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            style={style}
        >
            {isSelected && (
                <>
                    <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', background: '#1f2937', borderRadius: '6px', padding: '4px', display: 'flex', gap: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50 }}>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ color: '#ef4444', padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        <button style={{ color: 'white', padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}><Settings size={14} /></button>
                    </div>
                    {/* Resize Handle */}
                    <div
                        onMouseDown={handleResize}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            width: '12px',
                            height: '12px',
                            background: '#4f46e5',
                            border: '1px solid white',
                            borderRadius: '50%',
                            cursor: 'nwse-resize',
                            zIndex: 60
                        }}
                    />
                </>
            )}
            <div style={{
                padding: '0',
                background: isSelected ? '#e0e7ff' : '#eff6ff',
                border: isSelected ? '2px solid #4f46e5' : '2px solid #6366f1',
                borderRadius: '4px',
                cursor: 'move',
                boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                overflow: 'hidden'
            }}>
                <span style={{ fontSize: field.type === 'signature' ? '14px' : '12px', fontWeight: '600', color: '#4f46e5', pointerEvents: 'none', whiteSpace: 'nowrap' }}>{field.type}</span>
            </div>
        </div>
    );
};

// Droppable Canvas Component
const PDFCanvas = ({ fileUrl, fields, selectedFieldId, onSelectField, onDeleteField, onResizeField }: { fileUrl: string, fields: any[], selectedFieldId: string | null, onSelectField: (id: string | null) => void, onDeleteField: (id: string) => void, onResizeField: (id: string, width: number, height: number) => void }) => {
    const { setNodeRef } = useDroppable({
        id: 'pdf-canvas',
    });
    const [numPages, setNumPages] = useState<number>(0);

    return (
        <div
            id="pdf-canvas-container"
            ref={setNodeRef}
            onClick={() => onSelectField(null)}
            style={{
                width: '800px',
                minHeight: '1100px',
                background: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '2rem'
            }}
        >
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div style={{ padding: '2rem', color: '#6b7280' }}>Loading PDF...</div>}
                error={<div style={{ padding: '2rem', color: '#ef4444' }}>Failed to load PDF. Please try again.</div>}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} style={{ marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <Page pageNumber={index + 1} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
                    </div>
                ))}
            </Document>

            {fields.map((field) => (
                <CanvasField
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    onSelect={() => onSelectField(field.id)}
                    onDelete={() => onDeleteField(field.id)}
                    onResize={(width, height) => onResizeField(field.id, width, height)}
                />
            ))}
        </div>
    );
};

const DocumentEditor: React.FC<DocumentEditorProps> = ({ fileUrl, onSave, onCancel }) => {
    const [fields, setFields] = useState<any[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<any>(null);

    // Signer State
    const [signers, setSigners] = useState<Signer[]>([]);
    const [isSignerModalOpen, setIsSignerModalOpen] = useState(false);
    const [newSignerName, setNewSignerName] = useState('');
    const [newSignerEmail, setNewSignerEmail] = useState('');

    const handleAddSigner = () => {
        if (newSignerName && newSignerEmail) {
            setSigners([...signers, {
                id: Date.now().toString(),
                name: newSignerName,
                email: newSignerEmail,
                color: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][signers.length % 5]
            }]);
            setNewSignerName('');
            setNewSignerEmail('');
            setIsSignerModalOpen(false);
        }
    };

    const handleDragStart = (event: any) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active, delta } = event;
        setActiveDragItem(null);

        if (!over) return;

        // Calculate drop position
        const dropRect = active.rect.current.translated;
        const container = document.getElementById('pdf-canvas-container');

        // Variables for new coordinates
        let newX = 0;
        let newY = 0;

        if (dropRect && container) {
            const containerRect = container.getBoundingClientRect();
            // Calculate relative coordinates
            newX = dropRect.left - containerRect.left;
            newY = dropRect.top - containerRect.top;

            // Snap to grid
            newX = snapToGrid(newX);
            newY = snapToGrid(newY);
        } else {
            // Fallback if we can't calculate rects
            newX = 100;
            newY = 100;
        }

        if (active.data.current?.origin === 'sidebar' && over.id === 'pdf-canvas') {
            // New Item
            const type = active.data.current.type;
            let width = 120;
            let height = 40;

            // Set default sizes based on type
            switch (type) {
                case 'checkbox':
                    width = 30;
                    height = 30;
                    break;
                case 'signature':
                    width = 150;
                    height = 60;
                    break;
                case 'initials':
                    width = 100;
                    height = 60;
                    break;
                case 'text':
                    width = 200;
                    height = 40;
                    break;
                case 'date':
                    width = 120;
                    height = 40;
                    break;
            }

            const newField = {
                id: Date.now().toString(),
                type: type,
                x: newX,
                y: newY,
                width,
                height
            };
            setFields([...fields, newField]);
            setSelectedFieldId(newField.id);
        } else if (active.data.current?.origin === 'canvas') {
            // Moving existing item
            // For existing items, delta is relative to start.
            // But we can also use absolute calculation to be safe or stick to delta.
            // Using delta on existing fields is usually safer if we already have x,y.

            setFields(fields.map(f => {
                if (f.id === active.data.current?.id) {
                    return {
                        ...f,
                        x: snapToGrid(f.x + delta.x),
                        y: snapToGrid(f.y + delta.y)
                    };
                }
                return f;
            }));
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                background: '#f3f4f6',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Modern Patterned Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    opacity: 0.4,
                    pointerEvents: 'none'
                }}></div>

                {/* Floating Header */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    height: '72px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem',
                    boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
                    zIndex: 50
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                color: '#4b5563',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            className="hover:bg-gray-50 hover:border-gray-300"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <div style={{ width: '1px', height: '24px', background: '#d1d5db' }} />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>Prepare Document</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button style={{ padding: '0.6rem 1.25rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#374151', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px -1px rgba(0,0,0,0.05)' }}>
                            <Eye size={18} /> Preview
                        </button>
                        <button
                            onClick={() => onSave(fields)}
                            style={{
                                padding: '0.6rem 1.5rem',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}
                            className="hover:scale-105 active:scale-95 transition-transform"
                        >
                            <Save size={18} /> Send Request
                        </button>
                    </div>
                </div>

                {/* Main Content Area - Correctly Flexed */}
                <div style={{ display: 'flex', flex: 1, marginTop: '110px', height: 'calc(100vh - 110px)', overflow: 'hidden' }}>

                    {/* Floating Sidebar */}
                    <div style={{
                        width: '300px',
                        margin: '0 0 20px 20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid white',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        zIndex: 40,
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                        overflowY: 'auto'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Drag Fields</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <DraggableTool icon={<Type size={18} />} label="Signature" color="#4f46e5" type="signature" />
                                <DraggableTool icon={<Type size={18} />} label="Initials" color="#8b5cf6" type="initials" />
                                <DraggableTool icon={<Calendar size={18} />} label="Date Signed" color="#059669" type="date" />
                                <DraggableTool icon={<Type size={18} />} label="Text Box" color="#f59e0b" type="text" />
                                <DraggableTool icon={<CheckSquare size={18} />} label="Checkbox" color="#ef4444" type="checkbox" />
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f3f4f6' }}></div>

                        <div>


                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                {signers.map((signer) => (
                                    <div key={signer.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        background: 'white',
                                        borderRadius: '12px',
                                        border: '1px solid #f3f4f6',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: `linear-gradient(135deg, ${signer.color}20, ${signer.color}40)`,
                                            color: signer.color,
                                            border: `1px solid ${signer.color}40`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {signer.name.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{signer.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{signer.email}</div>
                                        </div>
                                        <button
                                            onClick={() => setSigners(signers.filter(s => s.id !== signer.id))}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '4px', transition: 'color 0.2s' }}
                                            className="hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>

                    {/* Canvas Area with Scroll */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0 2rem 4rem 2rem',
                    }}>
                        <div style={{
                            borderRadius: '4px',
                            // Add a subtle reflection/glow behind the PDF
                            position: 'relative'
                        }}>
                            <PDFCanvas
                                fileUrl={fileUrl}
                                fields={fields}
                                selectedFieldId={selectedFieldId}
                                onSelectField={setSelectedFieldId}
                                onDeleteField={(id) => setFields(fields.filter(f => f.id !== id))}
                                onResizeField={(id, width, height) => {
                                    setFields(fields.map(f => f.id === id ? { ...f, width, height } : f));
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeDragItem ? (
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #6366f1',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            transform: 'scale(1.05) rotate(2deg)',
                            cursor: 'grabbing'
                        }}>
                            <div style={{ color: activeDragItem.color }}>{activeDragItem.icon}</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>
                                {activeDragItem.label || activeDragItem.type}
                            </span>
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Signer Modal */}
                {isSignerModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setIsSignerModalOpen(false)}>
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em' }}>Add Signer</h3>
                                <button onClick={() => setIsSignerModalOpen(false)} style={{ background: '#f3f4f6', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={newSignerName}
                                        onChange={(e) => setNewSignerName(e.target.value)}
                                        placeholder="e.g. Alice Smith"
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', background: '#f9fafb', fontSize: '1rem' }}
                                        className="focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={newSignerEmail}
                                        onChange={(e) => setNewSignerEmail(e.target.value)}
                                        placeholder="e.g. alice@company.com"
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', background: '#f9fafb', fontSize: '1rem' }}
                                        className="focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddSigner()}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setIsSignerModalOpen(false)} style={{ flex: 1, padding: '1rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: '600', color: '#374151', cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
                                <button onClick={handleAddSigner} style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', border: 'none', borderRadius: '12px', fontWeight: '600', color: 'white', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>Add Signer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndContext >
    );
};

export default DocumentEditor;
