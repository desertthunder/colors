import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

type PackageJson = { version: string }

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as PackageJson
const buildVersion = buildVersionDetails(packageJson.version)

function getVersion(version: string): string {
  const verify = gitOutput(['rev-parse', '--verify', version])
  if (verify === null) return version
  return gitOutput(['describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*']) ?? version
}

function buildVersionDetails(version: string): { display: string; commit: string; version: string } {
  const versionTag = `v${version}`
  const tag = getVersion(versionTag)
  const count = gitOutput(tag ? ['rev-list', '--count', `${tag}..HEAD`] : ['rev-list', '--count', 'HEAD']) ?? '0'
  const commit = gitOutput(['rev-parse', 'HEAD']) ?? 'unknown'
  const shortCommit = gitOutput(['rev-parse', '--short', 'HEAD']) ?? 'unknown'
  const display = count === '0' ? versionTag : `${versionTag}-${count}+g${shortCommit}`
  return { display, commit, version: tag }
}

function gitOutput(args: string[]): string | null {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(buildVersion) },
  plugins: [vue()],
  server: { open: true },
})
