import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VaultItem, WearLogItem, WeeklyPlan } from '../types';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PLAN_KEY = 'koo_weekly_plan';
const WEAR_KEY = 'koo_wear_history';
const VAULT_KEY = 'koo_jewelry_vault';

export const PlannerPage: React.FC = () => {
  const { isPro, openProModal, formatPrice, markFeatureUsed, navigate } = useApp();

  useEffect(() => {
    markFeatureUsed('planner');
  }, []);

  const [vaultItems] = useState<VaultItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    try {
      return JSON.parse(localStorage.getItem(PLAN_KEY) || '{}');
    } catch {
      return {};
    }
  });

  const [wears, setWears] = useState<WearLogItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(WEAR_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedVaultIndex, setSelectedVaultIndex] = useState<string>('');
  const [customPiece, setCustomPiece] = useState('');
  const [vibe, setVibe] = useState('Casual Everyday');
  const [wearMsg, setWearMsg] = useState('');

  const savePlan = (newPlan: WeeklyPlan) => {
    setPlan(newPlan);
    localStorage.setItem(PLAN_KEY, JSON.stringify(newPlan));
  };

  const saveWears = (newWears: WearLogItem[]) => {
    setWears(newWears);
    localStorage.setItem(WEAR_KEY, JSON.stringify(newWears));
  };

  const handleSetDayPlan = (day: string, idx: number) => {
    if (!isPro && idx >= 2) {
      openProModal(false);
      return;
    }
    const current = plan[day] || '';
    const input = window.prompt(`Assign jewelry for ${day}:`, current);
    if (input !== null) {
      savePlan({ ...plan, [day]: input.trim() });
    }
  };

  const handleLogWear = (e: React.FormEvent) => {
    e.preventDefault();
    let piece = customPiece.trim();
    let pIdx: number | undefined;

    if (selectedVaultIndex !== '') {
      const idx = parseInt(selectedVaultIndex, 10);
      if (vaultItems[idx]) {
        piece = vaultItems[idx].name;
        pIdx = idx;
      }
    }

    if (!piece) {
      setWearMsg('Please choose a piece from your box or type a custom one.');
      return;
    }

    const newLog: WearLogItem = {
      id: Date.now().toString(),
      date,
      pieceName: piece,
      pieceIndex: pIdx,
      vibe,
    };

    saveWears([newLog, ...wears]);
    setCustomPiece('');
    setSelectedVaultIndex('');
    setWearMsg('Wear logged successfully!');
    setTimeout(() => setWearMsg(''), 3000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all 30-day wear history?')) {
      saveWears([]);
    }
  };

  // Stats calculation
  const plannedCount = DAYS.filter((d) => plan[d] && plan[d].length > 0).length;

  // Filter wears in last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const recentWears = wears.filter((w) => new Date(w.date) >= thirtyDaysAgo);

  // Piece counts
  const pieceCounts: Record<string, number> = {};
  recentWears.forEach((w) => {
    pieceCounts[w.pieceName] = (pieceCounts[w.pieceName] || 0) + 1;
  });

  let topPieceName = 'None yet';
  let topCount = 0;
  Object.keys(pieceCounts).forEach((name) => {
    if (pieceCounts[name] > topCount) {
      topCount = pieceCounts[name];
      topPieceName = `${name} (${topCount}x)`;
    }
  });

  // Unique pieces table
  const uniqueLoggedPieces = Object.keys(pieceCounts).map((name) => {
    const wearCount = pieceCounts[name];
    const matchVault = vaultItems.find((v) => v.name.toLowerCase() === name.toLowerCase());
    const estPrice = matchVault ? matchVault.price : 0;
    const cpw = estPrice > 0 ? estPrice / wearCount : 0;
    return { name, wearCount, estPrice, cpw };
  });

  const totalPrices = uniqueLoggedPieces.reduce((acc, p) => acc + p.estPrice, 0);
  const totalWearTimes = uniqueLoggedPieces.reduce((acc, p) => acc + p.wearCount, 0);
  const avgCpw = totalWearTimes > 0 && totalPrices > 0 ? totalPrices / totalWearTimes : 0;

  // Neglected pieces in vault (0 wears)
  const neglectedPieces = vaultItems.filter(
    (v) => !Object.keys(pieceCounts).some((k) => k.toLowerCase() === v.name.toLowerCase())
  );

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      {/* HEADER */}
      <div className="max-w-3xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Styling & Capsule Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Jewelry Lookbook & Wear Planner</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Organize what jewelry you wear every day, track your 30-day wearing history, and discover your true Cost-Per-Wear.
        </p>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Days Planned</span>
          <p className="serif text-3xl gt mt-1">{plannedCount} / 7</p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">30-Day Wears</span>
          <p className="serif text-3xl gt mt-1">{recentWears.length}</p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Top Worn Piece</span>
          <p className="serif text-xl gt mt-1 truncate">{topPieceName}</p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Avg Cost Per Wear</span>
          <p className="serif text-3xl text-emerald-600 dark:text-emerald-400 mt-1">
            {formatPrice(avgCpw)}
          </p>
        </div>
      </div>

      {/* SECTION 1: WEEKLY PLANNER */}
      <section className="mb-14">
        <div className="flex flex-wrap items-center justify-between mb-5 gap-3">
          <div>
            <h2 className="serif text-3xl gt">This Week's Styling Plan</h2>
            <p className="muted text-xs mt-0.5">Assign your rings, necklaces, and earrings to your outfits this week.</p>
          </div>
          <div className="flex gap-2 no-print">
            <span className="chip text-xs">
              {isPro ? '⭐ Pro (Unlimited Days)' : 'Free Tier (2 days max)'}
            </span>
            <button onClick={() => window.print()} className="btn btn-ghost text-xs">
              🖨️ Print Week
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS.map((d, idx) => {
            const isLockedDay = !isPro && idx >= 2;
            const item = plan[d] || '';

            return (
              <div
                key={d}
                onClick={() => handleSetDayPlan(d, idx)}
                className={`glass p-4 rounded-2xl tool-card flex flex-col justify-between min-h-[140px] cursor-pointer ${
                  isLockedDay ? 'opacity-60' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-medium text-rose-300">{d.slice(0, 3)}</span>
                    {isLockedDay && <span className="text-xs">🔒</span>}
                  </div>
                  <p className="serif text-lg gt mt-2 font-medium leading-tight">
                    {item || <span className="muted text-xs italic">Tap to assign</span>}
                  </p>
                </div>
                <div className="text-[11px] text-rose-400/80 mt-2 flex items-center justify-between pt-2 border-t border-rose-200/10">
                  <span>{item ? 'Edit' : '+ Add'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: 30-DAY WEAR LOG & COST PER WEAR */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* LOG WEAR FORM */}
        <div className="glass p-6 md:p-8 rounded-3xl h-fit no-print">
          <h3 className="serif text-2xl gt mb-2">Log Today's Jewelry</h3>
          <p className="muted text-xs mb-4">
            Record what you wore today to update your 30-day history and lower your Cost-Per-Wear.
          </p>

          <form onSubmit={handleLogWear} className="flex flex-col gap-3">
            <label className="fld">
              <span>Date</span>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label className="fld">
              <span>Select from Jewelry Box</span>
              <select
                value={selectedVaultIndex}
                onChange={(e) => {
                  setSelectedVaultIndex(e.target.value);
                  if (e.target.value !== '') setCustomPiece('');
                }}
              >
                <option value="">-- Choose from your box --</option>
                {vaultItems.map((it, i) => (
                  <option key={it.id} value={i}>
                    {it.name} ({it.cat})
                  </option>
                ))}
              </select>
            </label>

            <label className="fld">
              <span>Or type custom piece</span>
              <input
                value={customPiece}
                onChange={(e) => {
                  setCustomPiece(e.target.value);
                  if (e.target.value) setSelectedVaultIndex('');
                }}
                placeholder="e.g. Gold Huggie Earrings"
              />
            </label>

            <label className="fld">
              <span>Occasion / Outfit</span>
              <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
                <option>Work / Professional</option>
                <option>Casual Everyday</option>
                <option>Date Night / Dinner</option>
                <option>Weekend Brunch</option>
                <option>Special Event / Gala</option>
              </select>
            </label>

            <button type="submit" className="btn btn-gold w-full mt-3 justify-center shadow-md">
              + Log Wear
            </button>
            {wearMsg && <p className="text-xs text-center mt-2 text-rose-300">{wearMsg}</p>}
          </form>

          <div className="mt-6 pt-5 border-t border-rose-200/10">
            <button
              onClick={() => navigate('vault')}
              className="muted hover:text-white text-xs block text-center w-full bg-transparent border-0 cursor-pointer"
            >
              &rarr; Manage pieces in My Jewelry Box
            </button>
          </div>
        </div>

        {/* 30-DAY HISTORY & COST PER WEAR TABLE */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="serif text-3xl gt">30-Day Wear & Cost-Per-Wear (CPW)</h3>
            {wears.length > 0 && (
              <button onClick={handleClearHistory} className="btn btn-ghost text-xs text-red-400 no-print">
                Clear Log
              </button>
            )}
          </div>

          <div className="glass p-6 rounded-3xl overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs muted uppercase tracking-wider border-b border-rose-200/20">
                  <th className="pb-3 px-3">Jewelry Piece</th>
                  <th className="pb-3 px-3">30-Day Wears</th>
                  <th className="pb-3 px-3">Est. Price</th>
                  <th className="pb-3 px-3">Cost Per Wear</th>
                </tr>
              </thead>
              <tbody>
                {uniqueLoggedPieces.map((p) => (
                  <tr key={p.name} className="border-t border-rose-200/10">
                    <td className="py-3 px-3 serif text-lg gt font-medium">{p.name}</td>
                    <td className="py-3 px-3">{p.wearCount} wears</td>
                    <td className="py-3 px-3 muted">{p.estPrice > 0 ? formatPrice(p.estPrice) : '—'}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-500">
                      {p.cpw > 0 ? `${formatPrice(p.cpw)} / wear` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {uniqueLoggedPieces.length === 0 && (
              <div className="text-center py-8 muted text-xs">
                No pieces logged in the last 30 days. Log your first wear on the left!
              </div>
            )}
          </div>

          {/* FORGOTTEN JEWELS ALERT */}
          {neglectedPieces.length > 0 && (
            <div className="glass p-5 rounded-2xl mt-5 border border-amber-300/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="serif text-xl gt">Forgotten Treasures in Your Box</h4>
                  <p className="muted text-xs mt-0.5">
                    These pieces have not been worn this month: {neglectedPieces.map((p) => p.name).join(', ')}.
                    Consider styling them this week to lower their Cost-Per-Wear!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <AdPromoBanner />
    </main>
  );
};
