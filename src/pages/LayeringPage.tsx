import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WishlistButton } from '../components/shared/WishlistButton';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

interface NecklineOption {
  lengths: number[];
  path: string;
  tip: string;
}

const NECKLINES: Record<string, NecklineOption> = {
  'Crew neck': {
    lengths: [40, 45, 60],
    path: 'M95 118Q150 150 205 118',
    tip: 'Sit the shortest chain just above the collar line, and let the longest drop below it.',
  },
  'V-neck': {
    lengths: [45, 50, 60],
    path: 'M95 118L150 215L205 118',
    tip: 'Echo the plunging V with a pendant on your longest chain.',
  },
  'Scoop neck': {
    lengths: [40, 45, 55],
    path: 'M95 118Q150 230 205 118',
    tip: 'Follow the curve. Keep chains within 5 cm of the scoop edge.',
  },
  'Off-shoulder': {
    lengths: [35, 40, 45],
    path: 'M30 150Q150 190 270 150',
    tip: 'Short collar chokers and delicate princess chains frame bare collarbones best.',
  },
  'High neck': {
    lengths: [70, 80, 90],
    path: 'M110 118Q150 128 190 118',
    tip: 'Go long over thick knits and turtlenecks so chains stand out against the fabric.',
  },
  'Collared shirt': {
    lengths: [40, 45],
    path: 'M95 118L150 170L205 118',
    tip: 'Wear one fine chain tucked inside the unbuttoned collar and one layered outside.',
  },
};

const CHAIN_COLORS = ['#f3e2b3', '#e8b4b8', '#b76e79'];

export const LayeringPage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [selectedNeckline, setSelectedNeckline] = useState<string>('Crew neck');

  useEffect(() => {
    markFeatureUsed('layering');
  }, []);

  const data = NECKLINES[selectedNeckline];
  const getY = (len: number) => 112 + (len - 35) * 2.6;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Chains Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Layer your necklaces</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Choose a neckline to see the chain lengths that drape best, how to space them, and prevent tangled knots.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-6 sm:p-8 rounded-3xl">
          <h2 className="serif text-3xl gt">Your neckline</h2>
          <div className="grid grid-cols-2 gap-3 mt-5" role="group" aria-label="Neckline">
            {Object.keys(NECKLINES).map((k) => (
              <button
                key={k}
                onClick={() => setSelectedNeckline(k)}
                className={`chip text-xs sm:text-sm py-3 px-4 ${
                  selectedNeckline === k ? 'border-rose-400 bg-rose-500/10' : ''
                }`}
                aria-pressed={selectedNeckline === k}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-8 fade">
            <p className="text-sm leading-relaxed">{data.tip}</p>
            <ul className="mt-5 grid gap-2.5 p-0 list-none">
              {data.lengths.map((len, i) => (
                <li
                  key={len}
                  className="stat flex items-center justify-between py-2.5 px-4 rounded-xl"
                >
                  <span className="flex items-center text-sm">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2.5 border border-white/30"
                      style={{ background: CHAIN_COLORS[i] || '#f3e2b3' }}
                    />
                    <b className="serif text-lg font-medium">{len} cm</b>
                    <span className="muted text-xs ml-1.5">/ {(len / 2.54).toFixed(0)} in</span>
                  </span>
                  <WishlistButton
                    id={`layer-${selectedNeckline}-${len}`}
                    label={`${selectedNeckline} chain, ${len} cm`}
                    note="Necklace layering"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SVG Mannequin Neck Preview */}
        <div className="glass p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 300 330"
            className="w-full max-w-sm"
            role="img"
            aria-label="Neck diagram with chains at suggested lengths"
          >
            {/* Mannequin neck silhouette */}
            <path
              d="M120 10v70c0 18-8 30-30 40-40 14-70 30-72 80v130h264V200c-2-50-32-66-72-80-22-10-30-22-30-40V10z"
              fill="rgba(255,255,255,.04)"
              stroke="rgba(243,226,179,.25)"
            />
            {/* Neckline boundary */}
            <path fill="none" stroke="rgba(243,226,179,.6)" strokeWidth="2" d={data.path} />
            {/* Layered chains */}
            {data.lengths.map((len, i) => {
              const yVal = getY(len);
              const color = CHAIN_COLORS[i] || '#f3e2b3';
              return (
                <path
                  key={len}
                  d={`M118 70Q150 ${yVal * 1.15} 182 70`}
                  fill="none"
                  stroke={color}
                  strokeWidth={2 + i}
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
              );
            })}
          </svg>
          <p className="muted text-xs mt-3 text-center">
            Drape preview for {selectedNeckline.toLowerCase()}. Screen proportions may vary.
          </p>
        </div>
      </div>

      {/* Layering Rules */}
      <div className="glass p-6 sm:p-8 rounded-3xl mt-8">
        <h2 className="serif text-3xl gt">Layering rules to master</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div className="stat">
            <h3 className="serif text-2xl gt">Space them</h3>
            <p className="muted text-xs mt-2 leading-relaxed">
              Leave at least 4 to 6 cm (about 2 inches) between chain lengths so each strand reads cleanly on the body.
            </p>
          </div>
          <div className="stat">
            <h3 className="serif text-2xl gt">Vary the weight</h3>
            <p className="muted text-xs mt-2 leading-relaxed">
              Pair one ultra-fine chain, one medium textured chain (like a herringbone or box link), and one with a pendant.
            </p>
          </div>
          <div className="stat">
            <h3 className="serif text-2xl gt">Mix metals</h3>
            <p className="muted text-xs mt-2 leading-relaxed">
              Keep one metal color dominant (70%), then add a second tone as an accent loop or pendant motif.
            </p>
          </div>
        </div>
      </div>

      <AdPromoBanner />
    </main>
  );
};
