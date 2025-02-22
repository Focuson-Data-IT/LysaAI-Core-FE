import React, { useState } from 'react';

interface TooltipIconProps {
    description: string;
    children: React.ReactNode; // Tambahkan ini agar children diterima
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ description, children }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div
            className="relative inline-block"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {children} {/* Render children di sini */}
            {showTooltip && (
                <span
                    className="fixed z-50 whitespace-normal w-[150px] text-center dark:bg-black bg-black text-white text-xs rounded py-2 px-3"
                    style={{
                        top: `${tooltipPosition.y + 20}px`,
                        left: `${tooltipPosition.x}px`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {description}
                </span>
            )}
        </div>
    );
};

export default TooltipIcon;
