import { ImageResponse } from 'next/og'
import { FresiLogo } from '~/components/fresi-logo'
import { PRIMARY_COLOR } from '~/tailwind.config'
import { getFonts } from './fonts'

export const runtime = 'edge'

export const alt = 'Fresi'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: PRIMARY_COLOR,
          width: '100%',
          height: '100%',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            gap: '4rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FresiLogo style={{ width: 150, height: 150, color: 'white' }} />
          <span style={{ fontSize: 200, fontWeight: 700, lineHeight: 1, marginBottom: -30 }}>
            Fresi
          </span>
        </div>
        <span style={{ fontSize: 60, fontWeight: 400 }}>
          JavaScript-First AI
        </span>
      </div>
    ),
    {
      ...size,
      fonts: await getFonts(),
    },
  )
}
