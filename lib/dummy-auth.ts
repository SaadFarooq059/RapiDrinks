import { apiRequest } from "@/lib/api-client";
import { normalizeVatNumber } from "@/lib/vat";

export const AUTH_STORAGE_KEY = "rapid_drinks_auth_user";
export const AUTH_TOKEN_STORAGE_KEY = "rapid_drinks_auth_token";
export const AUTH_UPDATED_EVENT = "rapid-drinks-auth-updated";

export type DummyAuthUser = {
  id: string;
  name: string;
  email: string;
  accountType: "personal" | "business";
  vatNumber?: string;
  vatVerified?: boolean;
  companyName?: string;
  companyAddress?: string;
};

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

export type VerifyVatResult = {
  vatVerified: boolean;
  companyName?: string;
  companyAddress?: string;
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

/** GET /api/auth/me — fetch profile and refresh stored user state */
export async function getCurrentUser(options?: {
  onUnauthorized?: "redirect" | "silent";
}): Promise<DummyAuthUser> {
  const response = await apiRequest<{ user: DummyAuthUser }>("/auth/me", {
    auth: true,
    onUnauthorized: options?.onUnauthorized ?? "redirect",
  });
  setAuthUser(response.user);
  return response.user;
}

export async function syncAuthFromServer(): Promise<DummyAuthUser | null> {
  if (!getAuthToken()) return null;
  try {
    return await getCurrentUser({ onUnauthorized: "silent" });
  } catch {
    clearAuthUser();
    return null;
  }
}

export type UpdateProfilePayload = {
  name: string;
  vatNumber?: string;
};

/** PATCH /api/auth/me — update profile fields */
export async function updateProfile(payload: UpdateProfilePayload): Promise<DummyAuthUser> {
  const name = payload.name.trim();
  if (!name) {
    throw new Error("Name is required.");
  }

  const body: Record<string, string> = { name };
  if (payload.vatNumber !== undefined) {
    body.vatNumber = normalizeVatNumber(payload.vatNumber);
  }

  const response = await apiRequest<{ user: DummyAuthUser }>("/auth/me", {
    method: "PATCH",
    auth: true,
    body,
  });
  setAuthUser(response.user);
  return response.user;
}

export async function verifyVat(vatNumber: string): Promise<VerifyVatResult> {
  const normalized = normalizeVatNumber(vatNumber);
  const response = await apiRequest<VerifyVatResult>("/auth/verify-vat", {
    method: "POST",
    auth: true,
    body: { vatNumber: normalized },
  });

  const user = getAuthUser();
  if (user) {
    setAuthUser({
      ...user,
      vatNumber: normalized,
      vatVerified: response.vatVerified,
      companyName: response.companyName ?? user.companyName,
      companyAddress: response.companyAddress ?? user.companyAddress,
    });
  }

  return response;
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
