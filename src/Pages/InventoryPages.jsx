import { useState } from 'react';
import { Package, Search, PlusCircle, RefreshCcw, Send, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MedicalInventory({ inventory: externalInventory = [], onAddDeliveryRequest }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // Default rich inventory stored in state so quantities update dynamically
    const [inventoryList, setInventoryList] = useState(
        externalInventory.length > 0 ? externalInventory : [
            { id: 1, supplyId: 'MED-B001', name: 'O- Blood Unit', batchId: 'Batch B123', type: 'BLOOD', quantityOnHand: 45, expiryDate: '28 Aug 2026' },
            { id: 2, supplyId: 'MED-V002', name: 'COVID Vaccine Vials', batchId: 'Lot 999', type: 'VACCINES', quantityOnHand: 120, expiryDate: '15 Oct 2026' },
            { id: 3, supplyId: 'MED-E003', name: 'Rabies Anti-Venom', batchId: 'Serial S456', type: 'EMERGENCY MEDS', quantityOnHand: 15, expiryDate: '12 Sep 2026' },
            { id: 4, supplyId: 'MED-B004', name: 'A+ Plasma Pack', batchId: 'Batch P789', type: 'BLOOD', quantityOnHand: 8, expiryDate: '05 Sep 2026' },
            { id: 5, supplyId: 'MED-K005', name: 'Trauma First Aid Kit', batchId: 'Kit T-01', type: 'EMERGENCY MEDS', quantityOnHand: 60, expiryDate: '30 Nov 2026' }
        ]
    );


    const [supplyName, setSupplyName] = useState('O- Blood Unit');
    const [quantity, setQuantity] = useState(10);
    const [destination, setDestination] = useState('Sector A-4 Hospital');


    const handleRestock = (id) => {
        setInventoryList(prevList =>
            prevList.map(item => {
                if (item.id === id) {
                    const updatedQty = item.quantityOnHand + 50;
                    toast.success(`Restocked 50 units! New stock for ${item.name}: ${updatedQty} units`, { icon: '📦' });
                    return { ...item, quantityOnHand: updatedQty };
                }
                return item;
            })
        );
    };


    const filteredItems = inventoryList.filter(item => {
        const matchesSearch =
            (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.supplyId && item.supplyId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.batchId && item.batchId.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'ALL' || (item.type && item.type.toUpperCase().includes(selectedCategory));
        return matchesSearch && matchesCategory;
    });

    const handleQuickDispatch = (e) => {
        e.preventDefault();
        if (onAddDeliveryRequest) {
            onAddDeliveryRequest({ supplyName, quantity, destination });
        }
        toast.success(`Dispatched ${quantity}x ${supplyName} successfully!`, { icon: '🚀' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
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
                                placeholder="Search inventory by name, Supply ID, or Batch ID..."
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
                                    <th className="p-4">Supply / ID</th>
                                    <th className="p-4">Item Name</th>
                                    <th className="p-4">Batch ID</th>
                                    <th className="p-4">In Stock</th>
                                    <th className="p-4 text-right">Quick Restock</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a3c]/60 text-gray-300">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => {
                                        const lowStock = item.quantityOnHand < 20;
                                        return (
                                            <tr key={item.id} className="hover:bg-[#181822]/60 transition-colors">
                                                <td className="p-4 font-bold text-white">{item.supplyId}</td>
                                                <td className="p-4 font-semibold">{item.name}</td>
                                                <td className="p-4 text-gray-400">{item.batchId}</td>
                                                <td className="p-4">
                                                        <span className={lowStock ? 'text-rose-400 font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 w-fit' : 'text-emerald-400'}>
                                                            {lowStock && <AlertTriangle size={12} />} {item.quantityOnHand} units
                                                        </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleRestock(item.id)}
                                                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-md"
                                                    >
                                                        <RefreshCcw size={12} /> Restock (+50)
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
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
                                    value={supplyName}
                                    onChange={(e) => setSupplyName(e.target.value)}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple"
                                >
                                    <option value="O- Blood Unit">O- Blood Unit</option>
                                    <option value="COVID Vaccine Vials">COVID Vaccine Vials</option>
                                    <option value="Rabies Anti-Venom">Rabies Anti-Venom</option>
                                    <option value="A+ Plasma Pack">A+ Plasma Pack</option>
                                    <option value="Trauma First Aid Kit">Trauma First Aid Kit</option>
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
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full bg-[#181822] text-white border border-[#2a2a3c] rounded-xl px-3.5 py-3 focus:outline-none focus:border-neonPurple"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 py-3 rounded-xl bg-neonPurple text-white font-bold hover:bg-neonPurple/80 transition-all shadow-lg shadow-neonPurple/20 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <Send size={14} /> Dispatch Request Now
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}