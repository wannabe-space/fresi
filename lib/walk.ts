import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * @returns Array of paths
 */
export async function walk(dir: string): Promise<string[]> {
  const immediateFiles = await readdir(dir)

  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(dir, file)
      const stats = await stat(path)

      if (stats.isDirectory()) {
        return walk(path)
      }
      else if (stats.isFile()) {
        return [path]
      }
      else {
        return []
      }
    }),
  )

  return recursiveFiles.flat(Infinity) as string[]
}
