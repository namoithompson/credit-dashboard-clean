import { promises as fs } from 'fs'
import { join } from 'path'

const root = process.env.FILE_STORAGE_ROOT || './uploads'

export async function ensureStorage() {
  await fs.mkdir(root, { recursive: true })
}

/**
 * Save a buffer to the uploads folder and return the relative path.
 */
export async function saveFile(name: string, buffer: Buffer) {
  await ensureStorage()
  const filePath = join(root, name)
  await fs.writeFile(filePath, buffer)
  return filePath
}