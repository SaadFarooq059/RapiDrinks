const API_BASE_URL = "https://api.rapiddrinks.be/api";
const AUTH_TOKEN_STORAGE_KEY = "rapid_drinks_auth_token";
const AUTH_STORAGE_KEY = "rapid_drinks_auth_user";
const AUTH_UPDATED_EVENT = "rapid-drinks-auth-updated";

type UnauthorizedMode = "redirect" | "silent";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  onUnauthorized?: UnauthorizedMode;
  signal?: AbortSignal;
};

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

function handleUnauthorized(mode: UnauthorizedMode): void {
  clearStoredAuth();
  if (mode !== "redirect" || typeof window === "undefined") return;

  const path = `${window.location.pathname}${window.location.search}`;
  if (path.startsWith("/signin") || path.startsWith("/signup")) return;
  window.location.href = `/signin?next=${encodeURIComponent(path)}`;
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim().length > 0) return data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["message", "error", "detail"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim().length > 0) return value;
    }

    const errors = record.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0];
      if (typeof first === "string" && first.trim().length > 0) return first;
      if (first && typeof first === "object") {
        const msg = (first as Record<string, unknown>).message;
        if (typeof msg === "string" && msg.trim().length > 0) return msg;
      }
    }
  }
  return fallback;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = false,
    onUnauthorized = "redirect",
    signal,
  } = options;

  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else if (auth) {
    handleUnauthorized(onUnauthorized);
    throw new ApiError("Authentication required.", 401, null);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      data = raw;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized(onUnauthorized);
    }
    throw new ApiError(
      extractErrorMessage(data, "Request failed. Please try again."),
      response.status,
      data
    );
  }

  return data as T;
}

