import React from 'react';
import CompareLayout from '../../components/CompareLayout';
import type { CompareFeature } from '../../components/CompareLayout';

const VsDocsend: React.FC = () => {
    const features: CompareFeature[] = [
        { feature: 'Free Plan', docTransfer: 'yes', docTransferNote: '10 uploads/day forever', competitor: 'no', competitorNote: '14-day trial only' },
        { feature: 'End-to-End Encryption', docTransfer: 'yes', docTransferNote: 'Zero-knowledge (Vault Mode)', competitor: 'no', competitorNote: 'Standard encryption' },
        { feature: 'Page-by-Page Analytics', docTransfer: 'yes', competitor: 'yes', competitorNote: 'Starting at $65/mo' },
        { feature: 'Dynamic Watermarking', docTransfer: 'yes', competitor: 'yes', competitorNote: 'Starting at $65/mo' },
        { feature: 'Built-in E-Signatures', docTransfer: 'yes', competitor: 'partial', competitorNote: 'Separate product/addon' },
        { feature: 'Biometric Gate (FaceID)', docTransfer: 'yes', competitor: 'no' },
        { feature: 'One-Click NDA', docTransfer: 'yes', competitor: 'yes', competitorNote: 'Enterprise plan' },
        { feature: 'Base Price', docTransfer: 'yes', docTransferNote: 'Free / $19m', competitor: 'no', competitorNote: '$15/mo - $65/mo' },
    ];

    return (
        <CompareLayout
            competitorName="DocSend"
            title="DocTransfer vs DocSend: The Best Free Alternative in 2026"
            description="Comparing DocTransfer and DocSend on price, security, and features. See why DocTransfer is the best free DocSend alternative for startups and freelancers."
            keywords="doctransfer vs docsend, docsend alternative, free docsend alternative, docsend pricing comparison, secure document sharing comparison"
            heroSubtitle="DocSend defined the category. DocTransfer perfected it—and made it affordable."
            features={features}
            verdict="DocTransfer is the clear winner for security-conscious users and those priced out of DocSend."
            verdictDetails={[
                "DocTransfer offers a generous FREE plan; DocSend has none.",
                "DocTransfer includes Vault Mode (E2EE) for true privacy.",
                "DocTransfer creates a legally binding audit trail with built-in e-signatures.",
                "DocSend is better if you specifically need their 'Spaces' deal room for enterprise-scale teams."
            ]}
        />
    );
};

export default VsDocsend;
