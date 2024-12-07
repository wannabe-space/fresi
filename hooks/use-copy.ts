import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useCopy() {
  const t = useTranslations('labels')

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success(t('copied'))
  }

  return { copyToClipboard }
}
