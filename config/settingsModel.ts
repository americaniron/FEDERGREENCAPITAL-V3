
import { NavItem, PageContent } from '../types';

export interface ThemeSettings {
    colors: {
        brand: {
            [key: string]: string;
        }
    };
}

export interface TypographySettings {
    fontFamily: {
        sans: string;
        heading: string;
        mono: string;
    };
}

export interface FooterLink {
    label: string;
    path: string;
}

export interface FooterLinkGroup {
    title: string;
    links: FooterLink[];
}

export interface FooterSettings {
    links: {
        access: FooterLinkGroup;
        legal: FooterLinkGroup;
    }
}

export interface MembershipTier {
    id: string; // e.g., 'free', 'pro'
    name: string; // e.g., 'Free', 'Pro'
}

export interface SiteSettings {
    theme: ThemeSettings;
    typography: TypographySettings;
    navigation: NavItem[];
    content: {
        pages: Record<string, PageContent>;
    },
    footer: FooterSettings;
    membership: {
        tiers: MembershipTier[];
    };
    // This maintains the image override functionality from Phase 1/2
    images: Record<string, string>; 
}
