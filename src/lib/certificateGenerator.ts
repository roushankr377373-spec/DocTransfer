import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import CryptoJS from 'crypto-js';

interface AuditLog {
    event_timestamp: string;
    event_type: string;
    user_email?: string;
    ip_address?: string;
    description?: string; // Derived or direct
}

/**
 * Generates a Certificate of Completion page and appends it to the PDF.
 * @param pdfDoc The PDFDocument object to append to.
 * @param auditLogs List of audit events to display.
 * @param documentId The ID of the document.
 */
export async function generateCertificateOfCompletion(
    pdfDoc: PDFDocument,
    auditLogs: AuditLog[],
    documentId: string
): Promise<void> {
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // --- Header ---
    page.drawText('Certificate of Completion', {
        x: 50,
        y: y,
        size: 24,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
    });
    y -= 30;

    page.drawText(`Document ID: ${documentId}`, {
        x: 50,
        y: y,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
    });
    y -= 20;

    const dateStr = new Date().toLocaleString();
    page.drawText(`Generated on: ${dateStr}`, {
        x: 50,
        y: y,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
    });
    y -= 40;

    // --- Document Hash ---
    // We calculate hash of the PDF *content* before this page was added? 
    // Technically hard to do perfectly inside the same object generation flow without saving first.
    // For now, we will create a hash of the *Audit Trail* as a proxy for integrity of the process,
    // or we'd need to assume the caller passes a hash of the original doc.
    // Let's hash the Document ID + Audit Logs for a "Process Hash".
    const processData = JSON.stringify({ documentId, logs: auditLogs });
    const hash = CryptoJS.SHA256(processData).toString();

    page.drawText('Cryptographic Process Hash (SHA-256):', {
        x: 50,
        y: y,
        size: 12,
        font: boldFont,
    });
    y -= 15;
    page.drawText(hash, {
        x: 50,
        y: y,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
    });
    y -= 40;

    // --- Audit Log Table ---
    page.drawText('Audit Trail', {
        x: 50,
        y: y,
        size: 16,
        font: boldFont,
    });
    y -= 25;

    // Table Headers
    const col1X = 50; // Timestamp
    const col2X = 200; // Event
    const col3X = 400; // User/IP

    page.drawText('Timestamp', { x: col1X, y, size: 10, font: boldFont });
    page.drawText('Event', { x: col2X, y, size: 10, font: boldFont });
    page.drawText('User / IP', { x: col3X, y, size: 10, font: boldFont });
    y -= 5;

    // Line
    page.drawLine({
        start: { x: 50, y: y },
        end: { x: width - 50, y: y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });
    y -= 20;

    // Rows
    for (const log of auditLogs) {
        if (y < 50) {
            // New page if we run out of space
            // For simplicity in this MVP, we won't handle multi-page audit trails yet, 
            // or we just break loop.
            break;
        }

        const date = new Date(log.event_timestamp).toLocaleString();
        const eventType = formatEventType(log.event_type);
        const userInfo = `${log.user_email || 'Anonymous'}\n${log.ip_address || 'Unknown IP'}`;

        page.drawText(date, { x: col1X, y, size: 9, font });
        page.drawText(eventType, { x: col2X, y, size: 9, font });

        // Handle multi-line for user info
        page.drawText(log.user_email || 'Anonymous', { x: col3X, y, size: 9, font });
        page.drawText(log.ip_address || 'Unknown IP', { x: col3X, y: y - 10, size: 8, font, color: rgb(0.5, 0.5, 0.5) });

        y -= 30; // Row height
    }

    // Footer
    page.drawText('Securely signed via DocTransfer', {
        x: width / 2 - 60,
        y: 30,
        size: 10,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
    });
}

function formatEventType(type: string): string {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
