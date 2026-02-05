/**
 * File Type Utilities for DocTransfer
 * Centralized configuration for supported file types, MIME types, and utilities
 */

// File categories and their configurations
export const FILE_CATEGORIES = {
    documents: {
        label: 'Documents',
        extensions: ['pdf', 'docx', 'doc'],
        mimeTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ],
        previewable: ['pdf'],
        icon: 'FileText'
    },
    presentations: {
        label: 'Presentations',
        extensions: ['pptx', 'ppt', 'key', 'odp'],
        mimeTypes: [
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint',
            'application/x-iwork-keynote-sffkey',
            'application/vnd.oasis.opendocument.presentation'
        ],
        previewable: [],
        icon: 'Presentation'
    },
    spreadsheets: {
        label: 'Spreadsheets',
        extensions: ['xlsx', 'xls', 'csv', 'tsv', 'ods'],
        mimeTypes: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
            'text/tab-separated-values',
            'application/vnd.oasis.opendocument.spreadsheet'
        ],
        previewable: ['csv', 'tsv'],
        icon: 'Table'
    },
    images: {
        label: 'Images',
        extensions: ['png', 'jpg', 'jpeg'],
        mimeTypes: ['image/png', 'image/jpeg'],
        previewable: ['png', 'jpg', 'jpeg'],
        icon: 'Image'
    },
    video: {
        label: 'Videos',
        extensions: ['mp4', 'mov', 'avi', 'webm'],
        mimeTypes: [
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo',
            'video/webm'
        ],
        previewable: ['mp4', 'webm'],
        icon: 'Video'
    },
    audio: {
        label: 'Audio',
        extensions: ['ogg', 'm4a', 'mp3'],
        mimeTypes: ['audio/ogg', 'audio/mp4', 'audio/mpeg'],
        previewable: ['ogg', 'm4a', 'mp3'],
        icon: 'Music'
    },
    other: {
        label: 'Other',
        extensions: ['zip', 'kml', 'kmz'],
        mimeTypes: [
            'application/zip',
            'application/vnd.google-earth.kml+xml',
            'application/vnd.google-earth.kmz'
        ],
        previewable: [],
        icon: 'Package'
    }
} as const;

export type FileCategory = keyof typeof FILE_CATEGORIES;

/**
 * Get all supported extensions as array
 */
export const getAllExtensions = (): string[] => {
    return Object.values(FILE_CATEGORIES).flatMap(cat => cat.extensions);
};

/**
 * Get accept string for file input
 */
export const getAcceptString = (): string => {
    return getAllExtensions().map(ext => `.${ext}`).join(',');
};

/**
 * Get file category from extension
 */
export const getFileCategory = (extension: string): FileCategory | null => {
    const ext = extension.toLowerCase().replace('.', '');
    for (const [category, config] of Object.entries(FILE_CATEGORIES)) {
        if ((config.extensions as readonly string[]).includes(ext)) {
            return category as FileCategory;
        }
    }
    return null;
};

/**
 * Get file category from MIME type
 */
export const getFileCategoryByMime = (mimeType: string): FileCategory | null => {
    for (const [category, config] of Object.entries(FILE_CATEGORIES)) {
        if ((config.mimeTypes as readonly string[]).includes(mimeType)) {
            return category as FileCategory;
        }
    }
    return null;
};

/**
 * Check if file extension is previewable in browser
 */
export const isPreviewable = (extension: string): boolean => {
    const ext = extension.toLowerCase().replace('.', '');
    for (const config of Object.values(FILE_CATEGORIES)) {
        const previewableList = config.previewable as readonly string[];
        if (previewableList.includes(ext)) {
            return true;
        }
    }
    return false;
};

/**
 * Get preview type for rendering
 */
export const getPreviewType = (extension: string): 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'none' => {
    const ext = extension.toLowerCase().replace('.', '');

    if (['png', 'jpg', 'jpeg'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
    if (['ogg', 'm4a', 'mp3'].includes(ext)) return 'audio';
    if (ext === 'pdf') return 'pdf';
    if (['csv', 'tsv', 'txt'].includes(ext)) return 'text';

    return 'none';
};

/**
 * Get icon name for file type
 */
export const getFileIcon = (extension: string): string => {
    const category = getFileCategory(extension);
    if (category) {
        return FILE_CATEGORIES[category].icon;
    }
    return 'File';
};

/**
 * Get extension from filename
 */
export const getExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Check if file type is supported
 */
export const isSupported = (extension: string): boolean => {
    return getFileCategory(extension) !== null;
};

// Export the complete accept string as a constant for easy import
export const ACCEPT_FILE_TYPES = getAcceptString();
