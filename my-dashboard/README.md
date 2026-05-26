# 📈 股市儀表板 (Stock Market Dashboard)

這是一個基於 Next.js 構建的股市儀表板應用程式，提供即時的股市指標、個股基本面分析以及 AI 輔助總結功能。

## ✨ 核心功能

*   **總體經濟與股市指標**：追蹤並視覺化關鍵經濟指標（如巴菲特指標、薩姆規則、SLOOS 銀行緊縮標準等），幫助判斷市場整體趨勢。
*   **個股基本面分析**：透過 Yahoo Finance API 獲取個股數據，提供深入的財務數據與圖表分析。
*   **AI 智能總結**：整合 Google Gemini API，根據市場指標與個股數據自動生成見解與總結。
*   **使用者帳號系統**：整合 Supabase 提供登入、註冊及個人化設定功能。
*   **自訂 API Key 設定**：使用者可自行輸入專屬的 Gemini API Key，確保 AI 功能的使用彈性與安全性。
*   **深色/淺色主題切換**：支援 Dark/Light 模式，提供更佳的使用者體驗。

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架**：[Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
*   **樣式與 UI**：[Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
*   **圖表套件**：[Recharts](https://recharts.org/)
*   **後端與資料庫**：[Supabase](https://supabase.com/)
*   **資料來源**：[yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2)
*   **AI 整合**：[Google Generative AI (@google/generative-ai)](https://ai.google.dev/)

## 🚀 快速開始 (Getting Started)

### 1. 安裝依賴套件

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. 環境變數設定

請在專案根目錄建立一個 `.env.local` 檔案，並填入以下必要的環境變數：

```env
# Supabase 設定 (用於身分驗證)
NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY

# Gemini API 設定 (可選，也可在網頁前台設定)
GEMINI_API_KEY=你的_GEMINI_API_KEY
```

### 3. 啟動開發伺服器

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

接著打開瀏覽器並前往 [http://localhost:3000](http://localhost:3000) 即可預覽網站。

## 📦 部署 (Deployment)

本專案可以直接部署至 [Vercel](https://vercel.com/)，請確保在 Vercel 的專案設定中填妥對應的 Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`)。

## 📄 授權 (License)

本專案僅供學習與參考用途。
