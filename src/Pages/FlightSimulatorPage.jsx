import { useState } from 'react';
import DroneVisualizer3D from '../components/DroneVisualizer3D';
import { Navigation, Play, Square, Layers, Wind } from 'lucide-react';

export default function FlightSimulatorPage() {
    const [selectedRoute, setSelectedRoute] = useState('depot-to-hospital-a');
    const [isPlaying, setIsPlaying] = useState(false); // Starts paused until you hit Launch
    const [terrainMode, setTerrainMode] = useState('urban'); // 'urban' or 'mountain'
    const [simKey, setSimKey] = useState(0); // Resets flight position when launched

    const currentTelemetry = {
        speed: isPlaying ? (terrainMode === 'mountain' ? 38 : 52) : 0,
        altitude: terrainMode === 'mountain' ? 240 : 120,
        battery: 88,
        route: selectedRoute,
        weatherWarning: terrainMode === 'mountain' ? 'High Altitude Turbulence / Crosswinds' : 'Optimal Urban Corridor'
    };

    const handleLaunch = () => {
        setSimKey(prev => prev + 1); // Reset drone position
        setIsPlaying(true);          // Start movement
    };

    const handleStop = () => {
        setIsPlaying(false);         // Stop movement immediately
    };

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#121218] border border-[#2a2a3c] rounded-2xl p-5 shadow-2xl gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Navigation className="text-neonPurple" size={20} />
                        3D Digital Twin Flight Corridor & Terrain Simulator
                    </h2>
                    <p className="text-xs text-gray-400">Simulating live drone telemetry across mountain wireframes and traffic obstacles</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Route Selector Dropdown */}
                    <select
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        className="bg-[#181822] border border-[#2a2a3c] text-xs rounded-xl px-3 py-2 text-gray-300 focus:outline-none focus:border-neonPurple"
                    >
                        <option value="depot-to-hospital-a">Route Alpha: Central Depot → General Hospital</option>
                        <option value="depot-to-clinic-b">Route Beta: Northern Mountain Hub → Rural Clinic</option>
                    </select>

                    {/* Terrain Toggle Button */}
                    <button
                        onClick={() => setTerrainMode(terrainMode === 'urban' ? 'mountain' : 'urban')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181822] border border-[#2a2a3c] hover:border-neonPurple text-xs font-medium text-gray-200 transition-colors cursor-pointer"
                    >
                        <Layers size={14} className="text-neonPurple" />
                        Terrain: {terrainMode === 'urban' ? 'Urban Grid' : 'Mountain Wireframe'}
                    </button>

                    {/* Launch Button */}
                    <button
                        onClick={handleLaunch}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                        <Play size={14} />
                        Launch
                    </button>

                    {/* Stop Button */}
                    <button
                        onClick={handleStop}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                        <Square size={14} />
                        Stop
                    </button>
                </div>
            </div>


            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs ${
                terrainMode === 'mountain'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
                <div className="flex items-center gap-2">
                    <Wind size={16} className={terrainMode === 'mountain' ? 'animate-pulse' : ''} />
                    <span><strong>Environment Status:</strong> {currentTelemetry.weatherWarning}</span>
                </div>
                <span className="font-mono">
                    {terrainMode === 'mountain' ? '⚠️ Obstacle Avoidance: Active' : '✔ Road Network Clear'}
                </span>
            </div>


            <div className="w-full h-[calc(100vh-280px)] min-h-[500px] bg-[#121218] border border-[#2a2a3c] rounded-2xl overflow-hidden shadow-2xl relative">
                <DroneVisualizer3D key={simKey} telemetry={currentTelemetry} terrain={terrainMode} isAnimating={isPlaying} />
            </div>
        </div>
    );
}