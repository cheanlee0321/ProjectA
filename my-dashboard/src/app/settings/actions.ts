'use server'

import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'
import { revalidatePath } from 'next/cache'

export async function saveApiKey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('請先登入')
  }

  const provider = formData.get('provider') as string
  const apiKey = formData.get('apiKey') as string
  const selectedModel = formData.get('selectedModel') as string | null

  if (!apiKey || !provider) return

  // 加密 API Key
  const { encryptedData, iv } = encrypt(apiKey)
  
  const metadata = selectedModel ? { selectedModel } : {}

  const { error } = await supabase
    .from('api_keys')
    .upsert({
      user_id: user.id,
      provider: provider,
      encrypted_key: encryptedData,
      iv: iv,
      metadata: metadata,
    }, { onConflict: 'user_id, provider' })

  if (error) {
    console.error('儲存 API Key 失敗:', error)
    throw new Error(error.message || '儲存失敗')
  }

  revalidatePath('/settings')
}
