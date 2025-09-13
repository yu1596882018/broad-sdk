
export function debounce(fn, delay, immediate = false) {
  let timer = null
  return function (...args) {
    const context = this

    if (timer) clearTimeout(timer)

    if (immediate) {
      const callNow = !timer
      if (callNow) fn.apply(context, args)
    }

    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(context, args)
    }, delay)
  }
}
