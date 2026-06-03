import { apiRequest } from "@/lib/api-client";

export const AUTH_STORAGE_KEY = "rapid_drinks_auth_user";
export const AUTH_TOKEN_STORAGE_KEY = "rapid_drinks_auth_token";
export const AUTH_UPDATED_EVENT = "rapid-drinks-auth-updated";

export type DummyAuthUser = {
  id: string;
  name: string;
  email: string;
  accountType: "personal" | "business";
};

export function getAuthUser(): DummyAuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DummyAuthUser;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function setAuthUser(user: DummyAuthUser, token?: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

type AuthResponse = {
  user: DummyAuthUser;
  token: string;
};

type SignUpPayload =
  | {
      accountType: "personal";
      fullName: string;
      email: string;
      password: string;
    }
  | {
      accountType: "business";
      businessName: string;
      vatNumber: string;
      email: string;
      password: string;
    };

export async function signIn(payload: {
  email: string;
  password: string;
}): Promise<DummyAuthUser> {
  const response = await apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: payload,
  });
  setAuthUser(response.user, response.token);
  return response.user;
}

export async function signUp(payload: SignUpPayload): Promise<DummyAuthUser> {
  const response = await apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });
  setAuthUser(response.user, response.token);
  return response.user;
}

export async function syncAuthFromServer(): Promise<DummyAuthUser | null> {
  if (!getAuthToken()) return null;
  try {
    const response = await apiRequest<{ user: DummyAuthUser }>("/auth/me", {
      auth: true,
      onUnauthorized: "silent",
    });
    setAuthUser(response.user);
    return response.user;
  } catch {
    clearAuthUser();
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await apiRequest("/auth/signout", {
      method: "POST",
      auth: true,
      onUnauthorized: "silent",
    });
  } catch {
    // Clear local auth even if remote signout fails.
  } finally {
    clearAuthUser();
  }
}
