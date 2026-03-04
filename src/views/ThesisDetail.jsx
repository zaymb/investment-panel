import { C, statusIcon, instStatusIcon, dirIcon, dirColor, alphaTag } from "../constants";

export default function ThesisDetail({
  thesis: t, instruments, records,
  goHome, goInstrument,
  card, sectionTitle,
}) {
  const linkedInsts = instruments.filter((i) => i.linkedTheses.includes(t.id));
  const linkedRecords = records.filter((r) => r.linkedTheses.includes(t.id));

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
        <span style={{ fontSize: 18 }}>{statusIcon(t.status)}</span>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{t.name}</h2>
        <span style={{ fontSize: 24, color: C.accent, fontWeight: 700 }}>{t.conviction}</span>
      </div>
      <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>
        <span style={{ padding: "2px 10px", borderRadius: 4, background: C.accentDim, color: C.accent, fontSize: 12 }}>{t.status}</span>
        <span style={{ marginLeft: 12 }}>{t.summary}</span>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={sectionTitle}>核心逻辑</div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.text }}>{t.coreLogic}</p>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={sectionTitle}>触发条件</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {t.triggers.map((tr, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: C.textDim }}>○</span>
              <span>{tr}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={sectionTitle}>关联标的</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {linkedInsts.map((inst) => (
            <div key={inst.id} onClick={() => goInstrument(inst.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "8px 10px",
                borderRadius: 6, background: C.bg, cursor: "pointer", fontSize: 13,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.surfaceHover}
              onMouseLeave={(e) => e.currentTarget.style.background = C.bg}>
              <span style={{ minWidth: 18 }}>{inst.positionLevel}</span>
              <span style={{ fontWeight: 500 }}>{inst.name}</span>
              <span style={{
                padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600,
                background: alphaTag(inst.hasAlpha).bg, color: alphaTag(inst.hasAlpha).text,
              }}>{alphaTag(inst.hasAlpha).label}</span>
              <span style={{ color: C.textMuted, fontSize: 11 }}>{inst.category}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.textMuted }}>{instStatusIcon(inst.status)} {inst.status}</span>
              {inst.positionPct > 0 && <span style={{ fontSize: 11, color: C.accent }}>{inst.positionPct}%</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>时间线</div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
