// ─── Data Layer ───────────────────────────────────────────────
export const INITIAL_THESES = [
  {
    id: "t1",
    name: "石油供给侧重定价",
    status: "研究中",
    conviction: "↗",
    summary: "Capex不足→供给缺口，但时间窗口可能推迟至2028-2030",
    coreLogic: "全球上游油气投资较2014年高点下降35%，但已批准项目仍在投产。结构性缺口需等当前项目周期结束后显现。伊朗战争叠加可能加速供给收紧。",
    triggers: ["WTI站稳70", "库存结构性去库", "金油比从油端修复"],
    instruments: ["i1", "i2", "i3", "i4", "i5"],
  },
  {
    id: "t2",
    name: "黄金长期重估",
    status: "持有",
    conviction: "↑",
    summary: "央行购金+去美元化，长期逻辑未变，短期投机层已清洗",
    coreLogic: "全球央行连续三年净购金超1000吨，去美元化趋势不可逆。1月闪崩清洗投机仓位，长期支撑更健康。",
    triggers: ["央行购金节奏", "实际利率走向", "美元信用事件"],
    instruments: ["i6"],
  },
  {
    id: "t3",
    name: "有色供需错配",
    status: "持有",
    conviction: "↗",
    summary: "新能源需求+矿端capex不足，铜铝结构性看多",
    coreLogic: "电动车、电网、AI算力基建对铜铝需求增速远超矿端扩产节奏。",
    triggers: ["铜价站稳9500", "中国基建刺激落地", "矿端供给中断"],
    instruments: ["i7"],
  },
];

export const INITIAL_INSTRUMENTS = [
  { id: "i1", name: "XOM", primaryThesis: "t1", linkedTheses: ["t1"], category: "进攻", positionLevel: "○", status: "观望", positionPct: 0, hasAlpha: true, entryRules: null, exitRules: null, scalingPlan: null },
  { id: "i2", name: "BP", primaryThesis: "t1", linkedTheses: ["t1"], category: "进攻", positionLevel: "○", status: "待研究", positionPct: 0, hasAlpha: false, entryRules: null, exitRules: null, scalingPlan: null },
  { id: "i3", name: "SHEL", primaryThesis: "t1", linkedTheses: ["t1"], category: "进攻", positionLevel: "○", status: "待研究", positionPct: 0, hasAlpha: false, entryRules: null, exitRules: null, scalingPlan: null },
  { id: "i4", name: "中国海油", primaryThesis: "t1", linkedTheses: ["t1"], category: "进攻", positionLevel: "◔", status: "持有", positionPct: 3, hasAlpha: true, entryRules: "RSI<45 或回撤>10% 时定投加仓", exitRules: "圭亚那项目延期 → 减半仓", scalingPlan: "轻仓3%→中仓8%→重仓15%，每层需新催化剂确认" },
  { id: "i5", name: "PBR", primaryThesis: "t1", linkedTheses: ["t1"], category: "进攻", positionLevel: "○", status: "待研究", positionPct: 0, hasAlpha: false, entryRules: null, exitRules: null, scalingPlan: null },
  { id: "i6", name: "黄金ETF", primaryThesis: "t2", linkedTheses: ["t2"], category: "防守", positionLevel: "◕", status: "持有", positionPct: 25, hasAlpha: false, entryRules: "实际利率转负 或 央行单季购金>300吨", exitRules: "美联储意外加息200bp+", scalingPlan: "当前25%已是目标仓位，维持" },
  { id: "i7", name: "有色ETF", primaryThesis: "t3", linkedTheses: ["t3"], category: "进攻", positionLevel: "◑", status: "持有", positionPct: 15, hasAlpha: false, entryRules: null, exitRules: null, scalingPlan: null },
];

export const INITIAL_TODOS = [
  { id: "td1", content: "等48-72h观察霍尔木兹海峡通航", type: "待决策", linkedId: "t1", createdAt: "2026-03-01", deadline: "2026-03-04", done: false },
  { id: "td2", content: "周一开盘后跑所有石油标的价格+技术面", type: "待研究", linkedId: "t1", createdAt: "2026-03-01", deadline: "2026-03-03", done: false },
  { id: "td3", content: "建立石油投资执行规则（入场区间/分层/止损）", type: "待决策", linkedId: "t1", createdAt: "2026-03-01", deadline: "2026-03-07", done: false },
  { id: "td4", content: "BP / SHEL earnings call（优先级降低）", type: "待研究", linkedId: "t1", createdAt: "2026-02-28", deadline: null, done: false },
];

