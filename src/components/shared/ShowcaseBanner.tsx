import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface ShowcaseProps {
  title?: string;
  subtitle?: string;
  pick?: string[];
}

interface ToolItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  slug: string;
  cta: string;
  icon: string;
}

export const ShowcaseBanner: React.FC<ShowcaseProps> = ({
  title = 'Put this guide to work',
  subtitle = 'Twelve free tools, built for jewelry. Pick one and try it right now.',
  pick = [],
}) => {
  const { navigate } = useApp();
  const [curCategory, setCurCategory] = useState('all');

  const tools: ToolItem[] = [
    { id: 'sizing', category: 'fit', title: 'Ring & Bracelet Sizer', desc: 'Slide to your size. US, UK, EU and Japan sizes at once.', slug: 'sizing', cta: 'Find my size', icon: 'ring' },
    { id: 'diamond', category: 'fit', title: 'Diamond Size Visualizer', desc: 'See any carat weight at scale on a finger.', slug: 'diamond', cta: 'See the carat', icon: 'gem' },
    { id: 'styling', category: 'style', title: 'Metal & Undertone Matcher', desc: 'Metals and gems that glow against your skin.', slug: 'styling', cta: 'Match my metal', icon: 'palette' },
    { id: 'layering', category: 'style', title: 'Necklace Layering Guide', desc: 'Chain lengths that sit right with your neckline.', slug: 'layering', cta: 'Layer my chains', icon: 'layers' },
    { id: 'earrings', category: 'style', title: 'Earring Face-Shape Finder', desc: 'Earrings that flatter, plus sensitive-ear tips.', slug: 'earrings', cta: 'Find my earrings', icon: 'drop' },
    { id: 'care', category: 'care', title: 'Jewelry Care Guide', desc: 'Clean and store gold, silver, pearls and more.', slug: 'care', cta: 'Care for mine', icon: 'sparkle' },
    { id: 'gift', category: 'gift', title: 'Gift Finder Quiz', desc: 'Four questions, three gift ideas she will wear.', slug: 'gift', cta: 'Find a gift', icon: 'gift' },
    { id: 'anniversary', category: 'gift', title: 'Anniversary Gifts by Year', desc: 'Traditional gifts and gemstones for years 1 to 60.', slug: 'anniversary', cta: 'Find my year', icon: 'calendar' },
    { id: 'gold', category: 'value', title: 'Gold Karat & Value Calculator', desc: 'Compare karats and estimate melt value.', slug: 'gold', cta: 'Calculate', icon: 'coins' },
    { id: 'vault', category: 'value', title: 'My Jewelry Box & Value Vault', desc: 'Catalog pieces and calculate scrap melt value.', slug: 'vault', cta: 'Open Box', icon: 'ring' },
    { id: 'planner', category: 'style', title: 'Lookbook & Outfit Planner', desc: 'Weekly look planning and cost-per-wear tracking.', slug: 'planner', cta: 'Start planning', icon: 'calendar' },
    { id: 'wishlist', category: 'gift', title: 'Wishlist', desc: 'Save ideas from any tool. Stays on your device.', slug: 'wishlist', cta: 'Open wishlist', icon: 'heart' }
  ];

  const categories = [
    { id: 'all', label: 'All tools' },
    { id: 'fit', label: 'Size & fit' },
    { id: 'style', label: 'Style' },
    { id: 'care', label: 'Care' },
    { id: 'gift', label: 'Gifts' },
    { id: 'value', label: 'Value' }
  ];

  const filtered = tools
    .filter((t) => curCategory === 'all' || t.category === curCategory)
    .sort((a, b) => {
      const aPicked = pick.includes(a.id) ? 1 : 0;
      const bPicked = pick.includes(b.id) ? 1 : 0;
      return bPicked - aPicked;
    });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'ring':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="15" r="6" />
            <path d="M9 4l3-2 3 2-3 4z" />
          </svg>
        );
      case 'gem':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 12L2 9z" />
            <path d="M2 9h20M9 3l3 18 3-18" />
          </svg>
        );
      case 'palette':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-1 1.2-1.8-.4-1 .2-2.2 1.6-2.2H17a4 4 0 0 0 4-4c0-5-4-10-9-10z" />
            <circle cx="7.5" cy="11" r="1" />
            <circle cx="10.5" cy="7" r="1" />
            <circle cx="15.5" cy="7.5" r="1" />
          </svg>
        );
      case 'layers':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5z" />
            <path d="M2 12l10 5 10-5M2 17l10 5 10-5" />
          </svg>
        );
      case 'drop':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4.5" r="2" />
            <path d="M12 7v3M12 10c-3.5 3.5-3.5 9 0 10.5 3.5-1.5 3.5-7 0-10.5z" />
          </svg>
        );
      case 'sparkle':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
            <path d="M19 16v4M17 18h4" />
          </svg>
        );
      case 'gift':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="4" />
            <rect x="5" y="12" width="14" height="9" />
            <path d="M12 8v13" />
          </svg>
        );
      case 'calendar':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
        );
      case 'coins':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
            <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
          </svg>
        );
    }
  };

  return (
    <section className="my-14 mx-auto max-w-5xl">
      <div className="glass p-6 md:p-8 rounded-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl gt">{title}</h2>
            <p className="muted mt-2 max-w-xl text-sm md:text-base">{subtitle}</p>
          </div>
          <button onClick={() => navigate('index')} className="btn btn-gold text-xs">
            Browse all tools
          </button>
        </div>

        <div role="tablist" aria-label="Tool categories" className="flex flex-wrap gap-2 mt-6">
          {categories.map((c) => (
            <button
              key={c.id}
              className="chip text-xs"
              style={{ padding: '.35rem .95rem' }}
              role="tab"
              aria-selected={curCategory === c.id}
              onClick={() => setCurCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
          {filtered.map((t) => {
            const isPicked = pick.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => navigate(t.slug)}
                className="tool-card glass p-5 rounded-2xl block text-left no-underline text-inherit cursor-pointer relative"
              >
                {isPicked && (
                  <span
                    className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(243,226,179,0.25)', color: '#b76e79' }}
                  >
                    For this guide
                  </span>
                )}
                <div className="text-rose-400 mb-2">{renderIcon(t.icon)}</div>
                <b className="serif block text-lg font-medium leading-tight">{t.title}</b>
                <span className="muted text-xs block mt-1 leading-snug">{t.desc}</span>
                <span className="gt text-xs font-semibold block mt-3">{t.cta} &rarr;</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
