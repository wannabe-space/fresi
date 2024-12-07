'use client'

import { enUS, heIL, ukUA } from '@clerk/localizations'
import { ClerkProvider as Provider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function ClerkProvider({ locale, children }: { locale: string, children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const langMap = {
    uk: ukUA,
    en: enUS,
    he: heIL,
  }

  return (
    <Provider
      localization={langMap[locale as keyof typeof langMap]}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/redirect"
      signUpForceRedirectUrl="/redirect"
      afterSignOutUrl="/redirect"
      experimental={{ persistClient: true }}
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        elements: {
          avatarBox: {
            borderRadius: '8px',
          },
          userButtonTrigger: 'rounded-lg',
          userButtonAvatarBox: 'size-full',
          cardBox: 'shadow-none',
          card: 'shadow-none bg-transparent',
          footer: 'bg-none',
          formFieldInput: 'bg-transparent',
        },
      }}
    >
      {children}
    </Provider>
  )
}
