import { RiCheckLine } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { popModal } from '.'

export function Confirm({ text, onConfirm }: { text: string, onConfirm: () => Promise<void> | void }) {
  const t = useTranslations('labels')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit() {
    setIsSubmitting(true)
    await onConfirm()
    toast.success(t('success'))
    setIsSubmitting(false)
    popModal('Confirm')
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {t('confirmation')}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {text}
      </DialogDescription>
      <DialogFooter>
        <Button
          variant="outline"
          disabled={isSubmitting}
          onClick={() => popModal('Confirm')}
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          onClick={submit}
        >
          <RiCheckLine className="size-4" />
          {t('confirm')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
