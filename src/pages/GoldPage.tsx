import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const KARAT_TABLE = [
  { k: 24, purity: '99.9%', feel: 'Deep yellow, very soft', best: 'Investment bars and traditional bridal sets' },
  { k: 22, purity: '91.7%', feel: 'Rich yellow, soft', best: 'Traditional, ceremonial, and high-karat heirloom pieces' },
  { k: 18, purity: '75.0%', feel: 'Warm, fairly durable', best: 'Fine diamond rings, luxury Swiss watches, and custom heirlooms' },
  { k: 14, purity: '58.3%', feel: 'Balanced, tough, scratch-resistant', best: 'Everyday stacking rings, tennis bracelets, and delicate chains' },
  { k: 10, purity: '41.7%', feel: 'Paler, very hard', best: 'Budget-friendly daily jewelry that withstands active wear' },
  { k: 9, purity: '37.5%', feel: 'Pale yellow, very hard', best: 'Standard alloy in the UK, Australia, and European markets' },
];

export const GoldPage: React.FC = () => {
  const { markFeatureUsed, currentLocale, formatPrice } = useApp();

  useEffect(() => {
    markFeatureUsed('gold');
  }, []);

  const [karat, setKarat] = useState<number>(18);
  const [weight, setWeight] = useState<string>('10');
  const [unit, setUnit] = useState<'g' | 'dwt' | 'oz'>('g');
  const [pricePerGram, setPricePerGram] = useState<string>('85');

  const wNum = parseFloat(weight) || 0;
  const pNum = parseFloat(pricePerGram) || 0;

  // Conversion to grams
  let grams = wNum;
  if (unit === 'dwt') grams = wNum * 1.55517;
  else if (unit === 'oz') grams = wNum * 31.1035;

  const pureGrams = (grams * karat) / 24;
  const pureTroyOz = pureGrams / 31.1035;
  const meltValue = pureGrams * pNum;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Melt Engine & Valuation</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Gold karat and value</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Compare karats, calculate pure gold weight across metrics, and estimate real-time scrap melt value.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="glass p-6 sm:p-8 rounded-3xl">
          <h2 className="serif text-3xl gt">Gold value calculator</h2>

          <div className="grid gap-4 mt-5">
            <label className="fld">
              <span>Select Karat Purity</span>
              <select value={karat} onChange={(e) => setKarat(parseInt(e.target.value, 10))}>
                <option value={24}>24k (99.9% Pure)</option>
                <option value={22}>22k (91.7% Pure)</option>
                <option value={21}>21k (87.5% Pure)</option>
                <option value={18}>18k (75.0% Pure)</option>
                <option value={14}>14k (58.3% Pure)</option>
                <option value={10}>10k (41.7% Pure)</option>
                <option value={9}>9k (37.5% Pure)</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="fld">
                <span>Weight</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </label>
              <label className="fld">
                <span>Unit</span>
                <select value={unit} onChange={(e) => setUnit(e.target.value as any)}>
                  <option value="g">grams (g)</option>
                  <option value="dwt">pennyweight (dwt)</option>
                  <option value="oz">troy ounces (ozt)</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="fld">
                <span>24k spot price per gram ($)</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={pricePerGram}
                  onChange={(e) => setPricePerGram(e.target.value)}
                  placeholder="e.g. 85.00"
                />
              </label>
              <div className="fld flex flex-col justify-end">
                <span className="text-xs muted mb-1">Active Currency</span>
                <div className="stat py-2.5 px-3 text-xs font-mono gt font-bold">
                  {currentLocale.currency}
                </div>
              </div>
            </div>
          </div>

          <p className="muted text-xs mt-4">
            Spot prices fluctuate daily. Enter today's benchmark spot price from your trusted market feed.
          </p>
        </div>

        {/* Results */}
        <div className="glass p-6 sm:p-8 rounded-3xl">
          <h2 className="serif text-3xl gt">Calculated results</h2>

          {wNum > 0 ? (
            <div className="grid grid-cols-2 gap-3 mt-5 fade">
              <div className="stat">
                <span className="muted text-xs uppercase tracking-wider">Purity Factor</span>
                <b className="gt text-2xl">{((karat / 24) * 100).toFixed(1)}%</b>
              </div>
              <div className="stat">
                <span className="muted text-xs uppercase tracking-wider">Total Weight</span>
                <b className="gt text-2xl">{grams.toFixed(2)} g</b>
              </div>
              <div className="stat">
                <span className="muted text-xs uppercase tracking-wider">Pure Gold (Grams)</span>
                <b className="gt text-2xl">{pureGrams.toFixed(2)} g</b>
              </div>
              <div className="stat">
                <span className="muted text-xs uppercase tracking-wider">Pure Gold (Troy Oz)</span>
                <b className="gt text-2xl">{pureTroyOz.toFixed(3)} ozt</b>
              </div>
              <div className="stat col-span-2 py-4">
                <span className="muted text-xs uppercase tracking-wider">Estimated Scrap Melt Value</span>
                <b className="serif text-3xl sm:text-4xl text-emerald-500 mt-1">
                  {formatPrice(meltValue)}
                </b>
              </div>
            </div>
          ) : (
            <p className="muted text-sm mt-5">Please enter a weight above zero to calculate.</p>
          )}

          <p className="muted text-xs mt-5 leading-relaxed">
            Melt value calculates purely intrinsic gold scrap content. Commercial jewelry buyers usually discount slightly below raw spot rates, while designer retail jewelry carries craftsmanship and gem value.
          </p>
        </div>
      </div>

      {/* Karat reference table */}
      <div className="glass p-6 sm:p-8 rounded-3xl mt-8 overflow-x-auto">
        <h2 className="serif text-3xl gt mb-4">Karat Purity Guide</h2>
        <table className="w-full text-left text-sm" style={{ minWidth: '32rem' }}>
          <thead>
            <tr className="muted text-xs uppercase tracking-wider border-b border-rose-200/20">
              <th className="py-2.5">Karat</th>
              <th>Pure Gold</th>
              <th>Feel & Hardness</th>
              <th>Best Used For</th>
            </tr>
          </thead>
          <tbody>
            {KARAT_TABLE.map((row) => (
              <tr key={row.k} className="border-t border-rose-200/10">
                <td className="py-3 serif text-2xl gt">{row.k}k</td>
                <td className="font-semibold">{row.purity}</td>
                <td className="muted text-xs">{row.feel}</td>
                <td className="muted text-xs">{row.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdPromoBanner />
    </main>
  );
};
