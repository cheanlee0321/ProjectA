export interface StrategyData {
  month: string;
  finraToM0?: number;
  sp500ToM0?: number;
  qqqToM0?: number;
  tqqqToM0?: number;
  uproToM0?: number;
  cape?: number;
  tips?: number;
  finraToNetLiq?: number;
  sp500ToNetLiq?: number;
  finraToM0_zScore?: number;
  finraToM0_upperBand?: number;
  finraToM0_lowerBand?: number;
  finraToNetLiq_upperBand?: number;
  finraToNetLiq_lowerBand?: number;
  finraToM0_p95_10y?: number;
  finraToM0_p05_10y?: number;
}

export interface ChartConfig {
  filteredData: StrategyData[];
  finraMin: number;
  finraMax: number;
  offRed: number;
  offYellow: number;
}

export interface ChartDefinition {
  id: string;
  title: string;
  titleColor: string;
  leftKey?: keyof StrategyData;
  leftName?: string;
  rightKey: keyof StrategyData;
  rightName: string;
  rightColor: string;
  rightYAxisId?: 'left' | 'right';
  rightDasharray?: string;
  extraLineKey?: keyof StrategyData;
  extraLineName?: string;
  extraLineColor?: string;
  extraLineDasharray?: string;
  formatRight: boolean;
  thresholdYellow?: number;
  thresholdRed?: number;
}

export interface BacktestRow {
  scenario: string;
  initial: string;
  final: string;
  finalColor?: string;
  totalReturn: string;
  totalReturnColor: string;
  totalReturnBold?: boolean;
  cagr: string;
  cagrColor: string;
  cagrBold?: boolean;
  maxDrawdown: string;
  maxDrawdownColor: string;
  maxDrawdownBold?: boolean;
}

export interface BacktestTableData {
  title: string;
  titleColor: string;
  titleIcon: string;
  bgColor: string;
  borderColor: string;
  rows: BacktestRow[];
  note: string;
}
