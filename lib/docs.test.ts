import { describe, expect, it } from 'vitest'
import { formatLink, getPropValueBetweenDashes } from './docs'

const markdown1 = `
---
title: "Assessment: Accessibility troubleshooting"
slug: Learn/Accessibility/Accessibility_troubleshooting
page-type: learn-module-assessment
---

{{LearnSidebar}}{{PreviousMenu("Learn/Accessibility/Mobile", "Learn/Accessibility")}}

In the assessment for this module, we present to you a simple site with a number of accessibility issues that you need to diagnose and fix.

<table>
`
const markdown2 = `
---
title: 'Assessment: Accessibility troubleshooting'
slug: Learn/Accessibility/Accessibility_troubleshooting
page-type: learn-module-assessment
---

{{LearnSidebar}}{{PreviousMenu("Learn/Accessibility/Mobile", "Learn/Accessibility")}}

In the assessment for this module, we present to you a simple site with a number of accessibility issues that you need to diagnose and fix.

<table>
`

const markdown3 = `
---
title: Accessibility troubleshooting
slug: Learn/Accessibility/Accessibility_troubleshooting
page-type: learn-module-assessment
---

{{LearnSidebar}}{{PreviousMenu("Learn/Accessibility/Mobile", "Learn/Accessibility")}}

In the assessment for this module, we present to you a simple site with a number of accessibility issues that you need to diagnose and fix.

<table>
`

const markdown4 = `
import Section from '@mdx/Section.astro';
import Callout from '@mdx/Callout.astro';

We have native support for all of them, yet if that's not enough for you, feel free to create **[custom types](/docs/custom-types)**.

<Callout title='important' type='warning'>
All examples in this part of the documentation do not use database column name aliases, and column names are generated from TypeScript keys.

You can use database aliases in column names if you want, and you can also use the casing parameter to define a mapping strategy for Drizzle.

You can read more about it [here](/docs/sql-schema-declaration#shape-your-data-schema)
</Callout>
title: something
`

describe('titles', () => {
  it('should return the title', async () => {
    expect(getPropValueBetweenDashes(markdown1, 'title')).toBe('Assessment: Accessibility troubleshooting')
    expect(getPropValueBetweenDashes(markdown2, 'title')).toBe('Assessment: Accessibility troubleshooting')
    expect(getPropValueBetweenDashes(markdown3, 'title')).toBe('Accessibility troubleshooting')
  })
})

describe('urls', () => {
  it('should remove md and mdx from the link', async () => {
    expect(formatLink('https://some.doc', '/docs/indexes-constraints.md')).toBe('https://some.doc/docs/indexes-constraints')
    expect(formatLink('https://some.doc', '/docs/indexes-constraints.mdx')).toBe('https://some.doc/docs/indexes-constraints')
  })

  it('should replace index at the end of the link and do not replace in the middle', async () => {
    expect(formatLink('https://some.doc', '/docs/indexes-constraints.mdx')).toBe('https://some.doc/docs/indexes-constraints')
    expect(formatLink('https://some.doc', '/docs/hooks/index.mdx')).toBe('https://some.doc/docs/hooks')
  })

  it('should fix double slashes', async () => {
    expect(formatLink('https://some.doc', '//docs/indexes-constraints.mdx')).toBe('https://some.doc/docs/indexes-constraints')
  })

  it('should not return title from the code block', async () => {
    expect(getPropValueBetweenDashes(markdown4, 'title')).toBe(null)
  })
})
