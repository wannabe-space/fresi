import { RiFileCopyLine, RiShare2Line } from '@remixicon/react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Switch } from '~/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { env } from '~/env'
import { useCopy } from '~/hooks/use-copy'
import { chatVisibilityMutation } from '~/lib/query-keys'

export function ChatShare({ chatId, initialPublic }: { chatId: string, initialPublic: boolean }) {
  const t = useTranslations('views.chat')
  const tLabels = useTranslations('labels')
  const { copyToClipboard } = useCopy()
  const link = `${env.NEXT_PUBLIC_URL}/chat/${chatId}`

  const { mutate: updateVisibility, data: isPublic, isPending } = useMutation(chatVisibilityMutation({ id: chatId }))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconSm">
          <RiShare2Line className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <h4 className="text-lg font-medium">{t('share')}</h4>
          <div className="flex items-center gap-4">
            <Switch
              id="public"
              disabled={isPending}
              checked={isPublic === undefined ? initialPublic : isPublic}
              onCheckedChange={value => updateVisibility({ isPublic: value })}
            />
            <Label htmlFor="public">{t('public')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="link"
              value={link}
              readOnly
              onClick={e => e.currentTarget.select()}
            />
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(link)}
                    >
                      <RiFileCopyLine className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={10}>
                    {tLabels('copy-link')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
