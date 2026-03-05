import { useState, useRef, useEffect } from "react";
import { C } from "../constants";

export default function LinkedSearch({
  theses, instruments, selected, onToggle, suggestions,
  inputStyle, single = false,
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, []);

  const allItems = [
    ...theses.map((t) => ({ id: t.id, name: t.name, icon: "📋", type: "thesis" })),
    ...instruments.map((i) => ({ id: i.id, name: i.name, icon: "📊", type: "instrument" })),
  ];

  const filtered = search.trim()
    ? allItems.filter((item) => {
        const kws = item.type === "thesis"
          ? (theses.find((t) => t.id === item.id)?.keywords || [])
          : (instruments.find((i) => i.id === item.id)?.keywords || []);
        const lower = search.toLowerCase();
        return item.name.toLowerCase().includes(lower) || kws.some((k) => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()));
      })
    : allItems;

  const handleSelect = (id) => {
    onToggle(id);
    setSearch("");
    if (single) setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      const first = filtered.find((f) => !selected.includes(f.id)) || filtered[0];
      handleSelect(first.id);
    }
  };

  const selectedItems = allItems.filter((item) => selected.includes(item.id));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{
          ...inputStyle, display: "flex", flexWrap: "wrap", gap: 4,
          alignItems: "center", padding: "4px 8px", minHeight: 36, cursor: "text",
        }}
        onClick={() => setOpen(true)}
      >
        {selectedItems.map((item) => (
          <span key={item.id} style={{
            display: "flex", alignItems: "center", gap: 3,
            padding: "2px 8px", borderRadius: 3, fontSize: 11,
            background: C.accentDim, color: C.accent,
          }}>
            {item.icon} {item.name}
            <span
              onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
              style={{ cursor: "pointer", marginLeft: 2, color: C.textMuted, fontSize: 13 }}
            >×</span>
          </span>
        ))}
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? "搜索关联 Thesis / 标的" : ""}
          style={{
            background: "none", border: "none", outline: "none",
            color: C.text, fontSize: 13, flex: 1, minWidth: 80, padding: "4px 0",
          }}
        />
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
          marginTop: 4, maxHeight: 180, overflowY: "auto",
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "8px 12px", fontSize: 12, color: C.textDim }}>无匹配</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{
                  padding: "6px 12px", fontSize: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  background: selected.includes(item.id) ? C.accentDim : "transparent",
                  color: selected.includes(item.id) ? C.accent : C.text,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = selected.includes(item.id) ? C.accentDim : C.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.background = selected.includes(item.id) ? C.accentDim : "transparent"}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {selected.includes(item.id) && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
              </div>
            ))
          )}
        </div>
      )}

      {suggestions && suggestions.filter((s) => !selected.includes(s.id)).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          <span style={{ fontSize: 10, color: C.textDim, marginRight: 2 }}>建议</span>
          {suggestions.filter((s) => !selected.includes(s.id)).map((s) => (
            <button key={s.id} onClick={() => handleSelect(s.id)} style={{
              padding: "2px 8px", borderRadius: 3, fontSize: 10, cursor: "pointer",
              background: "rgba(201,165,90,0.08)", color: C.textMuted,
              border: `1px dashed ${C.border}`,
            }}>
              {s.type === "thesis" ? "📋" : "📊"} {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
