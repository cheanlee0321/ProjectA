'use client';

import React from 'react';
import Link from 'next/link';

export default function MastersPerspectivePage() {
  const masters = [
    {
      id: 'dalio',
      name: 'Ray Dalio',
      title: '橋水基金創辦人 / 總體經濟機器的信徒',
      avatar: '⚙️',
      praise: '這份報告深得我心。你們把人類的貪婪（FINRA 融資）與央行的水龍頭（M0 貨幣）寫成了可量化的方程式，完美契合了「信貸週期」。更讓我激賞的是「WFO 實驗室與極端熱力圖」，你們沒有停留在回測最高點，而是去尋找適應不同環境的「高原區」，這正是橋水建立全天候基金 (All Weather) 時追求的抗脆弱性。',
      criticism: '這是一個極度粗糙的玩具模型。經濟這台機器有成千上萬個變數，你們只用融資餘額和 M0 供給，忽略了實質利率、企業盈餘增長 (EPS)、信用利差甚至是地緣政治。單一維度的指標，在遇到非典型的總體經濟危機（如供給側通膨）時，必定會發出致命的假訊號。',
    },
    {
      id: 'marks',
      name: 'Howard Marks',
      title: '橡樹資本創辦人 / 週期與心理學大師',
      avatar: '🕰️',
      praise: '非常好。你們沒有試圖預測「明天會不會崩盤」，而是用指標衡量「現在市場的鐘擺是不是已經到了最危險的高位」。我特別喜歡「系統是完美的，但執行的人不是」這點，在鐘擺盪到極端恐慌時，用 10 個月的機器紀律去對抗人類不敢買的恐懼，這是這套策略能賺錢的真正原因。',
      criticism: '把心理學量化是狂妄的。你們找到了一個「高原區」，並天真地以為未來的鐘擺一定會在這個數值內擺盪。如果未來的投資人心理因為 AI 革命或新科技發生典範轉移，這個寫死的閾值就會失效。你們用歷史推導出來的容錯率，終究只是「過去的容錯率」。',
    },
    {
      id: 'burry',
      name: 'Michael Burry',
      title: '大賣空主角 / 尋找結構性裂縫的孤狼',
      avatar: '👁️‍🗨️',
      praise: '你們看見了我在警告的東西：被動式 ETF 的踩踏死亡螺旋。我也同意用融資餘額來抓泡沫破裂。如果沒有 50% QQQ 作為保命底線，我會把這份報告直接扔進垃圾桶。',
      criticism: '你們的「安全船」其實是鐵達尼號！你們以為留了 50% 的 QQQ 作為保命底線很安全？現在的 QQQ 高度集中在少數科技巨頭身上，且全是被動資金撐起來的泡沫。如果資金流發生踩踏，QQQ 本身就有可能狂跌 80%，而你們的 TQQQ 會直接歸零。你們只是在用不同的速度一起沉沒。',
    },
    {
      id: 'klarman',
      name: 'Seth Klarman',
      title: 'Baupost Group 創辦人 / 安全邊際的死忠防守者',
      avatar: '🛡️',
      praise: '聽到 3 倍槓桿我本來是不屑一顧的。但當我仔細看了「0.34 高原區接飛刀壓力測試」，我改觀了。你們刻意讓策略在半山腰犯錯，卻透過磁滯效應與 10 個月極慢速建倉，硬生生為這個高風險資產人造出了一個巨大的「安全邊際」。只要不犯下買太快的致命錯誤，防守端確實做得滴水不漏。',
      criticism: '這根本不是真正的安全邊際！真正的安全邊際來自於深入分析企業的現金流與清算價值。你們的安全邊際只是「統計學上的風險管理」。如果底層資產（納斯達克）在結構上已經極度高估，你們的分批買入只不過是在「慢慢地買進一個巨大泡沫」而已。',
    },
    {
      id: 'munger_buffett',
      name: 'Charlie Munger & Warren Buffett',
      title: '波克夏海瑟威 / 價值投資的絕對基本教義派',
      avatar: '🦅',
      praise: '（沈默）... 如果勉強要說的話，把 50% 資金留在沒有槓桿的原型指數裡，並且願意承受 10 個月的無聊等待，算是有點常識的行為。',
      criticism: '這完全就是在胡說八道 (Twaddle)！這就是老鼠藥！用三倍槓桿加上一條總經公式去猜測底部，這根本不是投資，這是披著統計學外衣的賭博。這套策略存在巨大的「倖存者偏差」，過去 25 年是人類歷史上科技業爆發且利率降到零的黃金年代。如果遇到長達 20 年科技停滯、本益比只有 8 倍的年代，這套系統會讓你們徹底破產。',
    },
    {
      id: 'taleb',
      name: 'Nassim Nicholas Taleb',
      title: '《黑天鵝效應》作者 / 極端風險學者',
      avatar: '💣',
      praise: '你們在報告最後列出了「未來的四種死局（黑天鵝）」，承認了 50/50 是一種妥協，並且承認未來的指標可能會失效。能意識到自己的模型隨時會崩潰，這是唯一的優點。',
      criticism: '你們這是在壓路機前撿一角硬幣！你們的壓力測試假設市場是連續下跌的，但真正的黑天鵝是「斷層的」。如果某天市場發生閃崩，大盤單日暴跌 33% 且造市商撤單，TQQQ 的淨值會在一秒鐘內瞬間歸零並強制清算下市。你的「10 個月慢速建倉」連第一個月都還沒買完，標的就已經從地球上消失了。',
    },
    {
      id: 'pabrai',
      name: 'Mohnish Pabrai & Li Lu',
      title: 'Dhandho 投資法 & 價值投資實踐者',
      avatar: '⚖️',
      praise: '這完全就是量化版的 Dhandho 投資法！用 50% 資金鎖死最大下檔風險（反面我損失不大），然後用 10 個月慢速買入 TQQQ 去捕捉崩盤後瘋狂的 V 轉暴利（正面我大贏）。風險被鎖死，但獲利上不封頂，這是一筆極度聰明的不對稱交易！同時，這本質上依然是長期做多人類科技進步，大方向完全正確。',
      criticism: '太過依賴宏觀指標了。查理芒格說過，宏觀經濟是我們必須忍受的，微觀經濟才是我們能有所作為的。你們花太多時間在看宏觀水溫，卻完全不看底層那 100 家科技公司的資產負債表與護城河。',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/strategy" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          返回策略主頁
        </Link>

        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 mb-6 flex items-center justify-center gap-4">
            <span>🏛️</span> 華爾街的無情審查：大師視角
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            這是一場針對本策略的「紅隊測試 (Red Teaming)」。我們模擬了將這份報告遞交給華爾街最頂尖的投資大師們，透過他們各自著名的投資哲學，給予這套系統最赤裸、最殘酷的正反兩面評價。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {masters.map((master) => (
            <div key={master.id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              <div className="p-6 border-b border-slate-800/80 bg-slate-800/30 flex items-center gap-4">
                <div className="text-4xl bg-slate-900 p-3 rounded-full border border-slate-700 shadow-inner">
                  {master.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{master.name}</h3>
                  <p className="text-sm text-slate-400 font-medium">{master.title}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-6">
                {/* Praise Section */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"></div>
                  <div className="pl-4">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                      機構級的讚賞
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "{master.praise}"
                    </p>
                  </div>
                </div>

                {/* Criticism Section */}
                <div className="relative mt-auto">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-full"></div>
                  <div className="pl-4">
                    <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      致命的盲點與批評
                    </h4>
                    <p className="text-rose-200/80 text-sm leading-relaxed italic">
                      "{master.criticism}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 max-w-4xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <h2 className="text-2xl font-bold text-white mb-4">為什麼要接受無情的批評？</h2>
            <p className="text-slate-300 leading-relaxed">
              量化交易永遠沒有聖杯。這套策略的「終極防禦型設定」只能抵禦「可預期的常態性股災」，但面對大師們口中這些<strong className="text-rose-400">「改變遊戲規則的末日黑天鵝」</strong>，任何模型都會失效。
              <br/><br/>
              承認 50/50 是一種妥協，承認未來的指標可能會失效。這份大師視角的紅隊測試，正是為了時刻提醒我們：<strong className="text-amber-400">「投資中最大的危險，就是以為自己找到了一套絕對安全的系統。」</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
