'use client'

import { useEffect } from 'react'
import { scrollTo } from '~/lib/ui'
import { Available } from './components/available'
import { Companies } from './components/companies'
import { Features } from './components/features'
import { Hero } from './components/hero'
import { HowItWorks } from './components/how-it-works'
import { NotOnly } from './components/not-only'
import { Pricing } from './components/pricing'
import { Video } from './components/video'

export default function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      scrollTo(window.location.hash)
    }
  }, [])

  return (
    <div>
      <Hero />
      <div className="flex flex-col gap-20 md:gap-40 lg:gap-52">
        <Video className="relative z-20 mt-[calc(min(15vw,15vh)*-1)]" />
        <HowItWorks id="how-it-works" />
        <Companies />
        <Available id="available" />
        <Features id="features" />
        <NotOnly id="not-only" />
        <Pricing id="pricing" />
      </div>
    </div>
  )
}
