import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface AnimatedTypingProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: string
}

export function AnimatedTyping({ children }: AnimatedTypingProps) {
  const [displayText, setDisplayText] = useState<string[]>([])

  useEffect(() => {
    const words = children.split(' ')
    const currentDisplayText = displayText.join(' ')

    if (currentDisplayText !== children) {
      const nextWord = words[displayText.length]

      if (nextWord) {
        // To prevent react's strict mode from rendering the first word twice
        setDisplayText(prev => prev[0] === nextWord ? prev : [...prev, nextWord])
      }
    }
  }, [children, displayText])

  return (
    <motion.p>
      <AnimatePresence mode="sync">
        {displayText.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {word}
            {' '}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.p>
  )
}

export default AnimatedTyping
