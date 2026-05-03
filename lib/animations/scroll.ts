import type { EasingFn } from "./types"

import { easeInOutQuad } from "./easing"

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export function smoothScrollTo(targetY: number, duration = 500, easing: EasingFn = easeInOutQuad) {
  if (typeof window === "undefined") return () => {}

  const startY = window.scrollY
  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const clampedTargetY = clamp(targetY, 0, maxY)
  const distance = clampedTargetY - startY

  let startTime: number | null = null
  let rafId = 0

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime

    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const ease = easing(progress)

    window.scrollTo(0, startY + distance * ease)

    if (timeElapsed < duration) {
      rafId = window.requestAnimationFrame(animation)
    }
  }

  rafId = window.requestAnimationFrame(animation)

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId)
  }
}

export function scrollToElement(element: HTMLElement, duration = 500, easing: EasingFn = easeInOutQuad) {
  if (typeof window === "undefined") return () => {}

  const rect = element.getBoundingClientRect()
  const targetY = rect.top + window.scrollY - window.innerHeight / 2
  return smoothScrollTo(targetY, duration, easing)
}

