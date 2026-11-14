import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WishlistButton } from '../components/shared/WishlistButton';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

interface UndertoneData {
  n: string;
  sw: string;
  hint: string;
  m: [string, string][];
  g: string[];
  a: string;
}

const UNDERTONES: Record<string, UndertoneData> = {
  cool: {
    n: 'Cool',
    sw: '#c9a0c8',
    hint: 'Veins look blue or purple. Silver looks crisp and glowing on you.',
    m: [
      ['Silver', 'Crisp and bright against pink or blue tones.'],
      ['White gold', 'The same clean glow, with more heft and longevity.'],
      ['Platinum', 'Cool, durable, dense and naturally hypoallergenic.'],
    ],
    g: ['Sapphire', 'Amethyst', 'Aquamarine', 'Emerald', 'Diamond'],
    a: 'Very yellow gold can look flat or brassy. Choose pale or rose tones if you love gold.',
  },
  warm: {
    n: 'Warm',
    sw: '#e0a95e',
    hint: 'Veins look green. Gold brings out your natural sun-kissed warmth.',
    m: [
      ['Yellow gold', 'Brings out rich golden undertones in your complexion.'],
      ['Rose gold', 'Soft and flattering across almost all warm complexions.'],
      ['Brass and bronze', 'Earthy, textured and relaxed for effortless daily wear.'],
    ],
    g: ['Citrine', 'Garnet', 'Ruby', 'Amber', 'Topaz'],
    a: 'High-shine icy silver can wash you out. Try brushed or antique finishes instead.',
  },
  neutral: {
    n: 'Neutral',
    sw: '#d9b8a8',
    hint: 'Veins look blue-green, and both warm and cool metals look radiant.',
    m: [
      ['Rose gold', 'Sits between warm and cool, so it flatters you effortlessly.'],
      ['Yellow gold', 'Rich, luminous and classic.'],
      ['Silver', 'Sharp and modern. Mix it freely with yellow gold stacks.'],
    ],
    g: ['Morganite', 'Pearl', 'Opal', 'Blue topaz', 'Peridot'],
    a: 'Almost nothing. You can wear and mix two-tone metals freely.',
  },
  olive: {
    n: 'Olive',
    sw: '#a8a272',
    hint: 'Skin has a subtle green or golden cast and tans very easily in summer.',
    m: [
      ['Yellow gold', 'Harmonizes with and warms the greenish cast in olive skin.'],
      ['Antique gold', 'Soft satin patina flatters deeper Mediterranean & Asian tones.'],
      ['Rose gold', 'A gentle blush contrast that illuminates deeper skin.'],
    ],
    g: ['Emerald', 'Garnet', 'Turquoise', 'Amethyst', 'Deep ruby'],
    a: 'Icy, stark blue-white metals can look flat or grayish.',
  },
};

export const StylingPage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [currentTone, setCurrentTone] = useState<string>('neutral');

  useEffect(() => {
    markFeatureUsed('styling');
  }, []);

  const data = UNDERTONES[currentTone];

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Color Harmony Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Metals that suit your skin</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Choose your undertone for tailored metals, gemstone pairings, and styling recommendations.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Undertone picker */}
        <div className="glass p-6 sm:p-7 rounded-3xl h-fit">
          <h2 className="serif text-3xl gt">Your undertone</h2>
          <p className="muted text-xs mt-1 mb-5">
            Pick the one closest to you. Check the hint for wrist vein color.
          </p>
          <div className="grid gap-3" role="group" aria-label="Skin undertone">
            {Object.keys(UNDERTONES).map((k) => {
              const u = UNDERTONES[k];
              const isSelected = k === currentTone;
              return (
                <button
                  key={k}
                  className={`chip p-4 rounded-2xl block text-left transition-all cursor-pointer ${
                    isSelected ? 'border-rose-400 bg-rose-500/10' : ''
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => setCurrentTone(k)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3.5 h-3.5 rounded-full shrink-0 border border-white/40"
                      style={{ background: u.sw }}
                    />
                    <b className="serif text-xl">{u.n}</b>
                  </div>
                  <span className="block muted text-xs mt-1.5 leading-snug">{u.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results output */}
        <div className="lg:col-span-2 glass p-6 sm:p-8 rounded-3xl">
          <div className="fade">
            <div className="flex items-center justify-between">
              <h2 className="serif text-3xl sm:text-4xl gt">
                Best metals for {data.n.toLowerCase()} undertones
              </h2>
              <span
                className="w-5 h-5 rounded-full border border-white/50"
                style={{ background: data.sw }}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3.5 mt-5">
              {data.m.map(([metalName, metalDesc]) => (
                <div key={metalName} className="stat flex flex-col justify-between">
                  <div>
                    <b className="gt serif text-xl">{metalName}</b>
                    <p className="muted text-xs my-2 leading-relaxed">{metalDesc}</p>
                  </div>
                  <div className="mt-2">
                    <WishlistButton
                      id={`metal-${currentTone}-${metalName}`}
                      label={`${metalName} (${data.n} undertone)`}
                      note="Flattering metal match"
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="serif text-2xl sm:text-3xl gt mt-8">Gems to pair with</h3>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {data.g.map((gem) => (
                <span
                  key={gem}
                  className="stat inline-flex items-center gap-2 py-1.5 px-3 rounded-full text-xs"
                >
                  <span>{gem}</span>
                  <WishlistButton
                    id={`gem-${currentTone}-${gem}`}
                    label={`${gem} (${data.n} undertone)`}
                    note="Complimentary gem pairing"
                  />
                </span>
              ))}
            </div>

            <h3 className="serif text-2xl sm:text-3xl gt mt-8">Go lightly with</h3>
            <p className="muted text-sm mt-1 leading-relaxed">{data.a}</p>
          </div>
        </div>
      </div>

      <AdPromoBanner />
    </main>
  );
};
