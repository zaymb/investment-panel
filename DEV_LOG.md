# Dev Log

## Next Up

### AI 智能输入模块
自然语言 → 结构化录入，需要独立组件 + 后端服务。

**核心需求：**
- Haiku 做 NLP 解析（一句话 → 填好表单字段：type, instrument, direction, source 等）
- 行情/新闻 API 补全客观数据（价格、日期、财报数据），不依赖 LLM 编造
- 前端：独立 AI 输入栏或改造现有快速输入弹窗

**待决策：**
- 后端选型：Cloudflare Workers / Vercel Edge Functions / Express
- 行情 API：Yahoo Finance / Alpha Vantage（免费额度）
- 新闻 API：NewsAPI / Google Search API
- 交互形式：改造快速输入 vs 独立组件

**原则：** LLM 只做录入助手，不做投资分析。重大决策由人判断。

### 快速输入交互优化
当前弹窗卡片式交互偏繁琐，待探索更流畅的录入方式。暂无明确方案，留意灵感。

### 收盘价 API 自动获取
操作记录的"当日涨幅"不应依赖手动输入，应关联行情 API 自动拉取最新收盘价。与 AI 智能输入模块的行情 API 可复用同一数据源。

### 关联标的/Thesis 智能推荐
录入时根据内容关键词自动 suggest 关联的 thesis/instrument，用简单的关键词匹配或轻量 RAG。用户仍可手动选择覆盖。

### Thesis 状态超期提醒
Thesis 加 `statusSince` 字段，Launchpad 上对"研究中"超过 N 天的 thesis 做视觉高亮提醒。

---

## Completed

### 2026-03-05 快速输入模块接通
- 快速输入弹窗三种类型（操作/观点/消息）全部接通状态 + 保存逻辑
- 新记录插入到列表顶部，自动生成时间戳
- 待办弹窗：类型选择按钮接通状态，关联下拉接通状态
- 待办截止日期：预设按钮（明天/3天/1周）+ 日历选择器 + 清除按钮
- 关闭/切换 tab 时自动重置表单

### 2026-03-05 数据模型增强
- Instrument 加 `hasAlpha` 字段（α+β vs β），Thesis 层不标（天然都是 Beta）
- Instrument 加 `entryRules / exitRules / scalingPlan` 执行规则
- Todo 加 `deadline` + 逾期/紧急视觉高亮
- Record 加 `source` 字段 + 快速输入来源下拉
- InstrumentDetail 新增执行规则卡片
- InstrumentDetail / ThesisDetail / Launchpad 显示 α+β / β 标签
