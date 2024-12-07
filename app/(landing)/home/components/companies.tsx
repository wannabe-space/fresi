import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { cn } from '~/lib/ui'

function Logo({ alt, src, className }: { alt: string, src: string, className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 0.5, scale: 1 }}
      whileHover={{ scale: 1.1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.3 }}
    >
      <Image src={src} alt={alt} width={100} height={100} className={cn('dark:invert', className)} />
    </motion.div>
  )
}

export function Companies({ className, ...props }: Pick<React.ComponentProps<'div'>, 'className' | 'id'>) {
  const t = useTranslations('views.home.companies')

  return (
    <div
      className={cn('container', className)}
      {...props}
    >
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
        className="mx-auto mb-8 max-w-2xl text-balance text-center text-h3 leading-none lg:mb-14"
      >
        {t('description')}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-6 lg:gap-10"
      >
        <Logo
          src="/logos/openai.svg"
          alt="OpenAI"
          className="w-20 min-w-16 lg:w-28"
        />
        <Logo
          src="/logos/anthropic.svg"
          alt="Anthropic"
          className="w-28 min-w-16 lg:w-36"
        />
        <Logo
          src="/logos/gemini.svg"
          alt="Gemini"
          className="-mt-3 w-20 min-w-16 lg:-mt-4 lg:w-24"
        />
        <Logo
          src="/logos/grok.svg"
          alt="Grok"
          className="-mt-1 w-20 min-w-16"
        />
      </motion.div>
    </div>
  )
}
