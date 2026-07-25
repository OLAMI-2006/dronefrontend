import   'react';
import { Battery, BatteryCharging, Navigation, Send, MoreVertical } from 'lucide-react';

export default function DroneTable({ drones = [] }) {
    const MIN_BATTERY_FOR_LAUNCH = 20;


    const handleTakeoff = async (droneId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/drones/${droneId}/takeoff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetLat: 6.5244, targetLng: 3.3792 })
            });

            if (response.ok) {
                console.log(`Takeoff initiated for Drone #${droneId}`);
            } else {
                console.error(`Failed to trigger takeoff for Drone #${droneId}`);
            }
        } catch (error) {
            console.error('Error connecting to backend:', error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'FLYING':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neonPurple/20 text-neonPurple border border-neonPurple/40 animate-pulse">
                        ● In-Flight
                    </span>
                );
            case 'IDLE':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        ● Ready
                    </span>
                );
            case 'CHARGING':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        ● Charging
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        ● Maintenance
                    </span>
                );
        }
    };

    const renderActionButton = (drone) => {
        const isBatteryReady = drone.batteryCapacity >= MIN_BATTERY_FOR_LAUNCH;

        switch (drone.status) {
            case 'FLYING':
                return (
                    <button
                        disabled
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neonPurple/20 text-neonPurple border border-neonPurple/40 text-xs font-medium opacity-90 cursor-default"
                    >
                        <Send size={12} /> In-Flight
                    </button>
                );

            case 'IDLE':
                return isBatteryReady ? (
                    <button
                        onClick={() => handleTakeoff(drone.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neonPurple/20 text-neonPurple border border-neonPurple/40 hover:bg-neonPurple/30 transition-colors text-xs font-medium"
                    >
                        <Send size={12} /> Launch
                    </button>
                ) : (
                    <button
                        disabled
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-medium opacity-60 cursor-not-allowed"
                    >
                        <Send size={12} /> Unable to Launch
                    </button>
                );

            case 'CHARGING':
                return (
                    <button
                        disabled
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium opacity-60 cursor-not-allowed"
                    >
                        <Send size={12} /> Unable to Launch
                    </button>
                );

            case 'MAINTENANCE':
            default:
                return (
                    <button
                        disabled
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-500/10 text-gray-400 border border-gray-500/30 text-xs font-medium opacity-60 cursor-not-allowed"
                    >
                        <Send size={12} /> Unavailable
                    </button>
                );
        }
    };

    return (
        <div className="bg-darkCard border border-darkBorder rounded-2xl p-4 sm:p-6 shadow-xl w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">Drone Fleet Roster</h2>
                    <p className="text-xs text-gray-400">Live operational telemetry & status</p>
                </div>
                <span className="text-xs bg-darkBg border border-darkBorder px-3 py-1 rounded-full text-gray-400">
                    Total Registered: {drones.length}
                </span>
            </div>

            {/* Responsive Scrollable Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-darkBorder text-xs text-gray-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Serial Number</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Battery</th>
                        <th className="py-3 px-4">Coordinates</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-darkBorder/50 text-sm">
                    {drones.map((drone) => (
                        <tr key={drone.id} className="hover:bg-darkBg/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-medium text-white flex items-center gap-2">
                                <Navigation size={14} className="text-neonPurple" />
                                {drone.serialNumber}
                            </td>
                            <td className="py-3.5 px-4">{getStatusBadge(drone.status)}</td>
                            <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                    {drone.batteryCapacity > 50 ? (
                                        <BatteryCharging size={16} className="text-emerald-400" />
                                    ) : (
                                        <Battery size={16} className="text-rose-400" />
                                    )}
                                    <div className="w-16 bg-darkBg rounded-full h-2 overflow-hidden border border-darkBorder">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                drone.batteryCapacity > 50
                                                    ? 'bg-emerald-400'
                                                    : drone.batteryCapacity >= MIN_BATTERY_FOR_LAUNCH
                                                        ? 'bg-amber-400'
                                                        : 'bg-rose-500'
                                            }`}
                                            style={{ width: `${drone.batteryCapacity}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-300">
                                            {drone.batteryCapacity}%
                                        </span>
                                </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-gray-400">
                                {drone.latitude?.toFixed(4)}, {drone.longitude?.toFixed(4)}
                            </td>
                            <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                                {/* Uniform action button with arrow icon for all statuses */}
                                {renderActionButton(drone)}

                                <button className="p-1.5 rounded-lg hover:bg-darkBg text-gray-400 hover:text-white transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}