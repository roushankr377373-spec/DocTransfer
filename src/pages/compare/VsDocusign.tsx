import React from 'react';
import CompareLayout from '../../components/CompareLayout';
import type { CompareFeature } from '../../components/CompareLayout';

const VsDocusign: React.FC = () => {
    const features: CompareFeature[] = [
        { feature: 'Legally Binding E-Signatures', docTransfer: 'yes', competitor: 'yes', competitorNote: 'Industry standard' },
        { feature: 'Document Analytics (Time per page)', docTransfer: 'yes', competitor: 'no', competitorNote: 'Signature status only' },
        { feature: 'Dynamic Watermarking', docTransfer: 'yes', competitor: 'no' },
        { feature: 'Free Plan', docTransfer: 'yes', docTransferNote: '10 uploads/day', competitor: 'no', competitorNote: 'Paid plans only' },
        { feature: 'End-to-End Encryption', docTransfer: 'yes', competitor: 'partial', competitorNote: 'Enterprise add-on' },
        { feature: 'Secure File Sharing', docTransfer: 'yes', competitor: 'no', competitorNote: 'Sending only' },
        { feature: 'Biometric ID Verification', docTransfer: 'yes', competitor: 'yes', competitorNote: 'ID Verification addon ($$)' },
    ];

    return (
        <CompareLayout
            competitorName="DocuSign"
            title="DocTransfer vs DocuSign: More Than Just Signatures"
            description="DocuSign is for signing. DocTransfer is for sharing AND signing. Compare features, pricing, and security."
            keywords="doctransfer vs docusign, docusign alternative, free docusign alternative, e-signature comparison"
            heroSubtitle="DocuSign is the giant of e-signatures. DocTransfer is the modern, secure way to share AND sign."
            features={features}
            verdict="Use DocTransfer if you need to engage with documents (analytics, secure sharing) before signing them."
            verdictDetails={[
                "DocTransfer lets you track *reading* behavior, not just signing status.",
                "DocTransfer is significantly cheaper for small teams.",
                "DocuSign is better if you need complex enterprise workflows (e.g. 20-person signing chains).",
                "DocTransfer combines the data room + the signature tool in one."
            ]}
        />
    );
};

export default VsDocusign;
