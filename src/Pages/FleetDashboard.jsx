import { useState, useEffect } from 'react';
import { Radio, Compass, Gauge, ShieldAlert, Navigation, TrendingUp, Zap, ShieldCheck } from 'lucide-react';
import TacticalMap from '../components/TacticalMap.jsx';

export default function FleetDashboard({ drones = [] }) {
    const [selectedDroneId, setSelectedDroneId] = useState(drones[0]?.id || 1);
    const [timeRange, setTimeRange] = useState('Flight Hours');
    const [chartOffset, setChartOffset] = useState(0);
    const selectedDrone = drones.find(d => d.id === selectedDroneId) || drones[0];


    useEffect(() => {
        const interval = setInterval(() => {
            setChartOffset(prev => (prev + 1) % 20);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-darkBorder pb-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        <Radio className="text-neonPurple animate-pulse" size={22} />
                        Fleet Performance Summary & Tactical Operations
                    </h2>
                    <p className="text-xs text-gray-400">Granular flight telemetry and live animated trends</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                        ● Airspace Clear (Sector A-4)
                    </span>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-8 bg-[#121218] border border-[#2a2a3c] rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-[#2a2a3c] pb-3">
                        <div>
                            <h3 className="text-sm font-bold text-white">Fleet Performance Summary</h3>
                            <p className="text-[10px] text-gray-400">Live Fluctuating Drone Utilization and Delivery Volume Growth</p>
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-[#181822] text-xs text-gray-300 border border-[#2a2a3c] rounded-xl px-3 py-1.5 focus:outline-none"
                        >
                            <option value="Flight Hours">Flight Hours</option>
                            <option value="Deliveries">Delivery Volume</option>
                        </select>
                    </div>

                    <div className="h-56 flex flex-col justify-end relative p-2 bg-[#16161e]/40 rounded-xl border border-[#2a2a3c]/60 overflow-hidden">
                        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                            <div className="border-b border-gray-600 w-full"></div>
                            <div className="border-b border-gray-600 w-full"></div>
                            <div className="border-b border-gray-600 w-full"></div>
                            <div className="border-b border-gray-600 w-full"></div>
                        </div>

                        <svg className="absolute inset-0 w-full h-full p-4 overflow-visible transition-all duration-300" preserveAspectRatio="none" viewBox="0 0 400 200">
                            <path
                                d={`M 0,${160 - (chartOffset % 10)} Q 100,${120 + (chartOffset % 8)} 200,${90 - (chartOffset % 12)} T 400,${30 + (chartOffset % 6)}`}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2.5"
                            />
                            <path
                                d={`M 0,${180 + (chartOffset % 8)} Q 120,${130 - (chartOffset % 10)} 250,${70 + (chartOffset % 14)} T 400,${20 - (chartOffset % 5)}`}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2.5"
                            />
                        </svg>

                        <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-auto pt-2 z-10 border-t border-[#2a2a3c]">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>
                </div>


                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-mono text-gray-400">Avg. Mission Duration</p>
                            <h4 className="text-2xl font-bold text-white mt-1">18 min</h4>
                        </div>
                        <div className="p-3 rounded-xl bg-neonPurple/10 text-neonPurple border border-neonPurple/20">
                            <Zap size={20} />
                        </div>
                    </div>

                    <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-mono text-gray-400">Fleet Uptime</p>
                            <h4 className="text-2xl font-bold text-white mt-1">98.2%</h4>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-mono text-gray-400">Delivery Success Rate</p>
                            <h4 className="text-2xl font-bold text-emerald-400 mt-1">99.7%</h4>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Active Fleet Telemetry
                    </h3>

                    <div className="space-y-2.5">
                        {drones.map((drone) => {
                            const isSelected = drone.id === selectedDroneId;
                            return (
                                <div
                                    key={drone.id}
                                    onClick={() => setSelectedDroneId(drone.id)}
                                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                        isSelected
                                            ? 'bg-darkCard border-neonPurple shadow-lg shadow-neonPurple/10'
                                            : 'bg-darkCard/50 border-darkBorder hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Navigation size={15} className={isSelected ? 'text-neonPurple' : 'text-gray-400'} />
                                            <span className="font-mono font-bold text-sm text-white">
                                                {drone.serialNumber}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            drone.status === 'FLYING' ? 'bg-neonPurple/20 text-neonPurple border border-neonPurple/30' :
                                                drone.status === 'RETURNING' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                    drone.status === 'HOVERING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                            {drone.status}
                                        </span>
                                    </div>


                                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-gray-400 pt-2 border-t border-darkBorder/50">
                                        <div>
                                            <span className="text-[9px] text-gray-500 block uppercase">Battery</span>
                                            <span className={drone.batteryCapacity < 20 ? 'text-rose-400 font-bold' : 'text-gray-200'}>
                                                {drone.batteryCapacity}%
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-gray-500 block uppercase">Altitude</span>
                                            <span className="text-gray-200">{drone.altitude ?? 120} m</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-gray-500 block uppercase">Speed</span>
                                            <span className="text-gray-200">{drone.speed ?? 42} km/h</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Live Flight Controller HUD: {selectedDrone?.serialNumber}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-darkCard border border-darkBorder rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Gauge size={14} className="text-neonPurple" /> Speed
                            </div>
                            <p className="text-lg font-mono font-bold text-white">{selectedDrone?.speed ?? 45.2} <span className="text-xs text-gray-500">km/h</span></p>
                        </div>

                        <div className="bg-darkCard border border-darkBorder rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Compass size={14} className="text-blue-400" /> Heading / Yaw
                            </div>
                            <p className="text-lg font-mono font-bold text-white">084° <span className="text-xs text-gray-500">ENE</span></p>
                        </div>

                        <div className="bg-darkCard border border-darkBorder rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Radio size={14} className="text-emerald-400" /> Link Quality
                            </div>
                            <p className="text-lg font-mono font-bold text-emerald-400">98% <span className="text-xs text-gray-500">(5G)</span></p>
                        </div>

                        <div className="bg-darkCard border border-darkBorder rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <ShieldAlert size={14} className="text-amber-400" /> GPS Satellites
                            </div>
                            <p className="text-lg font-mono font-bold text-white">18 <span className="text-xs text-gray-500">Locked</span></p>
                        </div>
                    </div>


                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                            <span>Live Map Focus: <strong className="text-neonPurple">{selectedDrone?.serialNumber}</strong></span>
                            <span>Coords: {selectedDrone?.currentLatitude?.toFixed(4) ?? '6.5244'}, {selectedDrone?.currentLongitude?.toFixed(4) ?? '3.3792'}</span>
                        </div>

                        <TacticalMap
                            drones={drones}
                            selectedDroneId={selectedDroneId}
                            onSelectDrone={(id) => setSelectedDroneId(id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}