import { useState } from 'react';
import { FileText, Download, Calendar, Activity, ShieldCheck, Clock, Layers, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsView({ reportsData = [] }) {

    const [timeFilter, setTimeFilter] = useState('today');


    const baseReports = reportsData.length > 0 ? reportsData : [
        { id: 1, missionCode: 'M-104', type: 'Blood Delivery', sector: 'Sector A-4', duration: '18 min', payload: '12 kg', status: 'Completed', date: new Date().toISOString().split('T')[0] },
        { id: 2, missionCode: 'M-103', type: 'Vaccine Transport', sector: 'Sector B-2', duration: '24 min', payload: '8 kg', status: 'Completed', date: new Date().toISOString().split('T')[0] },
        { id: 3, missionCode: 'M-102', type: 'Emergency Anti-Venom', sector: 'Sector C-1', duration: '15 min', payload: '5 kg', status: 'Completed', date: '2026-07-20' },
        { id: 4, missionCode: 'M-101', type: 'Plasma Supply', sector: 'Sector A-1', duration: '30 min', payload: '15 kg', status: 'Completed', date: '2026-07-15' }
    ];


    const filteredReports = baseReports.filter(item => {
        if (timeFilter === 'today') {
            const todayStr = new Date().toISOString().split('T')[0];
            return item.date === todayStr;
        }
        if (timeFilter === 'week') {

            return true;
        }
        return true; // 'all' time
    });


    const totalMissionsCount = filteredReports.length;
    const avgDeliveryTimeVal = totalMissionsCount > 0 ? '21 min' : '0 min';
    const totalPayloadVal = filteredReports.reduce((acc, curr) => acc + parseInt(curr.payload || 0), 0) + ' kg';


    const handleExportCSV = () => {
        const headers = ['Mission Code', 'Type', 'Sector', 'Duration', 'Payload', 'Status', 'Date'];
        const rows = filteredReports.map(r => [r.missionCode, r.type, r.sector, r.duration, r.payload, r.status, r.date]);

        let csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `drone_fleet_reports_${timeFilter}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Successfully exported reports as CSV (${timeFilter})!`, { icon: '📊' });
    };


    const handleExportPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Popup blocked! Please allow popups to download PDF reports.');
            return;
        }

        const htmlContent = `
            <html>
                <head>
                    <title>Drone Healthcare Logistics Report - Q3 2026</title>
                    <style>
                        body { font-family: monospace; padding: 30px; background: #fff; color: #111; }
                        h1 { color: #6d28d9; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
                        th { background: #f3f4f6; }
                        .summary { display: flex; gap: 20px; margin-top: 20px; font-size: 14px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>Drone Healthcare Logistics (DHP) - Mission Report</h1>
                    <p><strong>Filter Range:</strong> ${timeFilter.toUpperCase()} | <strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <div class="summary">
                        <div>Total Missions: ${totalMissionsCount}</div>
                        <div>Avg Delivery Time: ${avgDeliveryTimeVal}</div>
                        <div>Total Payload: ${totalPayloadVal}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Mission Code</th>
                                <th>Type</th>
                                <th>Sector</th>
                                <th>Duration</th>
                                <th>Payload</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredReports.map(r => `
                                <tr>
                                    <td>${r.missionCode}</td>
                                    <td>${r.type}</td>
                                    <td>${r.sector}</td>
                                    <td>${r.duration}</td>
                                    <td>${r.payload}</td>
                                    <td>${r.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        toast.success('PDF report generated successfully! Check your print dialog.', { icon: '📄' });
    };

    return (
        <div className="space-y-6">
            {/* Header & Export Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-darkBorder pb-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        <FileText className="text-neonPurple" size={22} />
                        Fleet Telemetry & Compliance Reports
                    </h2>
                    <p className="text-xs text-gray-400">Comprehensive analytics, mission audits, and document exports</p>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-darkCard border border-darkBorder hover:border-neonPurple text-xs font-bold text-gray-200 transition-all cursor-pointer shadow-md"
                    >
                        <Download size={14} className="text-emerald-400" /> Export CSV
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neonPurple/20 border border-neonPurple/40 hover:bg-neonPurple/30 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-neonPurple/10"
                    >
                        <Download size={14} className="text-neonPurple" /> Export PDF Report
                    </button>
                </div>
            </div>

            {/* Time Filter Bar */}
            <div className="flex items-center justify-between bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={16} className="text-neonPurple" />
                    <span>Filter Range:</span>
                </div>
                <div className="flex items-center gap-2">
                    {['today', 'week', 'all'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                                timeFilter === filter
                                    ? 'bg-neonPurple text-white shadow-lg shadow-neonPurple/20'
                                    : 'bg-[#181822] text-gray-400 border border-[#2a2a3c] hover:text-white'
                            }`}
                        >
                            {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between shadow-xl">
                    <div>
                        <p className="text-[10px] uppercase font-mono text-gray-400">Total Missions</p>
                        <h4 className="text-2xl font-bold text-white mt-1 font-mono">{totalMissionsCount}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-neonPurple/10 text-neonPurple border border-neonPurple/20">
                        <Activity size={20} />
                    </div>
                </div>

                <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between shadow-xl">
                    <div>
                        <p className="text-[10px] uppercase font-mono text-gray-400">Avg Delivery Time</p>
                        <h4 className="text-2xl font-bold text-white mt-1 font-mono">{avgDeliveryTimeVal}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between shadow-xl">
                    <div>
                        <p className="text-[10px] uppercase font-mono text-gray-400">Total Payload Transported</p>
                        <h4 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{totalPayloadVal}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Layers size={20} />
                    </div>
                </div>

                <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between shadow-xl">
                    <div>
                        <p className="text-[10px] uppercase font-mono text-gray-400">Compliance Audit</p>
                        <h4 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">100% Pass</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck size={20} />
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-[#2a2a3c] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-400" size={16} /> Filtered Flight Logs & Compliance Records ({timeFilter.toUpperCase()})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#16161e] text-gray-400 uppercase text-[10px] border-b border-[#2a2a3c]">
                        <tr>
                            <th className="p-4">Mission Code</th>
                            <th className="p-4">Delivery Type</th>
                            <th className="p-4">Sector Destination</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Payload Weight</th>
                            <th className="p-4">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a3c]/60 text-gray-300">
                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <tr key={report.id || report.missionCode} className="hover:bg-[#181822]/60 transition-colors">
                                    <td className="p-4 font-bold text-white">{report.missionCode}</td>
                                    <td className="p-4">{report.type}</td>
                                    <td className="p-4 text-gray-400">{report.sector}</td>
                                    <td className="p-4">{report.duration}</td>
                                    <td className="p-4 text-emerald-400 font-semibold">{report.payload}</td>
                                    <td className="p-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                {report.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 font-sans">
                                    No flight telemetry logs found for the selected time filter ("{timeFilter}").
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}