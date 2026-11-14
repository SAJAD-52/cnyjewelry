import React from 'react';
import { useApp, ALL_TOOL_SLUGS, STRIPE_BASE } from '../../context/AppContext';

export const ProModal: React.FC = () => {
  const {
    isProModalOpen,
    closeProModal,
    remainingTries,
    formatPrice,
    currentUser,
    openAuthModal,
  } = useApp();

  if (!isProModalOpen) return null;

  const priceLabel = formatPrice(6);

  const stripeUrl = currentUser?.email
    ? `${STRIPE_BASE}?prefilled_email=${encodeURIComponent(currentUser.email)}`
    : STRIPE_BASE;

  const features = [
    { icon: '👑', t: 'My Jewelry Box & Value Vault', d: 'Track collection weight, gold melt value & insurance dossiers' },
    { icon: '🗓️', t: 'Lookbook & Outfit Planner', d: 'Weekly 7-day look planning & 30-day Cost-Per-Wear analysis' },
    { icon: '💍', t: 'Ring & Bracelet Sizer', d: 'US, UK, EU and Japan sizes with life-scale preview' },
    { icon: '🪙', t: 'Gold Karat & Value Calculator', d: 'Real-time 10k–24k melt values and investment estimates' },
    { icon: '💎', t: 'Diamond Carat Visualizer', d: 'Exact millimeter-to-carat finger scale on hand simulator' },
    { icon: '✨', t: 'Photo & Undertone Analyzer', d: 'Browser-based metal detection & gem color matching' },
    { icon: '📿', t: 'Necklace Layering Studio', d: 'Recommended chain lengths and spacing for 6 necklines' },
    { icon: '🎨', t: 'Metal & Skin Undertone Match', d: 'Gold, silver and rose gold flattering guide' },
    { icon: '🎁', t: '4-Question Smart Gift Finder', d: 'Custom jewelry gift recommendations by style and budget' },
    { icon: '🧿', t: 'Beading Board & Pattern Designer', d: 'Millimeter bracelet patterns, bead counts, BOM CSV & blueprints' },
    { icon: '♡', t: 'Synced Pro Wishlist', d: 'Save unlimited pieces and styling sets across devices' }
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
            ✨ MCGEE JEWELRY PRO
          </span>
          <h2 className="serif text-3xl md:text-5xl gt mt-3">Free Try Used For This Studio</h2>
          <p className="muted text-sm md:text-base mt-2 max-w-lg mx-auto">
            You have used your 1 free try for this feature ({remainingTries}/{ALL_TOOL_SLUGS.length} total tries remaining). Subscribe for <b className="gt">{priceLabel}/month</b> to unlock all {ALL_TOOL_SLUGS.length} tools with unlimited access.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5 mt-5 max-h-[44vh] overflow-y-auto pr-1">
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

        <div className="mt-6 flex flex-col gap-2.5 items-center">
          <a
            href={stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold w-full text-center py-3.5 text-base md:text-lg font-medium shadow-lg justify-center no-underline"
            style={{ letterSpacing: '0.02em' }}
          >
            Unlock All {ALL_TOOL_SLUGS.length} Studios &nbsp;&rarr;&nbsp; {priceLabel}/month
          </a>
          <p className="muted text-xs mt-0.5 text-center">
            Instant access &middot; Secure checkout via Stripe &middot; Cancel anytime in 1 click
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
