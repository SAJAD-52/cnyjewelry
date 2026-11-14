import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdPromoBanner: React.FC = () => {
  const { openProModal, navigate, formatPrice } = useApp();
  const priceLabel = formatPrice(6);

  return (
    <div
      className="glass glow p-6 md:p-8 my-10 rounded-3xl text-center max-w-4xl mx-auto"
      style={{ border: '1px solid rgba(243,226,179,0.25)' }}
    >
      <span
        className="chip text-xs inline-block mb-1"
        style={{ background: 'rgba(243,226,179,0.15)', color: '#b76e79' }}
      >
        ✨ MCGEE JEWELRY PRO
      </span>
      <h3 className="serif text-2xl md:text-4xl gt mt-2">Elevate Your Jewelry Collection</h3>
      <p className="muted text-sm md:text-base mt-2 max-w-lg mx-auto">
        Get unlimited access to the Jewelry Box value tracker, live metal calculators, and styling guides for only{' '}
        <b className="gt">{priceLabel} a month</b>.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        <button
          onClick={() => openProModal(false)}
          className="btn btn-gold text-xs shadow-md"
          style={{ padding: '.45rem 1.3rem' }}
        >
          Upgrade to Pro ({priceLabel}/mo) &rarr;
        </button>
        <button
          onClick={() => navigate('vault')}
          className="btn btn-ghost text-xs"
          style={{ padding: '.45rem 1.3rem' }}
        >
          Open Jewelry Box
        </button>
      </div>
    </div>
  );
};
