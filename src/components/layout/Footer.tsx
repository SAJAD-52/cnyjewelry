import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  const pages = [
    { slug: 'index', label: 'Home' },
    { slug: 'vault', label: 'Jewelry Box' },
    { slug: 'planner', label: 'Look Planner' },
    { slug: 'sizing', label: 'Size guide' },
    { slug: 'styling', label: 'Metal match' },
    { slug: 'care', label: 'Care' },
    { slug: 'gift', label: 'Gift finder' },
    { slug: 'blog', label: 'Blog' },
    { slug: 'wishlist', label: 'Wishlist' },
    { slug: 'layering', label: 'Layering' },
    { slug: 'anniversary', label: 'Anniversary gifts' },
    { slug: 'gold', label: 'Gold calculator' },
    { slug: 'diamond', label: 'Diamond size' },
    { slug: 'earrings', label: 'Earring finder' },
    { slug: 'privacy', label: 'Privacy and ads' },
  ];

  const guides = [
    { slug: 'how-to-measure-ring-size-at-home', label: 'Measure Ring Size at Home' },
    { slug: 'how-to-untangle-a-necklace', label: 'Untangle Fine Gold Chains' },
    { slug: 'shop/necklaces/14k-yellow-gold-necklace-with-devil-emoji-symbol', label: 'Devil emoji necklace' },
    { slug: 'how-to-clean-sterling-silver-at-home', label: 'Clean Sterling Silver Guide' },
    { slug: 'why-does-gold-turn-skin-green', label: 'Gold Turning Skin Green' },
    { slug: 'product-category/rings', label: 'Rings guide' },
    { slug: 'what-earrings-are-trending-now', label: 'Earring trends' },
    { slug: 'shop/rings/14k-white-and-rose-gold-doulbe-diamond-infinity-design-band-3-8-cttw', label: 'Diamond infinity band' },
  ];

  return (
    <footer className="mx-auto max-w-6xl px-5 py-12 border-t mt-20" style={{ borderColor: 'rgba(243,226,179,.1)' }}>
      <div className="flex flex-wrap justify-between gap-6">
        <div>
          <button
            onClick={() => navigate('index')}
            className="brand flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
              <defs>
                <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f3e2b3" />
                  <stop offset="0.55" stopColor="#e8b4b8" />
                  <stop offset="1" stopColor="#b76e79" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="25" r="11" fill="none" stroke="url(#footer-logo-grad)" strokeWidth="2.6" />
              <polygon points="14,5 26,5 31,10 20,19 9,10" fill="url(#footer-logo-grad)" />
            </svg>
            <span>
              <span className="serif gt text-2xl font-medium tracking-tight">McGee</span>
              <span className="text-[10px] tracking-widest text-[#b76e79] ml-1 font-sans uppercase font-bold">
                JEWELRY
              </span>
            </span>
          </button>
          <p className="muted text-sm mt-2 max-w-sm">
            Fine jewelry tools and style guides. Upgrade to Pro for unlimited access.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm muted" aria-label="Footer">
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => navigate(p.slug)}
              className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-inherit text-left"
            >
              {p.label}
            </button>
          ))}
        </nav>
      </div>

      <nav className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm muted mt-6" aria-label="Guides">
        {guides.map((g) => (
          <button
            key={g.slug}
            onClick={() => navigate(g.slug)}
            className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-inherit text-left"
          >
            {g.label}
          </button>
        ))}
      </nav>

      <p className="muted text-xs mt-8">
        © 2026 McGee Jewelry. Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.
      </p>
    </footer>
  );
};
