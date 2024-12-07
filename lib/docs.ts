import { cleanDoubleSlashes } from 'ufo'

function removeBOM(markdown: string) {
  return markdown.replaceAll(/^\uFEFF/g, '')
}

export function stringifyContent(content: string) {
  return removeBOM(content).toLowerCase().replace(/[^a-z0-9<>]/gi, '')
}

/**
 * @example '---' -> null
 * @example '--- content ---' -> 'content'
 * @example
 *
 * const md = `
 * ---
 * title: "Cool Title"
 * ---
 * content
 * `
 *
 * console.log(getContentBetweenDashes(md) -> 'title: "Cool Title"'
 */
function getContentBetweenDashes(text: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const regex = /---\s*([\s\S]*?)\s*---/
  const match = text.match(regex)

  return (match && match[1].trim()) || null
}

/**
 * @example 'prop: "Cool Title"' -> 'Cool Title'
 * @example 'prop: 'Cool Title'' -> 'Cool Title'
 * @example 'prop: Cool Title' -> 'Cool Title'
 */
export function getPropValueBetweenDashes(markdown: string, prop: string) {
  const regex = new RegExp(`${prop}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n\\r]*))`, 'i')
  const md = removeBOM(markdown)
  const sections = getContentBetweenDashes(md)
  const match = sections?.match(regex)

  return (match && (match[1] || match[2] || match[3]).trim()) || null
}

export function getPropValue(markdown: string, prop: string) {
  const regex = new RegExp(`${prop}:\\s*['"]([^'"]+)['"]`, 'i')

  const match = markdown.match(regex)
  return match ? match[1] : null
}

/**
 * @example docs/02-app/01-building-your-application/01-routing/01-defining-routes.mdx -> docs/app/building-your-application/routing/defining-routes
 */
export function removeNumbersWithDashFromPath(path: string) {
  return path.replace(/\d+-/g, '')
}

/**
 * @example docs/1.getting-started/1.introduction.md -> docs/getting-started/introduction.md
 */
export function removeNumbersWithDotFromPath(path: string) {
  return path.replace(/\d+\./g, '')
}

/**
 * @example '# Cool Title {#cool-title}' -> 'Cool Title'
 * @example '# Cool Title' -> 'Cool Title'
 */
export function getFirstHeadingAsTitle(markdown: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const regex = /^#\s+([^{#\n]+)(?:\s*\{[^}]*\})?/m
  const match = removeBOM(markdown).match(regex)

  const title = match?.[1] || null

  if (!title) {
    return null
  }

  const formattedTitle = title.startsWith('\\')
    ? title.slice(1).trim()
    : title.trim()

  if (formattedTitle.startsWith('#')) {
    throw new Error(`[getFirstHeadingAsTitle]: Title cannot start with #`)
  }

  return formattedTitle
}

/**
 * @example src/content/docs/indexes-constraints/index.mdx -> src/content/docs/indexes-constraints
 */
export function formatLink(base: string, link: string) {
  const formattedLink = cleanDoubleSlashes(`${base}/${link.replace(/\.mdx?$/, '')}`)

  return formattedLink.endsWith('/index') ? formattedLink.slice(0, -6) : formattedLink
}
