export function initialsFromUsername(username: string): string {
  const t = username.trim()
  if (t.length <= 2) return t.toUpperCase() || "?"
  return t.slice(0, 2).toUpperCase()
}
