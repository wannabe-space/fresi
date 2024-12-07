'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { z } from 'zod'

export function useZodConfig() {
  const t = useTranslations('validations')

  useEffect(() => {
    const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.minimum === 1) {
          if (issue.type === 'number')
            return { message: t('min', { count: issue.minimum }) }

          return { message: t('required') }
        }

        return {
          message: t('too-small', { count: Number(issue.minimum) }),
        }
      }
      else if (issue.code === z.ZodIssueCode.too_big) {
        if (issue.type === 'number')
          return { message: t('max', { count: Number(issue.maximum) }) }

        return {
          message: t('too-big', { count: Number(issue.maximum) }),
        }
      }
      else if (issue.code === z.ZodIssueCode.invalid_string) {
        if (issue.validation === 'email')
          return { message: t('email') }

        if (issue.validation === 'url')
          return { message: t('url') }
      }

      return { message: ctx.defaultError }
    }

    z.setErrorMap(customErrorMap)
  }, [])
}
