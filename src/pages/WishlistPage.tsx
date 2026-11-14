import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeWishlist, clearWishlist, navigate, markFeatureUsed } = useApp();
  const [copyMsg, setCopyMsg] = useState('');

  useEffect(() => {
    markFeatureUsed('wishlist');
  }, []);

  const handleCopyList = () => {
    if (!wishlist.length) return;
    const text = wishlist.map((x) => `- ${x.label}${x.note ? ` (${x.note})` : ''}`).join('\n');
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMsg('Copied to clipboard!');
        setTimeout(() => setCopyMsg(''), 3000);
      })
      .catch(() => {
        setCopyMsg('Copy failed. Please copy manually.');
      });
  };

  const handleClear = () => {
    if (window.confirm('Remove all saved items from your wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Personal Vault</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Your wishlist</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Saved privately on this device. Bookmark pieces from any guide or styling tool to build your bespoke jewelry capsule.
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button onClick={handleCopyList} className="btn btn-gold text-xs cursor-pointer shadow-md">
              Copy List to Clipboard
            </button>
            <button onClick={handleClear} className="btn btn-ghost text-xs cursor-pointer text-red-300">
              Clear All
            </button>
            {copyMsg && <span className="text-xs text-emerald-400 font-medium">{copyMsg}</span>}
          </div>

          <ul className="grid md:grid-cols-2 gap-4 p-0 list-none">
            {wishlist.map((it) => (
              <li
                key={it.id}
                className="glass p-5 rounded-2xl flex items-center justify-between gap-4 fade"
              >
                <div>
                  <h3 className="serif text-2xl gt font-semibold">{it.label}</h3>
                  {it.note && <p className="muted text-xs mt-1">{it.note}</p>}
                </div>
                <button
                  onClick={() => removeWishlist(it.id)}
                  className="btn btn-ghost text-xs shrink-0 cursor-pointer"
                  style={{ padding: '.35rem 1rem' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="glass p-12 text-center max-w-xl mx-auto rounded-3xl">
          <div className="text-4xl gt mb-2">♡</div>
          <h2 className="serif text-3xl gt">Nothing saved yet</h2>
          <p className="muted text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Tap the &ldquo;♡ Save&rdquo; button on any gift idea, gemstone pairing, or chain guide, and it will appear here in your private wishlist.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button onClick={() => navigate('gift')} className="btn btn-gold text-xs">
              Find a gift
            </button>
            <button onClick={() => navigate('styling')} className="btn btn-ghost text-xs">
              Match your metal
            </button>
          </div>
        </div>
      )}

      <AdPromoBanner />
    </main>
  );
};
