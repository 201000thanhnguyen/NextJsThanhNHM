import type React from "react"
import { useCallback } from "react"

import { scrollToElement } from "./scroll"

export function useScrollTo() {
  return useCallback((ref: React.RefObject<HTMLElement>) => {
    if (!ref.current) return
    scrollToElement(ref.current, 600)
  }, [])
}

