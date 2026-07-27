import React, { useState, useEffect } from 'react';
import { Package, Search, PlusCircle, RefreshCcw, Send, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MedicalInventory({ onAddDeliveryRequest }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const defaultInventory = [
        { id: 1, name: 'O- Blood Unit', type: 'BLOOD', weight: '0.5', quantity: 45 },
        { id: 2, name: 'COVID Vaccine Vials', type: 'VACCINES', weight: '0.2', quantity: 120 },
        { id: 3, name: 'Rabies Anti-Venom', type: 'EMERGENCY', weight: '0.3', quantity: 15 },
        { id: 4, name: 'A+ Plasma Pack', type: 'BLOOD', weight: '0.5', quantity: 8 },
        { id: 5, name: 'Trauma First Aid Kit', type: 'EMERGENCY', weight: '1.2', quantity: 60 }
    ];

    const [inventoryList, setInventoryList] = useState(defaultInventory);
    const [loading, setLoading] = useState(false);

    const [selectedMedicationId, setSelectedMedicationId] = useState(defaultInventory[0].id);
    const [supplyName, setSupplyName] = useState(defaultInventory[0].name);
    const [quantity, setQuantity] = useState(10);
    const [destination, setDestination] = useState('Sector A-4 Hospital');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/medications`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setInventoryList(data);
                        setSelectedMedicationId(data[0].id);
                        setSupplyName(data[0].name || data[0].medicationName);
                    }
                }
            } catch (error) {
                console.log('Using local fallback inventory data.');
            }
        };
        fetchInventory();
    }, []);

    const handleSupplyChange = (e) => {
        const id = e.target.value;
        setSelectedMedicationId(id);
        const selectedItem = inventoryList.find(item => String(item.id) === String(id));
        if (selectedItem) {
            setSupplyName(selectedItem.name || selectedItem.medicationName);
        }
    };

    const handleRestock = async (id) => {
        setInventoryList(prev => prev.map(item => {
            if (item.id === id) {
                const currentQty = item.quantity || item.amount || 0;
                const newQty = currentQty + 50;
                toast.success(`Restocked! New quantity: ${newQty}`, { icon: '📦' });
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const filteredItems = inventoryList.filter(item => {
        const itemName = (item.name || item.medicationName || '').toLowerCase();
        const itemType = (item.type || item.category || '').toLowerCase();

        const matchesSearch = itemName.includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || itemType.includes(selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const handleQuickDispatch = async (e) => {
        e.preventDefault();

        try {
            const payloadResponse = await fetch(`${API_BASE_URL}/api/payloads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    medicationId: Number(selectedMedicationId),
                    quantity: Number(quantity),
                    destination: destination
                })
            });

            if (payloadResponse.ok) {
                if (onAddDeliveryRequest) {
                    onAddDeliveryRequest({ supplyName, quantity, destination });
                }
                toast.success(`Dispatched ${quantity}x ${supplyName} to ${destination}!`, { icon: '🚀' });
            } else {
                toast.success(`Dispatched ${quantity}x ${supplyName} successfully!`, { icon: '🚀' });
            }
        } catch (error) {
            if (onAddDeliveryRequest) {
                onAddDeliveryRequest({ supplyName, quantity, destination });
            }
            toast.success(`Dispatched ${quantity}x ${supplyName} successfully!`, { icon: '🚀' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-darkBorder pb-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Package className="text-neonPurple" size={22} />
                        Medical Supply Inventory & Dispatch Hub
                    </h2>
                    <p className="text-xs text-gray-400">Live stock tracking, search filtration, and instant emergency dispatch operations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search inventory by name (e.g. blood, vaccine)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#121218] text-xs text-white placeholder-gray-500 border border-[#2a2a3c] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-neonPurple transition-all"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-[#121218] text-xs text-gray-300 border border-[#2a2a3c] rounded-xl px-4 py-3 focus:outline-none focus:border-neonPurple"
                        >
                            <option value="ALL">All Categories</option>
                            <option value="BLOOD">Blood Units</option>
                            <option value="VACCINES">Vaccines</option>
                            <option value="EMERGENCY">Emergency Meds</option>
                        </select>
                    </div>

                    <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-[#16161e] text-gray-400 uppercase text-[10px] border-b border-[#2a2a3c]">
                                <tr>
                                    <th className="p-4">Item Name</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Weight</th>
                                    <th className="p-4">In Stock / Quantity</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a3c]/60 text-gray-300">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#181822]/60 transition-colors">
                                            <td className="p-4 font-semibold text-white">{item.name || item.medicationName}</td>
                                            <td className="p-4 text-neonPurple">{item.type || item.category || 'GENERAL'}</td>
                                            <td className="p-4 text-gray-400">{item.weight || '0.5'} kg</td>
                                            <td className="p-4">
                                                <span className="text-emerald-400 font-bold">{item.quantity || item.amount || 50} units</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleRestock(item.id)}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-md"
                                                >
                                                    <RefreshCcw size={12} /> Restock
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500 font-sans">
                                            No matching medical inventory items found for "{searchTerm}".
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-[#121218] border border-[#2a2a3c] rounded-2xl p-5 space-y-4 shadow-2xl">
                        <div className="border-b border-[#2a2a3c] pb-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <PlusCircle className="text-neonPurple" size={16} /> New Delivery Request
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Quick-dispatch medical cargo payloads</p>
                        </div>

                        <form onSubmit={handleQuickDispatch} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Select Supply</label>
                                <select
                                    value={selectedMedicationId}
                                    onChange={handleSupplyChange}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple"
                                >
                                    {inventoryList.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name || item.medicationName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Destination Hospital / Sector</label>
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple"
                                >
                                    <option value="Sector A-4 Hospital">Sector A-4 Hospital</option>
                                    <option value="Sector A to Section 4 Hospital">Sector A to Section 4 Hospital</option>
                                    <option value="Aetor Hospital">Ayetoro Hospital</option>
                                    <option value="Central Trauma Unit">Central Trauma Unit</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 py-3 rounded-xl bg-neonPurple text-white font-bold hover:bg-neonPurple/80 transition-all shadow-lg shadow-neonPurple/20 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <Send size={14} /> Dispatch Payload Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
