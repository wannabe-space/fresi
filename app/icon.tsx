import { ImageResponse } from 'next/og'
import { FresiLogo } from '~/components/fresi-logo'

export const size = {
  width: 128,
  height: 128,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#16c2ad',
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FresiLogo style={{ color: 'white', width: '50%', height: '50%' }} />
      </div>
    ),
    size,
  )
}
