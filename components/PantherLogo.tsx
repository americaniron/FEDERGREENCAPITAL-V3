
import React, { useState, useEffect } from 'react';
import { brandingService } from '../services/brandingService';

interface PantherLogoProps {
    className?: string;
}

const OriginalSVG: React.FC<PantherLogoProps> = ({ className }) => {
    return (
        <svg 
            viewBox="0 0 600 240" 
            className={className} 
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Federgreen Capital Panther Logo"
        >
            <defs>
                <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#1e1b4b" /> {/* Midnight Blue */}
                    <stop offset="50%" stopColor="#4338ca" /> {/* Indigo */}
                    <stop offset="100%" stopColor="#170C3A" /> {/* Deep Purple Black */}
                </linearGradient>
                <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" /> {/* Light Indigo */}
                    <stop offset="100%" stopColor="#312e81" /> {/* Dark Indigo */}
                </linearGradient>
            </defs>
            
            <g transform="translate(10, 20)">
                {/* LOW POLY BODY CONSTRUCTION */}
                
                {/* Head & Neck */}
                <path d="M50 110 L90 80 L130 90 L110 130 Z" fill="#0f172a" stroke="#312e81" strokeWidth="1" /> {/* Face Shadow */}
                <path d="M0 130 L50 110 L40 145 Z" fill="#1e1b4b" /> {/* Snout */}
                <path d="M50 110 L90 80 L70 50 Z" fill="#312e81" /> {/* Forehead */}
                <path d="M70 50 L90 80 L110 60 Z" fill="#4338ca" /> {/* Ear Left */}
                <path d="M90 80 L130 90 L160 60 Z" fill="#1e1b4b" /> {/* Neck Top */}
                <path d="M110 130 L160 140 L130 90 Z" fill="#312e81" /> {/* Neck Side */}
                
                {/* Torso */}
                <path d="M160 60 L300 60 L280 110 L130 90 Z" fill="url(#polyGrad)" /> {/* Upper Back */}
                <path d="M300 60 L420 70 L380 120 L280 110 Z" fill="#1e1b4b" /> {/* Mid Back */}
                <path d="M160 140 L280 110 L260 160 L180 180 Z" fill="#0f172a" /> {/* Chest/Belly */}
                <path d="M280 110 L380 120 L360 160 L260 160 Z" fill="#1e1b4b" /> {/* Belly Side */}
                
                {/* Rear & Tail */}
                <path d="M420 70 L480 90 L450 140 L380 120 Z" fill="url(#highlightGrad)" opacity="0.8" /> {/* Hips */}
                <path d="M480 90 L520 120 L550 80 L560 50 L540 80 L500 100 Z" fill="#312e81" /> {/* Tail Curve Up */}
                <path d="M560 50 L580 40 L570 70 L550 80 Z" fill="#4338ca" /> {/* Tail Tip */}

                {/* Front Legs */}
                <path d="M160 140 L180 180 L140 220 L130 200 Z" fill="#312e81" /> {/* Front Left Upper */}
                <path d="M140 220 L110 240 L120 230 Z" fill="#1e1b4b" /> {/* Front Left Paw */}
                
                <path d="M180 140 L210 170 L220 220 L200 240 L190 220 Z" fill="#0f172a" opacity="0.8" transform="translate(30, -10)" /> {/* Front Right (Background) */}

                {/* Back Legs */}
                <path d="M450 140 L480 180 L440 220 L420 200 Z" fill="#312e81" /> {/* Back Left Upper */}
                <path d="M440 220 L400 240 L410 230 Z" fill="#1e1b4b" /> {/* Back Left Paw */}
                
                <path d="M380 160 L410 200 L440 200 L420 230 Z" fill="#0f172a" opacity="0.7" transform="translate(-10, 0)" /> {/* Back Right (Background) */}
                
                {/* Facet Highlights */}
                <path d="M90 80 L160 60" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
                <path d="M300 60 L280 110" stroke="#6366f1" strokeWidth="1" opacity="0.3" />
                <path d="M480 90 L450 140" stroke="#6366f1" strokeWidth="1" opacity="0.3" />
            </g>
        </svg>
    );
};

export const PantherLogo: React.FC<PantherLogoProps> = ({ className }) => {
    const [customLogo, setCustomLogo] = useState<string | null>(null);

    useEffect(() => {
        setCustomLogo(brandingService.getCustomLogo());
    
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'fc_custom_logo') {
                setCustomLogo(brandingService.getCustomLogo());
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (customLogo) {
        // Remove styling classes that only apply to the SVG (like invert)
        const imgClassName = className?.replace(/filter|brightness-0|invert|opacity-\d+/g, '').trim();
        return (
            <img 
                src={customLogo} 
                alt="Federgreen Capital Logo" 
                className={imgClassName} 
            />
        );
    }

    return <OriginalSVG className={className} />;
};
