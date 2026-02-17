
import { SiteSettings } from './settingsModel';
import { NAVIGATION, PAGE_DATA } from '../constants';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    theme: {
        colors: {
            brand: {
                '50': '#F5FAFF',
                '100': '#E6F1FF',
                '200': '#CCD6F6',
                '300': '#A8B2D1',
                '400': '#8892B0',
                '500': '#485A78',
                '600': '#304566',
                '700': '#233554',
                '800': '#172A45',
                '900': '#112240',
                '950': '#081424', // Darker Navy
                'gold': '#2E8B57', // Medium Dark Green
                'gold_light': '#3CB371',
                'terminal': '#64FFDA',
                'pearl': '#1E3A3A', // Dark Green/Teal for card background
            }
        }
    },
    typography: {
        fontFamily: {
            sans: 'Inter',
            heading: 'Montserrat',
            mono: 'Fira Code',
        }
    },
    navigation: NAVIGATION,
    content: {
        pages: PAGE_DATA
    },
    footer: {
        links: {
            access: {
                title: 'Strategic Access',
                links: [
                    { label: 'About Federgreen', path: '/about-us' },
                    { label: 'Our Capabilities', path: '/services' },
                    { label: 'Sectors Covered', path: '/sectors' },
                    { label: 'Contact Concierge', path: '/contact' }
                ]
            },
            legal: {
                title: 'Institutional Standards',
                links: [
                    { label: 'Terms of Use', path: '/terms' },
                    { label: 'Privacy Policy', path: '/privacy' },
                    { label: 'Investment Disclaimer', path: '/disclaimer' },
                    { label: 'Secure Portal', path: '/portal' }
                ]
            }
        }
    },
    membership: {
        tiers: [
            { id: 'Free', name: 'Free' },
            { id: 'Basic', name: 'Basic' },
            { id: 'Pro', name: 'Pro' },
            { id: 'Enterprise', name: 'Enterprise' },
        ]
    },
    images: {} // Defaulting to no overrides
};
