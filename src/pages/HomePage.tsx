import React, { useState, useRef } from 'react';
import { useApp, CURRENCY_FLAGS } from '../context/AppContext';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

export const HomePage: React.FC = () => {
  const { navigate, openProModal, formatPrice, currentLocale, setCurrency, t } = useApp();

  // Widget 1: Interactive Ring Sizer
  const [usSize, setUsSize] = useState<number>(7);
  const ringDiameter = 11.63 + 0.8128 * usSize;
  const ringCircumference = Math.PI * ringDiameter;
  const ukSize = String.fromCharCode(70 + Math.round((usSize - 3) * 2)) + '½';
  const euSize = Math.round(ringCircumference);
  const jpSize = Math.round(ringCircumference - 40.8);

  // Widget 2: Photo & Undertone Analyzer
  const [photoAnalysis, setPhotoAnalysis] = useState<{
    metal: string;
    dominantColor: string;
    advice: string;
    undertone: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsAnalyzing(false);
          return;
        }
        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Classify metal & tone
        let metal = 'Yellow Gold';
        let undertone = 'Warm';
        let advice = 'Warm yellow gold brings out high reflectivity and compliments earthy, warm palettes.';

        if (r > 180 && g < 160 && b < 160) {
          metal = 'Rose Gold';
          undertone = 'Neutral to Warm';
          advice = 'Copper-alloy rose gold gives a soft romantic blush that flatters most complexions.';
        } else if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 140) {
          metal = 'White Gold / Sterling Silver';
          undertone = 'Cool';
          advice = 'Crisp, mirror-bright rhodium and silver shine effortlessly against cool undertones.';
        } else if (r > g && g > b) {
          metal = '14k / 18k Fine Yellow Gold';
          undertone = 'Warm / Olive';
          advice = 'Rich golden tones enhance natural skin warmth and contrast beautifully with neutral knits.';
        }

        setTimeout(() => {
          setPhotoAnalysis({
            metal,
            dominantColor: `rgb(${r}, ${g}, ${b})`,
            advice,
            undertone,
          });
          setIsAnalyzing(false);
        }, 600);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Widget 3: Necklace Layering Preview
  const [selectedNeckline, setSelectedNeckline] = useState<string>('Crew neck');
  const necklines: Record<string, { lengths: number[]; tip: string }> = {
    'Crew neck': { lengths: [40, 45, 60], tip: 'Sit the shortest chain above collar, let the longest drop below.' },
    'V-neck': { lengths: [45, 50, 60], tip: 'Echo the plunging V with a pendant on your longest strand.' },
    'Scoop neck': { lengths: [40, 45, 55], tip: 'Follow the curve and keep chains within 5 cm of the neckline.' },
    'Off-shoulder': { lengths: [35, 40, 45], tip: 'Short collar chokers frame bare collarbones best.' },
  };

  // Widget 4: Birthstone Finder
  const [birthMonth, setBirthMonth] = useState<number>(0);
  const birthstones = [
    { month: 'January', gem: 'Garnet', meaning: 'Protection, passion and constancy', col: '#7b1e2b' },
    { month: 'February', gem: 'Amethyst', meaning: 'Clarity, calm and courage', col: '#8a4b82' },
    { month: 'March', gem: 'Aquamarine', meaning: 'Serenity, hope and harmony', col: '#7fc4c9' },
    { month: 'April', gem: 'Diamond', meaning: 'Invincibility, purity and eternal love', col: '#e8b4b8' },
    { month: 'May', gem: 'Emerald', meaning: 'Growth, prosperity and renewal', col: '#2d7c52' },
    { month: 'June', gem: 'Pearl', meaning: 'Purity, wisdom and elegance', col: '#f8e8ee' },
    { month: 'July', gem: 'Ruby', meaning: 'Vitality, devotion and nobility', col: '#9c1c2e' },
    { month: 'August', gem: 'Peridot', meaning: 'Strength, joy and lightness', col: '#8a9b3a' },
    { month: 'September', gem: 'Sapphire', meaning: 'Truth, loyalty and wisdom', col: '#224488' },
    { month: 'October', gem: 'Opal / Tourmaline', meaning: 'Creativity, luck and optimism', col: '#d9a8bf' },
    { month: 'November', gem: 'Topaz / Citrine', meaning: 'Warmth, friendship and abundance', col: '#e2a336' },
    { month: 'December', gem: 'Tanzanite / Turquoise', meaning: 'Intuition, peace and transformation', col: '#3a7b9e' },
  ];

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-20 pt-6 sm:pt-10 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center pt-2 sm:pt-6 md:pt-12 pb-14 md:pb-20 relative">
        <div className="relative z-10 text-left">
          <p
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs mb-4 glass border border-rose-300/30"
            style={{ color: '#b76e79' }}
          >
            ✦ {t('hero.eyebrow', 'Daily Jewelry Ritual · Live Gold Vault · 14 Studios')}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal hero-title-shimmer leading-[1.08] tracking-tight">
            {t('hero.title', 'Your daily jewelry ritual & value vault, in one studio.')}
          </h1>

          <p className="muted text-base sm:text-lg mt-4 sm:mt-5 max-w-lg leading-relaxed">
            {t('hero.sub', 'Pick your morning jewelry stack in 10 seconds, protect pieces from tarnish, track live 10k–24k gold melt value, and share your exact size passport.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-7 sm:mt-8">
            <button
              onClick={() => navigate('ritual')}
              className="btn btn-gold text-center py-3.5 sm:py-3 shadow-lg text-sm sm:text-base font-medium justify-center cursor-pointer"
            >
              {t('hero.cta_ritual', 'Start Today’s 10s Ritual →')}
            </button>
            <button
              onClick={() => navigate('vault')}
              className="btn btn-ghost text-center py-3.5 sm:py-3 text-sm justify-center cursor-pointer"
            >
              👑 {t('hero.cta_vault', 'Open My Jewelry Box')}
            </button>
            <button
              onClick={() => openProModal(false)}
              className="btn btn-ghost text-center py-3.5 sm:py-3 text-sm justify-center cursor-pointer"
            >
              ✨ Pro ({formatPrice(0.20)}/day)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-4" aria-label="Switch currency">
            <span className="text-[11px] muted mr-1">Currency:</span>
            {['USD', 'CAD', 'GBP', 'AUD', 'EUR'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrency(code)}
                className="chip text-[11px] py-1 px-2.5"
                aria-pressed={currentLocale.currency === code}
              >
                {CURRENCY_FLAGS[code]} {code}
              </button>
            ))}
          </div>

          {/* TRUST TICKER */}
          <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-rose-200/15 text-[11px] sm:text-xs muted text-center sm:text-left">
            <div>
              <b className="gt text-base sm:text-lg block serif leading-tight">14 Studios</b> Daily · Weekly · Monthly
            </div>
            <div>
              <b className="gt text-base sm:text-lg block serif leading-tight">Cloud Synced</b> Multi-device vault
            </div>
            <div>
              <b className="gt text-base sm:text-lg block serif leading-tight">Live Gold</b> Local currency rates
            </div>
          </div>
        </div>

        {/* HERO LUXURY ART */}
        <div className="flex justify-center relative mt-4 md:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/15 via-amber-200/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
          <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[270px] sm:max-w-sm md:max-w-md hero-float relative z-10"
            role="img"
            aria-label="A rose gold ring with a glowing diamond"
          >
            <defs>
              <linearGradient id="hero-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e2b3" />
                <stop offset="0.55" stopColor="#e8b4b8" />
                <stop offset="1" stopColor="#b76e79" />
              </linearGradient>
              <linearGradient id="hero-d" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" />
                <stop offset="0.6" stopColor="#f8d9e0" />
                <stop offset="1" stopColor="#e8b4b8" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="240" r="115" fill="none" stroke="url(#hero-g)" strokeWidth="18" className="draw hero-glow" />
            <circle cx="200" cy="240" r="96" fill="none" stroke="rgba(243,226,179,.25)" strokeWidth="1.2" />
            <g className="gem">
              <g className="shim">
                <polygon points="172,70 228,70 258,104 200,150 142,104" fill="url(#hero-d)" opacity="0.95" />
                <g stroke="#b76e79" strokeWidth="1.2" fill="none" opacity="0.7">
                  <polyline points="142,104 258,104" />
                  <polyline points="172,70 186,104 200,150 214,104 228,70" />
                  <polyline points="186,104 200,70 214,104" />
                </g>
              </g>
              <g fill="#f3e2b3">
                <path className="sparkle-star" d="M300 60l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" />
                <path className="sparkle-star" style={{ animationDelay: '1.5s' }} d="M96 130l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
              </g>
            </g>
          </svg>
        </div>
      </section>

      {/* FLAGSHIP SPOTLIGHT (RITUAL, VAULT & PLANNER) */}
      <section className="mb-14 sm:mb-18">
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => navigate('ritual')}
            className="glass glow p-6 sm:p-7 rounded-2xl sm:rounded-3xl block text-left no-underline text-inherit tool-card relative cursor-pointer"
            style={{ border: '1px solid rgba(243,226,179,0.28)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">✨</span>
              <span className="chip text-[11px] sm:text-xs" style={{ background: 'rgba(243,226,179,0.2)', color: '#b76e79' }}>
                DAILY HABIT
              </span>
            </div>
            <h2 className="serif text-2xl sm:text-3xl gt mt-3">Daily Ritual &amp; Size Passport</h2>
            <p className="muted mt-2 text-xs sm:text-sm leading-relaxed">
              10-second morning look &amp; tarnish safety check-in, Sunday cleaning radar, and 1-tap gift card for your partner.
            </p>
            <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-rose-200/10 text-xs">
              <span className="muted text-[11px] sm:text-xs">10s Check-In &amp; Streak</span>
              <b className="gt text-xs sm:text-sm font-semibold">Open Ritual &rarr;</b>
            </div>
          </button>

          <button
            onClick={() => navigate('vault')}
            className="glass glow p-6 sm:p-7 rounded-2xl sm:rounded-3xl block text-left no-underline text-inherit tool-card relative cursor-pointer"
            style={{ border: '1px solid rgba(243,226,179,0.28)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">👑</span>
              <span className="chip text-[11px] sm:text-xs" style={{ background: 'rgba(243,226,179,0.2)', color: '#b76e79' }}>
                PORTFOLIO STUDIO
              </span>
            </div>
            <h2 className="serif text-2xl sm:text-3xl gt mt-3">My Jewelry Box & Value Vault</h2>
            <p className="muted mt-2 text-xs sm:text-sm leading-relaxed">
              Catalog rings, chains and bracelets. Calculates pure gold grams, real-time melt values, and insurance records.
            </p>
            <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-rose-200/10 text-xs">
              <span className="muted text-[11px] sm:text-xs">10k&ndash;24k Melt Engine</span>
              <b className="gt text-xs sm:text-sm font-semibold">Open Box &rarr;</b>
            </div>
          </button>

          <button
            onClick={() => navigate('planner')}
            className="glass glow p-6 sm:p-7 rounded-2xl sm:rounded-3xl block text-left no-underline text-inherit tool-card relative cursor-pointer"
            style={{ border: '1px solid rgba(243,226,179,0.28)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🗓️</span>
              <span className="chip text-[11px] sm:text-xs" style={{ background: 'rgba(243,226,179,0.2)', color: '#b76e79' }}>
                STYLING STUDIO
              </span>
            </div>
            <h2 className="serif text-2xl sm:text-3xl gt mt-3">Jewelry Lookbook & Planner</h2>
            <p className="muted mt-2 text-xs sm:text-sm leading-relaxed">
              Plan jewelry outfits Monday to Sunday, log your 30-day wear diary, and uncover your true Cost-Per-Wear.
            </p>
            <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-rose-200/10 text-xs">
              <span className="muted text-[11px] sm:text-xs">7-Day Planner & Diary</span>
              <b className="gt text-xs sm:text-sm font-semibold">Start Planning &rarr;</b>
            </div>
          </button>
        </div>
      </section>

      {/* ALL 14 FEATURES IN ONE PLACE */}
      <section id="suite" className="mt-12 sm:mt-16" aria-labelledby="suite-heading">
        <div className="flex flex-wrap items-end justify-between mb-6 sm:mb-8 gap-2">
          <div>
            <span className="chip text-[11px] sm:text-xs mb-1.5 inline-block">Complete Suite</span>
            <h2 id="suite-heading" className="text-3xl sm:text-4xl md:text-5xl gt">
              The McGee Jewelry Studio
            </h2>
            <p className="muted text-xs sm:text-sm mt-1">
              Fourteen specialized interactive tools and rituals built exclusively for jewelry lovers.
            </p>
          </div>
          <span className="chip text-[11px] sm:text-xs">14 Active Tools</span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          <button onClick={() => navigate('sizing')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit sm:col-span-2 tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">◌</div>
              <span className="chip text-[11px] sm:text-xs">Sizing Studio</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Ring & bracelet size guide</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Slide to your size and see US, UK, EU and Japan sizes at once, with an interactive life-size ring.
            </p>
          </button>

          <button onClick={() => navigate('styling')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">◈</div>
              <span className="chip text-[11px] sm:text-xs">Color Match</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Metal & undertone match</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Discover whether yellow gold, silver, or rose gold brings out your natural skin glow.
            </p>
          </button>

          <button onClick={() => navigate('care')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">✧</div>
              <span className="chip text-[11px] sm:text-xs">Care Vault</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Jewelry care guide</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Gold, silver, pearls, and diamonds: what preserves their brilliance and what harms them.
            </p>
          </button>

          <button onClick={() => navigate('gift')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit sm:col-span-2 tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">❖</div>
              <span className="chip text-[11px] sm:text-xs">Smart Quiz</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Gift finder quiz</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Four thoughtful questions, three gift recommendations matched to her aesthetic and your budget.
            </p>
          </button>

          <button onClick={() => navigate('layering')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">⟡</div>
              <span className="chip text-[11px] sm:text-xs">Chains Studio</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Necklace layering guide</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Simulate chain lengths and spacing that drape effortlessly over 6 neckline styles.
            </p>
          </button>

          <button onClick={() => navigate('wishlist')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">♡</div>
              <span className="chip text-[11px] sm:text-xs">Wishlist Vault</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Wishlist</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Bookmark pieces from any guide or tool. Kept securely and privately on this device.
            </p>
          </button>

          <button onClick={() => navigate('anniversary')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">✦</div>
              <span className="chip text-[11px] sm:text-xs">Milestones</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Anniversary gifts by year</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Traditional gifts and gemstones curated for milestone anniversaries from years 1 to 60.
            </p>
          </button>

          <button onClick={() => navigate('gold')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit sm:col-span-2 tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">◍</div>
              <span className="chip text-[11px] sm:text-xs">Melt Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Gold karat and value</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Compare purity levels across 10k, 14k, 18k and 24k and calculate scrap melt value.
            </p>
          </button>

          <button onClick={() => navigate('diamond')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">◇</div>
              <span className="chip text-[11px] sm:text-xs">Carat Scale</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">How big is a carat?</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Visualize diamond carat weights at scale directly on a life-size finger model.
            </p>
          </button>

          <button onClick={() => navigate('earrings')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">❋</div>
              <span className="chip text-[11px] sm:text-xs">Face Match</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Earrings for your face shape</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Discover which studs, huggies, hoops, and chandelier drops harmonize with your facial structure.
            </p>
          </button>

          <button onClick={() => navigate('beading')} className="glass glow p-5 sm:p-6 md:p-7 block text-left no-underline text-inherit tool-card rounded-2xl sm:rounded-3xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl gt">🧿</div>
              <span className="chip text-[11px] sm:text-xs">Pattern Studio</span>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-3 sm:mt-4">Beading board &amp; pattern designer</h3>
            <p className="muted text-xs sm:text-sm mt-1.5">
              Arrange bracelet &amp; necklace bead patterns on a millimeter board with cord cut lengths and BOM estimates.
            </p>
          </button>
        </div>
      </section>

      {/* INTERACTIVE STUDIO 1: LIVE RING SIZER WIDGET */}
      <section id="size" className="mt-16 sm:mt-24 grid lg:grid-cols-2 gap-8 items-center scroll-mt-20">
        <div>
          <span className="chip text-[11px] sm:text-xs mb-2 inline-block">Live Interactive Sizer</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl gt">Find your size</h2>
          <p className="muted text-sm sm:text-base mt-3 max-w-md">
            Drag the slider to view your ring size in US, UK, EU and Japan at once. The glowing ring circle changes in real time to match millimeter scale.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <button onClick={() => navigate('sizing')} className="btn btn-gold text-xs py-2.5">
              Open full size guide
            </button>
          </div>
        </div>

        <div className="glass p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
          <div className="flex flex-wrap items-center justify-between mb-3 gap-1">
            <label htmlFor="home-size-slider" className="block font-medium text-sm sm:text-base">
              US Ring Size: <b className="serif text-3xl sm:text-4xl gt ml-1">{usSize}</b>
            </label>
            <span className="text-xs muted font-mono">
              {ringDiameter.toFixed(1)} mm &middot; {Math.round(ringCircumference)} mm circ.
            </span>
          </div>

          <input
            id="home-size-slider"
            type="range"
            min="3"
            max="13"
            step="0.5"
            value={usSize}
            onChange={(e) => setUsSize(parseFloat(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />

          <div className="flex justify-center my-6">
            <svg viewBox="0 0 240 240" className="w-48 h-48" role="img" aria-label="Interactive scale ring">
              <defs>
                <linearGradient id="ring-glow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f3e2b3" />
                  <stop offset="0.5" stopColor="#e8b4b8" />
                  <stop offset="1" stopColor="#b76e79" />
                </linearGradient>
              </defs>
              <circle
                cx="120"
                cy="120"
                r={ringDiameter * 4.4}
                fill="none"
                stroke="url(#ring-glow)"
                strokeWidth="12"
                style={{ filter: 'drop-shadow(0 0 16px rgba(232,180,184,0.6))' }}
              />
              <line
                x1={120 - ringDiameter * 4.4}
                y1="120"
                x2={120 + ringDiameter * 4.4}
                y2="120"
                stroke="#f3e2b3"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <text x="120" y="115" textAnchor="middle" fill="#f3e2b3" fontSize="12" fontFamily="sans-serif">
                {ringDiameter.toFixed(1)} mm
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="stat py-2 px-1">
              <span className="muted text-[10px]">UK / AU</span>
              <b className="gt text-lg">{ukSize}</b>
            </div>
            <div className="stat py-2 px-1">
              <span className="muted text-[10px]">EU (ISO)</span>
              <b className="gt text-lg">{euSize}</b>
            </div>
            <div className="stat py-2 px-1">
              <span className="muted text-[10px]">Japan</span>
              <b className="gt text-lg">{jpSize}</b>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE STUDIO 2: PHOTO & UNDERTONE ANALYZER WIDGET */}
      <section id="photo" className="mt-16 sm:mt-24 grid lg:grid-cols-2 gap-8 items-center scroll-mt-20">
        <div>
          <span className="chip text-[11px] sm:text-xs mb-2 inline-block">HTML5 Canvas Analyzer</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl gt">Photo & Metal Matcher</h2>
          <p className="muted text-sm sm:text-base mt-3 max-w-md">
            Upload a photo of your skin or favorite piece of jewelry. Our on-device analyzer samples the color palette directly in your browser without uploading to any remote server.
          </p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-gold text-xs py-2.5">
              Upload Photo &rarr;
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <div className="glass p-6 sm:p-8 rounded-3xl text-center">
          {photoAnalysis ? (
            <div className="fade text-left">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-10 h-10 rounded-full border border-white/40 shadow-inner"
                  style={{ backgroundColor: photoAnalysis.dominantColor }}
                />
                <div>
                  <h3 className="serif text-2xl gt">{photoAnalysis.metal}</h3>
                  <span className="muted text-xs">Detected Tone: {photoAnalysis.undertone}</span>
                </div>
              </div>
              <p className="muted text-sm leading-relaxed">{photoAnalysis.advice}</p>
              <button
                onClick={() => setPhotoAnalysis(null)}
                className="btn btn-ghost text-xs mt-4"
              >
                Test Another Photo
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-rose-300/40 rounded-2xl p-8 hover:border-rose-400 cursor-pointer transition-all"
            >
              <div className="text-3xl mb-2">📸</div>
              <h3 className="serif text-xl gt">
                {isAnalyzing ? 'Analyzing photo colors...' : 'Tap or drop a photo to analyze'}
              </h3>
              <p className="muted text-xs mt-1">
                Supports JPG, PNG, WEBP. Instant on-device color matching.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* INTERACTIVE STUDIO 3: NECKLACE LAYERING PREVIEW WIDGET */}
      <section id="layer" className="mt-16 sm:mt-24 grid lg:grid-cols-2 gap-8 items-center scroll-mt-20">
        <div>
          <span className="chip text-[11px] sm:text-xs mb-2 inline-block">Chains Drape Studio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl gt">Necklace Layering</h2>
          <p className="muted text-sm sm:text-base mt-3 max-w-md">
            Preview chain stacking for different collars and necklines. Prevent clashing lengths and keep chains from tangling.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {Object.keys(necklines).map((nl) => (
              <button
                key={nl}
                onClick={() => setSelectedNeckline(nl)}
                className={`chip text-xs ${selectedNeckline === nl ? 'border-rose-400 text-white' : ''}`}
                aria-pressed={selectedNeckline === nl}
              >
                {nl}
              </button>
            ))}
          </div>
        </div>

        <div className="glass p-6 sm:p-8 rounded-3xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="serif text-2xl gt">{selectedNeckline}</h3>
              <p className="muted text-xs mt-1">{necklines[selectedNeckline].tip}</p>
            </div>
            <button onClick={() => navigate('layering')} className="btn btn-ghost text-xs py-1 px-3">
              Full Guide &rarr;
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {necklines[selectedNeckline].lengths.map((len, idx) => (
              <div key={idx} className="stat flex items-center justify-between py-2.5 px-4">
                <span className="text-sm font-medium">Layer {idx + 1}</span>
                <span className="gt font-mono font-bold text-sm">
                  {len} cm / {(len / 2.54).toFixed(0)} inches
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE STUDIO 4: BIRTHSTONE FINDER WIDGET */}
      <section id="birth" className="mt-16 sm:mt-24 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="chip text-[11px] sm:text-xs mb-2 inline-block">Milestones & Lore</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl gt">Birthstone Finder</h2>
          <p className="muted text-sm sm:text-base mt-2">
            Select your birth month to reveal the traditional gemstone, its historical lore, and symbolic significance.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8">
          {birthstones.map((b, idx) => (
            <button
              key={b.month}
              onClick={() => setBirthMonth(idx)}
              className={`chip text-xs py-1 px-3 ${birthMonth === idx ? 'border-rose-400 font-bold' : ''}`}
              aria-pressed={birthMonth === idx}
            >
              {b.month.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="glass p-6 md:p-8 rounded-3xl max-w-xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 border border-white/50 shadow-lg"
            style={{ backgroundColor: birthstones[birthMonth].col }}
          />
          <h3 className="serif text-3xl gt">{birthstones[birthMonth].gem}</h3>
          <p className="text-sm font-medium text-rose-300 mt-1">{birthstones[birthMonth].month}</p>
          <p className="muted text-sm mt-3 leading-relaxed">
            {birthstones[birthMonth].meaning}
          </p>
        </div>
      </section>

      <AdPromoBanner />
    </main>
  );
};
