const fs = require('fs');

const filePath = 'src/app/strategy/ClientStrategyPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The file has a clear structure. 
// The #advanced section starts with <div id="advanced" ...> and ends with the matching </div>

const advancedStartIdx = content.indexOf('<div id="advanced"');
if (advancedStartIdx === -1) throw new Error("advanced section not found");

// Let's use regex or split to extract sections.
// Section markers:
// 1. {/* 實驗 A：閾值敏感度 */}
// 2. {/* 實驗 B：速度敏感度 */}
// 3. <div className="mb-10 mt-8 p-6 rounded-2xl bg-indigo-900/30 (最佳化總結)
// 4. <div className="mb-10 p-6 rounded-2xl bg-slate-800/50 (最佳化參數回測結果)
// 5. {/* Institutional Metrics Block */}
// 6. {/* Retail Edge Block */}
// 7. {/* DEEP DIVE DISCUSSION */}
// 8. {/* WFO LABORATORY ENTRY */}
// 9. {/* FUTURE EVOLUTION */}

const markers = {
  header: '<h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-100">',
  A: '{/* 實驗 A：閾值敏感度 */}',
  B: '{/* 實驗 B：速度敏感度 */}',
  C: '<div className="mb-10 mt-8 p-6 rounded-2xl bg-indigo-900/30 border border-indigo-500/30">',
  D: '<div className="mb-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700">',
  E: '{/* Institutional Metrics Block */}',
  F: '{/* Retail Edge Block */}',
  G: '{/* DEEP DIVE DISCUSSION */}',
  H: '{/* WFO LABORATORY ENTRY */}',
  I: '{/* FUTURE EVOLUTION */}',
  end: '          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n'
};

// We will split the file into parts based on indices of these markers.
const indices = {
  header: content.indexOf(markers.header),
  A: content.indexOf(markers.A),
  B: content.indexOf(markers.B),
  C: content.indexOf(markers.C),
  D: content.indexOf(markers.D),
  E: content.indexOf(markers.E),
  F: content.indexOf(markers.F),
  G: content.indexOf(markers.G),
  H: content.indexOf(markers.H),
  I: content.indexOf(markers.I),
  end: content.indexOf(markers.end)
};

// Extract blocks
const blocks = {
  preAdvanced: content.substring(0, indices.header),
  header: content.substring(indices.header, indices.A),
  A: content.substring(indices.A, indices.B),
  B: content.substring(indices.B, indices.C),
  C: content.substring(indices.C, indices.D),
  D: content.substring(indices.D, indices.E),
  E: content.substring(indices.E, indices.F),
  F: content.substring(indices.F, indices.G),
  G: content.substring(indices.G, indices.H),
  H: content.substring(indices.H, indices.I),
  I: content.substring(indices.I, indices.end),
  postAdvanced: content.substring(indices.end)
};

// New Order: 
// Header
// G (Deep Dive Discussion)
// A (Threshold Heatmap)
// B (Speed Sensitivity)
// C (Optimization Summary)
// D (Backtest Table + Overfitting)
// E (Institutional Metrics)
// F (Retail Edge)
// H (WFO Laboratory)
// I (Future Evolution)

const newContent = 
  blocks.preAdvanced +
  blocks.header +
  blocks.G +
  blocks.A +
  blocks.B +
  blocks.C +
  blocks.D +
  blocks.E +
  blocks.F +
  blocks.H +
  blocks.I +
  blocks.postAdvanced;

fs.writeFileSync(filePath, newContent);
console.log("Successfully reordered the file!");
