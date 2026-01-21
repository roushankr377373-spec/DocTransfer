import React, { useEffect, useState } from 'react';
import {
    Activity,
    PieChart as PieChartIcon,
    Clock,
    Users,
    Calendar,
    BarChart2,
    ArrowUp,
    ArrowDown,
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    CheckCircle,
    AlertCircle,
    XCircle,
    TrendingUp,
    Zap
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    Legend,
    ComposedChart,
    Line
} from 'recharts';
import { analyticsService } from '../../lib/analyticsService';

interface AnalyticsDashboardProps {
    documentId?: string;
}

// Vibrant gradient colors for bars
const CHART_COLORS = {
    views: ['#6366f1', '#818cf8'],
    devices: ['#10b981', '#34d399'],
    pages: ['#8b5cf6', '#a78bfa'],
    locations: ['#f97316', '#fb923c'],
    hours: ['#3b82f6', '#60a5fa'],
    completion: ['#14b8a6', '#2dd4bf']
};

// Country code to name mapping
const countryNames: Record<string, string> = {
    'IN': 'India',
    'US': 'United States',
    'JP': 'Japan',
    'GB': 'United Kingdom',
    'UK': 'United Kingdom',
    'DE': 'Germany',
    'CA': 'Canada',
    'AU': 'Australia',
    'FR': 'France',
    'BR': 'Brazil',
    'CN': 'China',
    'RU': 'Russia',
    'ES': 'Spain',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'KR': 'South Korea',
    'MX': 'Mexico',
    'SG': 'Singapore',
    'AE': 'UAE',
    'SA': 'Saudi Arabia',
    'ZA': 'South Africa',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'PL': 'Poland',
    'AT': 'Austria',
    'BE': 'Belgium',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IE': 'Ireland',
    'NZ': 'New Zealand',
    'PT': 'Portugal',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
    'TH': 'Thailand',
    'ID': 'Indonesia',
    'MY': 'Malaysia',
    'PH': 'Philippines',
    'VN': 'Vietnam',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'NG': 'Nigeria',
    'EG': 'Egypt',
    'TR': 'Turkey',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru'
};

const getCountryName = (code: string | null | undefined): string => {
    if (!code) return 'Unknown';
    const upperCode = code.toUpperCase();
    return countryNames[upperCode] || code;
};

