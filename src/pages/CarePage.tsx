import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

interface CareData {
  t: string;
  c: string;
  clean: string;
  avoid: string;
  store: string;
  freq: string;
}

const CARE_MATERIALS: Record<string, CareData> = {
  Gold: {
    t: 'Soft metal. It scratches before it tarnishes.',
    c: '#f3e2b3',
    clean: 'Soak 15 minutes in warm water with mild dish soap. Brush gently with an extra-soft toothbrush, rinse thoroughly, pat dry flat.',
    avoid: 'Chlorine pools, hot tubs and household bleach. Chlorine chemically weakens gold alloy solder points over time.',
    store: 'Separate soft velvet pouch or dedicated slot, so harder stones or chains do not scratch polished surfaces.',
    freq: 'Monthly for daily wear.',
  },
  Silver: {
    t: 'Tarnishes naturally with air and moisture, so wearing it regularly prevents oxidation.',
    c: '#cbd5e1',
    clean: 'Use a micro-abrasive silver polishing cloth in straight motions. For deep tarnish, an aluminum foil and baking soda bath restores brilliant luster instantly.',
    avoid: 'Rubber bands, wool sweaters, sulfur-rich foods, and direct perfumes, which rapidly accelerate oxidation.',
    store: 'Sealed airtight ziplock pouch with a fresh anti-tarnish paper strip or silica gel packet.',
    freq: 'Wipe after each wear. Polish every 1 to 2 months.',
  },
  Platinum: {
    t: 'Exceptionally dense and durable. It develops a distinguished soft satin patina.',
    c: '#e2e8f0',
    clean: 'Warm soapy water and a soft baby toothbrush. A bench jeweler can re-buff to a mirror shine anytime.',
    avoid: 'Hard knocks against diamonds or sapphires that are harder than platinum mountings, and abrasive cleaners.',
    store: 'Individual compartment, as platinum can easily scratch softer gold pieces.',
    freq: 'Monthly routine wash. Professional inspection every 1 to 2 years.',
  },
  Pearls: {
    t: 'Organic, porous and delicate. They are permanently damaged by acids and extreme dryness.',
    c: '#f8e8ee',
    clean: 'Gently wipe down with a soft damp microfiber cloth after wearing. Never soak in liquids or place in an ultrasonic cleaner.',
    avoid: 'Perfumes, hairsprays, cosmetics, body lotions, acidic liquids, and ultrasonic vibrations.',
    store: 'Flat in breathable soft fabric pouches. Restring knotted silk strands every 1 to 2 years.',
    freq: 'Wipe after every single wear.',
  },
  Diamonds: {
    t: 'The hardest natural gemstone on earth, but inherently attracts natural skin oils and lotion films.',
    c: '#dbeafe',
    clean: 'Soak 20 minutes in warm soapy water, use a soft baby toothbrush behind the open setting, rinse and dry with a lint-free cloth.',
    avoid: 'Touching the top table with bare fingers, and harsh bleach or chlorine on the prong setting.',
    store: 'Strictly separate from other diamonds, as diamonds are the only mineral capable of scratching diamonds.',
    freq: 'Clean every 2 weeks. Have prongs and tension inspected yearly by a master jeweler.',
  },
  'Colored gems': {
    t: 'Hardness and porosity vary dramatically by gemstone mineral family.',
    c: '#e8b4b8',
    clean: 'Warm mild soapy water and a gentle brush. Skip ultrasonic and steam cleaning for emeralds, opals, turquoise and treated gems.',
    avoid: 'Excess heat, direct prolonged sunlight, thermal shock, and aggressive chemical cleaners.',
    store: 'Padded compartments with dividers. Keep opals and pearls away from bone-dry heat sources.',
    freq: 'Every 2 to 4 weeks.',
  },
  'Plated and costume': {
    t: 'A microscopic electroplated coating over base brass or silver. Treat with extreme gentleness.',
    c: '#b76e79',
    clean: 'Gently wipe with a clean, dry, lint-free cloth. Avoid chemical dipping solutions, and never use abrasive metal polish.',
    avoid: 'Water, sweat, body lotions, hairsprays, and wearing in the shower or swimming pools.',
    store: 'Completely dry in an airtight zip pouch alongside a silica moisture absorber.',
    freq: 'Wipe down after each wear.',
  },
};

export const CarePage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [currentMat, setCurrentMat] = useState<string>('Gold');

  useEffect(() => {
    markFeatureUsed('care');
  }, []);

  const m = CARE_MATERIALS[currentMat];
  const rows = [
    ['How to clean', m.clean],
    ['What to avoid', m.avoid],
    ['Safe storage', m.store],
    ['Frequency', m.freq],
  ];

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Care & Preservation Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Care for every material</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Select a precious metal or gemstone to view recommended cleaning steps, safe storage, and maintenance schedules.
        </p>
      </div>

      <div className="glass p-6 sm:p-8 rounded-3xl">
        <div role="tablist" className="flex flex-wrap gap-2 mb-8" aria-label="Material">
          {Object.keys(CARE_MATERIALS).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={currentMat === k}
              onClick={() => setCurrentMat(k)}
              className="chip cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="fade">
          <div className="flex items-center gap-4">
            <span
              className="w-14 h-14 rounded-full shrink-0 border border-white/40"
              style={{
                background: `radial-gradient(circle at 30% 30%, #fff, ${m.c} 60%, #334155)`,
                boxShadow: `0 0 30px ${m.c}66`,
              }}
            />
            <div>
              <h2 className="serif text-3xl sm:text-4xl gt">{currentMat}</h2>
              <p className="muted text-sm mt-1">{m.t}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {rows.map(([title, desc]) => (
              <div key={title} className="stat">
                <h3 className="serif text-2xl gt">{title}</h3>
                <p className="muted text-sm mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdPromoBanner />
    </main>
  );
};
