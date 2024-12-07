import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '~/lib/ui'

interface NavbarLinkProps
  extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  text: string
  href?: string
  icon?: ReactNode
  onClick?: () => void
}

export function NavbarLink({
  text,
  href,
  icon,
  onClick,
  className,
  ...props
}: NavbarLinkProps) {
  const Comp = href ? Link : 'button'

  return (
    <Comp
      href={href || undefined!}
      className={cn(
        'inline-flex items-center no-underline hover-support:hover:no-underline',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <div className="me-2 size-5">{icon}</div>}
      {text}
    </Comp>
  )
}
