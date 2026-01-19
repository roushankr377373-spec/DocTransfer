import React from 'react';
import { X } from 'lucide-react';

export type StampType = 'biohazard' | 'auth-square' | 'saito' | 'auth-simple' | 'authorized';

interface StampSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (stampType: StampType) => void;
}

export const STAMPS: Record<StampType, { label: string, component: React.ReactNode, width: number, height: number, svgString: string }> = {
    'biohazard': {
        label: 'Circles',
        width: 100,
        height: 100,
        component: (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                {/* Background Box */}
                <rect width="100" height="100" fill="#F59E0B" stroke="black" strokeWidth="2" />

                {/* Biohazard Symbol - Geometric Approximation */}
                <g transform="translate(50, 50) scale(0.8)">
                    <circle cx="0" cy="0" r="10" stroke="black" strokeWidth="6" fill="none" />
                    <g>
                        <circle cx="0" cy="-28" r="18" stroke="black" strokeWidth="6" fill="none" />
                        <circle cx="0" cy="-28" r="10" fill="none" /> {/* cutout illusion */}
                    </g>
                    <g transform="rotate(120)">
                        <circle cx="0" cy="-28" r="18" stroke="black" strokeWidth="6" fill="none" />
                    </g>
                    <g transform="rotate(240)">
                        <circle cx="0" cy="-28" r="18" stroke="black" strokeWidth="6" fill="none" />
                    </g>
                </g>
                {/* Fine tuning the cutouts to look like biohazard */}
                <path d="M50 42 L50 20 M50 42 L60 48 M50 42 L40 48" stroke="#F59E0B" strokeWidth="4" />

                {/* Better path for standard biohazard symbol */}
                <path fill="black" d="M50 15
                 C50 15 54 22 58 25
                 A 20 20 0 0 1 75 25
                 C 78 22 82 18 82 18
                 A 30 30 0 0 0 50 8
                 A 30 30 0 0 0 18 18
                 C 18 18 22 22 25 25
                 A 20 20 0 0 1 42 25
                 C 46 22 50 15 50 15
                 Z" transform="translate(0, 5)" />

                <path fill="black" d="M50 85
                 C 50 85 46 78 42 75
                 A 20 20 0 0 1 33 58
                 C 30 58 25 58 25 58
                 A 30 30 0 0 0 41 82
                 L 50 92
                 L 59 82
                 A 30 30 0 0 0 75 58
                 C 75 58 70 58 67 58
                 A 20 20 0 0 1 58 75
                 C 54 78 50 85 50 85
                 Z" transform="translate(0, -5)" />

                <circle cx="50" cy="50" r="12" stroke="black" strokeWidth="4" fill="none" />
                <circle cx="50" cy="50" r="6" fill="black" />
            </svg>
        ),
        svgString: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <rect width="100" height="100" fill="#F59E0B" stroke="black" stroke-width="2" />
            <g transform="translate(50, 50) scale(0.8)">
                <circle cx="0" cy="0" r="10" stroke="black" stroke-width="6" fill="none" />
                <g>
                    <circle cx="0" cy="-28" r="18" stroke="black" stroke-width="6" fill="none" />
                    <circle cx="0" cy="-28" r="10" fill="none" />
                </g>
                <g transform="rotate(120)">
                    <circle cx="0" cy="-28" r="18" stroke="black" stroke-width="6" fill="none" />
                </g>
                <g transform="rotate(240)">
                    <circle cx="0" cy="-28" r="18" stroke="black" stroke-width="6" fill="none" />
                </g>
            </g>
            <path d="M50 42 L50 20 M50 42 L60 48 M50 42 L40 48" stroke="#F59E0B" stroke-width="4" />
            <path fill="black" d="M50 15 C50 15 54 22 58 25 A 20 20 0 0 1 75 25 C 78 22 82 18 82 18 A 30 30 0 0 0 50 8 A 30 30 0 0 0 18 18 C 18 18 22 22 25 25 A 20 20 0 0 1 42 25 C 46 22 50 15 50 15 Z" transform="translate(0, 5)"/>
            <path fill="black" d="M50 85 C 50 85 46 78 42 75 A 20 20 0 0 1 33 58 C 30 58 25 58 25 58 A 30 30 0 0 0 41 82 L 50 92 L 59 82 A 30 30 0 0 0 75 58 C 75 58 70 58 67 58 A 20 20 0 0 1 58 75 C 54 78 50 85 50 85 Z" transform="translate(0, -5)"/>
            <circle cx="50" cy="50" r="12" stroke="black" stroke-width="4" fill="none" />
            <circle cx="50" cy="50" r="6" fill="black" />
        </svg>`
    },
    'auth-square': {
        label: 'Auth - square crop',
        width: 150,
        height: 60,
        component: (
            <svg viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <filter id="grunge-square">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                </defs>
                <g filter="url(#grunge-square)" opacity="0.9">
                    <rect x="4" y="4" width="142" height="52" rx="2" stroke="#DC2626" strokeWidth="2" fill="none" strokeDasharray="150 5 10 5" />
                    <rect x="8" y="8" width="134" height="44" rx="1" stroke="#DC2626" strokeWidth="1" fill="none" />
                    <text x="75" y="38" textAnchor="middle" fill="#DC2626" fontSize="22" fontFamily="serif" fontWeight="bold" letterSpacing="3">AUTHORIZED</text>
                </g>
            </svg>
        ),
        svgString: `<svg viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="150" height="60">
            <defs>
                <filter id="grunge-square">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
            </defs>
            <g filter="url(#grunge-square)" opacity="0.9">
                <rect x="4" y="4" width="142" height="52" rx="2" stroke="#DC2626" stroke-width="2" fill="none" stroke-dasharray="150 5 10 5" />
                <rect x="8" y="8" width="134" height="44" rx="1" stroke="#DC2626" stroke-width="1" fill="none" />
                <text x="75" y="38" text-anchor="middle" fill="#DC2626" font-size="22" font-family="serif" font-weight="bold" letter-spacing="3">AUTHORIZED</text>
            </g>
        </svg>`
    },
    'saito': {
        label: 'Saito',
        width: 80,
        height: 80,
        component: (
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <circle cx="40" cy="40" r="36" stroke="#DC2626" strokeWidth="2" fill="white" />
                <line x1="8" y1="26" x2="72" y2="26" stroke="#DC2626" strokeWidth="1" />
                <line x1="8" y1="54" x2="72" y2="54" stroke="#DC2626" strokeWidth="1" />
                <text x="40" y="20" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">2026.01.18</text>
                <text x="40" y="44" textAnchor="middle" fill="#DC2626" fontSize="20" fontFamily="serif" fontWeight="bold">斉藤</text>
                <text x="40" y="70" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">APPROVED</text>
            </svg>
        ),
        svgString: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
            <circle cx="40" cy="40" r="36" stroke="#DC2626" stroke-width="2" fill="white" />
            <line x1="8" y1="26" x2="72" y2="26" stroke="#DC2626" stroke-width="1" />
            <line x1="8" y1="54" x2="72" y2="54" stroke="#DC2626" stroke-width="1" />
            <text x="40" y="20" text-anchor="middle" fill="#DC2626" font-size="12" font-weight="bold" font-family="sans-serif">2026.01.18</text>
            <text x="40" y="44" text-anchor="middle" fill="#DC2626" font-size="20" font-family="serif" font-weight="bold">斉藤</text>
            <text x="40" y="70" text-anchor="middle" fill="#DC2626" font-size="12" font-weight="bold" font-family="sans-serif">APPROVED</text>
        </svg>`
    },
    'auth-simple': {
        label: 'Authorized - simple',
        width: 120,
        height: 120,
        component: (
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <circle cx="60" cy="60" r="48" stroke="#DC2626" strokeWidth="3" strokeDasharray="12 4" fill="none" transform="rotate(-15 60 60)" />
                <circle cx="60" cy="60" r="38" stroke="#DC2626" strokeWidth="1" fill="none" />
                <text x="60" y="65" textAnchor="middle" transform="rotate(-15 60 60)" fill="#DC2626" fontSize="16" fontWeight="bold" letterSpacing="1">AUTHORIZED</text>
            </svg>
        ),
        svgString: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
            <circle cx="60" cy="60" r="48" stroke="#DC2626" stroke-width="3" stroke-dasharray="12 4" fill="none" transform="rotate(-15 60 60)" />
            <circle cx="60" cy="60" r="38" stroke="#DC2626" stroke-width="1" fill="none" />
            <text x="60" y="65" text-anchor="middle" transform="rotate(-15 60 60)" fill="#DC2626" font-size="16" font-weight="bold" letter-spacing="1" font-family="sans-serif">AUTHORIZED</text>
        </svg>`
    },
    'authorized': {
        label: 'Authorized',
        width: 140,
        height: 60,
        component: (
            <svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <filter id="grunge-auth">
                        <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
                <g filter="url(#grunge-auth)" transform="rotate(-3 70 30)">
                    <rect x="5" y="5" width="130" height="50" rx="4" stroke="#D93025" strokeWidth="5" fill="none" />
                    <text x="70" y="38" textAnchor="middle" fill="#D93025" fontSize="24" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">AUTHORIZED</text>
                </g>
                <path d="M10 50 L130 15" stroke="#D93025" strokeWidth="2" opacity="0.4" transform="rotate(-3 70 30)" />
                <path d="M15 15 L125 45" stroke="#D93025" strokeWidth="2" opacity="0.4" transform="rotate(-3 70 30)" />
            </svg>
        ),
        svgString: `<svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="140" height="60">
            <defs>
                <filter id="grunge-auth">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
            <g filter="url(#grunge-auth)" transform="rotate(-3 70 30)">
                <rect x="5" y="5" width="130" height="50" rx="4" stroke="#D93025" stroke-width="5" fill="none" />
                <text x="70" y="38" text-anchor="middle" fill="#D93025" font-size="24" font-weight="900" font-family="sans-serif" letter-spacing="1">AUTHORIZED</text>
            </g>
            <path d="M10 50 L130 15" stroke="#D93025" stroke-width="2" opacity="0.4" transform="rotate(-3 70 30)" />
            <path d="M15 15 L125 45" stroke="#D93025" stroke-width="2" opacity="0.4" transform="rotate(-3 70 30)" />
        </svg>`
    }
};

const StampSelector: React.FC<StampSelectorProps> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Select Stamp</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f3f4f6',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '0.5rem', overflowY: 'auto' }}>
                    {Object.entries(STAMPS).map(([key, stamp]) => (
                        <div
                            key={key}
                            onClick={() => onSelect(key as StampType)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.5rem',
                                borderBottom: '1px solid #f3f4f6',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                gap: '2rem'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            <div style={{
                                width: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {stamp.component}
                            </div>
                            <div style={{ flex: 1 }}>
                                {key === 'biohazard' && (
                                    <span style={{
                                        background: '#DC2626',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        marginRight: '0.75rem'
                                    }}>Default</span>
                                )}
                                <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '500' }}>
                                    {stamp.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StampSelector;
