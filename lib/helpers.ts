import type { AnyType } from './types'

export function pick<O extends Record<string, AnyType>, K extends keyof O>(
  obj: O,
  fields: K[],
): Pick<O, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => fields.includes(key as K)),
  ) as Pick<O, K>
}

export function omit<O extends Record<string, AnyType>, K extends keyof O>(
  obj: O,
  fields: K[],
): Omit<O, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !fields.includes(key as K)),
  ) as Omit<O, K>
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
