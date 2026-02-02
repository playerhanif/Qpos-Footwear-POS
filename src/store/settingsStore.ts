import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    taxRate: number;
    currency: string;

    updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings' | 'resetSettings'>>) => void;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
    storeName: 'Qpos Store',
    storeAddress: '123 Retail St, Market City',
    storePhone: '+91 98765 43210',
    taxRate: 0.18,
    currency: '₹',
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            updateSettings: (newSettings) => {
                set((state) => ({ ...state, ...newSettings }));
            },

            resetSettings: () => {
                set(DEFAULT_SETTINGS);
            },
        }),
        {
            name: 'qpos-settings-storage',
        }
    )
);
