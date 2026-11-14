import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

interface BeadSpec {
  id: string;
  name: string;
  mm: number;
  hole: number;
  priceUsd: number;
  weightG: number;
  color: string;
}

interface SavedPreset {
  name: string;
  project: string;
  bodyCm: number;
  easeMm: number;
  mirror: boolean;
  motif: BeadSpec[];
}

const PRESET_KEY = 'koo_beading_presets_v1';

const BEAD_LIBRARY: BeadSpec[] = [
  { id: 'seed11', name: 'Seed Bead 11/0', mm: 2.0, hole: 0.8, priceUsd: 0.03, weightG: 0.02, color: '#f3e2b3' },
  { id: 'seed8', name: 'Seed Bead 8/0', mm: 3.0, hole: 1.1, priceUsd: 0.05, weightG: 0.04, color: '#e8d7c3' },
  { id: 'gold3', name: '14k GF Spacer', mm: 3.0, hole: 1.0, priceUsd: 0.35, weightG: 0.08, color: '#e5c16c' },
  { id: 'gold4', name: '14k GF Round', mm: 4.0, hole: 1.2, priceUsd: 0.55, weightG: 0.14, color: '#d8ab4c' },
  { id: 'pearl6', name: 'Freshwater Pearl', mm: 6.0, hole: 0.9, priceUsd: 0.85, weightG: 0.32, color: '#f8f2ea' },
  { id: 'pearl8', name: 'Baroque Pearl', mm: 8.0, hole: 1.0, priceUsd: 1.45, weightG: 0.68, color: '#f3ebe0' },
  { id: 'roseq6', name: 'Rose Quartz', mm: 6.0, hole: 1.0, priceUsd: 0.32, weightG: 0.30, color: '#e8b4b8' },
  { id: 'roseq8', name: 'Rose Quartz 8mm', mm: 8.0, hole: 1.0, priceUsd: 0.52, weightG: 0.72, color: '#dca0a8' },
  { id: 'carn6', name: 'Carnelian Agate', mm: 6.0, hole: 1.0, priceUsd: 0.34, weightG: 0.30, color: '#b54a32' },
  { id: 'onyx6', name: 'Black Onyx', mm: 6.0, hole: 1.0, priceUsd: 0.28, weightG: 0.30, color: '#28262c' },
  { id: 'lapis8', name: 'Lapis Lazuli', mm: 8.0, hole: 1.0, priceUsd: 0.75, weightG: 0.75, color: '#29488d' },
  { id: 'lab8', name: 'Labradorite', mm: 8.0, hole: 1.0, priceUsd: 0.65, weightG: 0.74, color: '#6b858d' },
];

const STARTERS: Record<string, { mirror: boolean; slots: string[] }> = {
  pearl_gold: { mirror: false, slots: ['pearl6', 'gold3', 'pearl6', 'gold3', 'pearl8', 'gold3'] },
  rose_carnelian: { mirror: true, slots: ['roseq6', 'gold3', 'carn6', 'pearl8'] },
  onyx_minimal: { mirror: false, slots: ['onyx6', 'onyx6', 'onyx6', 'gold4'] },
  seed_rhythm: { mirror: true, slots: ['seed8', 'seed11', 'gold3', 'pearl6'] },
};

const CLASP_OPTIONS = [
  { mm: 0, label: 'None — Stretch Knot (0 mm)', priceUsd: 0 },
  { mm: 10, label: 'Small Spring Ring (10 mm)', priceUsd: 1.4 },
  { mm: 12, label: '14k GF Lobster Clasp (12 mm)', priceUsd: 3.8 },
  { mm: 15, label: 'Toggle Bar Clasp (15 mm)', priceUsd: 4.5 },
  { mm: 18, label: 'Magnetic Bayonet (18 mm)', priceUsd: 5.2 },
];

const CORD_OPTIONS = [
  { diamMm: 0.38, label: '7-Strand Beading Wire (0.38 mm)', tailMm: 60, priceUsd: 0.45 },
  { diamMm: 0.46, label: '49-Strand Fine Wire (0.46 mm)', tailMm: 70, priceUsd: 0.65 },
  { diamMm: 0.80, label: 'Clear Stretch Elastic (0.80 mm)', tailMm: 120, priceUsd: 0.25 },
  { diamMm: 0.50, label: 'Knotted Silk Thread (0.50 mm)', tailMm: 140, priceUsd: 0.55 },
];

