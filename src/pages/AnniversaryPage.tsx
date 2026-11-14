import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WishlistButton } from '../components/shared/WishlistButton';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const TRADITIONAL: Record<number, string> = {
  1: 'Paper',
  2: 'Cotton',
  3: 'Leather',
  4: 'Linen or silk',
  5: 'Wood',
  6: 'Iron',
  7: 'Wool or copper',
  8: 'Bronze',
  9: 'Pottery',
  10: 'Tin or aluminum',
  11: 'Steel',
  12: 'Silk or linen',
  13: 'Lace',
  14: 'Ivory (modern: mother-of-pearl)',
  15: 'Crystal',
  20: 'China',
  25: 'Silver',
  30: 'Pearl',
  35: 'Coral',
  40: 'Ruby',
  45: 'Sapphire',
  50: 'Gold',
  55: 'Emerald',
  60: 'Diamond',
};

const GEMSTONES: Record<number, string> = {
  1: 'Gold',
  2: 'Garnet',
  3: 'Pearl',
  4: 'Blue topaz',
  5: 'Sapphire',
  6: 'Amethyst',
  7: 'Onyx',
  8: 'Tourmaline',
  9: 'Lapis lazuli',
  10: 'Diamond',
  11: 'Turquoise',
  12: 'Jade',
  13: 'Citrine',
  14: 'Opal',
  15: 'Ruby',
  16: 'Peridot',
  18: "Cat's eye",
  19: 'Aquamarine',
  20: 'Emerald',
  25: 'Silver',
  30: 'Pearl',
  35: 'Jade',
  40: 'Ruby',
  45: 'Sapphire',
  50: 'Gold',
  55: 'Emerald',
  60: 'Diamond',
};

const MILESTONES = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60];

export const AnniversaryPage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [year, setYear] = useState<number>(1);

  useEffect(() => {
    markFeatureUsed('anniversary');
  }, []);

  const trad = TRADITIONAL[year] || 'None';
  const gem = GEMSTONES[year] || 'None';

  let idea = 'No official theme for this year. Pair a small piece with a note, or plan ahead for an upcoming milestone.';
  if (gem !== 'None') {
    if (gem === 'Gold' || gem === 'Silver') {
      idea = `A classic solid ${gem.toLowerCase()} chain, bangle or engraved milestone ring.`;
    } else {
      idea = `A delicate pendant, solitaire ring or hoop earrings set with genuine ${gem.toLowerCase()}.`;
    }
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Milestones & Memories</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Anniversary gifts by year</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Slide to your anniversary for the traditional gift material, modern gemstone, and jewelry inspiration.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="glass p-6 sm:p-8 rounded-3xl lg:col-span-2">
          <label htmlFor="anniv-slider" className="block mb-3">
            Years together: <b className="serif text-3xl gt ml-1">{year}</b>
          </label>
          <input
            id="anniv-slider"
            type="range"
            min="1"
            max="60"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="w-full accent-rose-400 cursor-pointer"
          />

          <p className="muted text-xs uppercase tracking-wider mt-6 mb-2">Milestone Years</p>
          <div className="flex flex-wrap gap-2">
            {MILESTONES.map((m) => (
              <button
                key={m}
                onClick={() => setYear(m)}
                className={`chip text-xs py-1 px-3 ${year === m ? 'border-rose-400 bg-rose-500/10' : ''}`}
                aria-pressed={year === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="glass p-6 sm:p-8 rounded-3xl lg:col-span-3">
          <div className="fade">
            <h2 className="serif text-3xl sm:text-4xl gt">Year {year} Anniversary</h2>
            <div className="grid sm:grid-cols-2 gap-3.5 mt-5">
              <div className="stat">
                <span className="muted text-xs uppercase tracking-wider">Traditional Material</span>
                <b className="gt text-2xl mt-1">{trad}</b>
              </div>
              <div className="stat">
                <span className="muted text-xs uppercase tracking-wider">Gemstone</span>
                <b className="gt text-2xl mt-1">{gem}</b>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-rose-200/10">
              <b className="serif text-xl gt">Jewelry Styling Idea</b>
              <p className="muted text-xs sm:text-sm mt-1 leading-relaxed">{idea}</p>
            </div>

            {gem !== 'None' && (
              <div className="mt-5">
                <WishlistButton
                  id={`anniv-${year}`}
                  label={`Year ${year}: ${gem} jewelry`}
                  note="Anniversary milestone"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-6 sm:p-8 rounded-3xl mt-8">
        <p className="muted text-xs sm:text-sm leading-relaxed">
          Traditions differ by country and culture, and several anniversary years celebrate more than one theme. Treat these pairings as romantic inspiration and personal heritage rather than strict rules.
        </p>
      </div>

      <AdPromoBanner />
    </main>
  );
};
