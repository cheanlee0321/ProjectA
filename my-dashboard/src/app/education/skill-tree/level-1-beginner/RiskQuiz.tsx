"use client";

import { useState } from 'react';

const questions = [
  {
    id: 1,
    text: "你的主要投資目標是什麼？",
    options: [
      { text: "確保本金絕對安全，賺點微薄利息就好", score: 1 },
      { text: "資產能穩定成長，並且能打敗通貨膨脹", score: 2 },
      { text: "追求高報酬，希望能快速累積財富", score: 3 },
    ]
  },
  {
    id: 2,
    text: "如果你的投資組合在一個月內突然下跌了 20%，你會怎麼做？",
    options: [
      { text: "感到極度恐慌，立刻全部認賠賣出", score: 1 },
      { text: "覺得心痛，但會先放著觀察公司的基本面有沒有改變", score: 2 },
      { text: "感到興奮！這是難得的打折機會，我會準備加碼買進", score: 3 },
    ]
  },
  {
    id: 3,
    text: "你預計這筆投資的資金，多久以後才會用到？",
    options: [
      { text: "1 到 3 年內（例如買車、結婚基金）", score: 1 },
      { text: "3 到 10 年（例如頭期款、中期目標）", score: 2 },
      { text: "10 年以上（例如退休金、長期財富累積）", score: 3 },
    ]
  }
];

export default function RiskQuiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-3: questions, 4: result
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (score: number) => {
    setAnswers([...answers, score]);
    setCurrentStep(currentStep + 1);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
  };

  const calculateResult = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    if (totalScore <= 4) {
      return {
        type: "保守型玩家 (Conservative)",
        icon: "🐢",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        desc: "你無法承受太大的本金虧損。你的首要目標是保本與穩定。雖然報酬率較低，但你能在晚間安穩入睡。",
        recommend: "定存、政府公債、高信用評等公司債、極度穩定的防禦型 ETF。"
      };
    } else if (totalScore <= 7) {
      return {
        type: "穩健型玩家 (Steady)",
        icon: "⚖️",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        desc: "你可以承受一定程度的市場波動，希望在風險與報酬之間取得平衡。追求資產的長期穩健增長。",
        recommend: "大盤指數型 ETF (如 0050, SPY)、股債平衡配置、大型績優股。"
      };
    } else {
      return {
        type: "積極型玩家 (Aggressive)",
        icon: "🚀",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        desc: "你為了追求高報酬，願意承受本金大幅波動的風險。你有足夠的時間或心理素質來熬過市場的寒冬。",
        recommend: "成長型個股、科技股 ETF、加密貨幣（少量）、小型潛力股。"
      };
    }
  };

  return (
    <div className="mt-6 border border-foreground/10 rounded-2xl overflow-hidden bg-foreground/5 relative">
      {/* Quiz Intro */}
      {currentStep === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🪞</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">你是哪種投資人？</h3>
          <p className="text-foreground/70 mb-6 max-w-md mx-auto">
            在選擇投資武器前，你必須先了解自己的屬性。透過 3 個簡單的情境題，測出你的真實風險承受度。
          </p>
          <button 
            onClick={() => setCurrentStep(1)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20"
          >
            開始測驗
          </button>
        </div>
      )}

      {/* Questions */}
      {currentStep > 0 && currentStep <= questions.length && (
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 text-sm text-foreground/50">
            <span>問題 {currentStep} / {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, idx) => (
                <div key={idx} className={`h-2 w-8 rounded-full ${idx < currentStep ? 'bg-indigo-500' : 'bg-foreground/10'}`}></div>
              ))}
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            {questions[currentStep - 1].text}
          </h3>
          <div className="space-y-3">
            {questions[currentStep - 1].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.score)}
                className="w-full text-left p-4 rounded-xl border border-foreground/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-foreground/80 hover:text-foreground"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {currentStep > questions.length && (() => {
        const result = calculateResult();
        return (
          <div className={`p-8 text-center border-t-4 ${result.color.replace('text-', 'border-')} ${result.bg}`}>
            <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">{result.icon}</span>
            </div>
            <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-1">測驗結果</h3>
            <h2 className={`text-3xl font-black ${result.color} mb-4`}>{result.type}</h2>
            <p className="text-foreground/80 mb-6 max-w-lg mx-auto">
              {result.desc}
            </p>
            <div className="bg-background/60 p-4 rounded-xl text-left max-w-lg mx-auto border border-foreground/5 mb-6">
              <span className="font-bold text-foreground mb-1 block">💡 適合你的裝備：</span>
              <span className="text-sm text-foreground/70">{result.recommend}</span>
            </div>
            <button 
              onClick={resetQuiz}
              className="text-sm text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4"
            >
              重新測驗
            </button>
          </div>
        );
      })()}
    </div>
  );
}
