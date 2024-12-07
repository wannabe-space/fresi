import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '~/components/ui/button'
import { useTranslations } from 'next-intl'
import { createContext, useContext, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/ui'

const ComboboxContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>(null!)

function Combobox({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <ComboboxContext.Provider value={{ open, setOpen }}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

function ComboboxTrigger({
  children,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode
  className?: string
  disabled?: boolean
} & VariantProps<typeof buttonVariants>) {
  const { open } = useContext(ComboboxContext)

  return (
    <PopoverTrigger asChild disabled={disabled}>
      <Button
        role="combobox"
        type="button"
        aria-expanded={open}
        innerClassName="justify-between text-sm"
        className={cn('flex', className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </PopoverTrigger>
  )
}

function ComboboxContent({ children }: { children: React.ReactNode }) {
  const t = useTranslations('labels')

  return (
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandInput placeholder={`${t('search')}...`} />
        <CommandList>
          <CommandEmpty>{t('no-items-found')}</CommandEmpty>
          <CommandGroup>
            {children}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  )
}

function ComboboxItem({ children, selectedValue, value, setValue }: { children: React.ReactNode, selectedValue: string | null, value: string, setValue: (value: string | null) => void }) {
  const { setOpen } = useContext(ComboboxContext)

  return (
    <CommandItem
      value={value}
      onSelect={(currentValue) => {
        setValue(currentValue === selectedValue ? null : currentValue)
        setOpen(false)
      }}
    >
      {children}
    </CommandItem>
  )
}

export { Combobox, ComboboxContent, ComboboxItem, ComboboxTrigger }
