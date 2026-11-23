import React, { useState } from 'react';
import { useApp, ALL_TOOL_SLUGS, STRIPE_BASE } from '../../context/AppContext';

export const ProModal: React.FC = () => {
  const {
    isProModalOpen,
    closeProModal,
    remainingTries,
    formatPrice,
    currentUser,
    openAuthModal,
    t,
    trackEvent,
    currentLocale,
  } = useApp();

  const [guestEmail, setGuestEmail] = useState('');

  if (!isProModalOpen) return null;

  const priceLabel = formatPrice(6);
  const dailyLabel = formatPrice(0.20);
  const checkoutEmail = currentUser?.email || guestEmail.trim();
  const stripeUrl = checkoutEmail
    ? `${STRIPE_BASE}?prefilled_email=${encodeURIComponent(checkoutEmail)}`
    : STRIPE_BASE;

  const features = [
    { icon: '✨', t: 'Daily 10s Ritual & Tarnish Shield', d: 'Morning stack match, cleaning radar & partner size card' },
    { icon: '👑', t: 'My Jewelry Box & Value Vault', d: 'Unlimited collection photos, gold melt value & insurance sheets' },
    { icon: '🗓️', t: '7-Day Lookbook & CPW Diary', d: 'Full week outfit planner & 30-day Cost-Per-Wear tracking' },
    { icon: '💍', t: 'Ring & Bracelet Sizer', d: 'US, UK, EU & Japan scales with Size Passport sync' },
    { icon: '🪙', t: 'Gold Karat & Value Calculator', d: 'Real-time 10k–24k bullion & scrap values in local currency' },
    { icon: '💎', t: 'Diamond Carat Visualizer', d: 'Exact millimeter-to-carat finger scale on hand simulator' },
    { icon: '📿', t: 'Necklace Layering & Ear Match', d: 'Chain lengths, spacing & face-shape earring pairings' },
    { icon: '🧿', t: 'Beading Board & Wishlist Sync', d: 'Millimeter bracelet patterns, BOM CSV & cloud wishlist' },
  ];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto"
      style={{
        background: 'rgba(18,10,14,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProModal();
      }}
    >
      <div
        className="glass glow p-6 md:p-8 rounded-3xl max-w-2xl w-full relative my-auto"
        style={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(243,226,179,0.25)',
        }}
      >
        <button
          onClick={closeProModal}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          className="muted hover:text-white border-0"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center">
          <span
            className="chip text-xs inline-block"
            style={{
              padding: '0.25rem 0.9rem',
              background: 'rgba(243,226,179,0.15)',
              borderColor: '#b76e79',
              color: '#f3e2b3',
            }}
          >
            {t('pro.badge', '✨ MCGEE JEWELRY PRO')}
          </span>
          <h2 className="serif text-3xl md:text-5xl gt mt-3">
            {t('pro.title_unlock', 'Unlock Your Daily Jewelry Concierge')}
          </h2>
          <p className="muted text-sm md:text-base mt-2 max-w-lg mx-auto">
            Less than <b className="gt">{dailyLabel}/day</b> ({priceLabel}/month) for all {ALL_TOOL_SLUGS.length} studios unlimited ({remainingTries} free tries remaining).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5 mt-5 max-h-[40vh] overflow-y-auto pr-1">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(243,226,179,0.1)',
              }}
            >
              <span className="text-xl shrink-0">{f.icon}</span>
              <div className="text-left">
                <p className="text-sm font-medium gt leading-tight">{f.t}</p>
                <p className="muted text-xs mt-0.5 leading-snug">{f.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2.5 items-center">
          {!currentUser?.email && (
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter email for instant activation (optional)"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-rose-200/30 bg-white/85 text-slate-900"
            />
          )}
          <a
            href={stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('InitiateCheckout', {
                value: 6,
                currency: currentLocale.currency || 'USD',
                content_name: 'McGee Pro Membership',
              })
            }
            className="btn btn-gold w-full text-center py-3.5 text-base md:text-lg font-medium shadow-lg justify-center no-underline"
            style={{ letterSpacing: '0.02em' }}
          >
            Start Pro · {dailyLabel}/day ({priceLabel}/mo) &rarr;
          </a>
          <p className="muted text-xs mt-0.5 text-center">
            {t('pro.cancel', 'Instant activation via Stripe · Local currency checkout · Cancel in 1 click')}
          </p>
        </div>

        <div className="text-center mt-3 pt-3 border-t border-rose-200/10">
          <button
            onClick={() => {
              closeProModal();
              openAuthModal('login');
            }}
            className="text-xs muted hover:underline bg-transparent border-0 cursor-pointer"
          >
            Already subscribed? <b className="gt">Log in to your account</b>
          </button>
        </div>
      </div>
    </div>
  );
};
