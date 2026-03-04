import { C, statusIcon, dirIcon, dirColor, alphaTag } from "../constants";

export default function InstrumentDetail({
  instrument: inst, theses, records,
  goHome, goThesis,
  card, sectionTitle,
}) {
  const linkedTs = theses.filter((t) => inst.linkedTheses.includes(t.id));
  const linkedRecords = records.filter((r) => r.linkedInstruments.includes(inst.id));

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
      padding: "24px 32px", maxWidth: 900, margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <button onClick={goHome} style={{
        background: "none", border: "none", color: C.textMuted, cursor: "pointer",
        fontSize: 13, marginBottom: 20, padding: 0,
      }}>← 返回 Launchpad</button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{inst.positionLevel}</span>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{inst.name}</h2>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, fontSize: 12, color: C.textMuted }}>
        <span style={{ padding: "2px 10px", borderRadius: 4, background: inst.category === "进攻" ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)", color: inst.category === "进攻" ? C.red : C.blue }}>{inst.category}</span>
        <span style={{
          padding: "2px 10px", borderRadius: 4, fontSize: 12,
          background: alphaTag(inst.hasAlpha).bg, color: alphaTag(inst.hasAlpha).text,
        }}>{alphaTag(inst.hasAlpha).label}</span>
        <span style={{ padding: "2px 10px", borderRadius: 4, background: C.accentDim, color: C.accent }}>{inst.status}</span>
        {inst.positionPct > 0 && <span style={{ padding: "2px 10px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>仓位 {inst.positionPct}%</span>}
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={sectionTitle}>执行规则</div>
        {inst.entryRules || inst.exitRules || inst.scalingPlan ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "入场条件", value: inst.entryRules, color: C.green },
              { label: "退出条件", value: inst.exitRules, color: C.red },
              { label: "分层计划", value: inst.scalingPlan, color: C.amber },
            ].filter(r => r.value).map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13 }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap",
                  background: `${r.color}15`, color: r.color, marginTop: 1,
                }}>{r.label}</span>
                <span style={{ color: C.text, lineHeight: 1.5 }}>{r.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: C.textDim, fontSize: 13, padding: "4px 0" }}>暂无执行规则</div>
        )}
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={sectionTitle}>关联 Thesis（双链）</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {linkedTs.map((t) => (
            <div key={t.id} onClick={() => goThesis(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 6, background: C.bg, cursor: "pointer", fontSize: 13,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.surfaceHover}
              onMouseLeave={(e) => e.currentTarget.style.background = C.bg}>
              <span>{statusIcon(t.status)}</span>
              <span style={{ fontWeight: 500 }}>{t.name}</span>
              <span style={{ color: C.accent, marginLeft: 4 }}>{t.conviction}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.textMuted }}>{t.status}</span>
              {t.id === inst.primaryThesis && (
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: C.accentDim, color: C.accent }}>主要</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>时间线</div>
        {linkedRecords.length === 0 ? (
          <div style={{ color: C.textDim, fontSize: 13, padding: 12 }}>暂无关联记录</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {linkedRecords.map((rec) => (
              <div key={rec.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                borderRadius: 6, background: C.bg, fontSize: 13,
              }}>
                <span style={{ color: C.textDim, fontSize: 11, whiteSpace: "nowrap", minWidth: 110 }}>{rec.timestamp}</span>
                <span style={{ color: dirColor(rec.direction), fontSize: 12 }}>{dirIcon(rec.direction)}</span>
                <span style={{
                  padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 600,
                  background: rec.type === "操作" ? "rgba(59,130,246,0.15)" : rec.type === "观点" ? "rgba(201,165,90,0.15)" : "rgba(139,92,246,0.15)",
                  color: rec.type === "操作" ? C.blue : rec.type === "观点" ? C.accent : "#8b5cf6",
                }}>{rec.type}</span>
                <span style={{ flex: 1 }}>{rec.content}</span>
                {rec.operationDetail && (
                  <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>
                    {rec.operationDetail.opType} {rec.operationDetail.quantity}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
