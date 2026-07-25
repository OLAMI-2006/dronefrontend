import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const createDroneIcon = (isSelected) => {
    const color = isSelected ? '#a855f7' : '#10b981';

    return L.divIcon({
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
               
                <div style="
                    position: absolute;
                    inset: -4px;
                    border: 2px solid ${color};
                    border-radius: 50%;
                    opacity: 0.4;
                    animation: pulse 2s infinite;
                "></div>

                <!-- True Quadcopter Drone Silhouette -->
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.8));">
                    <!-- Top Rotor Blade -->
                    <line x1="12" y1="1" x2="12" y2="6"></line>
                    <!-- Bottom Rotor Blade -->
                    <line x1="12" y1="18" x2="12" y2="23"></line>
                    <!-- Left Rotor Blade -->
                    <line x1="1" y1="12" x2="6" y2="12"></line>
                    <!-- Right Rotor Blade -->
                    <line x1="18" y1="12" x2="23" y2="12"></line>
                    <!-- Diagonal Frame Arms -->
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line>
                    <!-- Central Body Hub -->
                    <circle cx="12" cy="12" r="3.5" fill="${color}"></circle>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

function CameraController({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13, { duration: 1.2 });
        }
    }, [center, map]);
    return null;
}


function HeatmapLayerComponent({ points }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const heatLayer = L.heatLayer(points, {
            radius: 28,
            blur: 18,
            maxZoom: 14,
            max: 1.0,
            gradient: {
                0.3: '#10b981',
                0.6: '#f59e0b',
                1.0: '#ef4444'
            }
        }).addTo(map);

        return () => {
            try {
                if (map.hasLayer(heatLayer)) {
                    map.removeLayer(heatLayer);
                }
            } catch (e) {
                console.error("Cleanup error removing heatlayer:", e);
            }
        };
    }, [map, points]);

    return null;
}

export default function TacticalMap({ drones = [], selectedDroneId, onSelectDrone }) {
    const selectedDrone = drones.find(d => d.id === selectedDroneId) || drones[0];

    const activeCenter = selectedDrone && selectedDrone.latitude && selectedDrone.longitude
        ? [selectedDrone.latitude, selectedDrone.longitude]
        : [6.5244, 3.3792];

    const breadcrumbTrail = selectedDrone && selectedDrone.latitude && selectedDrone.longitude ? [
        [selectedDrone.latitude - 0.015, selectedDrone.longitude - 0.020],
        [selectedDrone.latitude - 0.008, selectedDrone.longitude - 0.010],
        [selectedDrone.latitude, selectedDrone.longitude]
    ] : [];

    const demandPoints = [
        [6.5244, 3.3792, 0.95],
        [6.4541, 3.3947, 0.80],
        [6.6018, 3.3515, 0.65],
        [6.5500, 3.5000, 0.40],
        [6.4000, 3.2500, 0.90],
        [6.4800, 3.4200, 0.70]
    ];

    return (
        <div className="w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-darkBorder shadow-2xl relative z-0 bg-[#121218]">
            <MapContainer
                center={activeCenter}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <CameraController center={activeCenter} />

                <HeatmapLayerComponent points={demandPoints} />

                {selectedDrone && (
                    <Polyline
                        positions={breadcrumbTrail}
                        pathOptions={{
                            color: '#a855f7',
                            weight: 3,
                            dashArray: '6, 8',
                            opacity: 0.8
                        }}
                    />
                )}


                {drones.map((drone) => {
                    if (!drone.latitude || !drone.longitude) return null;
                    const isSelected = drone.id === selectedDroneId;
                    return (
                        <Marker
                            key={drone.id}
                            position={[drone.latitude, drone.longitude]}
                            icon={createDroneIcon(isSelected)}
                            eventHandlers={{
                                click: () => {
                                    if (onSelectDrone) onSelectDrone(drone.id);
                                },
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 text-xs text-gray-900">
                                    <p className="font-bold">{drone.serialNumber}</p>
                                    <p>Status: {drone.status}</p>
                                    <p>Battery: {drone.batteryCapacity}%</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>


            <div className="absolute bottom-4 right-4 z-[400] bg-[#181822]/90 backdrop-blur-md border border-[#2a2a3c] rounded-xl p-3 shadow-xl pointer-events-none">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Regional Demand Intensity</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-400">Low</span>
                    <div className="w-28 h-2 rounded-full bg-gradient-to-r from-[#10b981] via-[#f59e0b] to-[#ef4444]"></div>
                    <span className="text-[9px] text-gray-400">High</span>
                </div>
            </div>
        </div>
    );
}