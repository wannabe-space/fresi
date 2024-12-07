import Link from 'next/link'
import { FresiLogo } from '~/components/fresi-logo'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto my-10 max-w-4xl">
      <Link href="/home">
        <h1 className="mb-10 flex items-center justify-center gap-2 text-3xl font-bold">
          <FresiLogo className="size-6 text-primary" />
          Fresi
        </h1>
      </Link>
      <div className=" rounded-3xl bg-white p-6 dark:bg-zinc-900">{children}</div>
    </div>
  )
}
