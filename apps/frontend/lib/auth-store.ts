import { create } from 'zustand';
import { clearSession, readSession, saveSession, type MerchantSession } from './session';

type AuthState = {
  session: MerchantSession | null;
  hydrated: boolean;
  hydrate: () => void;
  setSession: (session: MerchantSession) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hydrated: false,
  hydrate: () => {
    const session = readSession();
    set({ session, hydrated: true });
  },
  setSession: (session) => {
    saveSession(session);
    set({ session, hydrated: true });
  },
  clear: () => {
    clearSession();
    set({ session: null, hydrated: true });
  }
}));
