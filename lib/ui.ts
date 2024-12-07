import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollTo(selectorOrOffset: string | number = 0, type: 'smooth' | 'instant' = 'smooth') {
  if (typeof selectorOrOffset === 'string') {
    const element = document.querySelector(selectorOrOffset)

    if (!element) {
      console.warn(`Element with selector ${selectorOrOffset} not found`)
    }

    element?.scrollIntoView({ behavior: type, block: 'center' })
  }
  else if (typeof selectorOrOffset === 'number') {
    window.scrollTo({ top: selectorOrOffset, behavior: type })
  }
}

export function hasScrollbar(element?: HTMLElement, onlyVertical = true) {
  if (onlyVertical) {
    return element
      ? element.scrollHeight > element.clientHeight
      : window.innerWidth > document.documentElement.clientWidth
  }

  if (element) {
    return (
      element.scrollHeight > element.clientHeight
      || element.scrollWidth > element.clientWidth
    )
  }

  return (
    window.innerWidth > document.documentElement.clientWidth
    || window.innerHeight > document.documentElement.clientHeight
  )
}

export function shadeColor(color: string, percent: number) {
  let R = Number.parseInt(color.substring(1, 3), 16)
  let G = Number.parseInt(color.substring(3, 5), 16)
  let B = Number.parseInt(color.substring(5, 7), 16)

  // @ts-expect-error https://stackoverflow.com/a/13532993/25689393
  R = Number.parseInt((R * (100 + percent)) / 100)
  // @ts-expect-error https://stackoverflow.com/a/13532993/25689393
  G = Number.parseInt((G * (100 + percent)) / 100)
  // @ts-expect-error https://stackoverflow.com/a/13532993/25689393
  B = Number.parseInt((B * (100 + percent)) / 100)

  R = R < 255 ? R : 255
  G = G < 255 ? G : 255
  B = B < 255 ? B : 255

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  const RR
    = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16)
  const GG
    = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16)
  const BB
    = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16)

  return `#${RR}${GG}${BB}`
}
