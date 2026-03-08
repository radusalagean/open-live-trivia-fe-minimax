import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readFileSync, existsSync } from 'fs'

const envPath = process.env.ENV_FILE
const secretsEnvPath = process.env.SECRETS_ENV_FILE
if (!envPath || !existsSync(envPath)) {
  throw new Error(`ENV_FILE not set or file not found: ${envPath}`)
}

const envContent = readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach((line: string) => {
  const [key, ...values] = line.split('=')
  if (key && values.length) {
    process.env[key.trim()] = values.join('=').trim()
  }
})

if (secretsEnvPath && existsSync(secretsEnvPath)) {
  const secretsContent = readFileSync(secretsEnvPath, 'utf-8')
  secretsContent.split('\n').forEach((line: string) => {
    const [key, ...values] = line.split('=')
    if (key && values.length) {
      process.env[key.trim()] = values.join('=').trim()
    }
  })
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
