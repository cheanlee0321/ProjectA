@echo off
echo 正在啟動股市泡沫指標儀表板...
echo 請稍候幾秒鐘...

:: 切換到 batch 檔所在的目錄 (讓這個檔案可以隨便移動)
cd /d "%~dp0"

:: 啟動 Next.js 伺服器並自動開啟瀏覽器
start npm run dev

:: 等待 3 秒讓伺服器有時間啟動
timeout /t 3 /nobreak > nul

:: 開啟預設瀏覽器前往 localhost:3000
start http://localhost:3000

exit
