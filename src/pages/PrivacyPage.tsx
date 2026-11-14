import React from 'react';
import { Shield, Eye, DollarSign, Mail } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl gt text-[var(--ink)]">Privacy, ads and affiliate links</h1>
        <p className="muted text-lg mt-3">How McGee Jewelry handles your data, advertising, and commissions.</p>
      </div>

      <div className="glass p-8 md:p-10 rounded-2xl grid gap-8 border border-[var(--border)]">
        <div>
          <h2 className="text-2xl gt text-[var(--gold)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--gold)]" /> Your Data &amp; Security
          </h2>
          <p className="muted mt-2 text-sm md:text-base leading-relaxed">
            The tools on this site run directly in your browser. Photos you upload for undertone and metal analysis are processed on your device using client-side canvas routines and are never sent or stored on remote servers. Your wishlist, jewelry box vault, cost-per-wear plans, and custom preferences are stored safely in your browser’s local storage. You can export, reset, or clear them at any time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl gt text-[var(--gold)] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--gold)]" /> Advertising
          </h2>
          <p className="muted mt-2 text-sm md:text-base leading-relaxed">
            This site may show ads from third-party networks such as Google AdSense. These partners may use cookies to show and measure ads, with your permission where the law requires it. Pro subscribers enjoy an ad-free experience across all calculators and studio workspaces. You can manage personalized ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--gold)]">adssettings.google.com</a> or <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--gold)]">aboutads.info</a>.
          </p>
        </div>

        <div>
          <h2 className="text-2xl gt text-[var(--gold)] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[var(--gold)]" /> Affiliate Disclosures
          </h2>
          <p className="muted mt-2 text-sm md:text-base leading-relaxed">
            Some links to products, precious metal suppliers, or independent bench jewellers are affiliate links. If you make a purchase through them, we may earn a small referral commission at no extra cost to you. Recommendations are chosen for craftsmanship, fit, and metal purity—never for commercial payout.
          </p>
        </div>

        <div>
          <h2 className="text-2xl gt text-[var(--gold)] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--gold)]" /> Contact &amp; Support
          </h2>
          <p className="muted mt-2 text-sm md:text-base leading-relaxed">
            Have questions about our calculation engines, scrap melt valuations, or privacy practices? Reach our team at <a href="mailto:said.cpge24@gmail.com" className="underline text-[var(--gold)]">said.cpge24@gmail.com</a>.
          </p>
        </div>

        <p className="muted text-xs border-t border-[var(--border)] pt-4">
          This page is a general disclosure template for informational purposes. McGee Jewelry tools and valuations are intended for personal guidance and jewelry education.
        </p>
      </div>
    </div>
  );
};
