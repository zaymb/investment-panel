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

---

## Completed

### 2026-03-05 数据模型增强
- Instrument 加 `hasAlpha` 字段（α+β vs β），Thesis 层不标（天然都是 Beta）
- Instrument 加 `entryRules / exitRules / scalingPlan` 执行规则
- Todo 加 `deadline` + 逾期/紧急视觉高亮
- Record 加 `source` 字段 + 快速输入来源下拉
- InstrumentDetail 新增执行规则卡片
- InstrumentDetail / ThesisDetail / Launchpad 显示 α+β / β 标签
