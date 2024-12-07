import type { DocType } from '~/resources'
import { useTranslations } from 'next-intl'
import { useAppContext } from '~/app/app-context'
import { DocIcon } from '~/components/doc-icon'
import { Button } from '~/components/ui/button'
import { resources } from '~/resources'

interface AvailableProps {
  setDocType: (resource: DocType) => void
}

export function Available({ setDocType }: AvailableProps) {
  const t = useTranslations('views.chat')
  const { isDesktop } = useAppContext()

  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-start gap-6">
      <h3 className="text-center text-xl font-semibold">{t('available-docs')}</h3>
      <div className="flex flex-wrap justify-center gap-2 animate-in lg:gap-4">
        {resources.map(resource => (
          <Button
            key={resource.label}
            variant="outline"
            size={isDesktop ? 'sm' : 'xs'}
            onClick={() => setDocType(resource.type)}
          >
            <DocIcon name={resource.type} />
            {resource.label}
          </Button>
        ))}
      </div>
      <p className="text-balance text-center opacity-70">
        {t('but-anything')}
      </p>
    </div>
  )
}
