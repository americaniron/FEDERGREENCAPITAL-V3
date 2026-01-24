
export interface KycProfile {
    id: string;
    fullName: string;
    dob: string;
    address: string;
    idType: string;
    idNumber: string;
    wealthSource: string;
    expectedVolume: string;
    lastUpdated: number;
    riskScore: number;
    riskChecklist: Record<string, boolean>;
    consentGiven: boolean;
}

const STORAGE_KEY = 'federgreen_kyc_profiles';

export const ComplianceManager = {
    getProfiles: (): KycProfile[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse KYC profiles", e);
            return [];
        }
    },

    saveProfile: (profile: Omit<KycProfile, 'id' | 'lastUpdated'> & { id?: string }): KycProfile => {
        const profiles = ComplianceManager.getProfiles();
        const now = Date.now();

        if (profile.id) {
            const index = profiles.findIndex(p => p.id === profile.id);
            if (index !== -1) {
                profiles[index] = { ...profiles[index], ...profile, lastUpdated: now };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
                return profiles[index];
            }
        }
        
        const newProfile: KycProfile = {
            ...profile,
            id: crypto.randomUUID(),
            lastUpdated: now,
        };
        profiles.push(newProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        return newProfile;
    },

    getProfileById: (id: string): KycProfile | undefined => {
        return ComplianceManager.getProfiles().find(p => p.id === id);
    },

    deleteProfile: (id: string): void => {
        let profiles = ComplianceManager.getProfiles();
        profiles = profiles.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
};
