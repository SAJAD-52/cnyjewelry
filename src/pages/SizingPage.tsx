import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

export const SizingPage: React.FC = () => {
  const { markFeatureUsed } = useApp();

  useEffect(() => {
    markFeatureUsed('sizing');
  }, []);

  const [mode, setMode] = useState<'ring' | 'bracelet'>('ring');
  const [ringSize, setRingSize] = useState<number>(7);
  const [wristCirc, setWristCirc] = useState<number>(16);

  // Ring formulas
  const ringDiameter = 11.63 + 0.8128 * ringSize;
  const ringCircumference = Math.PI * ringDiameter;
  const ukRingSize = String.fromCharCode(70 + Math.round((ringSize - 3) * 2)) + '½';
  const euRingSize = Math.round(ringCircumference);
  const jpRingSize = Math.round(ringCircumference - 40.8);

  const inch = (c: number) => (c / 2.54).toFixed(2) + ' in';

  const PX = 9;
  const radius = (ringDiameter * PX) / 2;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Fit & Sizing Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Find your size</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Slide to your ring size for instant conversions across 4 scales, or switch to bracelet for the drape that suits your wrist.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SVG Life-scale visualizer */}
        <div className="glass p-6 flex flex-col items-center justify-center">
          <svg viewBox="0 0 260 260" className="w-full max-w-xs" role="img" aria-label="Life-scale ring preview">
            <defs>
              <linearGradient id="sizing-rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e2b3" />
                <stop offset="1" stopColor="#b76e79" />
              </linearGradient>
            </defs>
            <circle
              cx="130"
              cy="130"
              r={mode === 'ring' ? radius : (wristCirc / Math.PI / 2) * 26}
              fill="none"
              stroke="url(#sizing-rg)"
              strokeWidth="14"
              className="ring-live-circle"
            />
            <line
              x1={mode === 'ring' ? 130 - radius : 130 - (wristCirc / Math.PI / 2) * 26}
              y1="130"
              x2={mode === 'ring' ? 130 + radius : 130 + (wristCirc / Math.PI / 2) * 26}
              y2="130"
              stroke="#f3e2b3"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <text x="130" y="124" textAnchor="middle" fill="#f3e2b3" fontSize="13" fontFamily="sans-serif">
              {mode === 'ring' ? `${ringDiameter.toFixed(1)} mm` : `${(wristCirc / Math.PI * 10).toFixed(0)} mm`}
            </text>
          </svg>
          <p className="muted text-xs mt-3 text-center">
            {mode === 'ring' ? 'Preview scales dynamically with ring size. Check ruler at home.' : 'Circular bracelet diameter model.'}
          </p>
        </div>

        {/* Sliders and Stats */}
        <div className="glass p-6 sm:p-8 rounded-3xl">
          <div role="tablist" className="flex gap-2 mb-6">
            <button
              className="chip cursor-pointer"
              role="tab"
              aria-selected={mode === 'ring'}
              onClick={() => setMode('ring')}
            >
              Ring
            </button>
            <button
              className="chip cursor-pointer"
              role="tab"
              aria-selected={mode === 'bracelet'}
              onClick={() => setMode('bracelet')}
            >
              Bracelet
            </button>
          </div>

          {mode === 'ring' ? (
            <div>
              <label htmlFor="ring-slider" className="block mb-3">
                US ring size: <b className="gt serif text-3xl ml-1">{ringSize}</b>
              </label>
              <input
                id="ring-slider"
                type="range"
                min="3"
                max="13"
                step="0.5"
                value={ringSize}
                onChange={(e) => setRingSize(parseFloat(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="stat">
                  <span className="muted text-xs">US</span>
                  <b className="gt text-2xl">{ringSize}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">UK / AU</span>
                  <b className="gt text-2xl">{ukRingSize}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">EU (ISO)</span>
                  <b className="gt text-2xl">{euRingSize}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">Japan</span>
                  <b className="gt text-2xl">{jpRingSize}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">Inner diameter</span>
                  <b className="gt text-2xl">{ringDiameter.toFixed(1)} mm</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">Circumference</span>
                  <b className="gt text-2xl">{ringCircumference.toFixed(1)} mm</b>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="wrist-slider" className="block mb-3">
                Wrist circumference: <b className="gt serif text-3xl ml-1">{wristCirc} cm / {inch(wristCirc)}</b>
              </label>
              <input
                id="wrist-slider"
                type="range"
                min="12"
                max="22"
                step="0.5"
                value={wristCirc}
                onChange={(e) => setWristCirc(parseFloat(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="stat">
                  <span className="muted text-xs">Snug fit</span>
                  <b className="gt text-xl">{wristCirc + 1} cm / {inch(wristCirc + 1)}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">Comfortable</span>
                  <b className="gt text-xl">{wristCirc + 2} cm / {inch(wristCirc + 2)}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">Loose, with drape</span>
                  <b className="gt text-xl">{wristCirc + 3} cm / {inch(wristCirc + 3)}</b>
                </div>
                <div className="stat">
                  <span className="muted text-xs">Standard length</span>
                  <b className="gt text-xl">17 to 19 cm</b>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass p-6 sm:p-8 rounded-3xl mt-8">
        <h2 className="serif text-3xl gt">Measure at home</h2>
        <p className="muted mt-2 max-w-3xl leading-relaxed">
          Wrap a strip of paper around the base of the finger, mark where it overlaps, and measure the length in millimeters. Measure at the end of the day when fingers are warmest, and check twice. For a wide band (over 4 mm), go up half a size. For the wrist, measure just above the wrist bone and add 1 to 2 cm depending on drape preference.
        </p>
      </div>

      <AdPromoBanner />
    </main>
  );
};