export const INITIAL_RECORDS = [
  { id: "r1", timestamp: "2026-03-01 02:30", type: "消息", linkedTheses: ["t1"], linkedInstruments: [], direction: "+", content: "美以联合打击伊朗，哈梅内伊被击杀。霍尔木兹海峡风险骤升。", source: "新闻" },
  { id: "r2", timestamp: "2026-02-28 14:00", type: "观点", linkedTheses: ["t1"], linkedInstruments: ["i1"], direction: "?", content: "XOM P/E 22倍已超分析师目标价10%，alpha已被定价。等战争明朗后再评估。", source: null },
  { id: "r3", timestamp: "2026-02-27 10:00", type: "观点", linkedTheses: ["t2"], linkedInstruments: ["i6"], direction: "+", content: "黄金闪崩后投机层清洗，长期逻辑未变。战争避险可能推回5000+。", source: null },
  { id: "r4", timestamp: "2026-02-15 09:30", type: "操作", linkedTheses: ["t1"], linkedInstruments: ["i4"], direction: "+", content: "中国海油小幅试探建仓", operationDetail: { opType: "买入", quantity: "100股", dayChange: "+1.2%" }, source: null },
  { id: "r5", timestamp: "2026-02-10 16:00", type: "消息", linkedTheses: ["t1"], linkedInstruments: ["i1"], direction: "+", content: "XOM Q4财报超预期，圭亚那增产+成本控制双轮驱动", source: "新闻" },
];

// ─── Helpers ──────────────────────────────────────────────────
export const statusIcon = (s) => {
  if (["建仓中", "持有", "止盈中"].includes(s)) return "🟢";
  if (["观望", "研究中"].includes(s)) return "🟡";
  return "⚪";
};

export const instStatusIcon = (s) => {
  if (s === "待研究") return "🔍";
  if (s === "持有") return "─";
  if (s === "止盈中") return "⤵️";
  if (s === "已清仓") return "✓";
  return "○";
};

export const dirIcon = (d) => d === "+" ? "▲" : d === "-" ? "▼" : "◆";
export const dirColor = (d) => d === "+" ? "#22c55e" : d === "-" ? "#ef4444" : "#f59e0b";
export const typeIcon = (t) => t === "待研究" ? "🔍" : "⚡";

export const alphaTag = (hasAlpha) => hasAlpha
  ? { label: "α+β", bg: "rgba(34,197,94,0.12)", text: "#22c55e" }
  : { label: "β", bg: "rgba(59,130,246,0.12)", text: "#3b82f6" };

export const todoUrgency = (deadline) => {
  if (!deadline) return "normal";
  const diff = (new Date(deadline) - new Date()) / 86400000;
  if (diff < 0) return "overdue";
  if (diff < 2) return "urgent";
  return "normal";
};

export const sourceLabel = (s) => {
  if (s === "新闻") return "📰 新闻";
  if (s === "分析师") return "👤 分析师";
  if (s === "自己判断") return "🧠 自己判断";
  if (s === "LLM对话") return "🤖 LLM对话";
  return null;
};

// ─── Color System ─────────────────────────────────────────────
export const C = {
  bg: "#0a0c10",
  surface: "#12151c",
  surfaceHover: "#1a1e28",
  border: "#1e2330",
  borderLight: "#2a3040",
  text: "#e2e4e9",
  textMuted: "#7a8194",
  textDim: "#4a5168",
  accent: "#c9a55a",
  accentDim: "rgba(201,165,90,0.15)",
  green: "#22c55e",
  red: "#ef4444",
  amber: "#f59e0b",
  blue: "#3b82f6",
};

export const PIE_COLORS = ["#c9a55a", "#3b82f6", "#22c55e", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899"];
export const CATEGORY_COLORS = { "进攻": "#ef4444", "防守": "#3b82f6", "现金": "#4a5168" };
