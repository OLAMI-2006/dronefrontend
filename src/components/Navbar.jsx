import { useState } from 'react';
import {
    LayoutDashboard,
    Plane,
    Navigation,
    Package,
    FileText,
    Menu,
    X
} from 'lucide-react';
import EzerLogo from './EzerLogo';

export default function Navbar({ activeTab, setActiveTab }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'simulator', name: '3D Simulator', icon: Navigation },
        { id: 'fleet', name: 'Fleet Management', icon: Plane },
        { id: 'inventory', name: 'Inventory', icon: Package },
        { id: 'reports', name: 'Reports', icon: FileText },
    ];

    return (
        <nav className="w-full bg-darkCard/85 backdrop-blur-md border-b border-darkBorder sticky top-0 z-[50] px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand Logo & Title */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setActiveTab('dashboard')}
                >
                    <EzerLogo size={36} />
                    <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        <span className="text-neonPurple">Ezer:</span> Healthcare Logistics
                    </h1>
                </div>


                <div className="hidden md:flex items-center gap-1 bg-darkBg/80 p-1.5 rounded-xl border border-darkBorder">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-gradient-to-r from-neonPurple/80 to-purple-700 text-white shadow-neon border border-neonPurple/40'
                                        : 'text-gray-400 hover:text-white hover:bg-darkCard'
                                }`}
                            >
                                <Icon size={16} />
                                {item.name}
                            </button>
                        );
                    })}
                </div>


                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg bg-darkBg border border-darkBorder text-gray-300"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>


            {mobileMenuOpen && (
                <div className="md:hidden mt-3 pt-3 border-t border-darkBorder flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-neonPurple text-white shadow-neon'
                                        : 'text-gray-400 bg-darkBg/60'
                                }`}
                            >
                                <Icon size={18} />
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}