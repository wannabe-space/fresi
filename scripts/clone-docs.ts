import type { Resource } from '~/resources'
import { existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import consola from 'consola'
import { simpleGit } from 'simple-git'
import { DOCS_PATH } from '~/lib/constants'
import { resources } from '~/resources'

// npm run docs:clone --name=react
const repoName = process.env.npm_config_name

if (!existsSync(DOCS_PATH)) {
  await mkdir(DOCS_PATH)
}

const git = simpleGit(DOCS_PATH)

async function clone(resource: Resource) {
  if (!resource) {
    throw new Error('Invalid resource')
  }

  if (existsSync(`${DOCS_PATH}/${resource.type}`)) {
    await rm(`${DOCS_PATH}/${resource.type}`, {
      recursive: true,
    })
  }

  consola.info(`Cloning... ${resource.git}`)

  await git.clone(resource.git, resource.type)

  consola.success(`Cloned ${resource.git} into ${DOCS_PATH}/${resource.type}`)
}

async function cloneDocs() {
  if (repoName) {
    // Find the specific resource
    const resource = resources.find(r => r.type === repoName)
    if (!resource) {
      consola.error(`Repo ${repoName} not found`)
      process.exit(1)
    }
    await clone(resource)
  }
  else {
    // Clone all resources if no specific repo is specified
    for (const resource of resources) {
      await clone(resource)
    }
  }
}

cloneDocs()
