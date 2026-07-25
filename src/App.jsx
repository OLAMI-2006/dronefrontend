import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import Navbar from './components/Navbar.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import {DroneDashboard} from './components/DroneDashboard.jsx';
import FleetStats from './components/FleetStats.jsx';
import DroneTable from './components/DroneTable.jsx';
import ClientOrderingPortal from './components/ClientOrderingPortal.jsx';
import WeatherWidget from './components/WeatherWidget.jsx';
import IntroCanvas from './components/IntroCanvas.jsx';
import { useDroneTelemetry } from './hooks/useDroneTelemetry.js';
import FleetDashboard from './pages/FleetDashboard.jsx';
import InventoryPage from './pages/InventoryPages.jsx';
import ReportsPage from './pages/ReportPage.jsx';
import FlightSimulatorPage from './pages/FlightSimulatorPage.jsx';

const initialDrones = [
    { id: 1, serialNumber: 'DRONE-DL-77', status: 'FLYING', destination: 'Atoro Hospital', batteryCapacity: 81, latitude: 6.4700, longitude: 3.3400 },
    { id: 2, serialNumber: 'DRONE-DL-89', status: 'IDLE', destination: 'Base', batteryCapacity: 95, latitude: 6.5400, longitude: 3.3900 },
    { id: 3, serialNumber: 'DRONE-DL-12', status: 'CHARGING', destination: 'Base', batteryCapacity: 42, latitude: 6.5100, longitude: 3.3600 },
    { id: 4, serialNumber: 'DRONE-DL-04', status: 'MAINTENANCE', destination: 'Hardware Workshop', batteryCapacity: 15, latitude: 6.5300, longitude: 3.3850 },
];

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showIntro, setShowIntro] = useState(true);
    const [weatherAlert, setWeatherAlert] = useState(false);
    const { drones = initialDrones, isConnected } = useDroneTelemetry(initialDrones);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIntro(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const handleOrderSubmit = (createdOrder) => {
        console.log('Order created and queued:', createdOrder);
    };

    const handleWeatherChange = (newWeather) => {
        if (newWeather.isSevere && !weatherAlert) {
            setWeatherAlert(true);
            toast.error(`⚠️ Weather Alert: ${newWeather.condition} detected in Lagos airspace. Flight dispatches restricted!`, {
                duration: 6000,
                position: 'top-center'
            });
        } else if (!newWeather.isSevere && weatherAlert) {
            setWeatherAlert(false);
            toast.success('✅ Airspace clear. Normal drone operations resumed.', {
                duration: 4000
            });
        }
    };

    return (
        <div className="min-h-screen bg-darkBg text-gray-100 flex flex-col relative">
            {showIntro && (
                <div className="fixed inset-0 z-[9999] bg-slate-950">
                    <IntroCanvas />
                </div>
            )}

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#16161e',
                        color: '#fff',
                        border: '1px solid #2a2a3c',
                        fontSize: '12px'
                    },
                }}
            />

            <div className="fixed top-0 left-0 right-0 z-50 bg-darkBg/90 backdrop-blur-md">
                <TopNavbar />
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 pt-36 sm:pt-40 space-y-6">
                {activeTab === 'dashboard' && (
                    <>
                        <div className="flex items-center justify-between bg-darkCard border border-darkBorder px-4 py-2 rounded-xl text-xs">
                            <span className="text-gray-400">Live Telemetry Stream:</span>
                            <span className={`font-semibold ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {isConnected ? '● Connected (Spring Boot WS)' : '○ Reconnecting / Offline'}
                            </span>
                        </div>

                        <WeatherWidget onWeatherChange={handleWeatherChange} />
                        <FleetStats drones={drones} />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-5">
                                <ClientOrderingPortal onOrderSubmit={handleOrderSubmit} />
                            </div>
                            <div className="lg:col-span-7">
                                <DroneDashboard drones={drones} isConnected={isConnected} />
                            </div>
                        </div>

                        <div className="w-full">
                            <DroneTable drones={drones} />
                        </div>
                    </>
                )}

                {activeTab === 'fleet' && <FleetDashboard drones={drones} />}
                {activeTab === 'inventory' && <InventoryPage drones={drones} />}
                {activeTab === 'reports' && <ReportsPage />}
                {activeTab === 'simulator' && <FlightSimulatorPage />}
            </main>
        </div>
    );
}

export default App;