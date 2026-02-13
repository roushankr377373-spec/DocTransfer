import React from 'react';
import CompareLayout from '../../components/CompareLayout';
import type { CompareFeature } from '../../components/CompareLayout';

const VsDropbox: React.FC = () => {
    const features: CompareFeature[] = [
        { feature: 'Page-Level Analytics', docTransfer: 'yes', competitor: 'no', competitorNote: 'Only on "DocSend" plan' },
        { feature: 'End-to-End Encryption', docTransfer: 'yes', competitor: 'no', competitorNote: 'Standard encryption only' },
        { feature: 'Dynamic Watermarking', docTransfer: 'yes', competitor: 'partial', competitorNote: 'Professional plans only' },
        { feature: 'Biometric Gate (FaceID)', docTransfer: 'yes', competitor: 'no' },
        { feature: 'Built-in E-Signatures', docTransfer: 'yes', competitor: 'yes', competitorNote: 'Dropbox Sign (separate)' },
        { feature: 'Free Plan', docTransfer: 'yes', docTransferNote: '10 uploads/day', competitor: 'yes', competitorNote: '2GB storage limit' }
    ];

    return (
        <CompareLayout
            competitorName="Dropbox"
            title="DocTransfer vs Dropbox: Secure Sharing Comparison"
            description="Moving beyond file storage. Compare DocTransfer's specialized secure sharing features against Dropbox's general cloud storage."
            keywords="doctransfer vs dropbox, dropbox secure sharing, dropbox alternative for business, secure file transfer comparison"
            heroSubtitle="Dropbox stores your files. DocTransfer protects them when you share."
            features={features}
            verdict="Dropbox is a hard drive in the cloud. DocTransfer is a secure courier service."
            verdictDetails={[
                "Dropbox is great for backing up files, but weak for sharing sensitive ones.",
                "DocTransfer gives you 'superpowers' like seeing exactly when a client opens a file.",
                "To get these features in Dropbox, you have to pay for their DocSend acquisition ($65/mo).",
                "DocTransfer includes them for free."
            ]}
        />
    );
};

export default VsDropbox;
