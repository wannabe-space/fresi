'use server'

import { cookies } from 'next/headers'

const COOKIE_NAME = 'FRESI_LOCALE'

export async function getCookieLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || null
}

export async function setCookieLocale(locale: string) {
  (await cookies()).set(COOKIE_NAME, locale)
}
