import type { DocType, Resource } from '~/resources'
import { readFile } from 'node:fs/promises'
import { embedMany } from 'ai'
import consola from 'consola'
import { and, eq } from 'drizzle-orm'
import { encodingForModel } from 'js-tiktoken'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { u } from 'unist-builder'
import { db, docs } from '~/drizzle'
import { models } from '~/lib/ai'
import { DOCS_PATH } from '~/lib/constants'
import { stringifyContent } from '~/lib/docs'
import { createLogger } from '~/lib/logger'
import { walk } from '~/lib/walk'
import { resources } from '~/resources'

const repoName = process.env.npm_config_name as DocType | undefined

type Root = ReturnType<typeof fromMarkdown>

function splitTreeByHeading(tree: Root) {
  return tree.children.reduce<Root[]>((trees, node) => {
    const lastTree = trees.at(-1)

    if (!lastTree || node.type === 'heading') {
      const tree: Root = u('root', [node])
      return trees.concat(tree)
    }

    if (node.type !== 'thematicBreak') {
      lastTree.children.push(node)
    }

    return trees
  }, [])
}

function formatPathToDB(path: string, docType: DocType) {
  return (path.startsWith('./') ? path : `./${path}`).replace(
    `${DOCS_PATH}/${docType}/`,
    '',
  )
}

async function generateAndSaveEmbeddingsForResource(
  resource: Resource,
) {
  const logger = createLogger(resource.label)

  logger.log(`Generating embeddings...`)

  let totalSectionsCreated = 0

  const foundPaths = await walk(`${DOCS_PATH}/${resource.type}/${resource.docsPath}`)
  const docsPaths = foundPaths
    .filter(file => (file.endsWith('.md') || file.endsWith('.mdx')) && !resource.ignore.some(item => file.includes(item)))

  logger.info(`Found ${docsPaths.length} markdown files`)

  const encoding = encodingForModel('gpt-4-turbo')

  for (const rawPath of docsPaths) {
    const content = await readFile(rawPath, { encoding: 'utf8' })

    if (!content) {
      logger.error(`File ${rawPath} is empty`)
      continue
    }

    const path = formatPathToDB(rawPath, resource.type)
    const title = resource.formatTitle({ path, doc: content })
    const url = resource.getLink({ path, doc: content })
    const sectionTrees = splitTreeByHeading(fromMarkdown(content))

    const where = and(eq(docs.type, resource.type), eq(docs.path, path))
    const sectionsDB = await db.select().from(docs).where(where)
    const sectionsFormatted = sectionTrees.map(tree => toMarkdown(tree)).filter(section => section && section !== '***\n')

    // If content, url or title are different, we resave all sections from the page
    const sectionsToSave = sectionsFormatted
      .some(section => !sectionsDB.find(s => stringifyContent(s.content) === stringifyContent(section)))
      || sectionsDB.some(s => s.url !== url || s.title !== title)
      ? sectionsFormatted
      : []

    if (!sectionsToSave.length) {
      logger.info(`No new sections found for ${DOCS_PATH}/${resource.type}/${path}`)
      continue
    }

    logger.info(`${sectionsToSave.length} section${sectionsToSave.length === 1 ? '' : 's'} to save in ${DOCS_PATH}/${resource.type}/${path}`)

    await db.transaction(async (tx) => {
      await tx.delete(docs).where(where)

      for (const [index, content] of sectionsToSave.entries()) {
        const tokens = encoding.encode(content.trim().replaceAll('\n', ' '))
        const MAX = 8192
        const texts = []

        for (let i = 0; i < tokens.length; i += MAX) {
          texts.push(encoding.decode(tokens.slice(i, i + MAX)))
        }

        const { embeddings } = await embedMany({
          model: models.embedding,
          values: texts,
        })

        await tx.insert(docs).values(
          embeddings.map(embedding => ({
            type: resource.type,
            path,
            title,
            url,
            content,
            embedding,
            index,
          })),
        )

        logger.success(`${embeddings.length} new embedding${embeddings.length === 1 ? '' : 's'} for "${title}" with index ${index}`)

        totalSectionsCreated += embeddings.length
      }
    })
  }

  logger.info(`Generated all embeddings. Total sections created: ${totalSectionsCreated}`)

  return { totalSectionsCreated }
}

async function generate() {
  const totalSectionsAllDocs = {} as Record<DocType, number>

  if (repoName) {
    const resource = resources.find(resource => resource.type === repoName)
    if (!resource) {
      consola.error(`Repo ${repoName} not found`)
      process.exit(1)
    }
    const { totalSectionsCreated } = await generateAndSaveEmbeddingsForResource(resource)
    totalSectionsAllDocs[repoName] = totalSectionsCreated
  }
  else {
    for (const resource of resources) {
      const { totalSectionsCreated } = await generateAndSaveEmbeddingsForResource(resource)
      totalSectionsAllDocs[resource.type] = totalSectionsCreated
    }
  }

  consola.success(`Generated all embeddings. Total sections created across all docs:\n${Object.entries(totalSectionsAllDocs).map(([doc, total]) => `${total} for ${doc}`).join('\n')}`)

  process.exit(0)
}

generate()
