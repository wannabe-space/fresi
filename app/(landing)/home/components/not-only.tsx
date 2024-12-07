import { RiExternalLinkLine } from '@remixicon/react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ChatAssistant, ChatContainer, ChatUser } from '~/components/chat-messages'
import { Markdown } from '~/components/markdown'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/ui'

export function NotOnly({ className, ...props }: Pick<React.ComponentProps<'div'>, 'className' | 'id'>) {
  const t = useTranslations('views.home.not-only')

  return (
    <div
      className={cn('container flex justify-center', className)}
      {...props}
    >
      <div className="max-w-5xl">
        <div className="flex flex-col items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-subtitle font-semibold text-primary"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
            whileInView={{ opacity: 1, filter: 'blur(0)', y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-16 text-balance text-center text-h3"
          >
            {t('description')}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChatContainer className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 lg:p-10">
            <ChatUser
              avatar={(
                <Image
                  src="/images/avatar.jpg"
                  className="size-full rounded-lg"
                  width={32}
                  height={32}
                  alt="User avatar"
                />
              )}
            >
              <Markdown content="how to cook borstch?" />
            </ChatUser>
            <ChatAssistant>
              <Markdown content="I'll help you with a traditional Ukrainian borscht recipe! Since this is not related to development documentation, I'm providing this information based on general knowledge." />
            </ChatAssistant>
          </ChatContainer>
          <div className="text-center">
            <Button
              variant="link"
              target="_blank"
              size="xs"
              href="/chat/019321b6-25ea-7469-95f4-235d6d466f5b"
              className="mt-4 opacity-50"
            >
              {t('open-chat')}
              <RiExternalLinkLine className="size-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
