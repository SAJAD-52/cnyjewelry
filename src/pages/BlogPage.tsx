import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/blogData';
import { ShowcaseBanner } from '../components/shared/ShowcaseBanner';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const CATEGORIES = ['All', 'Guides', 'Care', 'Spotlight', 'Trends', 'Seasonal', 'Buying advice'];

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
                style={{
                  height: isBig ? '11rem' : '7.5rem',
                  background: p.grad,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.25rem',
                }}
              >
                <span
                  className="chip"
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
