import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/blogData';
import { ShowcaseBanner } from '../components/shared/ShowcaseBanner';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const CATEGORIES = ['All', 'Guides', 'Care', 'Spotlight', 'Trends', 'Seasonal', 'Buying advice'];

const renderHeroSvg = (hero: string | undefined, idx: number) => {
  const id = `rpb-${idx}`;
  if (hero === 'chain' || hero === 'herringbone') {
    return (
      <svg viewBox="0 0 400 190" className="w-[86%] max-h-[78%]" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3e2b3" />
            <stop offset="0.5" stopColor="#e8b4b8" />
            <stop offset="1" stopColor="#b76e79" />
          </linearGradient>
        </defs>
        {Array.from({ length: 34 }, (_, k) => {
          const u = k / 33;
          const x = 40 + 320 * u;
          const y = 26 + 124 * (1 - Math.pow(2 * u - 1, 2));
          const a = (Math.atan2(-496 * (2 * u - 1), 320) * 180) / Math.PI + (k % 2 ? 38 : -38);
          return (
            <rect
              key={k}
              x="-10"
              y="-3.4"
              width="20"
              height="6.8"
              rx="3.4"
              fill={`url(#${id}-g)`}
              stroke="rgba(60,30,40,.4)"
              strokeWidth="0.6"
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})`}
            />
          );
        })}
      </svg>
    );
  }
  if (hero === 'rings') {
    return (
      <svg viewBox="0 0 400 190" className="w-[86%] max-h-[78%]" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3e2b3" />
            <stop offset="0.5" stopColor="#e8b4b8" />
            <stop offset="1" stopColor="#b76e79" />
          </linearGradient>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#aeb6c4" />
          </linearGradient>
        </defs>
        <circle cx="85" cy="112" r="40" fill="none" stroke={`url(#${id}-a)`} strokeWidth="10" />
        <polygon points="70,48 100,48 110,60 85,80 60,60" fill="#fde7ec" stroke="#b76e79" strokeWidth="1" />
        <circle cx="205" cy="105" r="42" fill="none" stroke={`url(#${id}-w)`} strokeWidth="11" />
        <circle cx="320" cy="108" r="40" fill="none" stroke={`url(#${id}-a)`} strokeWidth="7" />
        <circle cx="320" cy="108" r="30" fill="none" stroke={`url(#${id}-w)`} strokeWidth="7" />
        <circle cx="320" cy="108" r="21" fill="none" stroke={`url(#${id}-a)`} strokeWidth="5" />
      </svg>
    );
  }
  if (hero === 'ringsPair') {
    return (
      <svg viewBox="0 0 400 180" className="w-[82%] max-h-[76%]" role="img" aria-hidden="true">
        <circle cx="135" cy="90" r="48" fill="none" stroke="#f3e2b3" strokeWidth="11" />
        <circle cx="265" cy="90" r="48" fill="none" stroke="#e8b4b8" strokeWidth="11" />
      </svg>
    );
  }
  if (hero === 'infinity') {
    return (
      <svg viewBox="0 0 400 170" className="w-[86%] max-h-[78%]" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-i`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3e2b3" />
            <stop offset="1" stopColor="#b76e79" />
          </linearGradient>
        </defs>
        <path
          d="M 100 85 C 100 45, 170 45, 200 85 C 230 125, 300 125, 300 85 C 300 45, 230 45, 200 85 C 170 125, 100 125, 100 85 Z"
          fill="none"
          stroke={`url(#${id}-i)`}
          strokeWidth="9"
        />
        <path
          d="M 100 85 C 100 125, 170 125, 200 85 C 230 45, 300 45, 300 85 C 300 125, 230 125, 200 85 C 170 45, 100 45, 100 85 Z"
          fill="none"
          stroke="#cfd5de"
          strokeWidth="9"
        />
      </svg>
    );
  }
  if (hero === 'earrings') {
    return (
      <svg viewBox="0 0 400 190" className="w-[82%] max-h-[78%]" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-e`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3e2b3" />
            <stop offset="0.5" stopColor="#e8b4b8" />
            <stop offset="1" stopColor="#b76e79" />
          </linearGradient>
        </defs>
        <circle cx="115" cy="95" r="46" fill="none" stroke={`url(#${id}-e)`} strokeWidth="11" />
        <circle cx="285" cy="28" r="6" fill={`url(#${id}-e)`} />
        <path d="M285 34v32" stroke={`url(#${id}-e)`} strokeWidth="4" strokeLinecap="round" />
        <ellipse
          cx="285"
          cy="108"
          rx="28"
          ry="38"
          fill="#efe3da"
          stroke="rgba(120,90,70,.35)"
          transform="rotate(-8 285 108)"
        />
      </svg>
    );
  }
  if (hero === 'fallGems') {
    const gems = [
      { col: '#7b1e2b', name: 'Garnet' },
      { col: '#d98e32', name: 'Amber' },
      { col: '#e4b83a', name: 'Citrine' },
      { col: '#7c8a3a', name: 'Peridot' },
      { col: '#6b5a52', name: 'Smoky quartz' },
      { col: '#efe6dc', name: 'Pearl' },
    ];
    return (
      <svg viewBox="0 0 440 130" className="w-[90%] max-h-[76%]" role="img" aria-hidden="true">
        {gems.map((g, k) => {
          const cx = 48 + k * 68;
          const gid = `${id}-f-${k}`;
          return (
            <g key={g.name}>
              <defs>
                <radialGradient id={gid} cx="0.35" cy="0.3">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
                  <stop offset="0.45" stopColor={g.col} />
                  <stop offset="1" stopColor={g.col} stopOpacity="0.8" />
                </radialGradient>
              </defs>
              <circle cx={cx} cy="58" r="24" fill={`url(#${gid})`} stroke="rgba(255,255,255,.45)" />
              <text x={cx} y="110" textAnchor="middle" fontSize="11" fill="#fbf5f2">
                {g.name}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
  if (hero === 'plated') {
    return (
      <svg viewBox="0 0 400 170" className="w-[86%] max-h-[78%]" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-p`} x1="0" x2="1">
            <stop offset="0" stopColor="#f3e2b3" />
            <stop offset="1" stopColor="#d9a84a" />
          </linearGradient>
        </defs>
        <rect x="28" y="34" width="185" height="14" fill={`url(#${id}-p)`} rx="2" />
        <rect x="28" y="48" width="185" height="10" fill="#c9ced6" />
        <rect x="28" y="58" width="185" height="62" fill="#b87a4b" rx="2" />
        <g fill="#fbf5f2" fontSize="12">
          <text x="226" y="46">Gold layer (microns)</text>
          <text x="226" y="66">Barrier layer</text>
          <text x="226" y="96">Base metal</text>
        </g>
      </svg>
    );
  }
  if (hero === 'devil') {
    return (
      <svg viewBox="0 0 400 180" className="w-[76%] max-h-[78%]" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-d`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7e6b0" />
            <stop offset="0.55" stopColor="#e2b24f" />
            <stop offset="1" stopColor="#b9822a" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="108" r="40" fill={`url(#${id}-d)`} stroke="rgba(90,55,10,.5)" strokeWidth="1.5" />
        <path
          d="M168 85 L162 55 L183 72 Z M232 85 L238 55 L217 72 Z"
          fill={`url(#${id}-d)`}
          stroke="rgba(90,55,10,.5)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="187" cy="101" r="4" fill="#5a370a" />
        <circle cx="213" cy="101" r="4" fill="#5a370a" />
        <path d="M183 117 Q200 136 217 117" fill="none" stroke="#5a370a" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 180" className="w-[78%] max-h-[76%]" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e2b3" />
          <stop offset="0.5" stopColor="#e8b4b8" />
          <stop offset="1" stopColor="#b76e79" />
        </linearGradient>
      </defs>
      <polygon points="150,42 250,42 290,88 200,160 110,88" fill={`url(#${id}-m)`} opacity="0.95" />
      <g stroke="rgba(60,30,40,.45)" strokeWidth="1.2" fill="none">
        <polyline points="110,88 290,88" />
        <polyline points="150,42 175,88 200,160 225,88 250,42" />
      </g>
    </svg>
  );
};

export const BlogPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filtered = BLOG_POSTS.filter((p) => selectedCat === 'All' || p.cat === selectedCat);

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Editorial & Education</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">The McGee Jewelry blog</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Practical guides and expert advice on chains, diamond rings, earrings, gold plating, seasonal styling, and milestone gifts.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Blog categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={selectedCat === c}
            onClick={() => setSelectedCat(c)}
            className={`chip text-xs py-1.5 px-4 cursor-pointer ${
              selectedCat === c ? 'border-rose-400 bg-rose-500/10' : ''
            }`}
          >
            {c === 'All' ? 'All posts' : c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((p, idx) => {
          const isBig = idx === 0 && selectedCat === 'All';
          return (
            <div
              key={p.url}
              onClick={() => navigate(p.url)}
              className={`glass glow rounded-3xl overflow-hidden block text-left no-underline text-inherit tool-card cursor-pointer fade ${
                isBig ? 'md:col-span-2' : ''
              }`}
            >
              <div
                className="relative overflow-hidden flex items-end p-4"
                style={{
                  height: isBig ? '17.5rem' : '12.5rem',
                  background: p.grad,
                }}
              >
                {p.img ? (
                  <>
                    <img
                      src={p.img}
                      alt={p.title}
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(24,10,16,0.58), rgba(24,10,16,0.06) 55%)',
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center p-4 pb-8"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(24,10,16,0.28), rgba(24,10,16,0.62))',
                    }}
                  >
                    {renderHeroSvg(p.hero, idx)}
                  </div>
                )}

                <span
                  className="chip relative z-10"
                  style={{
                    padding: '.2rem .8rem',
                    fontSize: '.8rem',
                    background: 'rgba(255,255,255,.9)',
                    color: '#3b1a22',
                    borderColor: 'transparent',
                    fontWeight: 500,
                  }}
                >
                  {p.cat}
                </span>
              </div>

              <div className="p-6">
                <h2
                  className="serif gt font-medium"
                  style={{ fontSize: isBig ? '2.4rem' : '1.75rem', lineHeight: 1.15 }}
                >
                  {p.title}
                </h2>
                <p className="muted text-xs sm:text-sm mt-2 leading-relaxed">{p.blurb}</p>
                <div className="mt-5 flex items-center justify-between text-xs pt-3 border-t border-rose-200/10">
                  <span className="muted">{p.read}</span>
                  <span className="gt font-semibold">Read the guide &rarr;</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ShowcaseBanner
        title="Try the tools behind the guides"
        subtitle="Every article is supported by free interactive tools. Open one now."
        pick={['sizing', 'care', 'styling']}
      />

      <AdPromoBanner />
    </main>
  );
};
