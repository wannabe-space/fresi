import { RiSendPlaneFill } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import { forwardRef } from 'react'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { useUser } from '~/hooks/use-user'
import { type DocType, resources } from '~/resources'
import { DocSelector } from './doc-selector'

interface QuestionFormProps extends Omit<React.ComponentProps<'div'>, 'resource'> {
  input: string
  setInput: (value: string) => void
  docType: DocType | null
  setDocType: (value: DocType | null) => void
  handleSubmit: () => void
  disabled?: boolean
  loading?: boolean
}

export const QuestionForm = forwardRef<HTMLTextAreaElement, QuestionFormProps>(
  ({ input, setInput, docType, setDocType, handleSubmit, disabled, loading, ...props }, ref) => {
    const t = useTranslations('views.chat')
    const tLabels = useTranslations('labels')
    const { user } = useUser()

    const resourceLabel = docType ? resources.find(r => r.type === docType)?.label : null

    function submit() {
      if (input.replaceAll('\n', '').trim()) {
        handleSubmit()
      }
    }

    return (
      <div {...props}>
        <form
          className="relative mx-auto flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <Textarea
            ref={ref}
            id="question"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="max-h-80 min-h-[4.5rem] w-full pb-20 pe-14"
            disabled={disabled || !user}
            placeholder={resourceLabel ? `${t('ask')} ${tLabels('about').toLowerCase()} ${resourceLabel}` : t('ask')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <DocSelector
            disabled={disabled}
            docType={docType}
            setDocType={setDocType}
            className="absolute bottom-4 left-4"
          />
          <Button
            type="submit"
            size="iconSm"
            className="absolute bottom-4 right-4"
            disabled={!input.replaceAll('\n', '').trim() || disabled || !user}
            loading={loading}
          >
            <RiSendPlaneFill className="size-4" />
          </Button>
        </form>
        {/* <div className="flex-1 absolute bottom-2 text-center text-xs opacity-30">
          {t('mistake')}
        </div> */}
      </div>
    )
  },
)
