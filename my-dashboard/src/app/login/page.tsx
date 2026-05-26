import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="flex w-full max-w-md flex-col justify-center gap-4 text-foreground">
        <h1 className="text-2xl font-bold text-center mb-6">歡迎使用股市儀表板</h1>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-inherit px-4 py-2"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-medium" htmlFor="password">
            密碼 (至少 6 個字元)
          </label>
          <input
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-inherit px-4 py-2"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          formAction={login}
          className="mb-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          登入
        </button>
        <button
          formAction={signup}
          className="mb-2 rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          註冊
        </button>
        
        {resolvedSearchParams?.message && (
          <p className={`mt-4 p-4 text-center text-sm rounded-md ${
            resolvedSearchParams.message.includes('失敗') 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' 
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
          }`}>
            {resolvedSearchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
