import { SignUp as ClerkSignUp } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

export function SignUp() {
  const t = useTranslations()

  return (
    <DialogContent>
      <DialogHeader className="sr-only">
        <DialogTitle>
          {t('features.auth.sign-up')}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription />
      <div className="flex justify-center">
        <ClerkSignUp routing="virtual" />
      </div>
    </DialogContent>
  )
}
