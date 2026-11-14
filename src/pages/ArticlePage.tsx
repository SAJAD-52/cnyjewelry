import React from 'react';
import { useApp } from '../context/AppContext';
import { ARTICLES_DATA, BLOG_POSTS, ArticleContent } from '../data/blogData';
import { ShowcaseBanner } from '../components/shared/ShowcaseBanner';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { navigate } = useApp();

  // Find article data
  const article: ArticleContent | undefined = ARTICLES_DATA[slug];

  if (!article) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h1 className="serif text-4xl gt">Guide Not Found</h1>
        <p className="muted mt-3">The article you are looking for has been moved or updated.</p>
        <button onClick={() => navigate('blog')} className="btn btn-gold text-xs mt-6">
          Return to Blog &rarr;
        </button>
      </main>
    );
  }

  const renderIllustration = () => {
    if (article.image) {
      return (
        <figure className="mt-8">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto rounded-3xl border border-rose-200/20 shadow-lg object-cover max-h-[480px]"
          />
          <figcaption className="muted text-xs mt-2 text-center">
            Editorial illustration by McGee Jewelry.
          </figcaption>
        </figure>
      );
    }

    if (article.svgType === 'herringbone' || article.svgType === 'chain') {
      return (
        <div className="glass p-6 mt-8 rounded-3xl" style={{ color: '#b76e79' }}>
          <svg viewBox="0 0 400 190" className="w-full max-h-56 mx-auto" role="img" aria-label="Chain Illustration">
            <defs>
              <linearGradient id="art-chain-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e2b3" />
                <stop offset="0.5" stopColor="#e8b4b8" />
                <stop offset="1" stopColor="#b76e79" />
              </linearGradient>
            </defs>
            {[40, 57, 74, 91, 109, 126, 143, 161, 178, 195, 213, 230, 247, 264, 282, 299, 316, 334, 351].map((x, i) => (
              <rect
                key={i}
                x="-10"
                y="-3.4"
                width="20"
                height="6.8"
                rx="3.4"
                fill="url(#art-chain-g)"
                stroke="rgba(60,30,40,.35)"
                strokeWidth="0.6"
                transform={`translate(${x}, ${70 + Math.sin(i * 0.35) * 50}) rotate(${i % 2 === 0 ? 25 : 85})`}
              />
            ))}
          </svg>
        </div>
      );
    }

    if (article.svgType === 'devil') {
      return (
        <div className="glass p-6 mt-8 rounded-3xl text-center" style={{ color: '#b76e79' }}>
          <svg viewBox="0 0 400 190" className="w-full max-h-52 mx-auto" role="img" aria-label="Devil pendant illustration">
            <defs>
              <linearGradient id="art-pg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f7e6b0" />
                <stop offset="0.55" stopColor="#e2b24f" />
                <stop offset="1" stopColor="#b9822a" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="120" r="38" fill="url(#art-pg)" stroke="rgba(90,55,10,.5)" strokeWidth="1.5" />
            <path d="M170 98 L164 70 L184 86 Z M230 98 L236 70 L216 86 Z" fill="url(#art-pg)" stroke="rgba(90,55,10,.5)" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="188" cy="114" r="4" fill="#5a370a" />
            <circle cx="212" cy="114" r="4" fill="#5a370a" />
            <path d="M184 128 Q200 146 216 128" fill="none" stroke="#5a370a" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    if (article.svgType === 'fallGems') {
      const gems = [
        { name: 'Garnet', col: '#7b1e2b' },
        { name: 'Amber', col: '#d98e32' },
        { name: 'Citrine', col: '#e4b83a' },
        { name: 'Peridot', col: '#7c8a3a' },
        { name: 'Smoky Quartz', col: '#6b5a52' },
        { name: 'Pearl', col: '#efe6dc' },
      ];
      return (
        <div className="glass p-6 mt-8 rounded-3xl" style={{ color: '#b76e79' }}>
          <div className="flex flex-wrap justify-center gap-6 py-4">
            {gems.map((g, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="w-14 h-14 rounded-full border border-white/50 shadow-md"
                  style={{ background: g.col }}
                />
                <span className="muted text-xs mt-2 font-medium">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (article.svgType === 'infinity') {
      return (
        <div className="glass p-6 mt-8 rounded-3xl" style={{ color: '#b76e79' }}>
          <svg viewBox="0 0 400 170" className="w-full max-h-48 mx-auto" role="img" aria-label="Infinity Band">
            <defs>
              <linearGradient id="inf-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3e2b3" />
                <stop offset="1" stopColor="#b76e79" />
              </linearGradient>
              <linearGradient id="inf-w" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#aeb6c4" />
              </linearGradient>
            </defs>
            <path
              d="M 100 85 C 100 45, 170 45, 200 85 C 230 125, 300 125, 300 85 C 300 45, 230 45, 200 85 C 170 125, 100 125, 100 85 Z"
              fill="none"
              stroke="url(#inf-g)"
              strokeWidth="9"
            />
            <path
              d="M 100 85 C 100 125, 170 125, 200 85 C 230 45, 300 45, 300 85 C 300 125, 230 125, 200 85 C 170 45, 100 45, 100 85 Z"
              fill="none"
              stroke="url(#inf-w)"
              strokeWidth="9"
            />
          </svg>
        </div>
      );
    }

    if (article.svgType === 'rings') {
      return (
        <div className="glass p-6 mt-8 rounded-3xl text-center" style={{ color: '#b76e79' }}>
          <svg viewBox="0 0 400 180" className="w-full max-h-48 mx-auto" role="img" aria-label="Rings diagram">
            <circle cx="130" cy="90" r="50" fill="none" stroke="#f3e2b3" strokeWidth="10" />
            <circle cx="270" cy="90" r="50" fill="none" stroke="#e8b4b8" strokeWidth="10" />
          </svg>
        </div>
      );
    }

    if (article.svgType === 'plated') {
      return (
        <div className="glass p-6 mt-8 rounded-3xl text-center" style={{ color: '#b76e79' }}>
          <svg viewBox="0 0 400 160" className="w-full max-h-44 mx-auto" role="img" aria-label="Plated cross section">
            <rect x="50" y="40" width="200" height="14" fill="#f3e2b3" rx="2" />
            <rect x="50" y="54" width="200" height="10" fill="#c9ced6" />
            <rect x="50" y="64" width="200" height="60" fill="#b87a4b" rx="2" />
            <g fill="currentColor" fontSize="12">
              <text x="265" y="52">Gold layer (microns)</text>
              <text x="265" y="72">Barrier layer</text>
              <text x="265" y="100">Base metal (brass, silver, steel)</text>
            </g>
          </svg>
        </div>
      );
    }

    return null;
  };

  const relatedArticles = article.relatedSlugs
    .map((s) => BLOG_POSTS.find((p) => p.url === s || p.url.endsWith(s)))
    .filter(Boolean);

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <article>
        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <p className="muted text-xs uppercase tracking-wider mb-2">
            <button
              onClick={() => navigate('blog')}
              className="hover:underline text-inherit bg-transparent border-0 cursor-pointer p-0"
            >
              Blog
            </button>{' '}
            &rsaquo; {article.cat}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl gt mt-3 font-normal leading-tight">
            {article.title}
          </h1>

          <p className="muted text-base sm:text-xl mt-4 leading-relaxed">{article.subtitle}</p>

          <p className="muted text-xs sm:text-sm mt-4">
            By McGee Jewelry &middot; Updated {article.updated} &middot; {article.readTime}
          </p>

          {renderIllustration()}
        </header>

        {/* Content Sections */}
        <div className="mx-auto max-w-3xl mt-12 flex flex-col gap-10">
          {article.sections.map((sec, i) => (
            <div key={i} className="fade">
              <h2 className="serif text-3xl sm:text-4xl gt mb-4">{sec.heading}</h2>

              {sec.content && (
                <div className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-slate-300">
                  {sec.content}
                </div>
              )}

              {sec.list && (
                <ul className="mt-4 grid gap-2 pl-5 list-disc leading-relaxed text-slate-300">
                  {sec.list.map((item, lIdx) => (
                    <li key={lIdx}>{item}</li>
                  ))}
                </ul>
              )}

              {sec.table && (
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-rose-200/20 text-xs uppercase tracking-wider muted">
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="pb-3 px-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-t border-rose-200/10">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-3 px-3">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sec.note && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 mt-4 text-xs sm:text-sm text-amber-200 leading-relaxed">
                  <b>Note:</b> {sec.note}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Embedded Showcase Tools */}
        <ShowcaseBanner
          title="Put this guide to work"
          subtitle="Twelve free tools, built for jewelry. Tools for this guide are shown first."
          pick={article.showcaseTools}
        />

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <div className="mx-auto max-w-3xl mt-14">
            <h2 className="serif text-3xl sm:text-4xl gt mb-5">Frequently asked questions</h2>
            <div className="grid gap-3">
              {article.faqs.map((faq, fIdx) => (
                <details key={fIdx} className="faq">
                  <summary>{faq.question}</summary>
                  <p className="muted text-sm sm:text-base mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Keep Reading */}
        {relatedArticles.length > 0 && (
          <div className="mx-auto max-w-5xl mt-18">
            <h2 className="serif text-3xl sm:text-4xl gt mb-6">Keep reading</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((rel, rIdx) => {
                if (!rel) return null;
                return (
                  <button
                    key={rIdx}
                    onClick={() => navigate(rel.url)}
                    className="glass glow p-6 rounded-2xl block text-left no-underline text-inherit tool-card cursor-pointer"
                  >
                    <h3 className="serif text-2xl gt leading-snug">{rel.title}</h3>
                    <p className="muted text-xs mt-2 leading-relaxed">{rel.blurb}</p>
                    <span className="gt text-xs font-semibold block mt-4">Read guide &rarr;</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <AdPromoBanner />
      </article>
    </main>
  );
};
