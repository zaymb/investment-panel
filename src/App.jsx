import { useState, useEffect } from "react";
import {
  INITIAL_THESES, INITIAL_INSTRUMENTS, INITIAL_TODOS, INITIAL_RECORDS,
  C, PIE_COLORS, CATEGORY_COLORS,
} from "./constants";
import Launchpad from "./views/Launchpad";
import ThesisDetail from "./views/ThesisDetail";
import InstrumentDetail from "./views/InstrumentDetail";

export default function InvestmentPanel() {
  const [theses, setTheses] = useState(INITIAL_THESES);
  const [instruments, setInstruments] = useState(INITIAL_INSTRUMENTS);
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [records, setRecords] = useState(INITIAL_RECORDS);

  const [view, setView] = useState("launchpad");
  const [selectedId, setSelectedId] = useState(null);
  const [pieView, setPieView] = useState("标的");

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const goThesis = (id) => { setSelectedId(id); setView("thesis"); };
  const goInstrument = (id) => { setSelectedId(id); setView("instrument"); };
  const goHome = () => { setView("launchpad"); setSelectedId(null); };

  // ─── Position & Pie ─────────────────────────────────────────
  const cashPct = Math.max(0, 100 - instruments.reduce((s, i) => s + i.positionPct, 0));

  const getPieData = () => {
    if (pieView === "类别") {
      const cat = {};
      instruments.forEach((i) => { cat[i.category] = (cat[i.category] || 0) + i.positionPct; });
      const d = Object.entries(cat).filter(([, v]) => v > 0).map(([k, v]) => ({ label: k, value: v, color: CATEGORY_COLORS[k] }));
      d.push({ label: "现金", value: cashPct, color: CATEGORY_COLORS["现金"] });
      return d;
    }
    if (pieView === "Thesis") {
      const tm = {};
      instruments.forEach((i) => {
        const t = theses.find((th) => th.id === i.primaryThesis);
        const name = t ? t.name : "未分类";
        tm[name] = (tm[name] || 0) + i.positionPct;
      });
      const d = Object.entries(tm).filter(([, v]) => v > 0).map(([k, v], idx) => ({ label: k, value: v, color: PIE_COLORS[idx % PIE_COLORS.length] }));
      d.push({ label: "现金", value: cashPct, color: C.textDim });
      return d;
    }
    const d = instruments.filter((i) => i.positionPct > 0).map((i, idx) => ({ label: i.name, value: i.positionPct, color: PIE_COLORS[idx % PIE_COLORS.length], id: i.id }));
    d.push({ label: "现金", value: cashPct, color: C.textDim });
    return d;
  };

  const handlePieUpdate = (idx, deltaPct) => {
    if (pieView !== "标的") return;
    const pieData = getPieData();
    const item = pieData[idx];
    if (!item.id) return;
    setInstruments((prev) => prev.map((inst) => {
      if (inst.id !== item.id) return inst;
      const newPct = Math.max(0, Math.min(95, inst.positionPct + deltaPct));
      const snapped = Math.round(newPct / 5) * 5;
      let level = "○";
      if (snapped > 0 && snapped <= 10) level = "◔";
      else if (snapped > 10 && snapped <= 20) level = "◑";
      else if (snapped > 20) level = "◕";
      return { ...inst, positionPct: snapped, positionLevel: level };
    }));
  };

  // ─── Shared Styles ──────────────────────────────────────────
  const card = {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
    padding: "16px 20px", transition: "border-color 0.2s, transform 0.15s",
  };
  const sectionTitle = {
    color: C.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", marginBottom: 14,
  };
  const pill = (active) => ({
    padding: "4px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "none",
    background: active ? C.accentDim : "transparent", color: active ? C.accent : C.textMuted,
    fontWeight: active ? 600 : 400, transition: "all 0.15s",
  });
  const inputStyle = {
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
    padding: "8px 12px", color: C.text, fontSize: 13, width: "100%", outline: "none",
    boxSizing: "border-box",
  };
  const btnPrimary = {
    background: C.accent, color: C.bg, border: "none", borderRadius: 6,
    padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  };

  // ─── View Router ────────────────────────────────────────────
  if (view === "thesis") {
    const t = theses.find((x) => x.id === selectedId);
    if (!t) return null;
    return <ThesisDetail thesis={t} instruments={instruments} records={records}
      goHome={goHome} goInstrument={goInstrument} card={card} sectionTitle={sectionTitle} />;
  }

  if (view === "instrument") {
    const inst = instruments.find((x) => x.id === selectedId);
    if (!inst) return null;
    return <InstrumentDetail instrument={inst} theses={theses} records={records}
      goHome={goHome} goThesis={goThesis} card={card} sectionTitle={sectionTitle} />;
  }

  return <Launchpad
    theses={theses} instruments={instruments} todos={todos} records={records} setTodos={setTodos} setRecords={setRecords}
    pieView={pieView} setPieView={setPieView} pieData={getPieData()} handlePieUpdate={handlePieUpdate}
    goThesis={goThesis} goInstrument={goInstrument}
    mounted={mounted} card={card} sectionTitle={sectionTitle} pill={pill} inputStyle={inputStyle} btnPrimary={btnPrimary}
  />;
}
