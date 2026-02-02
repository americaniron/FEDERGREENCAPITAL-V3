
import React, { useEffect } from 'react';
import { SiteSettings } from './config/settingsModel';

interface SettingsInjectorProps {
    settings: SiteSettings;
}

const SettingsInjector: React.FC<SettingsInjectorProps> = ({ settings }) => {
    useEffect(() => {
        const styleId = 'dynamic-theme-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const { theme, typography } = settings;
        let css = ':root {\n';

        // Colors
        for (const [key, value] of Object.entries(theme.colors.brand)) {
            const cssVarName = `--color-brand-${key.replace('_', '-')}`;
            css += `  ${cssVarName}: ${value};\n`;
        }

        // Typography
        for (const [key, value] of Object.entries(typography.fontFamily)) {
            const cssVarName = `--font-${key}`;
            css += `  ${cssVarName}: '${value}';\n`;
        }
        
        css += '}';
        styleElement.innerHTML = css;

    }, [settings]);

    return null;
};

export default SettingsInjector;
