
import React, { useMemo } from 'react';
import { authService } from '../../services/authService';
import { TOOL_REGISTRY } from '../../lib/tool-registry';
import { settingsService } from '../../services/settingsService';
import UpgradeNotice from '../ui/UpgradeNotice';

interface EntitlementGateProps {
    children: React.ReactNode;
    toolId: string; 
}

// Simple tier hierarchy for comparison
const TIER_HIERARCHY: Record<string, number> = {
    'Free': 0,
    'Basic': 1,
    'Pro': 2,
    'Enterprise': 3,
};

const EntitlementGate: React.FC<EntitlementGateProps> = ({ children, toolId }) => {
    const hasAccess = useMemo(() => {
        const currentUser = authService.getCurrentSiteUser();
        const tool = TOOL_REGISTRY.find(t => t.id === toolId);

        if (!tool) {
            return true; // If tool isn't in registry, assume it's public
        }

        // 1. Check for a specific user override
        if (currentUser && currentUser.entitlementOverrides && currentUser.entitlementOverrides[toolId] !== undefined) {
            return currentUser.entitlementOverrides[toolId];
        }

        // 2. Check against tier defaults
        const requiredTier = tool.defaultTier;
        const userTier = currentUser ? currentUser.membershipTier : 'Free';
        
        const requiredLevel = TIER_HIERARCHY[requiredTier] ?? 99; // Default to high level if tier not found
        const userLevel = TIER_HIERARCHY[userTier] ?? -1; // Default to low level

        return userLevel >= requiredLevel;

    }, [toolId]);

    if (!hasAccess) {
        const tool = TOOL_REGISTRY.find(t => t.id === toolId);
        return <UpgradeNotice toolName={tool?.name} requiredTier={tool?.defaultTier} />;
    }
    
    return <>{children}</>;
};

export default EntitlementGate;
