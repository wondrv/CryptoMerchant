export type MerchantSession = {
  accessToken: string;
  refreshToken: string;
  merchant: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MERCHANT';
    status: string;
  };
};

const SESSION_KEY = 'cryptomerchant.session';

export const readSession = (): MerchantSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MerchantSession;
  } catch {
    return null;
  }
};

export const saveSession = (session: MerchantSession): void => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  window.localStorage.removeItem(SESSION_KEY);
};
