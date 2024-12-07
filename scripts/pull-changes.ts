import { exec } from 'node:child_process'
import consola from 'consola'
import { resources } from '~/resources'

resources.forEach((resource) => {
  exec(`cd docs/${resource.type} && git pull`, (error, stdout) => {
    if (error) {
      consola.error(`[${resource.type}] Error pulling: ${error}`)
      return
    }
    if (stdout.includes('Already up to date')) {
      consola.log(`[${resource.type}] No changes`)
    }
    else {
      const changedFiles = stdout.split('\n').filter(line => line.includes('|')).length
      consola.log(`[${resource.type}] ${changedFiles} change${changedFiles === 1 ? '' : 's'} pulled`)
    }
  })
})
