import * as React from "react"

const MOBILE_BREAKPOINT = 768
const mobileMediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export function useIsMobile() {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const mediaQueryList = window.matchMedia(mobileMediaQuery)
    mediaQueryList.addEventListener("change", onStoreChange)

    return () => {
      mediaQueryList.removeEventListener("change", onStoreChange)
    }
  }, [])

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(mobileMediaQuery).matches,
    () => false
  )
}
