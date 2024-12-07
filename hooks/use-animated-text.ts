import { animate, useMotionValue } from 'motion/react'
import { useEffect, useState } from 'react'

export function useAnimatedText(text: string, animated: boolean) {
  const [isLoading, setIsLoading] = useState(animated)
  const animatedCursor = useMotionValue(0)
  const [cursor, setCursor] = useState(0)
  const [prevText, setPrevText] = useState(text)
  const [isSameText, setIsSameText] = useState(true)

  if (prevText !== text) {
    setPrevText(text)
    setIsSameText(text.startsWith(prevText))

    if (!text.startsWith(prevText)) {
      setCursor(0)
    }
  }

  useEffect(() => {
    if (!isSameText) {
      animatedCursor.jump(0)
    }

    const controls = animate(animatedCursor, text.split('').length, {
      duration: isLoading ? 3 : 0,
      ease: 'easeOut',
      onUpdate(latest) {
        setCursor(Math.floor(latest))
      },
      onComplete() {
        setIsLoading(false)
      },
    })

    return () => controls.stop()
  }, [animatedCursor, isSameText, text])

  return text.split('').slice(0, cursor).join('')
}