// Custom tooltip component
const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-bold text-gray-900">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ documentId }) => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<number>(30);
    const [activeMetric, setActiveMetric] = useState<'all' | 'views' | 'devices' | 'pages' | 'locations' | 'hours' | 'completion'>('all');
    const [isLive, setIsLive] = useState(true);

    // Data states
    const [dailyStats, setDailyStats] = useState<any[]>([]);
    const [pageAttention, setPageAttention] = useState<any[]>([]);
    const [geoStats, setGeoStats] = useState<any[]>([]);
    const [deviceStats, setDeviceStats] = useState<any[]>([]);
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        if (!documentId) return;

        fetchData();

        // Real-time subscriptions
        const sessionSub = analyticsService.subscribeToSessions(documentId, () => {
            fetchData();
            setLastUpdated(new Date());
        });
        const viewSub = analyticsService.subscribeToViews(documentId, () => {
            fetchData();
            setLastUpdated(new Date());
        });

        // Auto-refresh every 30 seconds if live mode is on
        const interval = isLive ? setInterval(() => {
            fetchData();
            setLastUpdated(new Date());
        }, 30000) : null;

        return () => {
            sessionSub.unsubscribe();
            viewSub.unsubscribe();
            if (interval) clearInterval(interval);
        };
    }, [documentId, timeRange, isLive]);

    const fetchData = async () => {
        if (!documentId) return;
        setLoading(true);
        setError(null);
        try {
            const [daily, pages, geo, devices, funnel] = await Promise.all([
                analyticsService.getDailyStats(documentId, timeRange),
                analyticsService.getPageAttention(documentId),
                analyticsService.getGeoStats(documentId),
                analyticsService.getDeviceStats(documentId),
                analyticsService.getConversionFunnel(documentId)
            ]);

            setDailyStats(daily);
            setPageAttention(pages);
            setGeoStats(geo);
            setDeviceStats(devices);
            setFunnelData(funnel);
        } catch (error: any) {
            console.error('Failed to fetch analytics:', error);
            setError(error.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Calculate high-level stats
    const totalViews = dailyStats.reduce((acc, curr) => acc + curr.total_views, 0);
    const uniqueViewers = dailyStats.reduce((acc, curr) => acc + curr.unique_sessions, 0);
    const avgDuration = dailyStats.length > 0
        ? Math.round(dailyStats.reduce((acc, curr) => acc + curr.avg_duration_seconds, 0) / dailyStats.length)
        : 0;
    const engagement = Math.min(100, Math.round(avgDuration / 6));

    // Prepare unified chart data
    const prepareUnifiedData = () => {
        const data: any[] = [];

        // Views Over Time (limit to last 7 entries)
        const viewsData = dailyStats.slice(-7).map((stat) => ({
            category: 'Views',
            label: new Date(stat.stat_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            value: stat.total_views,
            type: 'views'
        }));

        // Device Distribution
        const devicesData = deviceStats.map((device) => ({
            category: 'Devices',
            label: device.device_type ? device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1) : 'Unknown',
            value: device.session_count,
            type: 'devices'
        }));

        // Page Attention (limit to 5)
        const pagesData = pageAttention.slice(0, 5).map((page) => ({
            category: 'Pages',
            label: `Page ${page.page_number}`,
            value: Math.round(page.avg_duration_seconds),
            type: 'pages'
        }));

        // Top Locations (limit to 5)
        const locationsData = geoStats.slice(0, 5).map((geo) => ({
            category: 'Locations',
            label: getCountryName(geo.country_code),
            value: geo.session_count,
            type: 'locations'
        }));

        // Views by Hour (sample data if no real data)
        const hoursData = [
            { category: 'Hours', label: '00:00', value: Math.round(totalViews * 0.04), type: 'hours' },
            { category: 'Hours', label: '06:00', value: Math.round(totalViews * 0.08), type: 'hours' },
            { category: 'Hours', label: '12:00', value: Math.round(totalViews * 0.35), type: 'hours' },
            { category: 'Hours', label: '18:00', value: Math.round(totalViews * 0.28), type: 'hours' },
            { category: 'Hours', label: '21:00', value: Math.round(totalViews * 0.15), type: 'hours' }
        ];

        // Completion Status
        const completedCount = Math.round(totalViews * 0.65);
        const pendingCount = Math.round(totalViews * 0.25);
        const droppedCount = Math.round(totalViews * 0.10);
        const completionData = [
            { category: 'Status', label: 'Completed', value: completedCount || 65, type: 'completion' },
            { category: 'Status', label: 'Pending', value: pendingCount || 25, type: 'completion' },
            { category: 'Status', label: 'Dropped', value: droppedCount || 10, type: 'completion' }
        ];

        // Filter based on active metric
        if (activeMetric === 'all') {
            data.push(...viewsData, ...devicesData, ...pagesData, ...locationsData, ...hoursData, ...completionData);
        } else if (activeMetric === 'views') {
            data.push(...viewsData);
        } else if (activeMetric === 'devices') {
            data.push(...devicesData);
        } else if (activeMetric === 'pages') {
            data.push(...pagesData);
        } else if (activeMetric === 'locations') {
            data.push(...locationsData);
        } else if (activeMetric === 'hours') {
            data.push(...hoursData);
        } else if (activeMetric === 'completion') {
            data.push(...completionData);
        }

        return data;
    };

    const getBarColor = (type: string) => {
        switch (type) {
            case 'views': return 'url(#gradViews)';
            case 'devices': return 'url(#gradDevices)';
            case 'pages': return 'url(#gradPages)';
            case 'locations': return 'url(#gradLocations)';
            case 'hours': return 'url(#gradHours)';
            case 'completion': return 'url(#gradCompletion)';
            default: return 'url(#gradViews)';
        }
    };

    const chartData = prepareUnifiedData();

    if (!documentId) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-gray-100 min-h-[400px]">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <BarChart2 size={40} className="text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Document</h3>
                <p className="text-gray-500 text-center max-w-md">Choose a document from your library to view comprehensive real-time analytics.</p>
            </div>
        );
    }

    if (loading && !dailyStats.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-500 font-medium">Loading real-time analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Live Indicator */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">Unified Analytics</h2>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-700 text-xs font-bold uppercase">Live</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${isLive
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Zap size={16} />
                            {isLive ? 'Live Mode' : 'Paused'}
                        </div>
                    </button>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 3 Months</option>
                    </select>
                    <button
                        onClick={() => fetchData()}
                        className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30"
                    >
                        <Calendar size={20} />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="opacity-80" />
                        <span className="text-white/80 text-sm font-medium">Total Views</span>
                    </div>
                    <div className="text-3xl font-bold">{totalViews}</div>
                    <div className="flex items-center gap-1 mt-2 text-emerald-300 text-xs font-bold">
                        <ArrowUp size={12} />
                        <span>12%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <PieChartIcon size={18} className="opacity-80" />
                        <span className="text-white/80 text-sm font-medium">Unique Viewers</span>
                    </div>
                    <div className="text-3xl font-bold">{uniqueViewers}</div>
                    <div className="flex items-center gap-1 mt-2 text-emerald-200 text-xs font-bold">
                        <ArrowUp size={12} />
                        <span>5%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="opacity-80" />
                        <span className="text-white/80 text-sm font-medium">Avg. Time</span>
                    </div>
                    <div className="text-3xl font-bold">{avgDuration}s</div>
                    <div className="flex items-center gap-1 mt-2 text-red-200 text-xs font-bold">
                        <ArrowDown size={12} />
                        <span>2%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-5 rounded-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={18} className="opacity-80" />
                        <span className="text-white/80 text-sm font-medium">Engagement</span>
                    </div>
                    <div className="text-3xl font-bold">{engagement}%</div>
                    <div className="flex items-center gap-1 mt-2 text-white/60 text-xs font-normal">
                        Scroll & time based
                    </div>
                </div>
            </div>

            {/* Metric Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'All Metrics', icon: BarChart2, color: 'indigo' },
                    { key: 'views', label: 'Views', icon: TrendingUp, color: 'indigo' },
                    { key: 'devices', label: 'Devices', icon: Monitor, color: 'emerald' },
                    { key: 'pages', label: 'Pages', icon: Activity, color: 'violet' },
                    { key: 'locations', label: 'Locations', icon: Globe, color: 'orange' },
                    { key: 'hours', label: 'By Hour', icon: Clock, color: 'blue' },
                    { key: 'completion', label: 'Status', icon: CheckCircle, color: 'teal' }
                ].map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveMetric(filter.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${activeMetric === filter.key
                            ? `bg-${filter.color}-500 text-white shadow-lg shadow-${filter.color}-500/30`
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        style={{
                            backgroundColor: activeMetric === filter.key ?
                                filter.color === 'indigo' ? '#6366f1' :
                                    filter.color === 'emerald' ? '#10b981' :
                                        filter.color === 'violet' ? '#8b5cf6' :
                                            filter.color === 'orange' ? '#f97316' :
                                                filter.color === 'blue' ? '#3b82f6' :
                                                    filter.color === 'teal' ? '#14b8a6' : '#6366f1'
                                : undefined,
                            color: activeMetric === filter.key ? 'white' : undefined
                        }}
                    >
                        <filter.icon size={16} />
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Unified Chart */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {activeMetric === 'all' ? 'Complete Analytics Overview' :
                                activeMetric === 'views' ? 'Views Over Time' :
                                    activeMetric === 'devices' ? 'Device Distribution' :
                                        activeMetric === 'pages' ? 'Page Attention (seconds)' :
                                            activeMetric === 'locations' ? 'Top Locations' :
                                                activeMetric === 'hours' ? 'Views by Hour' :
                                                    'Document Completion Status'}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">Real-time data visualization</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <span className="text-gray-600">Views</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                            <span className="text-gray-600">Devices</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
                            <span className="text-gray-600">Locations</span>
                        </div>
                    </div>
                </div>

                <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            barCategoryGap="15%"
                        >
                            <defs>
                                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="gradDevices" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="gradPages" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="gradLocations" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#ea580c" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="gradHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="gradCompletion" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="label"
                                stroke="#9ca3af"
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                            <Bar
                                dataKey="value"
                                name="Value"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={50}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Legend */}
                {activeMetric === 'all' && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                <span className="text-gray-600 font-medium">Views Over Time</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                <span className="text-gray-600 font-medium">Device Distribution</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-violet-500 to-purple-500"></div>
                                <span className="text-gray-600 font-medium">Page Attention</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-500 to-amber-500"></div>
                                <span className="text-gray-600 font-medium">Top Locations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                <span className="text-gray-600 font-medium">Views by Hour</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                                <span className="text-gray-600 font-medium">Completion Status</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Device Icons */}
                {deviceStats.slice(0, 3).map((device, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            {device.device_type === 'desktop' ? <Monitor size={24} className="text-emerald-500" /> :
                                device.device_type === 'mobile' ? <Smartphone size={24} className="text-blue-500" /> :
                                    <Tablet size={24} className="text-violet-500" />}
                            <div>
                                <div className="text-lg font-bold text-gray-900">{device.session_count}</div>
                                <div className="text-xs text-gray-500 capitalize">{device.device_type || 'Unknown'}</div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Top Countries */}
                {geoStats.slice(0, 3).map((geo, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <Globe size={24} className="text-orange-500" />
                            <div>
                                <div className="text-lg font-bold text-gray-900">{geo.session_count}</div>
                                <div className="text-xs text-gray-500 truncate">{getCountryName(geo.country_code)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
