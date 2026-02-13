import React from 'react';
import CompareLayout from '../../components/CompareLayout';
import type { CompareFeature } from '../../components/CompareLayout';

const VsGoogleDrive: React.FC = () => {
    const features: CompareFeature[] = [
        { feature: 'View Tracking & Analytics', docTransfer: 'yes', docTransferNote: 'Page-by-page tracking', competitor: 'no', competitorNote: 'Basic "viewer" list only' },
        { feature: 'End-to-End Encryption', docTransfer: 'yes', docTransferNote: 'Google can\'t see your files', competitor: 'no', competitorNote: 'Google has the keys' },
        { feature: 'Dynamic Watermarking', docTransfer: 'yes', competitor: 'no' },
        { feature: 'E-Signatures', docTransfer: 'yes', competitor: 'no', competitorNote: 'Requires 3rd party addon' },
        { feature: 'Password Protection', docTransfer: 'yes', competitor: 'no', competitorNote: 'Only "anyone with link"' },
        { feature: 'File Expiration', docTransfer: 'yes', competitor: 'partial', competitorNote: 'Paid plans only' },
        { feature: 'Biometric Access Limit', docTransfer: 'yes', competitor: 'no' }
    ];

    return (
        <CompareLayout
            competitorName="Google Drive"
            title="DocTransfer vs Google Drive: Security vs Convenience"
            description="Google Drive is great for collaboration, but risky for sharing sensitive documents. Compare security features, analytics, and encryption."
            keywords="doctransfer vs google drive, google drive secure sharing alternative, secure document sharing vs google drive, track google drive links"
            heroSubtitle="Google Drive is built for collaboration. DocTransfer is built for security and control."
            features={features}
            verdict="Use Google Drive for internal team work. Use DocTransfer for sending anything sensitive to clients or investors."
            verdictDetails={[
                "Google scans your files; DocTransfer (with Vault Mode) cannot see them.",
                "Google Drive has zero analytics—you never know if they read it.",
                "DocTransfer prevents leaks with watermarking; Google Drive files are easily forwarded.",
                "DocTransfer makes you look professional; a G-Drive link looks like a draft."
            ]}
        />
    );
};

export default VsGoogleDrive;
