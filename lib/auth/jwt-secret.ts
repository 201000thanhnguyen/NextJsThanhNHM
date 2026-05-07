/** Must match Nest `AuthService` default when `JWT_SECRET` is unset. */
const DEV_FALLBACK = "dev_secret_change_me"

export function getJwtSecretBytes() {
  const secret = process.env.JWT_SECRET?.trim() || DEV_FALLBACK
  return new TextEncoder().encode(secret)
}
