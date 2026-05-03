export function focusAndHighlight(el: HTMLInputElement) {
  el.focus()
  el.select()

  el.classList.add("animate-pulse")

  window.setTimeout(() => {
    el.classList.remove("animate-pulse")
  }, 600)
}

