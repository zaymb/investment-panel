# Project Instructions

## Communication Style

- Use Chinese as the primary language, with natural code-switching to English for technical/investment terms
- Be engaging and relatable — not robotic, but also not condescending
- The user is a vibe coder who is eager to learn along the way — treat them as a curious peer, not a beginner to be hand-held
- Briefly explain the reasoning behind code changes, but keep it concise by default — only go deeper when asked or when the concept is genuinely tricky

## Coding Workflow

- Before making changes, give a short plain-language summary of what you're about to do and why
- Don't over-explain with walls of text — a couple of sentences is usually enough
- Don't overkill — if a simple solution works, don't add layers of defense for edge cases

## Project Context

Investment Panel is a thesis-centric personal investment management tool.

**Core problem**: Information arrives chronologically, but thinking flows by thesis. Panel reorganizes the temporal information stream back into a thesis-indexed cognitive stream — "信息按时间流入，但思维按 thesis 流动".

**What Panel is**: A decision journal with thesis as the organizing index. It manages the full lifecycle from "这个想法值得认真对待" to "这个 thesis 彻底关闭".

**What Panel is not**: Not a portfolio tracker, not a trading terminal, not a market data platform.

**User profile**:
- 偏右侧宏观 trading style — theses are inherently Beta (macro/cycle driven)
- Alpha only emerges at the instrument selection level (marked with `hasAlpha` on instruments)
- Primary investment research happens on Claude.ai; Panel handles decision recording and lifecycle management
- Context is isolated between Claude.ai and Claude Code — this CLAUDE.md serves as a shared context carrier across both platforms

**Key data model decisions**:
- Thesis level has no Alpha/Beta tag (always Beta, tagging adds no information)
- Instrument level uses `hasAlpha: boolean` to distinguish pure Beta exposure (ETFs) from Alpha+Beta (individual stocks)
- Position granularity is "decision precision" not "accounting precision" — 5% snap, expressing allocation intent rather than exact holdings
- Record `source` field distinguishes information origin (新闻/分析师/自己判断/LLM对话) to support retrospectives

## Design Philosophy

1. **Help the user think better, not trade faster** — Panel's value is in forcing structured thinking (separating alpha/beta, setting entry/exit rules, deadline-driven review), not in execution speed
2. **Don't limit technology; set boundaries at the human execution layer** — Agentic automation is inevitable and everything automatable will be automated, but design always centers on optimizing personal-scale trading + cognitive and decision sustainability ("认知和决策可持续")
3. **Data flows through Panel, but Panel is not the source of truth** — Market data, precise positions, etc. will be injected on-demand by agents from brokers/APIs in the future; Panel maintains its own decision-centric perspective
4. **Minimize input friction** — LLM (Haiku) serves as a recording assistant parsing natural language, not as an investment analyst. Dedicated APIs supply objective data; never rely on LLM fabrication
5. **Two rhythms coexist** — Daily quick recording + periodic retrospective review. Retrospectives are the killer feature of a decision journal
6. **Guard against V2 bloat** — Paths like IB API integration, precise position sync, real-time technical indicators risk turning Panel into a half-baked trading terminal competing with Bloomberg/TWS. "Thesis-centric decision journal" has virtually no competition as a category
