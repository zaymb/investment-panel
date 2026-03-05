import { useState } from "react";
import { C, statusIcon, instStatusIcon, dirIcon, dirColor, typeIcon, alphaTag, todoUrgency, sourceLabel, matchKeywords } from "../constants";
import PieChart from "../components/PieChart";
import Modal from "../components/Modal";
import LinkedSearch from "../components/LinkedSearch";

export default function Launchpad({
  theses, instruments, todos, records, setTodos, setRecords,
  pieView, setPieView, pieData, handlePieUpdate,
  goThesis, goInstrument,
  mounted, card, sectionTitle, pill, inputStyle, btnPrimary,
}) {
  const [quickInputOpen, setQuickInputOpen] = useState(false);
  const [quickInputType, setQuickInputType] = useState("操作");
  const [addTodoOpen, setAddTodoOpen] = useState(false);

  // Quick input form state
  const [qiInstrument, setQiInstrument] = useState("");
  const [qiOpType, setQiOpType] = useState("");
  const [qiQuantity, setQiQuantity] = useState("");
  const [qiDayChange, setQiDayChange] = useState("");
  const [qiDirection, setQiDirection] = useState("");
  const [qiContent, setQiContent] = useState("");
  const [qiLinked, setQiLinked] = useState([]);
  const [qiSource, setQiSource] = useState("");

  // Add todo form state
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoType, setNewTodoType] = useState("待研究");
  const [newTodoLinked, setNewTodoLinked] = useState("");
  const [newTodoDeadline, setNewTodoDeadline] = useState("");

  const addDays = (days) => {
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const resetQuickInput = () => {
    setQiInstrument(""); setQiOpType(""); setQiQuantity(""); setQiDayChange("");
    setQiDirection(""); setQiContent(""); setQiLinked([]); setQiSource("");
  };

  const resetTodoForm = () => {
    setNewTodoText(""); setNewTodoType("待研究"); setNewTodoLinked(""); setNewTodoDeadline("");
  };

  const handleQuickSave = () => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    const id = `r${Date.now()}`;

    if (quickInputType === "操作") {
      if (!qiInstrument || !qiOpType) return;
      const inst = instruments.find(i => i.id === qiInstrument);
      setRecords(prev => [{
        id, timestamp: ts, type: "操作",
        linkedTheses: inst ? [inst.primaryThesis] : [], linkedInstruments: [qiInstrument],
        direction: qiOpType === "卖出" ? "-" : "+",
        content: `${inst?.name} ${qiOpType}`,
        operationDetail: { opType: qiOpType, quantity: qiQuantity, dayChange: qiDayChange },
        source: null,
      }, ...prev]);
    } else if (quickInputType === "观点") {
      if (!qiContent.trim()) return;
      setRecords(prev => [{
        id, timestamp: ts, type: "观点",
        linkedTheses: qiLinked.filter(lid => theses.some(t => t.id === lid)),
        linkedInstruments: qiLinked.filter(lid => instruments.some(i => i.id === lid)),
        direction: qiDirection || "?", content: qiContent, source: null,
      }, ...prev]);
    } else {
      if (!qiContent.trim()) return;
      setRecords(prev => [{
        id, timestamp: ts, type: "消息",
        linkedTheses: qiLinked.filter(lid => theses.some(t => t.id === lid)),
        linkedInstruments: qiLinked.filter(lid => instruments.some(i => i.id === lid)),
        direction: qiDirection || "?", content: qiContent, source: qiSource || null,
      }, ...prev]);
    }
    resetQuickInput();
    setQuickInputOpen(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
      padding: "24px 32px", maxWidth: 1100, margin: "0 auto",
      opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px)",
      transition: "opacity 0.4s, transform 0.4s",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: C.accent, letterSpacing: "0.02em" }}>
            Investment Panel
          </h1>
          <span style={{ fontSize: 12, color: C.textDim }}>Thesis-Centric Portfolio Management</span>
        </div>
        <button onClick={() => setQuickInputOpen(true)} style={{
          ...btnPrimary, display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> 快速输入
        </button>
      </div>

      {/* Thesis Cards */}
      <div style={sectionTitle}>THESES</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: 32 }}>
        {theses.map((t) => (
          <div key={t.id} style={{ ...card, cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
            onClick={() => goThesis(t.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>{statusIcon(t.status)}</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</span>
              </div>
              <span style={{ fontSize: 18, color: C.accent, fontWeight: 700 }}>{t.conviction}</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{t.summary}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.instruments.map((iid) => {
                const inst = instruments.find((x) => x.id === iid);
                if (!inst) return null;
                return (
                  <span key={iid} onClick={(e) => { e.stopPropagation(); goInstrument(iid); }}
                    style={{
                      padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500,
                      background: C.bg, color: C.textMuted, border: `1px solid ${C.border}`,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = C.accent}
                    onMouseLeave={(e) => e.currentTarget.style.color = C.textMuted}>
                    <span>{inst.positionLevel}</span>
                    <span>{inst.name}</span>
                    {inst.hasAlpha && <span style={{ fontSize: 9, color: alphaTag(true).text, fontWeight: 700 }}>α</span>}
                    <span style={{ fontSize: 10 }}>{instStatusIcon(inst.status)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {/* Pie Chart */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={sectionTitle}>仓位分布</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["类别", "Thesis", "标的"].map((v) => (
                <button key={v} style={pill(pieView === v)} onClick={() => setPieView(v)}>{v}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart data={pieData} editable={pieView === "标的"} onUpdate={handlePieUpdate} />
          </div>
          {pieView === "标的" && (
            <div style={{ fontSize: 10, color: C.textDim, textAlign: "center", marginTop: 4 }}>
              拖动金色圆点调整比例 · Snap to 5%
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, justifyContent: "center" }}>
            {pieData.filter(d => d.value > 0).map((d, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textMuted }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: "inline-block" }} />
                {d.label} {Math.round(d.value)}%
              </span>
            ))}
          </div>
        </div>

        {/* Todos */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={sectionTitle}>待办</span>
            <button onClick={() => setAddTodoOpen(true)}
              style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 4, color: C.textMuted, fontSize: 12, padding: "2px 10px", cursor: "pointer" }}>
              + 添加
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todos.filter((t) => !t.done).map((t) => {
              const urgency = todoUrgency(t.deadline);
              return (
                <div key={t.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px",
                  borderRadius: 6, background: C.bg, fontSize: 13,
                  borderLeft: urgency === "overdue" ? `3px solid ${C.red}` : urgency === "urgent" ? `3px solid ${C.amber}` : "none",
                }}>
                  <input type="checkbox" checked={t.done} onChange={() => {
                    setTodos((prev) => prev.map((x) => x.id === t.id ? { ...x, done: !x.done } : x));
                  }} style={{ marginTop: 2, accentColor: C.accent }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11 }}>{typeIcon(t.type)}</span>
                      <span style={{ color: C.text, lineHeight: 1.4 }}>{t.content}</span>
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim, display: "flex", gap: 8 }}>
                      <span>{t.createdAt}</span>
                      {t.linkedId && <span style={{ color: C.accent }}>
                        {theses.find((th) => th.id === t.linkedId)?.name || instruments.find((i) => i.id === t.linkedId)?.name}
                      </span>}
                      {t.deadline && <span style={{
                        color: urgency === "overdue" ? C.red : urgency === "urgent" ? C.amber : C.textDim,
                        fontWeight: urgency !== "normal" ? 600 : 400,
                      }}>截止 {parseInt(t.deadline.slice(5, 7))}/{parseInt(t.deadline.slice(8, 10))}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={sectionTitle}>近期记录</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {records.slice(0, 8).map((rec) => (
            <div key={rec.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 6, background: C.bg, fontSize: 13,
            }}>
              <span style={{ color: C.textDim, fontSize: 11, whiteSpace: "nowrap", minWidth: 110 }}>{rec.timestamp}</span>
              <span style={{ color: dirColor(rec.direction), fontSize: 12, minWidth: 14, textAlign: "center" }}>{dirIcon(rec.direction)}</span>
              <span style={{
                padding: "1px 8px", borderRadius: 3, fontSize: 10, fontWeight: 600,
                background: rec.type === "操作" ? "rgba(59,130,246,0.15)" : rec.type === "观点" ? "rgba(201,165,90,0.15)" : "rgba(139,92,246,0.15)",
                color: rec.type === "操作" ? C.blue : rec.type === "观点" ? C.accent : "#8b5cf6",
              }}>{rec.type}</span>
              {rec.source && sourceLabel(rec.source) && <span style={{
                padding: "1px 8px", borderRadius: 3, fontSize: 10,
                background: "rgba(122,129,148,0.1)", color: C.textMuted,
              }}>{sourceLabel(rec.source)}</span>}
              <span style={{ flex: 1, color: C.text, lineHeight: 1.4 }}>{rec.content}</span>
              {rec.operationDetail && (
                <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>
                  {rec.operationDetail.opType} {rec.operationDetail.quantity} ({rec.operationDetail.dayChange})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Input Modal */}
      <Modal open={quickInputOpen} onClose={() => setQuickInputOpen(false)} title="快速输入">
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["操作", "观点", "消息"].map((t) => (
            <button key={t} style={{ ...pill(quickInputType === t), padding: "6px 20px", fontSize: 13 }}
              onClick={() => setQuickInputType(t)}>{t}</button>
          ))}
        </div>
        {quickInputType === "操作" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select style={inputStyle} value={qiInstrument} onChange={(e) => setQiInstrument(e.target.value)}>
              <option value="">选择标的</option>
              {instruments.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              {["买入", "卖出", "转换"].map((op) => (
                <button key={op} onClick={() => setQiOpType(op)}
                  style={{ ...pill(qiOpType === op), border: `1px solid ${qiOpType === op ? C.accent : C.border}`, flex: 1 }}>{op}</button>
              ))}
            </div>
            <input style={inputStyle} placeholder="数量" value={qiQuantity} onChange={(e) => setQiQuantity(e.target.value)} />
            <input style={inputStyle} placeholder="当日涨幅 (e.g. +1.2%)" value={qiDayChange} onChange={(e) => setQiDayChange(e.target.value)} />
          </div>
        )}
        {quickInputType === "观点" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <LinkedSearch theses={theses} instruments={instruments}
              selected={qiLinked}
              onToggle={(id) => setQiLinked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
              suggestions={matchKeywords(qiContent, theses, instruments)}
              inputStyle={inputStyle} />
            <div style={{ display: "flex", gap: 8 }}>
              {["+", "-", "?"].map((d) => (
                <button key={d} onClick={() => setQiDirection(d)}
                  style={{ ...pill(qiDirection === d), border: `1px solid ${qiDirection === d ? C.accent : C.border}`, flex: 1, fontSize: 16, color: dirColor(d) }}>{d}</button>
              ))}
            </div>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="观点内容"
              value={qiContent} onChange={(e) => setQiContent(e.target.value)} />
          </div>
        )}
        {quickInputType === "消息" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select style={inputStyle} value={qiSource} onChange={(e) => setQiSource(e.target.value)}>
              <option value="">来源</option>
              {["自己判断", "新闻", "分析师", "LLM对话"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              {["+", "-", "?"].map((d) => (
                <button key={d} onClick={() => setQiDirection(d)}
                  style={{ ...pill(qiDirection === d), border: `1px solid ${qiDirection === d ? C.accent : C.border}`, flex: 1, fontSize: 16, color: dirColor(d) }}>{d}</button>
              ))}
            </div>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="消息内容"
              value={qiContent} onChange={(e) => setQiContent(e.target.value)} />
            <LinkedSearch theses={theses} instruments={instruments}
              selected={qiLinked}
              onToggle={(id) => setQiLinked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
              suggestions={matchKeywords(qiContent, theses, instruments)}
              inputStyle={inputStyle} />
          </div>
        )}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <button style={btnPrimary} onClick={handleQuickSave}>保存</button>
        </div>
      </Modal>

      {/* Add Todo Modal */}
      <Modal open={addTodoOpen} onClose={() => setAddTodoOpen(false)} title="添加待办">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input style={inputStyle} placeholder="待办内容" value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            {["待研究", "待决策"].map((t) => (
              <button key={t} onClick={() => setNewTodoType(t)}
                style={{ ...pill(newTodoType === t), border: `1px solid ${newTodoType === t ? C.accent : C.border}`, flex: 1 }}>{t}</button>
            ))}
          </div>
          <LinkedSearch theses={theses} instruments={instruments}
            selected={newTodoLinked ? [newTodoLinked] : []}
            onToggle={(id) => setNewTodoLinked(prev => prev === id ? "" : id)}
            suggestions={matchKeywords(newTodoText, theses, instruments)}
            inputStyle={inputStyle} single />
          <div>
            <span style={{ fontSize: 12, color: C.textMuted, marginBottom: 6, display: "block" }}>截止日期</span>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[{ label: "明天", days: 1 }, { label: "3天", days: 3 }, { label: "1周", days: 7 }].map((p) => (
                <button key={p.days} onClick={() => setNewTodoDeadline(addDays(p.days))}
                  style={{ ...pill(newTodoDeadline === addDays(p.days)), border: `1px solid ${newTodoDeadline === addDays(p.days) ? C.accent : C.border}`, flex: 1 }}>{p.label}</button>
              ))}
              {newTodoDeadline && (
                <button onClick={() => setNewTodoDeadline("")}
                  style={{ ...pill(false), border: `1px solid ${C.border}`, color: C.textDim, fontSize: 11, padding: "4px 8px" }}>清除</button>
              )}
            </div>
            <input type="date" style={inputStyle} value={newTodoDeadline}
              onChange={(e) => setNewTodoDeadline(e.target.value)} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={btnPrimary} onClick={() => {
              if (newTodoText.trim()) {
                setTodos((prev) => [...prev, {
                  id: `td${Date.now()}`, content: newTodoText, type: newTodoType,
                  linkedId: newTodoLinked || null, createdAt: new Date().toISOString().slice(0, 10),
                  deadline: newTodoDeadline || null, done: false,
                }]);
                resetTodoForm();
                setAddTodoOpen(false);
              }
            }}>添加</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