export const BeadingPage: React.FC = () => {
  const { isPro, openProModal, formatPrice, markFeatureUsed, navigate } = useApp();

  useEffect(() => {
    markFeatureUsed('beading');
  }, []);

  const [project, setProject] = useState('bracelet_clasp');
  const [bodyCm, setBodyCm] = useState(16.0);
  const [easeMm, setEaseMm] = useState(15);
  const [claspIdx, setClaspIdx] = useState(2);
  const [cordIdx, setCordIdx] = useState(0);
  const [mirror, setMirror] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'loop'>('board');
  const [selectedSeqIdx, setSelectedSeqIdx] = useState<number | null>(null);
  const [motif, setMotif] = useState<BeadSpec[]>(() =>
    STARTERS.pearl_gold.slots.map((id) => ({ ...(BEAD_LIBRARY.find((b) => b.id === id) || BEAD_LIBRARY[4]) }))
  );

  const [customName, setCustomName] = useState('');
  const [customMm, setCustomMm] = useState(6);
  const [customHole, setCustomHole] = useState(1.0);
  const [customPrice, setCustomPrice] = useState(0.45);
  const [customColor, setCustomColor] = useState('#3d8b6c');

  const [presets, setPresets] = useState<SavedPreset[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PRESET_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const clasp = CLASP_OPTIONS[claspIdx] || CLASP_OPTIONS[2];
  const cord = CORD_OPTIONS[cordIdx] || CORD_OPTIONS[0];

  const layout = useMemo(() => {
    const activeEase = project === 'bracelet_stretch' && easeMm === 0 ? 15 : easeMm;
    const targetMm = Math.round(bodyCm * 10) + activeEase;
    const effectiveClaspMm = project === 'bracelet_stretch' ? 0 : clasp.mm;
    const netSpanMm = Math.max(40, targetMm - effectiveClaspMm);

    const cycle = !mirror || motif.length < 2 ? motif : [...motif, ...motif.slice(0, -1).reverse()];
    const seq: BeadSpec[] = [];
    let usedMm = 0;

    if (cycle.length > 0) {
      let i = 0;
      while (i < 450) {
        const b = cycle[i % cycle.length];
        if (usedMm + b.mm <= netSpanMm + 0.01) {
          seq.push(b);
          usedMm += b.mm;
          i++;
        } else {
          break;
        }
      }
    }

    const gapMm = Math.max(0, netSpanMm - usedMm);
    const cutCordMm = Math.round(netSpanMm + cord.tailMm);
    const totalWeightG = seq.reduce((s, b) => s + b.weightG, 0);
    const beadsCostUsd = seq.reduce((s, b) => s + b.priceUsd, 0);
    const findingsCostUsd =
      (project === 'bracelet_stretch' ? 0 : clasp.priceUsd) + cord.priceUsd + (project === 'bracelet_stretch' ? 0.1 : 0.4);
    const totalCostUsd = beadsCostUsd + findingsCostUsd;

    const minHoleMm = seq.reduce((m, b) => Math.min(m, b.hole), 99);
    const maxBeadMm = seq.reduce((m, b) => Math.max(m, b.mm), 0);
    const requiredHole = project !== 'bracelet_stretch' && cord.diamMm <= 0.55 ? cord.diamMm * 2 : cord.diamMm * 1.1;

    const bomMap = new Map<string, { name: string; spec: string; qty: number; spanMm: number; costUsd: number; color: string }>();
    seq.forEach((b) => {
      const key = `${b.name}|${b.mm}|${b.priceUsd}`;
      const existing = bomMap.get(key);
      if (existing) {
        existing.qty += 1;
        existing.spanMm += b.mm;
        existing.costUsd += b.priceUsd;
      } else {
        bomMap.set(key, {
          name: b.name,
          spec: `${b.mm.toFixed(1)} mm (hole ${b.hole.toFixed(1)} mm)`,
          qty: 1,
          spanMm: b.mm,
          costUsd: b.priceUsd,
          color: b.color,
        });
      }
    });

    return {
      effectiveClaspMm,
      activeEase,
      targetMm,
      netSpanMm,
      seq,
      usedMm,
      gapMm,
      cutCordMm,
      totalWeightG,
      beadsCostUsd,
      findingsCostUsd,
      totalCostUsd,
      minHoleMm: minHoleMm === 99 ? 0 : minHoleMm,
      maxBeadMm,
      requiredHole,
      motifRepeats: cycle.length > 0 ? seq.length / cycle.length : 0,
      bomList: Array.from(bomMap.values()),
    };
  }, [project, bodyCm, easeMm, clasp, cord, mirror, motif]);

  const requirePro = (fn: () => void) => {
    if (isPro) fn();
    else openProModal(false);
  };

  const handleSavePreset = () => {
    requirePro(() => {
      const next: SavedPreset[] = [
        {
          name: `${project.replace('_', ' ')} · ${bodyCm.toFixed(1)} cm (${new Date().toLocaleDateString()})`,
          project,
          bodyCm,
          easeMm,
          mirror,
          motif: [...motif],
        },
        ...presets,
      ].slice(0, 15);
      setPresets(next);
      localStorage.setItem(PRESET_KEY, JSON.stringify(next));
    });
  };

  const handleExportCsv = () => {
    requirePro(() => {
      const rows = [
        ['Component', 'Specification', 'Quantity', 'Span (mm)', 'Est Cost (Display)', 'Est Cost (USD)'],
        ...layout.bomList.map((it) => [
          `"${it.name.replace(/"/g, '""')}"`,
          `"${it.spec.replace(/"/g, '""')}"`,
          String(it.qty),
          it.spanMm.toFixed(1),
          `"${formatPrice(it.costUsd)}"`,
          it.costUsd.toFixed(2),
        ]),
        [
          `"${cord.label}"`,
          `"Cut length incl. ${cord.tailMm} mm tails"`,
          `${layout.cutCordMm} mm`,
          '0',
          `"${formatPrice(cord.priceUsd)}"`,
          cord.priceUsd.toFixed(2),
        ],
      ];
      const csv = rows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mcgee-beading-bom-${layout.targetMm}mm.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  };

  const handlePrintBlueprint = () => {
    requirePro(() => window.print());
  };

  const mapU = (offsetMm: number) => {
    const maxHalf = Math.max(120, layout.netSpanMm / 2 + 20);
    const u = Math.max(-1, Math.min(1, offsetMm / maxHalf));
    if (Math.abs(u) <= 0.65) {
      const theta = (u / 0.65) * (Math.PI / 2);
      return { x: 320 + 235 * Math.sin(theta), y: 185 + 98 * Math.cos(theta) };
    }
    const arm = (Math.abs(u) - 0.65) / 0.35;
    return { x: u > 0 ? 555 : 85, y: 185 - arm * 136 };
  };

  const pxScale = Math.min(2.6, Math.max(1.15, 580 / Math.max(120, layout.netSpanMm)));

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-8 sm:pt-10">
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="chip text-xs">Fit &amp; Craft Studio · Millimeter Beading Board</span>
          <span className="chip text-xs">
            {isPro ? '⭐ Pro Active · Presets & Exports Unlocked' : '1 Free Try · Pro Unlocks Presets & Exports'}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Beading Board &amp; Bracelet Pattern Designer</h1>
        <p className="muted text-base sm:text-lg mt-3 max-w-3xl">
          Lay out repeating bead motifs around a calibrated millimeter channel, inspect wrist curvature clearance, and compute your exact bead count, cord cut length, and BOM cost.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 flex flex-col gap-5">
          <div className="glass glow p-5 sm:p-6 rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="serif text-2xl sm:text-3xl gt">Millimeter Design Board</h2>
                <p className="muted text-xs mt-0.5 tabular-nums">Center focal alignment · Proportional bead diameters</p>
              </div>
              <div className="flex flex-wrap gap-1.5 no-print">
                <button
                  type="button"
                  onClick={() => setViewMode('board')}
                  className="chip text-xs py-2 px-3.5"
                  aria-selected={viewMode === 'board'}
                >
                  U-Board Channel
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('loop')}
                  className="chip text-xs py-2 px-3.5"
                  aria-selected={viewMode === 'loop'}
                >
                  Wrist Loop
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-200/20 p-3 sm:p-4 bg-black/20">
              <svg viewBox="0 0 640 320" className="w-full h-auto block" role="img" aria-label="Interactive beading board">
                {viewMode === 'board' ? (
                  <>
                    <path d="M 85 46 L 85 185 A 235 98 0 0 0 555 185 L 555 46" fill="none" stroke="rgba(183,110,121,0.18)" strokeWidth="34" strokeLinecap="round" />
                    <path d="M 85 46 L 85 185 A 235 98 0 0 0 555 185 L 555 46" fill="none" stroke="rgba(243,226,179,0.28)" strokeWidth="1.5" />
                    <text x="320" y="34" textAnchor="middle" fill="#b76e79" fontSize="13" fontFamily="Cormorant Garamond,serif">
                      0 mm Center Focal Point · Span {layout.netSpanMm} mm
                    </text>
                    {(() => {
                      let acc = 0;
                      const start = -layout.usedMm / 2;
                      return layout.seq.map((b, idx) => {
                        const pt = mapU(start + acc + b.mm / 2);
                        acc += b.mm;
                        const r = Math.max(3, (b.mm * pxScale) / 2);
                        return (
                          <circle
                            key={idx}
                            cx={pt.x}
                            cy={pt.y}
                            r={r}
                            fill={b.color}
                            stroke={selectedSeqIdx === idx ? '#f3e2b3' : 'rgba(255,255,255,0.45)'}
                            strokeWidth={selectedSeqIdx === idx ? 2 : 0.7}
                            className="cursor-pointer"
                            onClick={() => setSelectedSeqIdx(idx)}
                          >
                            <title>{`#${idx + 1} ${b.name} (${b.mm} mm)`}</title>
                          </circle>
                        );
                      });
                    })()}
                  </>
                ) : (
                  <>
                    <circle cx="320" cy="160" r="108" fill="none" stroke="rgba(183,110,121,0.35)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="320" y="155" textAnchor="middle" fill="#b76e79" fontSize="22" fontFamily="Cormorant Garamond,serif">
                      {(layout.targetMm / 10).toFixed(1)} cm
                    </text>
                    <text x="320" y="175" textAnchor="middle" fill="#94a3b8" fontSize="11">
                      {layout.seq.length} beads · {layout.usedMm.toFixed(1)} mm span
                    </text>
                    {(() => {
                      const totalArc = layout.netSpanMm + layout.effectiveClaspMm;
                      const pxPerMm = (2 * Math.PI * 108) / Math.max(100, totalArc);
                      let cur = layout.effectiveClaspMm / 2 + layout.gapMm / 2;
                      return layout.seq.map((b, idx) => {
                        const mid = cur + b.mm / 2;
                        cur += b.mm;
                        const ang = -Math.PI / 2 + (mid / totalArc) * 2 * Math.PI;
                        const bx = 320 + 108 * Math.cos(ang);
                        const by = 160 + 108 * Math.sin(ang);
                        return (
                          <circle
                            key={idx}
                            cx={bx}
                            cy={by}
                            r={Math.max(3, (b.mm * pxPerMm) / 2)}
                            fill={b.color}
                            stroke={selectedSeqIdx === idx ? '#f3e2b3' : 'rgba(255,255,255,0.45)'}
                            strokeWidth={selectedSeqIdx === idx ? 2 : 0.7}
                            className="cursor-pointer"
                            onClick={() => setSelectedSeqIdx(idx)}
                          >
                            <title>{`#${idx + 1} ${b.name} (${b.mm} mm)`}</title>
                          </circle>
                        );
                      });
                    })()}
                  </>
                )}
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 tabular-nums">
              <div className="stat">
                <span className="muted text-[11px] uppercase">Beads Required</span>
                <b className="gt text-2xl">{layout.seq.length}</b>
                <span className="muted text-[11px]">{layout.motifRepeats.toFixed(1)} cycles</span>
              </div>
              <div className="stat">
                <span className="muted text-[11px] uppercase">Net Bead Span</span>
                <b className="gt text-2xl">{layout.usedMm.toFixed(1)} mm</b>
                <span className="muted text-[11px]">{layout.gapMm.toFixed(1)} mm gap</span>
              </div>
              <div className="stat">
                <span className="muted text-[11px] uppercase">Cut Wire / Cord</span>
                <b className="gt text-2xl">{layout.cutCordMm} mm</b>
                <span className="muted text-[11px]">{(layout.cutCordMm / 25.4).toFixed(1)} in total</span>
              </div>
              <div className="stat">
                <span className="muted text-[11px] uppercase">Est. Cost</span>
                <b className="gt text-2xl">{formatPrice(layout.totalCostUsd)}</b>
                <span className="muted text-[11px]">Est. {layout.totalWeightG.toFixed(1)} g</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-rose-200/15 flex flex-wrap items-center justify-between gap-2 no-print">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleSavePreset} className="btn btn-ghost text-xs py-2 px-4">
                  Save Preset (Pro)
                </button>
                <button type="button" onClick={handleExportCsv} className="btn btn-ghost text-xs py-2 px-4">
                  Export BOM CSV (Pro)
                </button>
              </div>
              <button type="button" onClick={handlePrintBlueprint} className="btn btn-gold text-xs py-2 px-5">
                Print / Save PDF Blueprint (Pro)
              </button>
            </div>
          </div>

          <div className="glass p-5 sm:p-6 rounded-3xl">
            <h2 className="serif text-2xl gt mb-3">Bill of Materials (BOM)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm tabular-nums">
                <thead>
                  <tr className="text-[11px] uppercase muted border-b border-rose-200/20">
                    <th className="pb-2">Component</th>
                    <th className="pb-2">Spec</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Span</th>
                    <th className="pb-2 text-right">Est. Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {layout.bomList.map((it) => (
                    <tr key={it.name + it.spec} className="border-t border-rose-200/10">
                      <td className="py-2 font-medium">{it.name}</td>
                      <td className="py-2 muted">{it.spec}</td>
                      <td className="py-2 text-right">{it.qty}</td>
                      <td className="py-2 text-right muted">{it.spanMm.toFixed(1)} mm</td>
                      <td className="py-2 text-right gt font-medium">{formatPrice(it.costUsd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 flex flex-col gap-5 no-print">
          <div className="glass p-5 sm:p-6 rounded-3xl">
            <h2 className="serif text-2xl gt mb-4">1. Wrist Size &amp; Stringing Spec</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="fld">
                <span>Project Type</span>
                <select
                  value={project}
                  onChange={(e) => {
                    const v = e.target.value;
                    setProject(v);
                    if (v === 'bracelet_stretch') {
                      setClaspIdx(0);
                      setCordIdx(2);
                    }
                    if (v === 'necklace' && bodyCm < 34) setBodyCm(42);
                    if (v !== 'necklace' && bodyCm > 28) setBodyCm(16);
                  }}
                >
                  <option value="bracelet_clasp">Clasp Bracelet</option>
                  <option value="bracelet_stretch">Stretch Bracelet</option>
                  <option value="anklet">Anklet</option>
                  <option value="necklace">Beaded Necklace</option>
                </select>
              </label>
              <label className="fld">
                <span>Drape Fit</span>
                <select value={easeMm} onChange={(e) => setEaseMm(Number(e.target.value))}>
                  <option value={10}>Snug (+1.0 cm)</option>
                  <option value={15}>Comfort (+1.5 cm)</option>
                  <option value={25}>Loose (+2.5 cm)</option>
                  <option value={0}>Exact (+0 cm)</option>
                </select>
              </label>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{project === 'necklace' ? 'Chain length' : 'Wrist circumference'}</span>
                <b className="gt">{bodyCm.toFixed(1)} cm ({(bodyCm / 2.54).toFixed(2)} in)</b>
              </div>
              <input
                type="range"
                min={project === 'necklace' ? 34 : 13}
                max={project === 'necklace' ? 65 : 23}
                step={0.5}
                value={bodyCm}
                onChange={(e) => setBodyCm(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="fld">
                <span>Clasp</span>
                <select value={claspIdx} onChange={(e) => setClaspIdx(Number(e.target.value))}>
                  {CLASP_OPTIONS.map((c, idx) => (
                    <option key={c.label} value={idx}>{c.label}</option>
                  ))}
                </select>
              </label>
              <label className="fld">
                <span>Cord</span>
                <select value={cordIdx} onChange={(e) => setCordIdx(Number(e.target.value))}>
                  {CORD_OPTIONS.map((c, idx) => (
                    <option key={c.label} value={idx}>{c.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="inline-flex items-center gap-2 text-xs cursor-pointer mb-3">
              <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} />
              <span>Mirror motif (A-B-C-B-A)</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {Object.entries(STARTERS).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  className="chip text-xs py-1.5 px-3"
                  onClick={() => {
                    setMirror(v.mirror);
                    setMotif(v.slots.map((id) => ({ ...(BEAD_LIBRARY.find((b) => b.id === id) || BEAD_LIBRARY[4]) })));
                  }}
                >
                  {k.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-5 sm:p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="serif text-2xl gt">2. Repeating Motif</h2>
              <button type="button" onClick={() => setMotif([])} className="text-xs muted underline bg-transparent border-0 cursor-pointer">
                Reset
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {motif.map((b, idx) => (
                <div key={idx} className="p-2 rounded-xl border border-rose-200/20 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ background: b.color }} />
                    {idx + 1}. {b.name} ({b.mm}mm)
                  </span>
                  <button
                    type="button"
                    className="text-red-400 bg-transparent border-0 cursor-pointer"
                    onClick={() => setMotif((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-5 sm:p-6 rounded-3xl">
            <h2 className="serif text-2xl gt mb-3">3. Atelier Bead Tray</h2>
            <div className="grid grid-cols-2 gap-2">
              {BEAD_LIBRARY.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => motif.length < 14 && setMotif((prev) => [...prev, { ...b }])}
                  className="p-2 rounded-xl border border-rose-200/25 flex items-center gap-2 text-left text-xs cursor-pointer bg-transparent text-inherit"
                >
                  <span className="w-4 h-4 rounded-full shrink-0 border border-white/40" style={{ background: b.color }} />
                  <span className="truncate">{b.name} ({b.mm}mm)</span>
                </button>
              ))}
            </div>

            <form
              className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-rose-200/15 text-xs"
              onSubmit={(e) => {
                e.preventDefault();
                if (motif.length >= 14) return;
                setMotif((prev) => [
                  ...prev,
                  {
                    id: `custom-${Date.now()}`,
                    name: customName.trim() || 'Custom Bead',
                    mm: customMm,
                    hole: customHole,
                    priceUsd: customPrice,
                    weightG: Number((0.0014 * Math.pow(customMm, 3)).toFixed(2)),
                    color: customColor,
                  },
                ]);
                setCustomName('');
              }}
            >
              <input className="col-span-2 p-2 rounded-lg border border-rose-200/30 bg-transparent" placeholder="Custom bead name" value={customName} onChange={(e) => setCustomName(e.target.value)} required />
              <input className="p-2 rounded-lg border border-rose-200/30 bg-transparent" type="number" step="0.5" min="1.5" max="20" value={customMm} onChange={(e) => setCustomMm(Number(e.target.value))} />
              <input className="p-2 rounded-lg border border-rose-200/30 bg-transparent" type="number" step="0.1" min="0.4" max="5" value={customHole} onChange={(e) => setCustomHole(Number(e.target.value))} />
              <input className="p-2 rounded-lg border border-rose-200/30 bg-transparent" type="number" step="0.05" min="0" value={customPrice} onChange={(e) => setCustomPrice(Number(e.target.value))} />
              <input className="p-1 rounded-lg border border-rose-200/30 bg-transparent h-9" type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} />
              <button type="submit" className="btn btn-gold col-span-2 text-xs py-2">+ Add Custom Bead</button>
            </form>
          </div>
        </aside>
      </div>

      <section className="glass p-6 rounded-3xl mt-10 no-print">
        <h2 className="serif text-3xl gt mb-3">Related Sizing &amp; Craft Studios</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => navigate('sizing')} className="chip text-xs">Ring &amp; Bracelet Sizer</button>
          <button type="button" onClick={() => navigate('layering')} className="chip text-xs">Necklace Layering</button>
          <button type="button" onClick={() => navigate('vault')} className="chip text-xs">My Jewelry Box</button>
          <button type="button" onClick={() => navigate('care')} className="chip text-xs">Care Guide</button>
        </div>
      </section>

      <AdPromoBanner />
    </main>
  );
};
