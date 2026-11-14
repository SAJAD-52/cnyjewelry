import React, { useState } from 'react';
import { useApp, ALL_TOOL_SLUGS } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentRoute,
    navigate,
    currentLocale,
    openLocaleModal,
    formatPrice,
    theme,
    cycleTheme,
    wishlist,
    currentUser,
    isPro,
    remainingTries,
    openProModal,
    openAuthModal,
    openProfileModal,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const priceLabel = formatPrice(6);

  const navLinks = [
    { slug: 'vault', label: 'Jewelry Box' },
    { slug: 'planner', label: 'Look Planner' },
    { slug: 'sizing', label: 'Size guide' },
    { slug: 'styling', label: 'Metal match' },
  ];

  const moreLinks = [
    { slug: 'care', label: 'Care' },
    { slug: 'gift', label: 'Gift finder' },
    { slug: 'blog', label: 'Blog' },
    { slug: 'wishlist', label: 'Wishlist' },
    { slug: 'layering', label: 'Layering' },
    { slug: 'anniversary', label: 'Anniversary gifts' },
    { slug: 'gold', label: 'Gold calculator' },
    { slug: 'diamond', label: 'Diamond size' },
    { slug: 'earrings', label: 'Earring finder' },
    { slug: 'beading', label: 'Beading board' },
  ];

  const handleNav = (slug: string) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    navigate(slug);
  };

  const isCurrent = (slug: string) => currentRoute === slug;

  return (
    <header className="nav">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('index')}
          className="brand shrink-0 flex items-center gap-2 cursor-pointer bg-transparent border-0 text-left p-0"
          aria-label="McGee Jewelry home"
        >
          <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
            <defs>
              <linearGradient id="nav-logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e2b3" />
                <stop offset="0.55" stopColor="#e8b4b8" />
                <stop offset="1" stopColor="#b76e79" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="25" r="11" fill="none" stroke="url(#nav-logo-grad)" strokeWidth="2.6" />
            <polygon points="14,5 26,5 31,10 20,19 9,10" fill="url(#nav-logo-grad)" />
            <g stroke="rgba(60,30,40,.45)" strokeWidth="0.8" fill="none">
              <polyline points="9,10 31,10" />
              <polyline points="14,5 17,10 20,19 23,10 26,5" />
            </g>
          </svg>
          <span className="flex items-baseline gap-1">
            <span className="serif gt text-2xl font-medium tracking-tight">McGee</span>
            <span className="text-[10px] tracking-widest text-[#b76e79] hidden sm:inline font-sans uppercase font-bold">
              JEWELRY
            </span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex gap-1 items-center" aria-label="Main">
          {navLinks.map((link) => (
            <button
              key={link.slug}
              onClick={() => handleNav(link.slug)}
              className={`l whitespace-nowrap cursor-pointer border-0 bg-transparent text-sm py-1.5 px-3 rounded-full transition-all ${
                isCurrent(link.slug) ? 'active' : ''
              }`}
              aria-current={isCurrent(link.slug) ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}

          {/* Currency Pill */}
          <button
            onClick={openLocaleModal}
            className="l whitespace-nowrap flex items-center gap-1 font-medium text-xs py-1 px-2.5 rounded-full cursor-pointer"
            style={{
              color: '#b76e79',
              background: 'rgba(243,226,179,0.15)',
              border: '1px solid rgba(183,110,121,0.25)',
            }}
            title="Change Currency & Language"
          >
            <span>📍 {currentLocale.currency} ▾</span>
          </button>

          <button
            onClick={() => handleNav('gift')}
            className={`l whitespace-nowrap cursor-pointer border-0 bg-transparent text-sm py-1.5 px-3 rounded-full transition-all ${
              isCurrent('gift') ? 'active' : ''
            }`}
          >
            Gift finder
          </button>

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="l whitespace-nowrap cursor-pointer border-0 bg-transparent text-sm py-1.5 px-3 rounded-full flex items-center gap-1"
            >
              <span>More</span>
              <span className="text-[10px]">▾</span>
            </button>

            {moreDropdownOpen && (
              <div
                className="more-menu absolute right-0 top-10 min-w-[13rem] flex flex-col p-2 rounded-2xl glass shadow-2xl z-50"
                onClick={() => setMoreDropdownOpen(false)}
              >
                {moreLinks.map((link) => (
                  <button
                    key={link.slug}
                    onClick={() => handleNav(link.slug)}
                    className="text-left py-2 px-3 rounded-xl hover:bg-rose-500/10 text-sm flex items-center justify-between cursor-pointer border-0 bg-transparent text-inherit"
                  >
                    <span>{link.label}</span>
                    {link.slug === 'wishlist' && wishlist.length > 0 && (
                      <span className="rounded-full px-1.5 text-xs bg-[#b76e79] text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Pro Status / Free Tries, Theme, Auth, Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Pro / Free tries badge */}
          {isPro ? (
            <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold text-xs whitespace-nowrap">
              ⭐ Pro
            </span>
          ) : (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap hidden sm:inline-block"
              style={{
                background: 'rgba(243,226,179,0.2)',
                color: '#b76e79',
                border: '1px solid rgba(183,110,121,0.25)',
              }}
            >
              🎁 {remainingTries}/{ALL_TOOL_SLUGS.length} Free Tries
            </span>
          )}

          {/* Theme button */}
          <button
            onClick={cycleTheme}
            className="btn btn-ghost hidden sm:inline-flex text-xs py-1.5 px-3 rounded-full cursor-pointer"
            aria-label="Change color theme"
          >
            Theme: {theme === 'light' ? 'Blush' : theme === 'plum' ? 'Plum' : 'Midnight'}
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <button
              onClick={openProfileModal}
              className="btn btn-ghost text-xs py-1.5 px-2.5 whitespace-nowrap flex items-center gap-1.5 cursor-pointer rounded-full"
              title="View Profile"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-200 to-rose-400 text-[#3b1a22] font-bold text-[10px] flex items-center justify-center">
                {currentUser.email.charAt(0).toUpperCase()}
              </span>
              <span className="hidden md:inline">
                {currentUser.email.length > 12 ? `${currentUser.email.slice(0, 9)}...` : currentUser.email}
              </span>
            </button>
          ) : (
            <>
              {!isPro && (
                <button
                  onClick={() => openProModal(false)}
                  className="btn btn-gold text-xs py-1.5 px-3 whitespace-nowrap cursor-pointer rounded-full font-medium"
                >
                  Pro {priceLabel}
                </button>
              )}
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-ghost text-xs py-1.5 px-3 whitespace-nowrap cursor-pointer rounded-full"
              >
                Log in
              </button>
            </>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden btn btn-ghost py-1.5 px-3 text-xs rounded-full cursor-pointer"
            aria-expanded={mobileMenuOpen}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="xl:hidden px-4 pb-5 flex flex-col gap-1 border-t border-rose-200/20 pt-3" aria-label="Mobile">
          <div className="pb-2 mb-2 border-b border-rose-200/20">
            {currentUser ? (
              <div className="flex items-center justify-between text-xs py-1">
                <button onClick={openProfileModal} className="text-left font-medium gt cursor-pointer">
                  {currentUser.email}
                </button>
                <button onClick={logout} className="text-red-400 text-xs cursor-pointer">
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="btn btn-ghost flex-1 py-1.5 text-xs text-center"
                >
                  Log in
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openProModal(false); }}
                  className="btn btn-gold flex-1 text-center py-1.5 text-xs"
                >
                  Pro {priceLabel}/mo
                </button>
              </div>
            )}
          </div>

          {[...navLinks, ...moreLinks].map((link) => (
            <button
              key={link.slug}
              onClick={() => handleNav(link.slug)}
              className="text-left py-2 px-3 rounded-lg text-sm flex items-center justify-between cursor-pointer border-0 bg-transparent text-inherit"
            >
              <span>{link.label}</span>
              {link.slug === 'wishlist' && wishlist.length > 0 && (
                <span className="rounded-full px-2 py-0.5 text-xs bg-[#b76e79] text-white">
                  {wishlist.length}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 mt-2 border-t border-rose-200/20 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); openLocaleModal(); }}
              className="chip text-xs w-full text-center py-2 cursor-pointer"
            >
              📍 Currency: {currentLocale.currency} · {currentLocale.lang}
            </button>
            <button
              onClick={cycleTheme}
              className="btn btn-ghost text-xs w-full py-2 cursor-pointer text-center justify-center"
            >
              Switch Theme ({theme})
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
