import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createDroneIcon = (status) => {
    const isFlying = status === 'FLYING';
    const color = isFlying ? '#a855f7' : status === 'IDLE' ? '#10b981' : '#f59e0b';

    return new L.DivIcon({
        className: 'custom-drone-marker',
        html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 16px ${color}, 0 0 24px ${color};
        ${isFlying ? 'animation: pulse 1.2s infinite alternate;' : ''}
      "></div>
    `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

function MapRecenter({ position }) {
    const map = useMap();
    React.useEffect(() => {
        if (position && position[0] && position[1]) {
            map.setView(position, map.getZoom(), { animate: true });
        }
    }, [position, map]);
    return null;
}

export default function MapControllerTower({ drones = [] }) {
    const defaultCenter = [6.5244, 3.3792];

    const activeDrone = drones.find((d) => d.status === 'FLYING') || drones[0];
    const activePosition = activeDrone && activeDrone.latitude
        ? [activeDrone.latitude, activeDrone.longitude]
        : defaultCenter;

    return (
        <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl overflow-hidden shadow-2xl w-full h-[450px] relative">
            <div className="absolute top-4 left-4 z-[1000] bg-[#16161e]/90 backdrop-blur-md border border-[#2a2a3c] px-4 py-2.5 rounded-xl shadow-xl">
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neonPurple animate-ping"></span>
                    Tactical Command Tower & Live Airspace Map
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Tracking {drones.length} active fleet assets in Sector A-4</p>
            </div>

            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#0d0d12' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                {activeDrone && <MapRecenter position={activePosition} />}

                {drones.map((drone) => {
                    if (!drone.latitude || !drone.longitude) return null;

                    return (
                        <Marker
                            key={drone.id}
                            position={[drone.latitude, drone.longitude]}
                            icon={createDroneIcon(drone.status)}
                        >
                            <Popup className="custom-tactical-popup">
                                <div className="p-2 space-y-1.5 font-sans text-xs text-white bg-[#16161e] border border-[#2a2a3c] rounded-xl shadow-2xl min-w-[220px]">
                                    <div className="flex items-center justify-between border-b border-[#2a2a3c] pb-1.5 font-mono font-bold text-neonPurple">
                                        <span>{drone.serialNumber || `Drone #${drone.id}`}</span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                            drone.status === 'FLYING' ? 'bg-neonPurple/20 text-neonPurple border border-neonPurple/30' :
                                                drone.status === 'CHARGING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                            {drone.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1 pt-1 text-[11px] text-gray-300">
                                        <p>Destination: <strong className="text-white">{drone.destination || 'Aitoro Hospital'}</strong></p>
                                        <p>Battery: <strong className={`font-mono ${drone.batteryCapacity < 25 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{drone.batteryCapacity}%</strong></p>
                                        <p>Coordinates: <span className="font-mono text-gray-400 text-[10px]">{drone.latitude.toFixed(4)}, {drone.longitude.toFixed(4)}</span></p>
                                        {drone.status === 'FLYING' && (
                                            <div className="pt-1.5 border-t border-[#2a2a3c] text-[10px] text-neonPurple font-mono flex items-center justify-between">
                                                <span>⚡ 45 knots</span>
                                                <span>Alt: 120m</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}