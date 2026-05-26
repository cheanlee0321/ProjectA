import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'

export interface UserApiKeys {
  fmp: string;
  finmind: string;
  gemini: string;
  geminiModel: string | null;
  userId: string | null;
}

export async function getUserApiKeys(): Promise<UserApiKeys> {
  // Fallback to .env.local defaults
  const defaultKeys: UserApiKeys = {
    fmp: process.env.FMP_API_KEY || '',
    finmind: process.env.FINMIND_TOKEN || '',
    gemini: process.env.GEMINI_API_KEY || '',
    geminiModel: null,
    userId: null,
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return defaultKeys
    }

    defaultKeys.userId = user.id

    const { data: apiKeys } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)

    if (apiKeys && apiKeys.length > 0) {
      apiKeys.forEach(k => {
        try {
          const decrypted = decrypt(k.encrypted_key, k.iv)
          if (k.provider === 'fmp' && decrypted) defaultKeys.fmp = decrypted
          if (k.provider === 'finmind' && decrypted) defaultKeys.finmind = decrypted
          if (k.provider === 'gemini' && decrypted) {
            defaultKeys.gemini = decrypted
            defaultKeys.geminiModel = k.metadata?.selectedModel || null
          }
        } catch (e) {
          console.error(`Error decrypting key for provider ${k.provider}:`, e)
        }
      })
    }

    return defaultKeys
  } catch (error) {
    console.error('Error fetching user api keys:', error)
    return defaultKeys
  }
}
