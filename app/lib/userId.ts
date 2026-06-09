// app/lib/userId.ts

export function generateUserId(): string {
  return (
    "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11)
  );
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("plics_user_id");
  if (stored) return stored;

  const newId = generateUserId();
  localStorage.setItem("plics_user_id", newId);
  return newId;
}

export function setUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("plics_user_id", userId);
}

const ACCESS_CACHE_KEY = "plics_has_access";

export function cacheAccessGranted(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_CACHE_KEY, "true");
}

export function hasCachedAccess(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ACCESS_CACHE_KEY) === "true";
}

export function clearAccessCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_CACHE_KEY);
}
