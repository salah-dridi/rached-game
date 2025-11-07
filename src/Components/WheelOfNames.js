import React, { useState, useMemo } from "react";
import Swal from 'sweetalert2';

export default function WheelOfNames() {
  const [names, setNames] = useState([]);
  const [input, setInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const size = 260;
  const radius = size / 2;
  const sliceAngle = names.length > 0 ? 360 / names.length : 0;
  const colors = useMemo(() => ["#ffe27a", "#89c2ff", "#ffb38a", "#9ff4d1", "#ff9a9a", "#c8b6ff"], []);

  function polar(cx, cy, r, angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(cx, cy, r, start, end) {
    const s = polar(cx, cy, r, end);
    const e = polar(cx, cy, r, start);
    const big = end - start <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${big} 0 ${e.x} ${e.y} Z`;
  }

  function addName() {
    if (!input.trim()) return;
    setNames([...names, input.trim()]);
    setInput("");
  }

  function spin() {
    if (spinning || names.length === 0) return;
    setSpinning(true);

    const idx = Math.floor(Math.random() * names.length);
    const centerAngle = idx * sliceAngle + sliceAngle / 2;
    const current = rotation % 360;
    const turns = 15 + Math.floor(Math.random() * 5);
    const target = rotation + (360 - current) + turns * 360 + (360 - centerAngle);

    setRotation(target);
    setTimeout(() => {
      setSpinning(false);
      Swal.fire({
        title: 'الاسم المختار',
        text: names[idx],
        icon: 'success',
        confirmButtonText: 'تمام'
      });
    }, 15000);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff', padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '960px', width: '100%' }}>
        {/* العجلة */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* السهم مقلوب للأعلى */}
          <div style={{ position: 'absolute', top: '-8px', zIndex: 20, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid white' }} />

          <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: '#333', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, transform: `rotate(${rotation}deg)`, transition: 'transform 15s cubic-bezier(0.12, 0.01, 0, 1)' }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {names.length === 0 ? (
                  <circle cx={radius} cy={radius} r={radius} fill="#1f2937" />
                ) : (
                  names.map((name, i) => {
                    const start = i * sliceAngle;
                    const end = start + sliceAngle;
                    const d = arcPath(radius, radius, radius, start, end);
                    const fill = colors[i % colors.length];
                    const mid = start + sliceAngle / 2;
                    const pos = polar(radius, radius, radius * 0.65, mid);
                    return (
                      <g key={i}>
                        <path d={d} fill={fill} stroke="#111" strokeWidth={1} />
                        <text x={pos.x} y={pos.y} fontSize={12} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mid + 90}, ${pos.x}, ${pos.y})`} fill="#111" style={{ fontWeight: 700 }}>{name}</text>
                      </g>
                    );
                  })
                )}

                <circle cx={radius} cy={radius} r={36} fill="#111" stroke="#fff" strokeWidth={2} />
                <circle cx={radius} cy={radius} r={5} fill="#fff" />
              </svg>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
            <button onClick={spin} disabled={spinning || names.length === 0} style={{ padding: '10px 20px', borderRadius: '14px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }}>{spinning ? 'تدور...' : 'أدر'}</button>
          </div>
        </div>

        {/* التحكم */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addName()} placeholder="إضافة إسم" style={{ flex: 1, borderRadius: '8px', backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 10px', color: '#fff' }} />
          <button onClick={addName} style={{ padding: '6px 12px', borderRadius: '14px', backgroundColor: '#34d399', color: '#000', fontWeight: 'bold' }}>إضافة</button>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>الأسماء</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {names.map((n, i) => (
            <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '2px 10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              {n}
              <button onClick={() => setNames(names.filter((_, idx) => idx !== i))} style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '0 5px' }}>×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
