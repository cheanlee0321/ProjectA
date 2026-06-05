export function MacroAssumptions() {
  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-orange-500/10 border border-orange-500/20 shadow-lg">
      <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center">
        <span className="mr-2">🔮</span> 終極靈魂拷問：這個策略在未來繼續有效的「5 大核心假設」
      </h3>
      <div className="space-y-6 text-foreground/80 text-sm">
        <p className="text-base font-medium text-orange-200">
          這個策略能在過去近 27 年的回測中取得如此驚人的成績，是建立在特定的總體經濟與金融市場結構之上。若要讓這套紅綠燈策略在未來繼續大放異彩，市場必須持續滿足以下 5 個核心假設。若假設被打破，策略即面臨失效風險：
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background/40 p-5 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
            <h4 className="text-lg font-bold text-orange-300 mb-2">1. 美國國運與股市長期「向上增長」</h4>
            <p>槓桿 ETF 最大的敵人是「波動耗損」。策略之所以賺錢，是因為在「上漲的大多頭」開了 3 倍槓桿。若美國步入類似日本「失落的三十年」，股市呈現長達十幾年的橫盤或緩跌，即使有紅綠燈保護，槓桿 ETF 也會因長期盤整耗損，導致淨值不斷蒸發。</p>
          </div>
          
          <div className="bg-background/40 p-5 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
            <h4 className="text-lg font-bold text-orange-300 mb-2">2. 股市崩盤依然是「溫水煮青蛙」而非閃崩</h4>
            <p>策略基於「月度數據」，假設股災 (如2000、2008、2022) 都是長達半年以上的凌遲，讓我們有時間分批撤退。若未來發生史無前例的黑天鵝導致美股在幾天內無量跌停累積逾 -33.4%，3 倍槓桿 ETF 會直接面臨「單日淨值歸零 (強制清算)」。</p>
          </div>
          
          <div className="bg-background/40 p-5 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
            <h4 className="text-lg font-bold text-orange-300 mb-2">3. FINRA 融資餘額仍是「市場貪婪」的最佳指標</h4>
            <p>過去幾十年「借錢買股票 (融資)」是做多市場最直接的方式。但若未來市場參與者為了開槓桿，不再使用傳統融資帳戶，而是全面改用「零日到期選擇權 (0DTE)」或衍生性商品來放大部位，融資數據就會失真，無法精準捕捉恐慌與瘋狂。</p>
          </div>
          
          <div className="bg-background/40 p-5 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
            <h4 className="text-lg font-bold text-orange-300 mb-2">4. 央行印鈔 (M0) 依然直接推升資產價格</h4>
            <p>策略核心信念是「流動性決定一切」。若未來發生極端的「停滯性通膨」，央行印鈔不僅沒流入股市，反而被炒作原物料，或被比特幣等新興避險資產大量吸走流動性。在這種宏觀變局下，M0 增長可能再也無法帶動美股估值提升。</p>
          </div>

          <div className="bg-background/40 p-5 rounded-2xl border border-orange-500/10 md:col-span-2 hover:border-orange-500/30 transition-colors">
            <h4 className="text-lg font-bold text-orange-300 mb-2">5. 發行商不改變槓桿 ETF 的遊戲規則</h4>
            <p>我們假設發行商 (如 ProShares) 能持續透過互換合約 (Swaps) 精準提供「每日 3 倍」報酬。若未來爆發未知金融危機導致對手盤倒閉違約，或 SEC 認為散戶買 3 倍太危險而強制修法下架這類產品。這類「監管風險」與「結構風險」是長期持有槓桿 ETF 的隱含假設。</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-orange-950/40 border border-orange-500/20 text-center">
          <p className="text-orange-100 font-medium">
            <strong>✨ 總結：</strong>這個策略在過去 27 年的回測中成功駕馭了「科技泡沫崩潰 + 金融海嘲 + 央行放水牛市」的完整循環。只要未來美國維持霸權地位、金融創新不脫離現有框架、且聯準會依然扮演世界資金的總水龍頭，這套策略就能繼續有效。身為理性的量化投資人，我們必須永遠對這 5 個底層假設抱持著敬畏之心。
          </p>
        </div>
      </div>
    </div>
  );
}
