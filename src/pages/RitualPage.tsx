import React, { useState, useEffect } from 'react';
import { useApp, supabase } from '../context/AppContext';
import { VaultItem, WearLogItem, RitualCheckin } from '../types';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const CHECKINS_KEY = 'mcgee_daily_checkins';
const WEAR_KEY = 'koo_wear_history';
const VAULT_KEY = 'koo_jewelry_vault';
const PASSPORT_KEY = 'mcgee_passport';

const OCCASIONS = ['Work', 'Casual', 'Date Night', 'Workout / Travel', 'Special Event'];
const NECKLINES: Record<string, { stack: string; tip: string }> = {
  'Crew neck': {
    stack: '40 cm choker + 45 cm fine box chain + 58 cm coin pendant',
    tip: 'Pair with crisp huggies or 12 mm hoops so your collar feels balanced.',
  },
  'V-neck': {
    stack: '45 cm dainty bar + 52 cm drop pendant echoing the V',
    tip: 'Add slim threader earrings or petite studs to elongate the neckline.',
  },
  'Scoop neck': {
    stack: '40 cm herringbone + 48 cm bezel solitaire',
    tip: 'Curved medium hoops frame open collarbones naturally.',
  },
  'Off-shoulder': {
    stack: '36 cm diamond tennis collar or 40 cm pearl strand',
    tip: 'Skip heavy chains if wearing statement shoulder-grazing drops.',
  },
  'High neck': {
    stack: '65 cm–75 cm lariat or bold medallion chain over knitwear',
    tip: 'Sculptural gold studs polish high-neck sweaters cleanly.',
  },
};

const METALS = [
  {
    key: '14K Yellow Gold',
    alert: 'Solid 14K resists daily handwashing, but remove rings before chlorine pools or heavy gym weights to prevent scratches.',
  },
  {
    key: 'White Gold / Platinum',
    alert: 'Rhodium plating fades faster with harsh sanitizer and lotion—apply hand cream first, wait 3 minutes, then slide rings on.',
  },
  {
    key: 'Sterling Silver 925',
    alert: 'Keep silver in an anti-tarnish pouch away from humidity and sulfur. Wipe with a microfiber cloth right after wear.',
  },
  {
    key: 'Rose Gold',
    alert: 'Copper alloys give rose gold its blush hue—rinse sweat off after warm days to preserve its warm mirror glow.',
  },
  {
    key: 'Pearls / Opals',
    alert: 'Last on, first off: spray perfume and hairspray BEFORE putting on pearls or opals. Never use ultrasonic cleaners.',
  },
];

function computeStreak(checkins: RitualCheckin[], wears: WearLogItem[]): number {
  const dates: Record<string, boolean> = {};
  checkins.forEach((c) => {
    if (c.checkedOn) dates[c.checkedOn] = true;
  });
  wears.forEach((w) => {
    if (w.date) dates[w.date] = true;
  });
  const d = new Date();
  let todayStr = d.toISOString().slice(0, 10);
  if (!dates[todayStr]) {
    d.setDate(d.getDate() - 1);
    todayStr = d.toISOString().slice(0, 10);
  }
  let streak = 0;
  while (dates[todayStr]) {
    streak++;
    d.setDate(d.getDate() - 1);
    todayStr = d.toISOString().slice(0, 10);
  }
  return streak;
}

