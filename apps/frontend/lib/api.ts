import { clearSession, readSession, saveSession, type MerchantSession } from './session';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type ApiOptions = RequestInit & {
  auth?: boolean;
};

const tokenRefresh = async (): Promise<MerchantSession | null> => {
  const session = readSession();
  if (!session) {
    return null;
  }

  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
    body: JSON.stringify({ refreshToken: session.refreshToken })
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const payload = (await response.json()) as { accessToken: string; refreshToken: string };
  const nextSession: MerchantSession = {
    ...session,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken
  };
  saveSession(nextSession);
  return nextSession;
};

export const apiRequest = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const session = options.auth === false ? null : readSession();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const execute = async (accessToken?: string) => {
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      credentials: 'include'
    });
  };

  let response = await execute();
  if (response.status === 401 && session) {
    const refreshed = await tokenRefresh();
    if (refreshed?.accessToken) {
      response = await execute(refreshed.accessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as T;
};
