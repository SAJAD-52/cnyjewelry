import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VaultItem } from '../types';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const STORAGE_KEY = 'koo_jewelry_vault';
const GOLD_24K_PER_GRAM = 85.0;
const SILVER_PER_GRAM = 1.05;
const PLATINUM_PER_GRAM = 32.0;

const PURITY: Record<string, { name: string; factor: number; metal: string }> = {
  '24k': { name: '24K Gold', factor: 1.0, metal: 'gold' },
  '22k': { name: '22K Gold', factor: 0.916, metal: 'gold' },
  '18k': { name: '18K Gold', factor: 0.75, metal: 'gold' },
  '14k': { name: '14K Gold', factor: 0.583, metal: 'gold' },
  '10k': { name: '10K Gold', factor: 0.417, metal: 'gold' },
  '925': { name: 'Sterling Silver 925', factor: 0.925, metal: 'silver' },
  plat: { name: 'Platinum 950', factor: 0.95, metal: 'plat' },
};

export const VaultPage: React.FC = () => {
  const { isPro, openProModal, formatPrice, markFeatureUsed } = useApp();

  useEffect(() => {
    markFeatureUsed('vault');
  }, []);

  const [items, setItems] = useState<VaultItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [name, setName] = useState('');
  const [cat, setCat] = useState('Ring');
  const [karat, setKarat] = useState('14k');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');

  const saveVault = (newItems: VaultItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const calcMelt = (w: number, k: string) => {
    const p = PURITY[k] || PURITY['14k'];
    const pureWeight = w * p.factor;
    const rate = p.metal === 'gold' ? GOLD_24K_PER_GRAM : p.metal === 'silver' ? SILVER_PER_GRAM : PLATINUM_PER_GRAM;
    return { pureGrams: pureWeight, meltVal: pureWeight * rate };
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !weight) return;

    if (!isPro && items.length >= 2) {
      setMsg('Free tier limit reached (2 items max). Upgrade to Pro for unlimited storage!');
      openProModal(false);
      return;
    }

    const newItem: VaultItem = {
      id: Date.now().toString(),
      name: name.trim(),
      cat,
      karat,
      weight: parseFloat(weight),
      price: parseFloat(price) || 0,
      notes: notes.trim(),
      dateAdded: new Date().toISOString(),
    };

    saveVault([...items, newItem]);
    setName('');
    setWeight('');
    setPrice('');
    setNotes('');
    setMsg('Item successfully added to your jewelry box!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDeleteItem = (id: string) => {
    saveVault(items.filter((it) => it.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire jewelry box?')) {
      saveVault([]);
    }
  };

  let totalPureGold = 0;
  let totalMelt = 0;
  let totalRetail = 0;

  items.forEach((it) => {
    const c = calcMelt(it.weight, it.karat);
    if (it.karat.includes('k')) totalPureGold += c.pureGrams;
    totalMelt += c.meltVal;
    totalRetail += it.price || 0;
  });

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      {/* HEADER */}
      <div className="max-w-3xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Portfolio & Value Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">My Jewelry Box & Value Tracker</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Catalog your fine pieces, track pure gold grams, and monitor your collection's estimated melt and replacement value privately on your device.
        </p>
      </div>

      {/* PORTFOLIO STATS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Total Pieces</span>
          <p className="serif text-3xl gt mt-1">{items.length}</p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Fine Gold Weight</span>
          <p className="serif text-3xl gt mt-1">{totalPureGold.toFixed(1)} g</p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Est. Melt Value</span>
          <p className="serif text-3xl text-emerald-600 dark:text-emerald-400 mt-1">
            {formatPrice(totalMelt)}
          </p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <span className="muted text-xs uppercase tracking-wider">Est. Retail / Replacement</span>
          <p className="serif text-3xl gt mt-1">{formatPrice(totalRetail)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ADD ITEM FORM */}
        <div className="glass p-6 md:p-8 rounded-3xl h-fit no-print">
          <div className="flex items-center justify-between mb-4">
            <h2 className="serif text-2xl gt">Add to Jewelry Box</h2>
            <span className="chip text-xs">
              {isPro ? '⭐ Pro (Unlimited)' : `Free (${items.length}/2 items)`}
            </span>
          </div>

          <form onSubmit={handleAddItem} className="flex flex-col gap-3">
            <label className="fld">
              <span>Piece Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 14k Herringbone Chain"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="fld">
                <span>Category</span>
                <select value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option>Ring</option>
                  <option>Necklace</option>
                  <option>Bracelet</option>
                  <option>Earrings</option>
                  <option>Pendant</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="fld">
                <span>Metal & Karat</span>
                <select value={karat} onChange={(e) => setKarat(e.target.value)}>
                  <option value="24k">24K Gold (99.9%)</option>
                  <option value="22k">22K Gold (91.6%)</option>
                  <option value="18k">18K Gold (75.0%)</option>
                  <option value="14k">14K Gold (58.3%)</option>
                  <option value="10k">10K Gold (41.7%)</option>
                  <option value="925">Sterling Silver 925</option>
                  <option value="plat">Platinum 950</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="fld">
                <span>Weight (Grams)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 8.5"
                />
              </label>
              <label className="fld">
                <span>Retail / Paid ($)</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 450"
                />
              </label>
            </div>

            <label className="fld">
              <span>Notes or Gemstones</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Gift from 2024, 0.5ct diamond"
              />
            </label>

            <button type="submit" className="btn btn-gold w-full mt-2 shadow-md justify-center">
              + Add to My Box
            </button>
            {msg && <p className="text-xs text-center mt-2 text-rose-300">{msg}</p>}
          </form>

          {/* SPOT PRICE REFERENCE */}
          <div className="mt-6 pt-5 border-t border-rose-200/10 text-xs muted flex items-center justify-between">
            <span>Gold Reference Rate:</span>
            <span className="font-mono gt font-semibold">$85.00 / gram (24k)</span>
          </div>
        </div>

        {/* INVENTORY LIST */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="serif text-3xl gt">Your Collection Inventory</h2>
            <div className="flex gap-2 no-print">
              <button onClick={() => window.print()} className="btn btn-ghost text-xs">
                🖨️ Print Dossier
              </button>
              {items.length > 0 && (
                <button onClick={handleClearAll} className="btn btn-ghost text-xs text-red-400">
                  Clear All
                </button>
              )}
            </div>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-3">
              {items.map((it) => {
                const c = calcMelt(it.weight, it.karat);
                const pInfo = PURITY[it.karat] || PURITY['14k'];
                return (
                  <div key={it.id} className="glass p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="serif text-2xl gt font-semibold">{it.name}</span>
                        <span className="chip text-[10px] py-0.5 px-2">{it.cat}</span>
                      </div>
                      <p className="muted text-xs mt-1">
                        {pInfo.name} &middot; {it.weight}g &middot; {c.pureGrams.toFixed(1)}g pure {pInfo.metal}
                      </p>
                      {it.notes && <p className="text-xs text-rose-300/80 mt-1">{it.notes}</p>}
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <span className="text-xs muted block">Melt Scrap Value</span>
                        <b className="serif text-xl text-emerald-500">{formatPrice(c.meltVal)}</b>
                      </div>
                      {it.price > 0 && (
                        <div className="text-right">
                          <span className="text-xs muted block">Retail / Paid</span>
                          <b className="serif text-xl gt">{formatPrice(it.price)}</b>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteItem(it.id)}
                        className="text-red-400 hover:text-red-300 text-sm p-1 no-print cursor-pointer bg-transparent border-0"
                        title="Delete Piece"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass p-12 text-center rounded-3xl">
              <div className="text-4xl gt mb-2">💎</div>
              <h3 className="serif text-2xl gt">Your Jewelry Box is Empty</h3>
              <p className="muted text-sm mt-1 max-w-sm mx-auto">
                Add your first ring, chain or bracelet using the form on the left to see your collection's value.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FAQS */}
      <section className="mt-20 no-print">
        <h2 className="text-3xl sm:text-4xl gt mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-3 max-w-3xl">
          <details className="faq">
            <summary>How is melt value calculated?</summary>
            <p className="muted mt-3">
              Melt value is the pure weight of precious metal multiplied by the current spot market price. It represents the intrinsic scrap metal value without brand markups or gemstone value.
            </p>
          </details>
          <details className="faq">
            <summary>Are my jewelry photos or prices saved to a public server?</summary>
            <p className="muted mt-3">
              No. All data is saved inside your private browser storage. Nothing leaves your personal device.
            </p>
          </details>
          <details className="faq">
            <summary>How do I unlock unlimited pieces?</summary>
            <p className="muted mt-3">
              Upgrade to McGee Jewelry Pro for $6/month to store unlimited pieces and generate printable insurance dossiers.
            </p>
          </details>
        </div>
      </section>

      <AdPromoBanner />
    </main>
  );
};
