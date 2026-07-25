import { useState } from 'react';
import { Bell, User, Check, Trash2, Mail, Shield, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TopNavbar({ userProfile = { name: 'Mercy', email: 'taiwomercyy277@gmail.com', role: 'Lead Backend Developer' } }) {

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Low Stock Alert', desc: 'O- Blood Unit dropped below 20 units.', time: '5m ago', read: false },
        { id: 2, title: 'Mission M-104 Complete', desc: 'Drone D-04 landed safely at Sector A-4.', time: '12m ago', read: false },
        { id: 3, title: 'System Security Audit', desc: '100% compliance verified for Q3 telemetry.', time: '1h ago', read: true }
    ]);

    // Profile dropdown and Auth modal state
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Auth form fields
    const [emailInput, setEmailInput] = useState(userProfile.email);
    const [passwordInput, setPasswordInput] = useState('');

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read.');
    };

    const handleClearNotifications = () => {
        setNotifications([]);
        toast.success('Notifications cleared.');
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        toast.success(isLoginMode ? `Welcome back, ${userProfile.name}!` : 'Account created successfully!');
        setShowAuthModal(false);
        setShowProfileMenu(false);
    };

    return (
        <>
            <header className="relative flex items-center justify-between px-6 py-4 bg-[#121218]/95 backdrop-blur-md border-b border-[#2a2a3c] z-[9999]">
                {/* Left Title / Branding status */}
                <div className="flex items-center gap-3">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Ezer Logistics Hub v2.6</span>
                </div>

                {/* Right Action Icons (Notifications & Profile) */}
                <div className="flex items-center gap-4">

                    {/* --- NOTIFICATION BELL --- */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowProfileMenu(false);
                            }}
                            className="relative p-2.5 rounded-xl bg-[#181822] border border-[#2a2a3c] text-gray-300 hover:text-white hover:border-neonPurple transition-all cursor-pointer"
                            title="Notifications"
                        >
                            <Bell size={18} className={unreadCount > 0 ? "text-neonPurple animate-bounce" : ""} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/40">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-[#121218] border border-[#2a2a3c] rounded-2xl shadow-2xl p-4 space-y-3 z-[10000] animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between border-b border-[#2a2a3c] pb-2.5">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Bell size={14} className="text-neonPurple" /> System Alerts
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllRead} className="text-[10px] text-neonPurple hover:underline cursor-pointer flex items-center gap-0.5">
                                                <Check size={10} /> Mark read
                                            </button>
                                        )}
                                        <button onClick={handleClearNotifications} className="text-[10px] text-gray-400 hover:text-rose-400 cursor-pointer">
                                            <Trash2 size={10} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div key={n.id} className={`p-2.5 rounded-xl border text-xs transition-colors ${n.read ? 'bg-[#181822]/40 border-[#2a2a3c]/40 text-gray-400' : 'bg-[#181822] border-[#2a2a3c] text-white'}`}>
                                                <div className="flex items-center justify-between font-bold mb-0.5">
                                                    <span>{n.title}</span>
                                                    <span className="text-[9px] font-mono text-gray-500">{n.time}</span>
                                                </div>
                                                <p className="text-[11px] text-gray-300 font-sans">{n.desc}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-center text-gray-500 py-6 font-sans">No new notifications.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- PROFILE ICON & DROPDOWN --- */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#181822] border border-[#2a2a3c] hover:border-neonPurple transition-all cursor-pointer text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-neonPurple/20 border border-neonPurple/40 flex items-center justify-center text-neonPurple font-bold text-xs">
                                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-bold text-white leading-tight">{userProfile.name}</p>
                                <p className="text-[9px] font-mono text-gray-400 leading-tight">Online</p>
                            </div>
                        </button>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-[#121218] border border-[#2a2a3c] rounded-2xl shadow-2xl p-3 space-y-2 z-[99999] animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 rounded-xl bg-[#181822] border border-[#2a2a3c] space-y-1">
                                    <p className="text-xs font-bold text-white">{userProfile.name}</p>
                                    <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><Mail size={10} /> {userProfile.email}</p>
                                    <p className="text-[10px] text-neonPurple font-mono mt-1 pt-1 border-t border-[#2a2a3c] flex items-center gap-1"><Shield size={10} /> {userProfile.role}</p>
                                </div>

                                <div className="space-y-1 pt-1">
                                    <button
                                        onClick={() => {
                                            setIsLoginMode(true);
                                            setShowAuthModal(true);
                                            setShowProfileMenu(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-[#181822] transition-colors flex items-center gap-2 cursor-pointer font-sans"
                                    >
                                        <User size={14} className="text-neonPurple" /> Sign In / Switch Account
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsLoginMode(false);
                                            setShowAuthModal(true);
                                            setShowProfileMenu(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-[#181822] transition-colors flex items-center gap-2 cursor-pointer font-sans"
                                    >
                                        <Settings size={14} className="text-blue-400" /> Create New Account
                                    </button>
                                    <div className="border-t border-[#2a2a3c] my-1"></div>
                                    <button
                                        onClick={() => {
                                            toast.success('Logged out successfully.');
                                            setShowProfileMenu(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer font-sans font-bold"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            {/* --- AUTH MODAL MOVED OUTSIDE THE HEADER --- */}
            {showAuthModal && (
                <div className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center z-[999999] p-4">
                    <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                        <div className="border-b border-[#2a2a3c] pb-3 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <User className="text-neonPurple" size={18} />
                                {isLoginMode ? 'Sign In to Ezer' : 'Create Account'}
                            </h3>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="text-gray-400 hover:text-white text-xs font-mono cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                            {!isLoginMode && (
                                <div>
                                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Full Name / Tag</label>
                                    <input
                                        type="text"
                                        required
                                        defaultValue={userProfile.name}
                                        className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-neonPurple text-white font-bold hover:bg-neonPurple/80 transition-all shadow-lg shadow-neonPurple/20 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                {isLoginMode ? 'Sign In Now' : 'Register Account'}
                            </button>

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLoginMode(!isLoginMode)}
                                    className="text-[11px] text-gray-400 hover:text-neonPurple cursor-pointer underline font-sans"
                                >
                                    {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}