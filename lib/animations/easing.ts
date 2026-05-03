export function easeInQuad(t: number) {
  return t * t
}

export function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t)
}

export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

