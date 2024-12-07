import type { Chat } from './api/route'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { getFonts } from '~/app/fonts'
import { FresiLogo } from '~/components/fresi-logo'
import { env } from '~/env'
import { PRIMARY_COLOR } from '~/tailwind.config'

export const runtime = 'edge'

export const alt = 'Fresi'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const chat = await fetch(`${env.NEXT_PUBLIC_URL}/chat/${params.id}/api`).then(res => res.json()) as Chat

  if (!chat) {
    return notFound()
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: PRIMARY_COLOR,
          width: '100%',
          height: '100%',
          padding: '2rem',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            gap: '2rem',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ height: '3rem' }} />
          <span
            style={{
              fontSize: '6rem',
              textAlign: 'center',
              lineHeight: '1',
            }}
          >
            {chat.title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FresiLogo style={{ width: 45, height: 45, color: 'white' }} />
            <span style={{ fontSize: 60, fontWeight: 700, lineHeight: 1, marginBottom: -10 }}>Fresi</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: await getFonts(),
    },
  )
}
