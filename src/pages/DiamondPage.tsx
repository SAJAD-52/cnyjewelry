import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const QUICK_CARATS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0];

export const DiamondPage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [carat, setCarat] = useState<number>(1.0);

  useEffect(() => {
    markFeatureUsed('diamond');
  }, []);

  const diameter = 6.5 * Math.cbrt(carat);
  const PX = 14;
  const radius = (diameter / 2) * PX;
  const fingerShare = Math.round((diameter / 17) * 100);

  const getLookLabel = (c: number) => {
    if (c < 0.5) return 'Delicate & Understated';
    if (c < 1.0) return 'Classic Everyday Solitaire';
    if (c < 2.0) return 'Statement Engagement Centerpiece';
    return 'Dramatic & Red-Carpet Presence';
  };

  const cx = 150;
  const cy = 135;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Carat Scale Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">How big is a carat?</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Slide the carat weight to preview a round brilliant diamond at scale on a finger, then explore what truly drives sparkle and value.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SVG Finger Simulator */}
        <div className="glass p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 300 260"
            className="w-full max-w-sm"
            role="img"
            aria-label="Round brilliant diamond shown at scale on a 17 mm finger"
          >
            <defs>
              <radialGradient id="dia-rad" cx="0.35" cy="0.3">
                <stop offset="0" stopColor="#fff" />
                <stop offset="0.6" stopColor="#f8d9e0" />
                <stop offset="1" stopColor="#e8b4b8" />
              </radialGradient>
            </defs>
            {/* Finger representation */}
            <rect
              x="31"
              y="20"
              width="238"
              height="230"
              rx="60"
              fill="rgba(232,180,184,.12)"
              stroke="rgba(243,226,179,.3)"
            />
            {/* Diamond outer facet */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="url(#dia-rad)"
              stroke="#f3e2b3"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 14px rgba(232,180,184,.8))' }}
            />
            {/* Inner table facets */}
            <circle
              cx={cx}
              cy={cy}
              r={radius * 0.55}
              fill="none"
              stroke="#b76e79"
              strokeWidth="1"
              opacity="0.6"
            />
            <g stroke="#b76e79" strokeWidth="1" opacity="0.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i * Math.PI) / 4;
                return (
                  <line
                    key={i}
                    x1={cx + Math.cos(angle) * radius * 0.55}
                    y1={cy + Math.sin(angle) * radius * 0.55}
                    x2={cx + Math.cos(angle) * radius}
                    y2={cy + Math.sin(angle) * radius}
                  />
                );
              })}
            </g>
          </svg>
          <p className="muted text-xs mt-3 text-center">
            Shown at scale on a standard 17 mm wide ring finger.
          </p>
        </div>

        {/* Sliders & Carat specs */}
        <div className="glass p-6 sm:p-8 rounded-3xl">
          <label htmlFor="diamond-slider" className="block mb-3">
            Carat weight: <b className="serif text-3xl gt ml-1">{carat.toFixed(2)} ct</b>
          </label>
          <input
            id="diamond-slider"
            type="range"
            min="0.25"
            max="3.0"
            step="0.05"
            value={carat}
            onChange={(e) => setCarat(parseFloat(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />

          <div className="flex flex-wrap gap-2 mt-5">
            {QUICK_CARATS.map((q) => (
              <button
                key={q}
                onClick={() => setCarat(q)}
                className={`chip text-xs py-1 px-3 ${carat === q ? 'border-rose-400 bg-rose-500/10' : ''}`}
                aria-pressed={carat === q}
              >
                {q} ct
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 fade">
            <div className="stat">
              <span className="muted text-xs uppercase tracking-wider">Weight</span>
              <b className="gt text-2xl">{carat.toFixed(2)} ct</b>
            </div>
            <div className="stat">
              <span className="muted text-xs uppercase tracking-wider">Estimated Diameter</span>
              <b className="gt text-2xl">{diameter.toFixed(1)} mm</b>
            </div>
            <div className="stat">
              <span className="muted text-xs uppercase tracking-wider">Finger Width Share</span>
              <b className="gt text-2xl">{fingerShare}%</b>
            </div>
            <div className="stat">
              <span className="muted text-xs uppercase tracking-wider">Aesthetic Look</span>
              <b className="gt text-lg leading-tight mt-1">{getLookLabel(carat)}</b>
            </div>
          </div>

          <p className="muted text-xs mt-5 leading-relaxed">
            Estimates calibrated for ideal round brilliant cuts. Fancy shapes (such as oval, emerald, or marquise) feature elongated profiles that appear noticeably larger per carat weight.
          </p>
        </div>
      </div>

      {/* 4Cs Cards */}
      <h2 className="serif text-3xl sm:text-4xl gt mt-16 mb-6">The 4Cs, simplified</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass glow p-6 rounded-2xl">
          <h3 className="serif text-3xl gt">Cut</h3>
          <p className="muted text-xs mt-2 leading-relaxed">
            Drives brilliance, fire and light refraction more than any other factor. Always prioritize an Excellent or Ideal cut first.
          </p>
        </div>
        <div className="glass glow p-6 rounded-2xl">
          <h3 className="serif text-3xl gt">Color</h3>
          <p className="muted text-xs mt-2 leading-relaxed">
            Graded from D (colorless) to Z. Near-colorless diamonds (G to I) look ice-white when mounted in gold or platinum at substantial savings.
          </p>
        </div>
        <div className="glass glow p-6 rounded-2xl">
          <h3 className="serif text-3xl gt">Clarity</h3>
          <p className="muted text-xs mt-2 leading-relaxed">
            Evaluates microscopic inclusions. Eye-clean grades like VS2 or SI1 appear identical to flawless diamonds without a 10x jeweler loupe.
          </p>
        </div>
        <div className="glass glow p-6 rounded-2xl">
          <h3 className="serif text-3xl gt">Carat</h3>
          <p className="muted text-xs mt-2 leading-relaxed">
            A precise unit of weight (0.2 grams), not surface size. Buying just under benchmark numbers (e.g., 0.90 ct vs 1.00 ct) yields big savings.
          </p>
        </div>
      </div>

      {/* Lab vs Natural */}
      <div className="glass p-6 sm:p-8 rounded-3xl mt-6">
        <h2 className="serif text-3xl gt">Lab-grown or natural?</h2>
        <p className="muted text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
          Lab-grown diamonds are 100% genuine carbon crystals with identical optical, physical, and chemical structures. They typically cost 60–80% less than mined stones. Natural diamonds command higher rarity premiums for heritage and resale. Always insist on an independent laboratory report (IGI or GIA) for either choice.
        </p>
      </div>

      <AdPromoBanner />
    </main>
  );
};
