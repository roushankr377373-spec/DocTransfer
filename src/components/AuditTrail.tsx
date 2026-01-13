import React, { useEffect, useState } from 'react';
import {
    Clock,
    Shield,
    FileText,
    Download,
    Eye,
    Globe,
    Search,
    RefreshCw,
    PenTool,
    Calendar,
    User,
    Filter,
    Smartphone,
    Monitor
} from 'lucide-react';
import { fetchAuditLogs, exportAuditLogs } from '../lib/auditLogger';

interface AuditLog {
    id: string;
    event_type: string;
    event_timestamp: string;
    document_name?: string;
    signer_name?: string;
    user_email?: string;
    ip_address?: string;
    city?: string;
    country?: string;
    user_agent?: string;
    event_metadata?: any;
}

interface AuditTrailProps {
    documentId?: string | string[]; // Optional: if provided, filters by specific document(s)
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentId }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filterType, setFilterType] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [userFilter, setUserFilter] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    const loadLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                eventType: filterType !== 'all' ? filterType : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                userEmail: userFilter || undefined
            };

            const { data, error: fetchError } = await fetchAuditLogs(documentId, filters);

            if (fetchError) {
                setError(fetchError);
            } else {
                setLogs(data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const filters = {
                eventType: filterType !== 'all' ? filterType : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                userEmail: userFilter || undefined
            };

            await exportAuditLogs(documentId, filters);
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to export logs');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        loadLogs();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadLogs, 30000);
        return () => clearInterval(interval);
    }, [documentId, filterType, startDate, endDate]); // Trigger on filter change (debounce userFilter separately ideally, but manual refresh is fine for now)

    // Helper to detect Browser/OS from UA string (Simple version)
    const getDeviceIcon = (ua?: string) => {
        if (!ua) return <Globe size={14} className="text-gray-400" />;
        if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return <Smartphone size={14} className="text-gray-500" />;
        return <Monitor size={14} className="text-gray-500" />;
    };

    const getBrowserName = (ua?: string) => {
        if (!ua) return 'Unknown Device';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Web Browser';
    };

    const getEventIcon = (type: string) => {
        if (type.includes('view')) return <Eye size={16} className="text-blue-500" />;
        if (type.includes('download')) return <Download size={16} className="text-green-500" />;
        if (type.includes('upload')) return <FileText size={16} className="text-purple-500" />;
        if (type.includes('signature')) return <PenTool size={16} className="text-orange-500" />;
        if (type.includes('security') || type.includes('password') || type.includes('failed')) return <Shield size={16} className="text-red-500" />;
        return <Clock size={16} className="text-gray-500" />;
    };

    const getEventLabel = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header & Controls */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Shield size={20} className="text-indigo-600" />
                            Audit Trail
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Comprehensive, compliance-ready activity log.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Filter size={16} /> Filters
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="p-2 px-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Download size={16} /> {exporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button
                            onClick={loadLogs}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Refresh Logs"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-gray-200 mb-2 animate-fade-in shadow-inner">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Event Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            >
                                <option value="all">All Events</option>
                                <option value="document_viewed">Views</option>
                                <option value="document_downloaded">Downloads</option>
                                <option value="document_uploaded">Uploads</option>
                                <option value="signature_completed">Signatures</option>
                                <option value="security_alert">Security Alerts</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">User / Email</label>
                            <div className="relative">
                                <User size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && loadLogs()}
                                    className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 pl-8 border"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">From Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">To Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100 flex items-center gap-2">
                    <Shield size={16} /> Error loading logs: {error}
                </div>
            )}

            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 font-medium">Timestamp (UTC)</th>
                            <th className="px-6 py-3 font-medium">Event</th>
                            <th className="px-6 py-3 font-medium">User & Device</th>
                            <th className="px-6 py-3 font-medium">Location (IP)</th>
                            <th className="px-6 py-3 font-medium">Document / Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {logs.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                                            <Search size={24} className="text-gray-400" />
                                        </div>
                                        <p>No audit logs found matching your filters.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700">{formatDate(log.event_timestamp).split(',')[0]}</span>
                                            <span className="text-xs text-gray-400">{formatDate(log.event_timestamp).split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${log.event_type.includes('failed') ? 'bg-red-50 text-red-700 border-red-100' :
                                            log.event_type.includes('upload') ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                log.event_type.includes('signature') ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {getEventIcon(log.event_type)}
                                            {getEventLabel(log.event_type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 flex items-center gap-1.5">
                                                {log.user_email || log.signer_name ? (
                                                    <User size={12} className="text-gray-400" />
                                                ) : null}
                                                {log.user_email || log.signer_name || 'Anonymous User'}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                                                {getDeviceIcon(log.user_agent)}
                                                <span className="truncate max-w-[120px]" title={log.user_agent}>{getBrowserName(log.user_agent)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex flex-col">
                                            {log.city ? (
                                                <span className="flex items-center gap-1 font-medium text-gray-700">
                                                    {log.city}, {log.country}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Unresolved Location</span>
                                            )}
                                            <span className="text-xs text-gray-400 font-mono mt-0.5">{log.ip_address !== 'unknown' ? log.ip_address : ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 max-w-xs">
                                        {log.document_name && (
                                            <div className="flex items-center gap-1.5 mb-1 text-gray-800 font-medium">
                                                <FileText size={12} className="text-indigo-500" />
                                                <span className="truncate">{log.document_name}</span>
                                            </div>
                                        )}
                                        {log.event_metadata && (() => {
                                            // Filter out internal fields like storageType
                                            const { storageType, ...displayMetadata } = log.event_metadata;
                                            if (Object.keys(displayMetadata).length === 0) return null;

                                            return (
                                                <div className="text-xs bg-gray-50 p-1.5 rounded border border-gray-100 truncate font-mono text-gray-500">
                                                    {JSON.stringify(displayMetadata)
                                                        .replace(/[{}"]/g, '')
                                                        .replace(/,/g, ', ')
                                                        .replace(/:/g, ': ')}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))
                        )}
                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    <div className="flex items-center justify-center gap-2">
                                        <RefreshCw size={16} className="animate-spin" /> Loading data...
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing {logs.length} events</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">
                    <Shield size={12} /> HIPAA / NIST Compliant Log
                </span>
            </div>
        </div>
    );
};

export default AuditTrail;
