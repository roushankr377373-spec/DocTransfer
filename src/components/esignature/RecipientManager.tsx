import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    Mail,
    Check,
    GripVertical,
    Trash2,
    ArrowDown,
    Clock,
    User
} from 'lucide-react';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Recipient {
    id: string;
    email: string;
    name: string;
    role: 'signer' | 'viewer';
    order: number;
}

interface RecipientManagerProps {
    recipients: Recipient[];
    onUpdate: (recipients: Recipient[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const SortableRecipientItem = ({ recipient, onDelete, index }: { recipient: Recipient, onDelete: () => void, index: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: recipient.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style}>
            {index > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
                    <div style={{
                        width: '2px',
                        height: '24px',
                        background: '#e5e7eb',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#9ca3af'
                        }}>
                            <ArrowDown size={14} />
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s'
            }}>
                <div {...attributes} {...listeners} style={{ cursor: 'grab', color: '#9ca3af' }}>
                    <GripVertical size={20} />
                </div>

                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${['#6366f1', '#ec4899', '#8b5cf6'][index % 3]} 0%, ${['#4f46e5', '#db2777', '#7c3aed'][index % 3]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {recipient.name.charAt(0).toUpperCase() || <User size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{recipient.name || 'New Recipient'}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={12} /> {recipient.email}
                    </div>
                </div>

                <div style={{
                    padding: '0.25rem 0.75rem',
                    background: '#eff6ff',
                    color: '#4f46e5',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {recipient.role}
                </div>

                <button onClick={onDelete} style={{ color: '#9ca3af', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const RecipientManager: React.FC<RecipientManagerProps> = ({ recipients, onUpdate, onNext, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = recipients.findIndex((r) => r.id === active.id);
            const newIndex = recipients.findIndex((r) => r.id === over.id);
            onUpdate(arrayMove(recipients, oldIndex, newIndex));
        }
    };

    const addRecipient = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;
        const newRecipient: Recipient = {
            id: Date.now().toString(),
            name,
            email,
            role: 'signer',
            order: recipients.length + 1
        };
        onUpdate([...recipients, newRecipient]);
        setName('');
        setEmail('');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Add Recipients</h2>
                <p style={{ color: '#6b7280' }}>Manage signers and set the signing order.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '3rem' }}>
                {/* Workflow List */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.25rem', background: '#dbeafe', borderRadius: '4px', color: '#2563eb' }}><Users size={16} /></div>
                        Signing Workflow
                    </h3>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={recipients} strategy={verticalListSortingStrategy}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {recipients.map((recipient, i) => (
                                    <SortableRecipientItem
                                        key={recipient.id}
                                        recipient={recipient}
                                        index={i}
                                        onDelete={() => onUpdate(recipients.filter(r => r.id !== recipient.id))}
                                    />
                                ))}
                                {recipients.length === 0 && (
                                    <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed #e5e7eb', borderRadius: '12px', color: '#9ca3af' }}>
                                        No recipients added yet.
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Add Form & Timeline */}
                <div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Add New Recipient</h4>
                        <form onSubmit={addRecipient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '100%' }}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '100%' }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem',
                                    background: '#111827',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <UserPlus size={18} /> Add
                            </button>
                        </form>
                    </div>

                    {/* Timeline Preview */}
                    <div style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Timeline</h4>
                        <div style={{ position: 'relative', paddingLeft: '1rem', borderLeft: '2px solid #e5e7eb' }}>
                            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                <div style={{ width: '10px', height: '10px', background: '#2563eb', borderRadius: '50%', position: 'absolute', left: '-1.35rem', top: '4px', border: '2px solid white', boxShadow: '0 0 0 2px #2563eb' }}></div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Draft Created</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Just now</div>
                            </div>
                            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                <div style={{ width: '10px', height: '10px', background: '#d1d5db', borderRadius: '50%', position: 'absolute', left: '-1.35rem', top: '4px', border: '2px solid white', boxShadow: '0 0 0 2px #d1d5db' }}></div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>To: {recipients.length > 0 ? recipients.map(r => r.name).join(', ') : '...'}</div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Pending sending</div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '10px', height: '10px', background: '#d1d5db', borderRadius: '50%', position: 'absolute', left: '-1.35rem', top: '4px', border: '2px solid white', boxShadow: '0 0 0 2px #d1d5db' }}></div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Completed</div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Future</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
                <button onClick={onBack} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>Back</button>
                <button onClick={onNext} disabled={recipients.length === 0} style={{ padding: '0.75rem 1.5rem', background: recipients.length > 0 ? '#4f46e5' : '#9ca3af', border: 'none', borderRadius: '8px', fontWeight: '600', color: 'white', cursor: recipients.length > 0 ? 'pointer' : 'not-allowed', boxShadow: recipients.length > 0 ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : 'none' }}>Continue to Review</button>
            </div>
        </div>
    );
};

export default RecipientManager;
