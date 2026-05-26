export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server'
import { saveApiKey } from './actions'
import GeminiKeyForm from '@/components/settings/GeminiKeyForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)

  const hasFmpKey = apiKeys?.some(k => k.provider === 'fmp')
  const hasFinmindKey = apiKeys?.some(k => k.provider === 'finmind')
  
  const geminiKeyRow = apiKeys?.find(k => k.provider === 'gemini')
  const hasGeminiKey = !!geminiKeyRow
  const initialModel = geminiKeyRow?.metadata?.selectedModel || null

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6">è¨­å? API Keys</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        è«‹æ?ä¾›æ‚¨??API Keys ä»¥ç²?–å€‹äºº?–ç?è³‡æ??†æ??‚æ‚¨?„é??°æ?è¢«å?å¯†å„²å­˜æ–¼è³‡æ?åº«ï??ªæ?å¾Œç«¯?¯ä»¥è§??ï¼Œç?å°ä??ƒæš´?²çµ¦?ç«¯?–å…¶ä»–ä½¿?¨è€…ã€?      </p>

      <div className="space-y-8">
        {/* FMP API Key */}
        <section className="p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">FMP (Financial Modeling Prep) API Key</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">?¨æ–¼?²å?ç¾å??¡ç¥¨?†æ??¸æ??‡åŸº?¬é¢è³‡æ???/p>
          
          <form action={saveApiKey} className="flex flex-col gap-4">
            <input type="hidden" name="provider" value="fmp" />
            <input
              type="password"
              name="apiKey"
              placeholder={hasFmpKey ? "å·²å„²å­?(è¼¸å…¥?°é??°ä»¥è¦†è?)" : "è¼¸å…¥ FMP API Key..."}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              ?²å??‘é‘°
            </button>
          </form>
          {hasFmpKey && <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            å·²æ??Ÿè¨­å®?          </p>}
        </section>

        {/* Finmind API Key */}
        <section className="p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Finmind Token</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">?¨æ–¼?²å??°ç£?¡ç¥¨?†æ??‡å??´æ­·?²è??™ã€?/p>
          
          <form action={saveApiKey} className="flex flex-col gap-4">
            <input type="hidden" name="provider" value="finmind" />
            <input
              type="password"
              name="apiKey"
              placeholder={hasFinmindKey ? "å·²å„²å­?(è¼¸å…¥?°é??°ä»¥è¦†è?)" : "è¼¸å…¥ Finmind Token..."}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              ?²å??‘é‘°
            </button>
          </form>
          {hasFinmindKey && <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            å·²æ??Ÿè¨­å®?          </p>}
        </section>

        {/* Gemini API Key */}
        <GeminiKeyForm hasKey={hasGeminiKey} initialModel={initialModel} />
      </div>
    </div>
  )
}

