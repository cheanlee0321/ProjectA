export function RiskWarnings() {
  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-lg">
      <h3 className="text-2xl font-bold text-rose-400 mb-6 flex items-center">
        <span className="mr-2">⚠️</span> 絕對不建議買 TQQQ 或 UPRO 的 4 種極端環境
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80 text-sm">
        <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
          <h4 className="text-lg font-bold text-rose-300 mb-2">1. 實質性經濟衰退 (如薩姆規則觸發)</h4>
          <p>當企業獲利衰退、失業率飆升時，股市會有長達半年的熊市。TQQQ 作為 3 倍槓桿，若大盤跌 33%，其淨值幾乎歸零。即使不歸零，只要跌掉 90%，您需要上漲 1000% 才能回本，時間成本極度不划算。</p>
        </div>
        <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
          <h4 className="text-lg font-bold text-rose-300 mb-2">2. 資金流動性暴力抽乾 (暴力升息/縮表)</h4>
          <p>科技股估值高度依賴低利率與充裕資金。當央行暴力升息時，大盤會呈現溫水煮青蛙的階梯式下跌。這正是 FINRA 亮紅燈的時刻！逢低攤平 TQQQ 最終極易在底部斷頭。</p>
        </div>
        <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
          <h4 className="text-lg font-bold text-rose-300 mb-2">3. 高波動的橫盤震盪 (波動耗損)</h4>
          <p>若市場每天上下 3% 劇烈震盪，TQQQ 會遭遇「波動耗損 (Volatility Decay)」。即便大盤最終沒跌，TQQQ 也會憑空蒸發淨值。此時持有 TQQQ 幾乎等於每天被扣血。請觀察 VIX 是否居高不下。</p>
        </div>
        <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
          <h4 className="text-lg font-bold text-rose-300 mb-2">4. 殖利率曲線「剛解除倒掛」瞬間</h4>
          <p>當 10 年期與 2 年期公債曲線倒掛很久後，突然因緊急降息而「急劇轉正」時，往往是主跌段的開始。市場恐慌情緒達到最高點，此時接刀 TQQQ 形同自殺。</p>
        </div>
      </div>
      <p className="mt-6 text-center text-rose-200 font-medium bg-rose-950/40 py-3 px-4 rounded-xl border border-rose-500/20 shadow-inner">
        💡 鐵則：TQQQ 是「順風局的王者」，一旦進入上述四種逆風局的任何一種，寧可空手也絕對不要妄想抄底或凹單！這也是紅燈時強制撤除槓桿的原因。
      </p>
    </div>
  );
}
