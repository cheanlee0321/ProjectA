import { createClient } from '@/lib/supabase/server'
import { saveApiKey } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)

  const hasGeminiKey = apiKeys?.some(k => k.provider === 'gemini')
  const hasFmpKey = apiKeys?.some(k => k.provider === 'fmp')
  const hasFinmindKey = apiKeys?.some(k => k.provider === 'finmind')

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6">設定 API Keys</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        請提供您的 API Keys 以獲取個人化的資料分析。您的金鑰會被加密儲存於資料庫，只有後端可以解密，絕對不會暴露給前端或其他使用者。
      </p>

      <div className="space-y-8">
        {/* FMP API Key */}
        <section className="p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">FMP (Financial Modeling Prep) API Key</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">用於獲取美國股票分析數據與基本面資料。</p>
          
          <form action={saveApiKey} className="flex flex-col gap-4">
            <input type="hidden" name="provider" value="fmp" />
            <input
              type="password"
              name="apiKey"
              placeholder={hasFmpKey ? "已儲存 (輸入新金鑰以覆蓋)" : "輸入 FMP API Key..."}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              儲存金鑰
            </button>
          </form>
          {hasFmpKey && <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            已成功設定
          </p>}
        </section>

        {/* Finmind API Key */}
        <section className="p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Finmind Token</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">用於獲取台灣股票分析與市場歷史資料。</p>
          
          <form action={saveApiKey} className="flex flex-col gap-4">
            <input type="hidden" name="provider" value="finmind" />
            <input
              type="password"
              name="apiKey"
              placeholder={hasFinmindKey ? "已儲存 (輸入新金鑰以覆蓋)" : "輸入 Finmind Token..."}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              儲存金鑰
            </button>
          </form>
          {hasFinmindKey && <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            已成功設定
          </p>}
        </section>

        {/* Gemini API Key */}
        <section className="p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Google Gemini API Key</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">用於產生 AI 個股分析與市場解讀。</p>
          
          <form action={saveApiKey} className="flex flex-col gap-4">
            <input type="hidden" name="provider" value="gemini" />
            <input
              type="password"
              name="apiKey"
              placeholder={hasGeminiKey ? "已儲存 (輸入新金鑰以覆蓋)" : "AIzaSy..."}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-inherit focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              儲存金鑰
            </button>
          </form>
          {hasGeminiKey && <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            已成功設定
          </p>}
        </section>
      </div>
    </div>
  )
}
