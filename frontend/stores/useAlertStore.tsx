import { create } from 'zustand';

type AlertState = {
    alert: string | null;
    addAlert: (msg: string) => void;
    clearAlert: () => void;
};

let timeoutId: NodeJS.Timeout | null = null;

export const useAlertStore = create<AlertState>((set) => ({
    alert: null,
    addAlert: (msg: string) => {
        set({ alert: msg });

        setTimeout(() => {
            set({ alert: null });
            timeoutId = null;
        }, 3000);
    },
    clearAlert: () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        set(() => ({ alert: null }))
    }
}));

