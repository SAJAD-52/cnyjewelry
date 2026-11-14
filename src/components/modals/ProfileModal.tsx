import React from 'react';
import { useApp, ALL_TOOL_SLUGS, STRIPE_PORTAL } from '../../context/AppContext';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    closeProfileModal,
    currentUser,
    isPro,
    remainingTries,
    formatPrice,
    openProModal,
    wishlist,
    navigate,
    logout,
  } = useApp();

  if (!isProfileModalOpen || !currentUser) return null;

  const priceLabel = formatPrice(6);
  const email = currentUser.email || 'Member';
  const joinDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active';

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 overflow-y-auto"
      style={{
        background: 'rgba(18,10,14,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileModal();
      }}
    >
      <div
        className="glass glow p-6 md:p-8 rounded-3xl max-w-lg w-full relative my-auto"
        style={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(243,226,179,0.25)',
        }}
      >
        <button
          onClick={closeProfileModal}
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
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div
            style={{
              width: '3.2rem',
              height: '3.2rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#f3e2b3,#b76e79)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#3b1a22',
            }}
          >
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="serif text-2xl gt leading-tight">{email}</h2>
            <p className="muted text-xs">Member since {joinDate}</p>
          </div>
        </div>

        <div
          className="mt-6 p-4 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(243,226,179,0.15)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="muted text-xs uppercase tracking-wider">Current Plan</span>
              <h3 className={`serif text-2xl ${isPro ? 'gt' : ''}`}>
                {isPro ? 'Pro Member ⭐' : 'Free Visitor'}
              </h3>
            </div>
            <span
              className="chip"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.75rem',
                background: isPro ? 'rgba(243,226,179,0.2)' : undefined,
                color: isPro ? '#f3e2b3' : undefined,
                borderColor: isPro ? '#b76e79' : undefined,
              }}
            >
              {isPro
                ? `${priceLabel} / month`
                : `${remainingTries}/${ALL_TOOL_SLUGS.length} Free Tries Left`}
            </span>
          </div>

          {isPro ? (
            <>
              <p className="muted text-xs mt-2">
                Unlimited access to all jewelry tools, lookbook planner, and gold tracker.
              </p>
              <div className="mt-4 pt-3 border-t border-rose-200/10 flex flex-col gap-2">
                <a
                  href={STRIPE_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-xs text-center w-full flex items-center justify-center gap-2 no-underline"
                >
                  <span>Manage Billing & Invoices</span> &rarr;
                </a>
                <a
                  href={STRIPE_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-300 hover:text-red-400 text-center mt-1 underline"
                >
                  Cancel subscription in Stripe Portal
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="muted text-xs mt-2">
                You have {remainingTries} free studio tries left. Upgrade to unlock all features permanently.
              </p>
              <button
                onClick={() => {
                  closeProfileModal();
                  openProModal(false);
                }}
                className="btn btn-gold w-full mt-3 text-sm justify-center"
              >
                Upgrade to Pro ({priceLabel}/month)
              </button>
            </>
          )}
        </div>

        <div
          className="mt-4 p-4 rounded-2xl flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(243,226,179,0.08)',
          }}
        >
          <div>
            <span className="muted text-xs">Saved in Wishlist</span>
            <p className="text-sm font-semibold">{wishlist.length} jewelry items</p>
          </div>
          <button
            onClick={() => {
              closeProfileModal();
              navigate('wishlist');
            }}
            className="btn btn-ghost text-xs"
            style={{ padding: '.35rem .75rem' }}
          >
            View Wishlist
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-rose-200/10">
          <button
            onClick={() => {
              logout();
              closeProfileModal();
            }}
            className="text-red-400 text-xs hover:underline bg-transparent border-0 cursor-pointer"
          >
            Log out of this device
          </button>
          <button
            onClick={closeProfileModal}
            className="btn btn-ghost text-xs"
            style={{ padding: '.35rem .9rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
