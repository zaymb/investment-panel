import { useState, useCallback, useRef } from "react";
import { C } from "../constants";

export default function PieChart({ data, editable, onUpdate }) {
  const svgRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [dragging, setDragging] = useState(null);
  const cx = 140, cy = 140, r = 110, r2 = 80;

  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const midAngle = (startAngle + endAngle) / 2;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + r2 * Math.cos(startAngle);
    const iy1 = cy + r2 * Math.sin(startAngle);
    const ix2 = cx + r2 * Math.cos(endAngle);
    const iy2 = cy + r2 * Math.sin(endAngle);
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r2} ${r2} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    return { ...d, path, midAngle, startAngle, endAngle, idx: i };
  });

  const getAngle = useCallback((e) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    return Math.atan2(y, x);
  }, []);

  const handleMouseDown = useCallback((idx, e) => {
    if (!editable) return;
    e.preventDefault();
    setDragging({ idx, startAngle: getAngle(e) });
  }, [editable, getAngle]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !editable || !onUpdate) return;
    const currentAngle = getAngle(e);
    const delta = currentAngle - dragging.startAngle;
    const deltaPct = (delta / (Math.PI * 2)) * 100;
    const snapped = Math.round(deltaPct / 5) * 5;
    if (snapped !== 0) {
      onUpdate(dragging.idx, snapped);
      setDragging({ ...dragging, startAngle: currentAngle });
    }
  }, [dragging, editable, getAngle, onUpdate]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  return (
    <svg ref={svgRef} width={280} height={280} style={{ cursor: editable ? "pointer" : "default" }}
      onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} opacity={hoveredIdx === i ? 1 : 0.85}
            stroke={C.bg} strokeWidth={2}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ transition: "opacity 0.15s" }} />
          {s.value > 4 && (
            <text x={cx + ((r + r2) / 2) * Math.cos(s.midAngle)} y={cy + ((r + r2) / 2) * Math.sin(s.midAngle)}
              textAnchor="middle" dominantBaseline="central"
              fill={C.bg} fontSize={11} fontWeight={600} style={{ pointerEvents: "none" }}>
              {Math.round(s.value)}%
            </text>
          )}
          {editable && i < slices.length - 1 && (
            <circle cx={cx + ((r + r2) / 2) * Math.cos(s.endAngle)}
              cy={cy + ((r + r2) / 2) * Math.sin(s.endAngle)}
              r={6} fill={C.accent} stroke={C.bg} strokeWidth={2}
              style={{ cursor: "grab" }}
              onMouseDown={(e) => handleMouseDown(i, e)} />
          )}
        </g>
      ))}
      {hoveredIdx !== null && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fill={C.text} fontSize={13} fontWeight={500}>
          {slices[hoveredIdx].label}
        </text>
      )}
    </svg>
  );
}
