import type { AnyType } from '~/lib/types'
// import parser from 'accept-language-parser'
// import { headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import en from '~/locales/en.json'
// import { getCookieLocale } from './locale'

export default getRequestConfig(() => {
  // const acceptLanguage = (await headers()).get('accept-language')
  // const browserLocale = acceptLanguage
  //   ? parser.pick(['en'], acceptLanguage)
  //   : null
  // const locale = (await getCookieLocale()) || browserLocale || 'en'

  return {
    locale: 'en',
    messages: en as AnyType,
  }
})
