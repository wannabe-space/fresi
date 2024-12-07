import { useEffect, useState } from 'react'

export function useMobileKeyboard() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function onResize(event: Event) {
      const viewport = event.target as VisualViewport

      setIsOpen(viewport.height + 30 < document.scrollingElement!.clientHeight)
    }

    if ('visualViewport' in window) {
      window.visualViewport!.addEventListener('resize', onResize)
    }

    return () => {
      if ('visualViewport' in window) {
        window.visualViewport!.removeEventListener('resize', onResize)
      }
    }
  }, [])

  return {
    isKeyboardOpen: isOpen,
  }
}
