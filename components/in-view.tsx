import { useEffect, useRef } from 'react'
import { useIntersection } from 'react-use'

interface InViewProps extends React.HTMLAttributes<HTMLDivElement> {
  threshold?: number
  rootMargin?: string
  onVisible?: () => void
  onHidden?: () => void
}

export function InView({ children, onVisible, onHidden, threshold = 1, rootMargin = '0px', ...props }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin,
    threshold,
  })

  useEffect(() => {
    if (intersection) {
      if (intersection.intersectionRatio < 1) {
        onHidden?.()
      }
      else {
        onVisible?.()
      }
    }
  }, [intersection?.isIntersecting])

  return <div ref={ref} {...props} />
}