export const RitualPage: React.FC = () => {
  const { isPro, openProModal, currentUser, t, navigate } = useApp();

  const [occasion, setOccasion] = useState('Work');
  const [neckline, setNeckline] = useState('Crew neck');
  const [metal, setMetal] = useState('14K Yellow Gold');
  const [pieceInput, setPieceInput] = useState('');
  const [ritualStatus, setRitualStatus] = useState('');

  const [vault, setVault] = useState<VaultItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [wears, setWears] = useState<WearLogItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(WEAR_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [checkins, setCheckins] = useState<RitualCheckin[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CHECKINS_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [passport, setPassport] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PASSPORT_KEY) || '{}');
      return {
        ringSizeUs: Number(p.ring_size_us || p.ringSizeUs) || 7,
        wristCm: Number(p.wrist_cm || p.wristCm) || 16,
        undertone: p.undertone || 'Warm',
        preferredMetal: p.preferred_metal || p.preferredMetal || '14K Yellow Gold',
      };
    } catch {
      return { ringSizeUs: 7, wristCm: 16, undertone: 'Warm', preferredMetal: '14K Yellow Gold' };
    }
  });
  const [passportMsg, setPassportMsg] = useState('');

  useEffect(() => {
    if (!currentUser?.id) return;
    supabase
      .from('daily_checkins')
      .select('id, checked_on, occasion, neckline, metal_mood, piece_names')
      .eq('user_id', currentUser.id)
      .order('checked_on', { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: RitualCheckin[] = data.map((r: any) => ({
            id: r.id,
            checkedOn: r.checked_on,
            occasion: r.occasion,
            neckline: r.neckline,
            metalMood: r.metal_mood,
            pieceNames: Array.isArray(r.piece_names) ? r.piece_names : [],
          }));
          setCheckins(mapped);
          try { localStorage.setItem(CHECKINS_KEY, JSON.stringify(mapped)); } catch {}
        }
      });
  }, [currentUser?.id]);

  const handleLogRitual = async () => {
    if (!isPro && checkins.length >= 5) {
      setRitualStatus('Free limit of 5 check-ins reached. Upgrade to Pro for unlimited daily streaks.');
      openProModal(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const pieces = pieceInput
      .split(/\+|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    const entry: RitualCheckin = {
      checkedOn: today,
      occasion,
      neckline,
      metalMood: metal,
      pieceNames: pieces.length ? pieces : [metal + ' Stack'],
    };

    const nextCheckins = [entry, ...checkins].slice(0, 60);
    setCheckins(nextCheckins);
    try { localStorage.setItem(CHECKINS_KEY, JSON.stringify(nextCheckins)); } catch {}

    const newWears = entry.pieceNames.map((nm, idx) => ({
      id: `${Date.now()}_${idx}`,
      date: today,
      pieceName: nm,
      vibe: occasion,
    }));
    const nextWears = [...newWears, ...wears];
    setWears(nextWears);
    try { localStorage.setItem(WEAR_KEY, JSON.stringify(nextWears)); } catch {}

    if (currentUser?.id) {
      try {
        await supabase.from('daily_checkins').insert({
          user_id: currentUser.id,
          checked_on: today,
          occasion,
          neckline,
          metal_mood: metal,
          piece_names: entry.pieceNames,
        });
      } catch {}
    }

    setRitualStatus('✓ Today’s ritual & wear streak logged!');
    setTimeout(() => setRitualStatus(''), 3500);
  };

  const handleMarkCleaned = (itemId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = vault.map((v) =>
      v.id === itemId ? ({ ...v, lastCleanedAt: today } as VaultItem & { lastCleanedAt: string }) : v
    );
    setVault(updated);
    try { localStorage.setItem(VAULT_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleDownloadIcs = () => {
    const now = new Date();
    const diff = (7 - now.getDay()) % 7 || 7;
    const sun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff, 10, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp =
      sun.getFullYear() +
      pad(sun.getMonth() + 1) +
      pad(sun.getDate()) +
      'T' +
      pad(sun.getHours()) +
      '0000';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//McGee Jewelry//Ritual//EN',
      'BEGIN:VEVENT',
      `UID:mcgee-sunday-reset-${Date.now()}@mcgeejewelry.com`,
      `DTSTAMP:${stamp}Z`,
      `DTSTART:${stamp}`,
      'RRULE:FREQ=WEEKLY;BYDAY=SU',
      'SUMMARY:McGee Jewelry Sunday Shine & Week Plan',
      'DESCRIPTION:Clean your favorite pieces and plan Monday-Sunday jewelry looks at https://mcgeejewelry.com/ritual',
      'DURATION:PT15M',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcgee-sunday-jewelry-reset.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const savePassport = async () => {
    const payload = {
      ring_size_us: passport.ringSizeUs,
      wrist_cm: passport.wristCm,
      undertone: passport.undertone,
      preferred_metal: passport.preferredMetal,
    };
    try { localStorage.setItem(PASSPORT_KEY, JSON.stringify(payload)); } catch {}
    if (currentUser?.id) {
      try {
        await supabase
          .from('profiles')
          .upsert(
            {
              user_id: currentUser.id,
              ring_size_us: passport.ringSizeUs,
              wrist_cm: passport.wristCm,
              undertone: passport.undertone,
              preferred_metal: passport.preferredMetal,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
      } catch {}
    }
    setPassportMsg('✓ Size Passport saved!');
    setTimeout(() => setPassportMsg(''), 3000);
  };

  const copyPartnerCard = async () => {
    const diam = (11.63 + 0.8128 * passport.ringSizeUs).toFixed(1);
    const eu = Math.round(Math.PI * parseFloat(diam));
    const card = [
      '💎 My Jewelry Size & Gift Passport (McGee Jewelry)',
      `• Ring Size: US ${passport.ringSizeUs} (EU ${eu} · ${diam} mm)`,
      `• Bracelet Fit: ${(passport.wristCm + 2).toFixed(1)} cm (Wrist ${passport.wristCm.toFixed(1)} cm)`,
      `• Favorite Metal: ${passport.preferredMetal} (${passport.undertone} undertone)`,
      'Saved at https://mcgeejewelry.com/ritual',
    ].join('\n');
    try {
      await navigator.clipboard.writeText(card);
      setPassportMsg('✓ Gift card copied for your partner!');
    } catch {
      setPassportMsg('Copy unavailable in this browser.');
    }
    setTimeout(() => setPassportMsg(''), 3500);
  };

  const wearCounts: Record<string, number> = {};
  wears.forEach((w) => {
    const lc = w.pieceName.toLowerCase();
    wearCounts[lc] = (wearCounts[lc] || 0) + 1;
  });

  const duePolishItems = vault.filter((v) => (wearCounts[v.name.toLowerCase()] || 0) >= 4);
  const streak = computeStreak(checkins, wears);
  const nInfo = NECKLINES[neckline] || NECKLINES['Crew neck'];
  const mInfo = METALS.find((m) => m.key === metal) || METALS[0];
  const diamMm = (11.63 + 0.8128 * passport.ringSizeUs).toFixed(1);
  const euSize = Math.round(Math.PI * parseFloat(diamMm));
  const ukSize = String.fromCharCode(70 + Math.round((passport.ringSizeUs - 3) * 2)) + '½';

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-8 sm:pt-10 overflow-x-hidden">
      {/* HEADER + STREAK SUMMARY */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-wider muted mb-2">Daily · Weekly · Monthly Concierge</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl gt">{t('ritual.title', 'Daily Jewelry Ritual & Care')}</h1>
          <p className="muted text-base sm:text-lg mt-3 leading-relaxed">
            {t(
              'ritual.sub',
              'Your 10-second morning check-in: match your neckline, protect metals from tarnish, log today’s wear streak, and share your size passport.'
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto tabular-nums">
          <div className="glass p-4 rounded-2xl text-center min-w-[6.2rem]">
            <span className="muted text-[11px] uppercase tracking-wider block">Streak</span>
            <b className="serif text-3xl gt block mt-0.5">{streak}d</b>
          </div>
          <div className="glass p-4 rounded-2xl text-center min-w-[6.2rem]">
            <span className="muted text-[11px] uppercase tracking-wider block">Check-Ins</span>
            <b className="serif text-3xl gt block mt-0.5">{checkins.length}</b>
          </div>
          <div className="glass p-4 rounded-2xl text-center min-w-[6.2rem]">
            <span className="muted text-[11px] uppercase tracking-wider block">Due Polish</span>
            <b className="serif text-3xl gt block mt-0.5">{duePolishItems.length}</b>
          </div>
        </div>
      </div>

      {/* SECTION 1: MORNING 10s RITUAL */}
      <section className="grid lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-7 glass glow p-6 sm:p-8 rounded-3xl">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div>
              <span className="text-xs uppercase tracking-wider gt font-medium">Step 01 · Every Morning (10s)</span>
              <h2 className="serif text-2xl sm:text-3xl gt mt-0.5">Morning Look & Tarnish Check</h2>
            </div>
            <span className="text-xs muted">
              {isPro ? '⭐ Pro Unlimited' : `Free: ${checkins.length}/5 check-ins`}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider muted mb-2">1. Today’s Occasion</p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOccasion(o)}
                    className={`chip text-xs py-1.5 px-3 cursor-pointer ${
                      occasion === o ? 'border-rose-400 font-semibold' : ''
                    }`}
                    aria-pressed={occasion === o}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider muted mb-2">2. Neckline</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(NECKLINES).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNeckline(n)}
                    className={`chip text-xs py-1.5 px-3 cursor-pointer ${
                      neckline === n ? 'border-rose-400 font-semibold' : ''
                    }`}
                    aria-pressed={neckline === n}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider muted mb-2">3. Metal / Stone Mood</p>
              <div className="flex flex-wrap gap-2">
                {METALS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMetal(m.key)}
                    className={`chip text-xs py-1.5 px-3 cursor-pointer ${
                      metal === m.key ? 'border-rose-400 font-semibold' : ''
                    }`}
                    aria-pressed={metal === m.key}
                  >
                    {m.key}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-200/15">
              <p className="text-xs uppercase tracking-wider muted mb-2">4. Pick or Type Piece You’re Wearing</p>
              {vault.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {vault.slice(0, 6).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setPieceInput((prev) => (prev ? `${prev} + ${v.name}` : v.name))}
                      className="chip text-xs py-1 px-3 cursor-pointer"
                    >
                      + {v.name}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('vault')}
                  className="text-xs underline gt mb-3 bg-transparent border-0 p-0 cursor-pointer block"
                >
                  + Add pieces to your Jewelry Box for 1-tap selection
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={pieceInput}
                  onChange={(e) => setPieceInput(e.target.value)}
                  placeholder="e.g. 14K Herringbone + Pearl Studs"
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-rose-200/30 bg-white/80 text-slate-900"
                />
                <button type="button" onClick={handleLogRitual} className="btn btn-gold py-2.5 px-5 text-sm shrink-0">
                  ✓ Wear & Log Today
                </button>
              </div>
              {ritualStatus && <p className="text-xs mt-2 gt">{ritualStatus}</p>}
            </div>
          </div>
        </div>

        {/* INSTANT STYLIST OUTPUT */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="glass p-6 sm:p-7 rounded-3xl flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider muted">Instant Stylist Recipe</span>
              <h3 className="serif text-2xl sm:text-3xl gt mt-1">
                {neckline} · {occasion}
              </h3>
              <p className="text-sm font-medium mt-3">Chain blueprint: {nInfo.stack}</p>
              <p className="muted text-xs sm:text-sm mt-2 leading-relaxed">
                {nInfo.tip}
                {occasion === 'Date Night' ? ' Add a shimmering stackable ring on your dominant hand.' : ''}
              </p>

              <div
                className="mt-5 p-4 rounded-2xl"
                style={{ background: 'rgba(183,110,121,0.1)', border: '1px solid rgba(183,110,121,0.28)' }}
              >
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#b76e79' }}>
                  Care & Tarnish Shield
                </p>
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {mInfo.alert}
                  {occasion === 'Workout / Travel'
                    ? ' Workout rule: swap delicate chains and plated pieces for solid silicone or sleek huggies before training.'
                    : ''}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200/15">
              <p className="text-xs muted mb-2">Recent Check-Ins</p>
              {checkins.length === 0 ? (
                <p className="text-xs muted">No check-ins logged yet today.</p>
              ) : (
                <div className="space-y-1.5 text-xs muted">
                  {checkins.slice(0, 4).map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        {c.pieceNames.join(', ')} · {c.occasion}
                      </span>
                      <span className="shrink-0 tabular-nums">{c.checkedOn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WEEKLY CLEANING RADAR */}
      <section className="glass p-6 sm:p-8 rounded-3xl mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider gt font-medium">Step 02 · Every Sunday (2 Min)</span>
            <h2 className="serif text-2xl sm:text-3xl gt mt-0.5">Weekly Cleaning Radar & Sunday Reset</h2>
            <p className="muted text-xs sm:text-sm mt-1">
              Pieces worn 4+ times since their last polish appear here so oils and perfume never dull your stones.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleDownloadIcs} className="btn btn-gold text-xs py-2.5 px-4">
              📅 Add Sunday Reset to Calendar (.ics)
            </button>
            <button type="button" onClick={() => navigate('planner')} className="btn btn-ghost text-xs py-2.5 px-4">
              Open 7-Day Planner &rarr;
            </button>
          </div>
        </div>

        {vault.length === 0 ? (
          <div className="p-6 rounded-2xl border border-rose-200/15 text-center muted text-sm">
            Your vault is empty.{' '}
            <button onClick={() => navigate('vault')} className="underline gt bg-transparent border-0 cursor-pointer">
              Add your everyday pieces
            </button>{' '}
            to track polish cycles automatically.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vault.map((item) => {
              const count = wearCounts[item.name.toLowerCase()] || 0;
              const needsPolish = count >= 4;
              return (
                <div key={item.id} className="stat flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="serif text-xl gt">{item.name}</span>
                      <span className={`chip text-[10px] ${needsPolish ? 'border-amber-400 text-amber-300' : ''}`}>
                        {needsPolish ? 'Needs Polish' : `${count} wears`}
                      </span>
                    </div>
                    <p className="muted text-xs mt-1">
                      {item.cat} · {item.karat.toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMarkCleaned(item.id)}
                    className="btn btn-ghost text-xs py-1.5 px-3 w-full justify-center"
                  >
                    ✨ Mark Cleaned Today
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: SIZE & GIFT PASSPORT */}
      <section className="glass glow p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider gt font-medium">Step 03 · Monthly & Gifting Loop</span>
            <h2 className="serif text-2xl sm:text-3xl gt mt-0.5">Size & Gift Passport</h2>
            <p className="muted text-xs sm:text-sm mt-1">
              Save your ring size, wrist fit, and preferred metal once — copy a gift card for your partner in 1 tap.
            </p>
          </div>
          <button type="button" onClick={() => navigate('wishlist')} className="btn btn-ghost text-xs py-2 px-4">
            View Wishlist &rarr;
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="fld" style={{ marginTop: 0 }}>
            <span>
              US Ring Size (<b className="gt">{passport.ringSizeUs}</b>)
            </span>
            <input
              type="range"
              min="3"
              max="13"
              step="0.5"
              value={passport.ringSizeUs}
              onChange={(e) => setPassport({ ...passport, ringSizeUs: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <span className="text-[11px] muted mt-1 block tabular-nums">
              UK {ukSize} · EU {euSize} · {diamMm} mm
            </span>
          </label>

          <label className="fld" style={{ marginTop: 0 }}>
            <span>
              Wrist Fit (<b className="gt">{passport.wristCm.toFixed(1)} cm</b>)
            </span>
            <input
              type="range"
              min="13"
              max="22"
              step="0.5"
              value={passport.wristCm}
              onChange={(e) => setPassport({ ...passport, wristCm: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
            <span className="text-[11px] muted mt-1 block tabular-nums">
              Bracelet: {(passport.wristCm + 2).toFixed(1)} cm comfort fit
            </span>
          </label>

          <label className="fld" style={{ marginTop: 0 }}>
            <span>Skin Undertone</span>
            <select
              value={passport.undertone}
              onChange={(e) => setPassport({ ...passport, undertone: e.target.value })}
            >
              <option value="Warm">Warm (Golden / Olive)</option>
              <option value="Cool">Cool (Rosy / Blue veins)</option>
              <option value="Neutral">Neutral (Balanced)</option>
            </select>
          </label>

          <label className="fld" style={{ marginTop: 0 }}>
            <span>Signature Metal</span>
            <select
              value={passport.preferredMetal}
              onChange={(e) => setPassport({ ...passport, preferredMetal: e.target.value })}
            >
              <option value="14K Yellow Gold">14K Yellow Gold</option>
              <option value="18K Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">14K Rose Gold</option>
              <option value="White Gold / Platinum">White Gold / Platinum</option>
              <option value="Sterling Silver 925">Sterling Silver 925</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-rose-200/15">
          <button type="button" onClick={savePassport} className="btn btn-gold text-sm py-2.5 px-5">
            Save Passport
          </button>
          <button type="button" onClick={copyPartnerCard} className="btn btn-ghost text-sm py-2.5 px-5">
            💌 Copy Size & Gift Card for Partner
          </button>
          {passportMsg && <span className="text-xs gt">{passportMsg}</span>}
        </div>
      </section>

      <AdPromoBanner />
    </main>
  );
};
