import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { IBM_Plex_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { CookieBanner } from '~/components/cookie-banner'
import { ModalProvider } from '~/components/modals'
import { Toaster } from '~/components/ui/sonner'
import { env } from '~/env'
import { resources } from '~/resources'
import { PRIMARY_COLOR } from '~/tailwind.config'
import { AppProvider } from './app-context'
import { ClerkProvider } from './clerk-provider'
import { DataProvider } from './data-provider'
import './assets/styles/globals.scss'

const fontSans = localFont({
  src: [
    {
      path: './assets/fonts/gilroy/Gilroy-Medium.woff2',
      weight: '400',
    },
    {
      path: './assets/fonts/gilroy/Gilroy-SemiBold.woff2',
      weight: '600',
    },
    {
      path: './assets/fonts/gilroy/Gilroy-Bold.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
  variable: '--font-sans',
})

const fontMono = IBM_Plex_Mono({
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
})

export const viewport: Viewport = {
  themeColor: PRIMARY_COLOR,
}

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()])

  return {
    title: t('seo.title'),
    description: t('seo.description'),
    applicationName: t('seo.title'),
    authors: [{ name: 'Valerii Strilets', url: 'https://github.com/letstri' }],
    creator: 'Wannabe Space',
    keywords: ['Fresi', 'JavaScript', 'AI', 'Assistant', 'Documentation', 'Search', ...resources.map(r => r.label)],
    metadataBase: new URL(env.NEXT_PUBLIC_URL),
    openGraph: {
      type: 'website',
      locale,
      title: t('seo.title'),
      description: t('seo.description'),
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()])

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head> */}
      <body className={`min-w-[320px] bg-zinc-50 font-sans dark:bg-zinc-950 ${fontMono.variable} ${fontSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider locale={locale}>
            <NextIntlClientProvider messages={messages}>
              <DataProvider>
                <AppProvider>
                  {/* <DesktopScreen /> */}
                  {children}
                  <Analytics />
                  <CookieBanner />
                  <ModalProvider />
                  <Toaster />
                </AppProvider>
              </DataProvider>
            </NextIntlClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
