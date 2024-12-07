import type { StreamableResult } from '../generate'
import { RiArrowDropRightLine } from '@remixicon/react'
import { capitalCase } from 'change-case'
import { useTranslations } from 'next-intl'
import { DocIcon } from '~/components/doc-icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

export function ChatSource({ source }: { source: StreamableResult['sources'][number] }) {
  const tLabels = useTranslations('labels')
  const breadcrumbs = new URL(source.url)
    .pathname
    .slice(1)
    .split('/')
    .filter((item) => {
      if (source.docType === 'tanstack-query') {
        return !['query', 'latest'].includes(item.toLowerCase())
      }

      if (source.docType === 'svelte') {
        return item !== 'Svelte'
      }

      return !!item
    })
    .filter((item, index, array) => item !== 'docs' || index !== 0 || array.length === 1)
    .map(c => capitalCase(c))

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="flex max-w-52 flex-col items-start gap-1 rounded-md border border-black/10 bg-white px-3 py-2 transition-colors duration-150 dark:border-white/10 dark:bg-zinc-900"
          >
            <span title={source.title.replaceAll('\\', '').replaceAll('&nbsp;', ' ')} className="relative flex w-full items-center gap-2 text-sm">
              <DocIcon
                name={source.docType}
                className="absolute left-0 top-1/2 size-4 -translate-y-1/2"
              />
              <span className="truncate pl-6">
                {source.title.replaceAll('\\', '').replaceAll('&nbsp;', ' ')}
              </span>
            </span>
            <span className="flex w-full items-center truncate text-left text-xs opacity-50">
              {breadcrumbs.map((item, index) => (
                <span key={index} className="flex items-center">
                  {item}
                  {index < breadcrumbs.length - 1 && <RiArrowDropRightLine className="size-4 opacity-50" />}
                </span>
              ))}
            </span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={10}>
          <span className="text-xs">
            {tLabels('match')}
            {' '}
            {source.match}
            %
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
