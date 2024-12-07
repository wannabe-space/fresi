import type { DocType } from '~/resources'
import { RiCheckLine, RiExpandUpDownLine } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import { DocIcon } from '~/components/doc-icon'
import { Combobox, ComboboxContent, ComboboxItem, ComboboxTrigger } from '~/components/ui/combobox'
import { cn } from '~/lib/ui'
import { resources } from '~/resources'

const resourcesList = resources.map(resource => ({
  value: resource.type,
  label: resource.label,
  icon: resource.icon,
}))

interface DocSelectorProps {
  docType: DocType | null
  setDocType: (value: DocType | null) => void
  className?: string
  disabled?: boolean
}

export function DocSelector({
  docType,
  setDocType,
  className,
  disabled,
}: DocSelectorProps) {
  const t = useTranslations('views.chat')

  return (
    <Combobox>
      <ComboboxTrigger
        className={className}
        disabled={disabled}
        variant="outline"
        size="sm"
      >
        {docType
          ? (
              <>
                <DocIcon name={docType} />
                {resourcesList.find(item => item.value === docType)?.label}
              </>
            )
          : (
              <span className="opacity-50">
                {t('resource-placeholder')}
              </span>
            )}
        <RiExpandUpDownLine className="size-4 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent>
        {resourcesList.map(item => (
          <ComboboxItem
            key={item.value}
            selectedValue={docType}
            value={item.value}
            setValue={v => setDocType(v as DocType | null)}
          >
            <RiCheckLine
              className={cn(
                'mr-2 size-4',
                docType === item.value ? 'opacity-100' : 'opacity-0',
              )}
            />
            <DocIcon name={item.value} className="mr-2" />
            {item.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  )
}
