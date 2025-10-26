import { cp, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = join(__dirname, '..')
const distPath = join(projectRoot, 'dist')
const wwwrootPath = join(projectRoot, '..', 'src', 'ONEHub.WebApi', 'wwwroot')

async function copyToWwwroot() {
  try {
    console.log('📦 Copying build files to wwwroot...')

    await cp(join(distPath, 'assets'), join(wwwrootPath, 'assets'), {
      recursive: true,
      force: true,
    })
    console.log('✓ Copied assets/')

    await cp(join(distPath, 'images'), join(wwwrootPath, 'images'), {
      recursive: true,
      force: true,
    })
    console.log('✓ Copied images/')

    await cp(join(distPath, 'index.html'), join(wwwrootPath, 'index.html'))
    console.log('✓ Copied index.html')

    console.log('✅ Build files successfully copied to wwwroot!')
  } catch (error) {
    console.error('❌ Error copying files:', error.message)
    process.exit(1)
  }
}

copyToWwwroot()
