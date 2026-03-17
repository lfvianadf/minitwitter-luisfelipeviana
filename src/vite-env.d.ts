/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_STORAGE_URL: string
  readonly VITE_SUPABASE_BUCKET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}