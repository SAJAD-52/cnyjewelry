import React, { useState, useEffect } from 'react';
import { useApp, CURRENCIES, LANGUAGES } from '../../context/AppContext';

export const LocaleModal: React.FC = () => {
  const { isLocaleModalOpen, closeLocaleModal, currentLocale, setLocale, t } = useApp();

  const [selectedCurrency, setSelectedCurrency] = useState(currentLocale.currency);
  const [selectedLang, setSelectedLang] = useState(currentLocale.lang);

  useEffect(() => {
    if (isLocaleModalOpen) {
      setSelectedCurrency(currentLocale.currency);
      setSelectedLang(currentLocale.lang);
    }
  }, [isLocaleModalOpen, currentLocale.currency, currentLocale.lang]);

  if (!isLocaleModalOpen) return null;

  const handleCurrencyChange = (c: string) => {
    setSelectedCurrency(c);
    const chosen = CURRENCIES[c];
    if (chosen && chosen.defaultLang) {
      setSelectedLang(chosen.defaultLang);
    }
  };

  const handleSave = () => {
    setLocale(selectedCurrency, selectedLang);
    closeLocaleModal();
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-5"
      style={{
        background: 'rgba(18,10,14,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLocaleModal();
      }}
    >
      <div
        className="glass glow p-6 md:p-8 rounded-3xl max-w-sm w-full relative"
        style={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(243,226,179,0.25)',
        }}
      >
        <button
          onClick={closeLocaleModal}
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
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          className="muted hover:text-white border-0"
        >
          ✕
        </button>

        <span className="chip text-xs">Regional Settings</span>
        <h3 className="serif text-3xl gt mt-2">{t('loc.title', 'Currency & Language')}</h3>
        <p className="muted text-xs mt-1">
          {t('loc.sub', 'Select your preferred currency and language. Rates and formats update instantly.')}
        </p>

        <div className="flex flex-col gap-3 mt-5">
          <label className="fld text-left">
            <span>Select Currency</span>
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {Object.keys(CURRENCIES).map((k) => {
                const c = CURRENCIES[k];
                return (
                  <option key={k} value={k}>
                    {k} ({c.symbol}) - {c.name}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="fld text-left">
            <span>Website Language</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {Object.keys(LANGUAGES).map((l) => (
                <option key={l} value={l}>
                  {LANGUAGES[l]} ({l})
                </option>
              ))}
            </select>
          </label>

          <button onClick={handleSave} className="btn btn-gold w-full mt-3 justify-center">
            {t('loc.apply', 'Apply & Translate')}
          </button>
        </div>
      </div>
    </div>
  );
};
