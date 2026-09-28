# Relay Protocol: Claude.ai → Investment Panel

A copy-paste relay for transferring thesis discussions from Claude.ai into the Panel's structured data model. Zero infrastructure — just a shared JSON schema as the contract between two Claudes.

## Workflow

1. Finish thesis discussion on Claude.ai → paste the **Export Prompt** (Section 2) → copy the JSON output
2. Open Claude Code → paste the JSON
3. Claude Code merges it into `constants.js`: assigns IDs (continuing from existing sequence), wires up `linkedTheses` / `primaryThesis`, and deduplicates against existing data

---

## Section 1: Transfer Schema

```json
{
  "thesis": {
    "name": "thesis 名称",
    "status": "研究中|观望|持有|建仓中|止盈中|已关闭",
    "conviction": "↑|↗|→|↘|↓",
    "summary": "一句话概括",
    "coreLogic": "核心因果链条",
    "triggers": ["催化剂1", "催化剂2"],
    "keywords": ["关键词1", "关键词2"]
  },
  "instruments": [
    {
      "name": "ticker or 名称",
      "category": "进攻|防守",
      "hasAlpha": false,
      "status": "待研究|观望|持有|止盈中|已清仓",
      "entryRules": "入场规则 or null",
      "exitRules": "退出规则 or null",
      "scalingPlan": "加减仓计划 or null",
      "keywords": ["关键词"]
    }
  ],
  "records": [
    {
      "type": "消息|观点|操作",
      "direction": "+|-|?",
      "content": "内容",
      "source": "新闻|分析师|自己判断|LLM对话",
      "linkedInstruments": ["instrument name if relevant"]
    }
  ],
  "todos": [
    {
      "content": "待办事项",
      "type": "待研究|待决策",
      "deadline": "YYYY-MM-DD or null"
    }
  ]
}
```

### Field Reference

| Field | Notes |
|---|---|
| `conviction` | ↑ strong bull · ↗ bull · → neutral · ↘ bear · ↓ strong bear |
| `status` (thesis) | 研究中 → 观望 → 建仓中 → 持有 → 止盈中 → 已关闭 |
| `status` (instrument) | 待研究 → 观望 → 持有 → 止盈中 → 已清仓 |
| `hasAlpha` | Individual stocks = `true`; ETFs / indices = `false` |
| `category` | 进攻 (offensive / growth) or 防守 (defensive / hedge) |
| `direction` | `+` bullish signal · `-` bearish signal · `?` ambiguous |
| `source` | 新闻 / 分析师 / 自己判断 / LLM对话 |
| `type` (record) | 消息 (news/event) · 观点 (opinion/analysis) · 操作 (trade action) |
| `type` (todo) | 待研究 (needs research) · 待决策 (needs decision) |

---

## Section 2: Export Prompt

Paste this at the end of your Claude.ai thesis discussion:

---

> 请把我们这次讨论的 thesis 整理成以下 JSON 格式，用于导入我的 Investment Panel。
>
> **规则：**
> - 只提取讨论中明确出现的信息，不要编造
> - `conviction` 用箭头：↑(强看多) ↗(看多) →(中性) ↘(看空) ↓(强看空)
> - `status` 反映当前阶段：研究中 / 观望 / 持有 / 建仓中 / 止盈中 / 已关闭
> - instruments 的 `hasAlpha` 标记是否有 alpha（个股=true，ETF/指数=false）
> - records 提取讨论中的关键观点和信息，`source` 标为 "LLM对话"
> - todos 提取讨论中识别出的待办行动
> - 不需要 ID 字段，只需要内容
>
> ```json
> {
>   "thesis": { "name", "status", "conviction", "summary", "coreLogic", "triggers": [], "keywords": [] },
>   "instruments": [{ "name", "category": "进攻|防守", "hasAlpha", "status", "entryRules", "exitRules", "scalingPlan", "keywords": [] }],
>   "records": [{ "type": "消息|观点|操作", "direction": "+|-|?", "content", "source", "linkedInstruments": [] }],
>   "todos": [{ "content", "type": "待研究|待决策", "deadline" }]
> }
> ```
>
> 输出完整的 JSON，不要包裹在 markdown code block 外面的解释文字。
