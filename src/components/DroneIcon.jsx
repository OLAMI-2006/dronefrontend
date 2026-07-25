import L from 'leaflet';

export const createDroneIcon = (colorHex, ringTailwindColor) => {
    return L.divIcon({
        className: 'custom-drone-marker',
        html: `
            <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
                <div class="absolute inset-0 rounded-full animate-ping opacity-40 ${ringTailwindColor}"></div>
                <div class="relative z-10 flex items-center justify-center w-7 h-7 bg-slate-900 border border-slate-700 rounded-full shadow-lg">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${colorHex};">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};