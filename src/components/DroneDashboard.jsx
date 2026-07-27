import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DroneVisualizer3D from './DroneVisualizer3D';

const createDroneIcon = (status) => {
    let color = '#10b981';
    let pulse = false;

    if (status === 'FLYING') {
        color = '#a855f7';
        pulse = true;
    } else if (status === 'CHARGING') {
        color = '#f59e0b';
    } else if (status === 'MAINTENANCE') {
        color = '#f43f5e';
    }

    return new L.DivIcon({
        className: 'drone-custom-shape',
        html: `
            <div style="
                position: relative;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: translate(-50%, -50%);
            ">
                
                ${pulse ? `
                <div style="
                    position: absolute;
                    inset: -4px;
                    border: 2px solid ${color};
                    border-radius: 50%;
                    opacity: 0.4;
                    animation: pulse 2s infinite;
                "></div>` : ''}

                
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.8));">
                    <line x1="12" y1="1" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="23"></line>
                    <line x1="1" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="23" y2="12"></line>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line>
                    <circle cx="12" cy="12" r="3.5" fill="${color}"></circle>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
        if (map && position && position[0] && position[1]) {
            const currentZoom = map.getZoom();
            map.setView(position, currentZoom);
        }
    }, [map, position]);
    return null;
}

export function DroneDashboard({ drones = [] }) {
    const defaultPosition = [6.5244, 3.3792];

    const fallbackDrones = drones.length > 0 ? drones : [
        {
            id: 1,
            serialNumber: 'DRONE-ALPHA-01',
            status: 'FLYING',
            destination: 'Ayetoro Hospital',
            latitude: 6.5244,
            longitude: 3.3792,
            batteryCapacity: 88,
            speed: 45,
            altitude: 120
        }
    ];

    const activeDrone = fallbackDrones.find((d) => d.status === 'FLYING') || fallbackDrones[0];
    const activePosition = (activeDrone?.latitude && activeDrone?.longitude)
        ? [activeDrone.latitude, activeDrone.longitude]
        : defaultPosition;

    const activeTelemetry = {
        speed: activeDrone?.speed ?? 45,
        altitude: activeDrone?.altitude ?? 120,
        battery: activeDrone?.batteryCapacity ?? 100,
    };


    const getHoverDestinationText = (drone) => {
        if (drone.status === 'FLYING') {
            return `Destination: ${drone.destination || 'Ayetoro Hospital'}`;
        } else if (drone.status === 'CHARGING' || drone.status === 'IDLE') {
            return 'Location: Base (Charging)';
        } else if (drone.status === 'MAINTENANCE') {
            return 'Location: Hardware Workshop';
        }
        return `Destination: ${drone.destination || 'Central Emergency Trauma Clinic'}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

            <div
                className="border border-darkBorder rounded-2xl overflow-hidden shadow-xl w-full relative z-10"
                style={{ height: '500px', backgroundColor: '#090d16', isolation: 'isolate' }}
            >
                <div className="absolute top-4 left-4 z-[1000] bg-darkBg/90 backdrop-blur border border-darkBorder rounded-xl p-3 shadow-lg">
                    <h3 className="text-sm font-bold text-white">Digital Twin Map</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        ● Simulation Active
                    </span>
                </div>

                <MapContainer
                    center={defaultPosition}
                    zoom={12}
                    style={{ height: '100%', width: '100%', backgroundColor: '#090d16' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    />

                    {activePosition && <RecenterMap position={activePosition} />}

                    {fallbackDrones.map((drone) => {
                        if (!drone?.latitude || !drone?.longitude) return null;

                        return (
                            <Marker
                                key={drone.id || Math.random()}
                                position={[drone.latitude, drone.longitude]}
                                icon={createDroneIcon(drone.status)}
                            >

                                <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                                    <div className="text-xs font-semibold px-1 py-0.5">
                                        <span className="text-purple-600 font-bold">{drone.serialNumber}</span>
                                        <div className="text-slate-700">{getHoverDestinationText(drone)}</div>
                                    </div>
                                </Tooltip>


                                <Popup className="custom-popup">
                                    <div className="text-darkBg font-sans p-1">
                                        <strong className="text-purple-700 font-bold text-sm">
                                            {drone.serialNumber || 'Drone Unit'}
                                        </strong>
                                        <div className="text-xs mt-1 space-y-0.5">
                                            <p><strong>Status:</strong> {drone.status || 'UNKNOWN'}</p>
                                            <p><strong>Target:</strong> {drone.destination || 'Ayetoro Hospital / Trauma Clinic'}</p>
                                            <p><strong>Battery:</strong> {drone.batteryCapacity ?? 100}%</p>
                                            <p className="font-mono text-[10px] text-gray-600 mt-1">
                                                {drone.latitude.toFixed(4)}, {drone.longitude.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>


            <div className="w-full h-[500px]">
                <DroneVisualizer3D telemetry={activeTelemetry} />
            </div>
        </div>
    );
}
