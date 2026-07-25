import { useState } from 'react';
import { Send, Package, MapPin, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientOrderingPortal({ onOrderSubmit }) {
    // Category selection state
    const [category, setCategory] = useState('VACCINES');
    const [selectedCargo, setSelectedCargo] = useState('COVID-19 mRNA Vaccine Kits (Ultra-Cold)');
    const [destination, setDestination] = useState('Aitoro Hospital - Sector 4');
    const [priority, setPriority] = useState('EMERGENCY');
    const [weight, setWeight] = useState(1.5);

    // Dynamic cargo catalog mapped to categories
    const cargoOptions = {
        VACCINES: [
            'COVID-19 mRNA Vaccine Kits (Ultra-Cold)',
            'Childhood Immunization Batch (Polio/Measles)',
            'Influenza Quadrivalent Supply'
        ],
        ANTIVENOM: [
            'Polyvalent Snake Antivenom Serum Units',
            'Scorpion Neurotoxin Antitoxin Vials',
            'Broad-Spectrum Envenomation Kit'
        ],
        BLOOD: [
            'O-Negative Packed Red Blood Cells (2 Units)',
            'Fresh Frozen Plasma (FFP)',
            'Platelet Concentrate Pack'
        ],
        EQUIPMENT: [
            'Emergency Trauma Surgical Pack',
            'EpiPen & Anaphylaxis Rescue Kit',
            'Paediatric Resuscitation Module'
        ]
    };

    // Tracked destination facilities
    const hospitalDestinations = [
        'Aitoro Hospital - Sector 4',
        'Central Emergency Trauma Clinic',
        'Northside Community Health Center',
        'St. Jude Research Medical Post'
    ];

    // Handle category change and auto-select the first item of that category
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        const firstAvailableItem = cargoOptions[newCategory][0];
        setSelectedCargo(firstAvailableItem);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trackingCode = `DLV-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrder = {
            id: Date.now(),
            trackingCode,
            category,
            cargoType: selectedCargo,
            destination,
            priority,
            weightKg: parseFloat(weight),
            status: 'PENDING',
            droneSerialNumber: 'DRONE-DL-77',
            timestamp: new Date().toLocaleTimeString()
        };

        toast.success(`Delivery Request ${trackingCode} Dispatched to Fleet Network!`);
        if (onOrderSubmit) {
            onOrderSubmit(newOrder);
        }
    };

    return (
        <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Subtle tactical ambient glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neonPurple/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#2a2a3c] pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-neonPurple/20 border border-neonPurple/30 text-neonPurple">
                        <Package size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">Client Dispatch & Ordering Portal</h3>
                        <p className="text-[10px] text-gray-400">Secure automated payload request & routing</p>
                    </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    ONLINE LINK
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Category Selection Tabs */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Cargo Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                            { id: 'VACCINES', label: 'Vaccines' },
                            { id: 'ANTIVENOM', label: 'Antivenom' },
                            { id: 'BLOOD', label: 'Blood Units' },
                            { id: 'EQUIPMENT', label: 'Trauma Kit' }
                        ].map((cat) => (
                            <button
                                type="button"
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border text-center truncate ${
                                    category === cat.id
                                        ? 'bg-neonPurple/20 text-neonPurple border-neonPurple/50 shadow-md shadow-neonPurple/20'
                                        : 'bg-[#181822] text-gray-400 border-[#2a2a3c] hover:border-gray-500'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Cargo Item Dropdown */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Specific Item Selection
                    </label>
                    <select
                        value={selectedCargo}
                        onChange={(e) => setSelectedCargo(e.target.value)}
                        className="w-full bg-[#181822] border border-[#2a2a3c] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neonPurple font-medium cursor-pointer"
                    >
                        {cargoOptions[category].map((item, idx) => (
                            <option key={idx} value={item} className="bg-[#121218] text-white">
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tracked Destination Facility */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={12} className="text-neonPurple" /> Target Hospital / Medical Post
                    </label>
                    <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-[#181822] border border-[#2a2a3c] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neonPurple font-medium cursor-pointer"
                    >
                        {hospitalDestinations.map((hospital, idx) => (
                            <option key={idx} value={hospital} className="bg-[#121218] text-white">
                                {hospital}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority & Weight Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <ShieldAlert size={12} className="text-amber-400" /> Mission Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full bg-[#181822] border border-[#2a2a3c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonPurple font-medium cursor-pointer"
                        >
                            <option value="CRITICAL">🔴 Critical (Immediate)</option>
                            <option value="EMERGENCY">🟡 Emergency Standard</option>
                            <option value="ROUTINE">🟢 Routine Supply</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                            Payload Weight (kg)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="5.0"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-[#181822] border border-[#2a2a3c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonPurple font-mono"
                        />
                    </div>
                </div>

                {/* Submit Dispatch Button */}
                <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-neonPurple to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-neonPurple/25 flex items-center justify-center gap-2 tracking-wide uppercase"
                >
                    <Send size={14} /> Dispatch Automated Drone Request
                </button>
            </form>
        </div>
    );
}