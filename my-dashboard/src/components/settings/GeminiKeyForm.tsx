'use client';

import { useState, useRef } from 'react';
import { saveApiKey } from '@/app/settings/actions';

interface GeminiKeyFormProps {
  hasKey: boolean;
  initialModel: string | null;
}

export default function GeminiKeyForm({ hasKey, initialModel }: GeminiKeyFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || 'gemini-2.5-flash');
  const [loading, setLoading] = useState(false);
  const [testingModel, setTestingModel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchModels = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('請先輸入 API Key');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || '無效的 API Key');
      }

      const availableModels = data.models
        .filter((m: any) => m.supportedGenerationMethods.includes('generateContent') && m.name.includes('gemini'))
        .map((m: any) => m.name.replace('models/', ''));

      if (availableModels.length === 0) {
        throw new Error('該金鑰無可用的文字生成模型');
      }

      setModels(availableModels);
      
      const targetModel = availableModels.includes(selectedModel) ? selectedModel : availableModels[0];
      setSelectedModel(targetModel);
      testModel(apiKey, targetModel);

    } catch (err: any) {
      setError(err.message || '抓取模型失敗，請確認金鑰是否正確');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const testModel = async (key: string, model: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setTestingModel(true);
    setModelError(null);
    
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }], generationConfig: { maxOutputTokens: 1 } }),
        signal: abortControllerRef.current.signal
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 && data.error?.message?.includes('Quota exceeded') && data.error?.message?.includes('limit: 0')) {
          setModelError(`此 API Key 沒有權限使用 ${model} (可能為免費版限制)`);
        } else {
          setModelError(`模型測試失敗: ${data.error?.message || '未知錯誤'}`);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setModelError('模型測試連線失敗');
      }
    } finally {
      setTestingModel(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    if (apiKey) {
      testModel(apiKey, newModel);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (modelError) {
      setError('請先選擇一個您可以正常使用的模型');
      return;
    }

    if (!apiKey) {
      if (hasKey && selectedModel !== initialModel) {
        setError('請重新輸入 API Key 以便一併更新模型設定。');
        return;
      }
      return;
    }

    const formData = new FormData();
    formData.append('provider', 'gemini');
    formData.append('apiKey', apiKey);
    formData.append('selectedModel', selectedModel);

    try {
      await saveApiKey(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '儲存失敗');
    }
  };

  return (
    <section className="p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Google Gemini API Key</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">輸入金鑰並驗證，即可自訂要使用的 AI 模型版本。</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasKey ? "已儲存 (輸入新金鑰以覆蓋並選擇模型)" : "AIzaSy..."}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-inherit focus:ring-2 focus:ring-blue-500 outline-none"
            required={!hasKey}
          />
          <button 
            onClick={fetchModels}
            disabled={!apiKey || loading}
            type="button"
            className="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '驗證中...' : '驗證 & 取得模型'}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {models.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              選擇要使用的 AI 模型
            </label>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-950 focus:ring-2 outline-none transition-colors ${
                modelError 
                  ? 'border-red-500 focus:ring-red-500 text-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
            >
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            
            {testingModel && (
              <p className="text-xs text-blue-500 mt-2 animate-pulse">正在測試模型權限...</p>
            )}
            
            {modelError && !testingModel && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                ⚠️ {modelError}
              </p>
            )}
            
            {!modelError && !testingModel && models.length > 0 && (
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                ✓ 此模型測試正常，可安全使用
              </p>
            )}
          </div>
        )}

        {hasKey && models.length === 0 && initialModel && (
           <div className="text-sm text-gray-500 dark:text-gray-400">
             目前使用的模型：<span className="font-semibold text-indigo-400">{initialModel}</span>
           </div>
        )}

        <button 
          type="submit"
          disabled={!!modelError || testingModel}
          className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          儲存設定
        </button>
      </form>
      
      {hasKey && success && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          已成功設定模型：{selectedModel}
        </p>
      )}
      {hasKey && !success && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          已成功儲存 API Key
        </p>
      )}
    </section>
  );
}
