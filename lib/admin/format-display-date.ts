/**
 * Locale pinned for admin UI strings that are SSR'd.
 * Using `undefined` (runtime default) differs between Node and the browser → hydration errors.
 */
export const ADMIN_DATE_DISPLAY_LOCALE = "en-US" as const

export function formatAdminDisplayDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(ADMIN_DATE_DISPLAY_LOCALE, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return iso
  }
}
