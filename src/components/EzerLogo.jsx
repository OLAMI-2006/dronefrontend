export default function EzerLogo({ size = 36, className = "" }) {
    return (
        <div
            style={{ width: size, height: size }}
            className={`relative flex items-center justify-center rounded-xl bg-neonPurple/20 border border-neonPurple/40 shadow-lg shadow-neonPurple/20 ${className}`}
        >

            <div className="absolute inset-0 rounded-xl border border-neonPurple/30 animate-pulse"></div>


            <svg
                width={size * 0.55}
                height={size * 0.55}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neonPurple z-10"
            >

                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        </div>
    );
}