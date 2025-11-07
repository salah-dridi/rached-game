import React, { useState, useMemo } from "react";
import Swal from 'sweetalert2';

import logo from './image1.jpg'
 import logo2 from './image2.jpg'
export default function WheelOfNames() {
  const [names, setNames] = useState([]);
  const [input, setInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const size = 250;
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
    <div style={{
      backgroundImage: `url(${logo2 })`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{ backgroundColor: '#333', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 20, borderBottom: '2px solid #222', borderRadius: '0 0 12px 12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 -6px 20px rgba(0,0,0,0.3)'}}>
        <img src={logo} alt="Logo" style={{ width: '30px', height: '30px', borderRadius:'50%' }} />
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#fff', margin: 0, textShadow: '0 0 4px #ccc' }}>
          ❥. 𝔹𝕚𝕟 𝕤𝕒𝕚𝕕
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Oman.svg" alt="Oman" style={{ width: '24px', height: '16px' }} />
        </h1>
      </header>
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', position: 'relative' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px', width: '100%', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: '-6px', zIndex: 5, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '18px solid white' }} />
            <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: '#87CEFA', border: '3px solid #000', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, transform: `rotate(${rotation}deg)`, transition: 'transform 15s cubic-bezier(0.12, 0.01, 0, 1)' }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                  {names.length === 0 ? (
                    <circle cx={radius} cy={radius} r={radius} fill="#87CEFA" />
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
                          <text x={pos.x} y={pos.y} fontSize={10} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mid + 90}, ${pos.x}, ${pos.y})`} fill="#111" style={{ fontWeight: 700, overflow: 'hidden' }}>
                            <tspan style={{ display: 'inline', maxWidth: `${radius * 1.2}px`, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</tspan>
                          </text>
                        </g>
                      );
                    })
                  )}
                  <circle cx={radius} cy={radius} r={36} fill="#000" stroke="#fff" strokeWidth={2} />
                  <circle cx={radius} cy={radius} r={6} fill="#fff" />
                </svg>
              </div>
              <button onClick={spin} disabled={spinning || names.length === 0} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', fontWeight: 'bold', zIndex: 15 }}>
                {spinning ? 'دوران' : 'أدر'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addName()} placeholder="إضافة إسم" style={{ flex: 1, borderRadius: '6px', backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 8px', color: '#fff' }} />
            <button onClick={addName} style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: '#34d399', color: '#000', fontWeight: 'bold' }}>إضافة</button>
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>الأسماء</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
            {names.map((n, i) => (
              <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '14px' }}>
                {n}
                <button onClick={() => setNames(names.filter((_, idx) => idx !== i))} style={{ backgroundColor: 'rgba(255,0,0,0.8)', borderRadius: '50%', padding: '0 6px', fontSize: '14px', color: '#fff' }}>×</button>
              </span>
            ))}
          </div>
        </div>
      </main>
      <footer style={{ backgroundColor: '#333', padding: '16px 24px', position: 'sticky', bottom: 0, boxShadow: '0 -6px 20px rgba(0,0,0,0.3)', borderTop: '2px solid #222', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '16px', color: '#fff', textShadow: '0 0 4px #ccc' }}>تم تطويرها من قبل مطور البرمجيات صالح الدريدي</p>
      </footer>
    </div>
  );
}
