/** Keys used by the admin UI in the browser (not the httpOnly JWT). */
export const ADMIN_SIDEBAR_LOGWORK_KEY = "admin:sidebar:logwork-expanded"

/**
 * Clears client-only session artifacts. HttpOnly `access_token` must be cleared by `POST /api/auth/logout`.
 */
export function clearAdminClientSession(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(ADMIN_SIDEBAR_LOGWORK_KEY)
    window.sessionStorage.clear()
  } catch {
    /* ignore quota / private mode */
  }
}
