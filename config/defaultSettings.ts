
import { SiteSettings } from './settingsModel';
import { NAVIGATION, PAGE_DATA } from '../constants';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    theme: {
        colors: {
            brand: {
                '50': '#f4eff7',
                '100': '#e8dff0',
                '200': '#d1bfe0',
                '300': '#ba9ed1',
                '400': '#a37ec1',
                '500': '#8b5db2',
                '600': '#744599',
                '700': '#4B2C71',
                '800': '#412562',
                '900': '#362052',
                '950': '#1d1135',
                'gold': '#d4af37',
                'gold_light': '#f3d267',
                'terminal': '#00ff41',
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
