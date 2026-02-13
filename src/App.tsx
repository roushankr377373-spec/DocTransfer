import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Pricing from './Pricing'
import PaymentSuccess from './PaymentSuccess'
import DataRoom from './DataRoom'
import DocumentSharing from './DocumentSharing'
import SettingsPage from './pages/SettingsPage'
import ViewDocument from './ViewDocument'
import SignDocument from './SignDocument'
import ProtectedRoute from './components/ProtectedRoute'
import BlogIndex from './pages/BlogIndex'

// Blog Posts
import DocsendAlternatives from './pages/blog/DocsendAlternatives'
import SecureDocumentSharing from './pages/blog/SecureDocumentSharing'
import EndToEndEncryption from './pages/blog/EndToEndEncryption'
import WatermarkDocuments from './pages/blog/WatermarkDocuments'
import EmailAttachmentRisks from './pages/blog/EmailAttachmentRisks'
import RealEstateDocSecurity from './pages/blog/RealEstateDocSecurity'
import VirtualDataRooms from './pages/blog/VirtualDataRooms'
import PitchDeckSharing from './pages/blog/PitchDeckSharing'
import NdaSigningGuide from './pages/blog/NdaSigningGuide'
import LawFirmDocSecurity from './pages/blog/LawFirmDocSecurity'
import DocumentAnalytics from './pages/blog/DocumentAnalytics'
import FreeESignatureTools from './pages/blog/FreeESignatureTools'

// Comparison Pages
import VsDocsend from './pages/compare/VsDocsend'
import VsDocusign from './pages/compare/VsDocusign'
import VsGoogleDrive from './pages/compare/VsGoogleDrive'
import VsDropbox from './pages/compare/VsDropbox'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* SEO Content Routes */}
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/docsend-alternatives" element={<DocsendAlternatives />} />
      <Route path="/blog/secure-document-sharing" element={<SecureDocumentSharing />} />
      <Route path="/blog/end-to-end-encryption" element={<EndToEndEncryption />} />
      <Route path="/blog/watermark-documents" element={<WatermarkDocuments />} />
      <Route path="/blog/email-attachment-risks" element={<EmailAttachmentRisks />} />
      <Route path="/blog/real-estate-document-sharing" element={<RealEstateDocSecurity />} />
      <Route path="/blog/virtual-data-room-guide" element={<VirtualDataRooms />} />
      <Route path="/blog/pitch-deck-sharing" element={<PitchDeckSharing />} />
      <Route path="/blog/nda-signing-guide" element={<NdaSigningGuide />} />
      <Route path="/blog/law-firm-document-security" element={<LawFirmDocSecurity />} />
      <Route path="/blog/document-analytics" element={<DocumentAnalytics />} />
      <Route path="/blog/free-esignature-tools" element={<FreeESignatureTools />} />

      <Route path="/compare/docsend-alternative" element={<VsDocsend />} />
      <Route path="/compare/docusign-alternative" element={<VsDocusign />} />
      <Route path="/compare/google-drive-alternative" element={<VsGoogleDrive />} />
      <Route path="/compare/dropbox-alternative" element={<VsDropbox />} />

      {/* Public Routes */}
      <Route path="/view/:shareLink" element={<ViewDocument />} />
      <Route path="/sign/:signingLink" element={<SignDocument />} />

      {/* Application Routes */}
      <Route
        path="/dataroom"
        element={
          <ProtectedRoute>
            <DataRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document-sharing"
        element={
          <ProtectedRoute>
            <DocumentSharing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
