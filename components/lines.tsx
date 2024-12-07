import { cn } from '~/lib/ui'
import styles from './lines.module.scss'

export function Lines() {
  return (
    <div className="absolute inset-0 z-10 m-auto h-full w-[80vw] overflow-hidden">
      <div className={cn('left-0 absolute inset-y-0', styles.line)} />
      <div className={cn('left-1/2 absolute inset-y-0', styles.line)} />
      <div className={cn('right-0 absolute inset-y-0', styles.line)} />
    </div>
  )
}
