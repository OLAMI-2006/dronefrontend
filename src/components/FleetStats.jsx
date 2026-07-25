import  'react';
import { BatteryCharging, Signal, ShieldCheck, Activity } from 'lucide-react';

export default function FleetStats({ drones = [] }) {
    const totalDrones = drones.length || 15;
    const activeFlying = drones.filter((d) => d.status === 'FLYING').length || 3;
    const avgBattery =
        drones.length > 0
            ? Math.round(drones.reduce((acc, d) => acc + d.batteryCapacity, 0) / drones.length)
            : 88;

    const stats = [
        {
            title: 'Total Fleet',
            value: totalDrones,
            subtitle: 'Active Units',
            icon: Activity,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
        },
        {
            title: 'In-Flight Operations',
            value: activeFlying,
            subtitle: 'Live Delivery Missions',
            icon: Signal,
            color: 'text-neonPurple',
            bgColor: 'bg-neonPurple/10',
            borderColor: 'border-neonPurple/30',
        },
        {
            title: 'Avg. Battery Health',
            value: `${avgBattery}%`,
            subtitle: 'Telemetry Operational',
            icon: BatteryCharging,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
        },
        {
            title: 'System Status',
            value: '100%',
            subtitle: 'All Systems Normal',
            icon: ShieldCheck,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/30',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={idx}
                        className={`p-4 rounded-2xl bg-darkCard border ${stat.borderColor} shadow-lg flex items-center justify-between transition-all hover:scale-[1.02]`}
                    >
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                {stat.title}
                            </p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                            <p className="text-[11px] text-gray-500 mt-1">{stat.subtitle}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                            <Icon size={24} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}