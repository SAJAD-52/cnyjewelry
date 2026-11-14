import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WishlistButton } from '../components/shared/WishlistButton';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

const QUESTIONS = [
  {
    q: 'What is the occasion?',
    options: ['Birthday', 'Anniversary', 'Just because', 'Engagement or wedding'],
  },
  {
    q: 'How would you describe her style?',
    options: ['Minimal', 'Classic', 'Bold', 'Vintage'],
  },
  {
    q: 'What is your budget?',
    options: ['Under $50', '$50 to $150', '$150 to $500', 'Over $500'],
  },
  {
    q: 'Which metal does she wear?',
    options: ['Yellow gold', 'Silver', 'Rose gold', 'Not sure'],
  },
];

const IDEAS: Record<string, string[]> = {
  Minimal: [
    'Stacking set of thin rings',
    'Fine chain with a bar pendant',
    'Solitaire stud earrings',
    'Slim tennis bracelet',
  ],
  Classic: [
    'Freshwater pearl drop earrings',
    'Initial pendant on a cable chain',
    'Strand of cultured pearls',
    'Diamond halo pendant',
  ],
  Bold: [
    'Chunky chain bracelet',
    'Sculptural dome hoops',
    'Cocktail ring with a large cabochon',
    'Statement collar necklace',
  ],
  Vintage: [
    'Filigree locket',
    'Cameo-style brooch',
    'Art deco inspired cocktail ring',
    'Antique-cut gemstone ring',
  ],
};

const OCCASION_NOTES: Record<string, string> = {
  Birthday: 'Engrave her birthstone or initial for a thoughtful personal touch.',
  Anniversary: 'Add a special milestone date or short line engraved inside the band.',
  'Just because': 'Understated, versatile pieces that she can wear effortlessly every day win.',
  'Engagement or wedding': 'Confirm her ring size first using our interactive size guide before ordering.',
};

export const GiftPage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    markFeatureUsed('gift');
  }, []);

  const handleSelect = (option: string) => {
    const updated = [...answers];
    updated[step] = option;
    setAnswers(updated);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
  };

  const isDone = step >= QUESTIONS.length;

  // Recommendations calculation
  let recommendations: { title: string; priceTag: string; metalNote: string; lab: string }[] = [];
  if (isDone) {
    const style = answers[1] || 'Classic';
    const budgetIndex = QUESTIONS[2].options.indexOf(answers[2]);
    const budget = budgetIndex >= 0 ? budgetIndex : 1;
    const list = IDEAS[style] || IDEAS.Classic;
    let pick = [budget - 1, budget, budget + 1].filter((i) => i >= 0 && i < 4);
    if (pick.length < 3) pick = budget === 0 ? [0, 1, 2] : [1, 2, 3];

    const metalChoice = answers[3] || 'Not sure';
    const metalSuffix = metalChoice === 'Not sure' ? '' : ` in ${metalChoice.toLowerCase()}`;

    recommendations = pick.map((i) => {
      const title = list[i];
      const lab = `${title}${metalSuffix}`;
      return {
        title,
        priceTag: QUESTIONS[2].options[i],
        metalNote: metalSuffix ? `Look for it${metalSuffix}.` : 'Yellow gold and sterling silver both work.',
        lab,
      };
    });
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Smart Match Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Find the right gift</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Four quick questions to reveal three thoughtful jewelry gift recommendations matched to her aesthetic and your budget.
        </p>
      </div>

      <div className="glass p-6 md:p-10 max-w-3xl rounded-3xl">
        {!isDone ? (
          <div className="fade">
            <p className="muted text-xs uppercase tracking-wider">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h2 className="serif text-3xl sm:text-4xl gt mt-2">{QUESTIONS[step].q}</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="chip p-4 rounded-2xl text-left cursor-pointer transition-all hover:border-rose-400"
                >
                  <b className="serif text-xl block">{opt}</b>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={handleBack}
                className="btn btn-ghost text-xs mt-6 cursor-pointer"
                style={{ padding: '.4rem 1.1rem' }}
              >
                &larr; Back
              </button>
            )}
          </div>
        ) : (
          <div className="fade">
            <h2 className="serif text-3xl sm:text-4xl gt">Your three gift ideas are ready</h2>
            <p className="muted text-sm sm:text-base mt-2">
              {OCCASION_NOTES[answers[0]] || 'A curated selection crafted for your celebration.'}
            </p>
            <button onClick={handleRestart} className="btn btn-ghost text-xs mt-5 cursor-pointer">
              Start over
            </button>
          </div>
        )}
      </div>

      {isDone && (
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {recommendations.map((rec, i) => (
            <div key={i} className="glass glow p-6 rounded-3xl fade flex flex-col justify-between">
              <div>
                <span className="chip text-[11px] mb-2 inline-block">{rec.priceTag}</span>
                <h3 className="serif text-2xl gt mt-1">{rec.title}</h3>
                <p className="muted text-xs mt-2 leading-relaxed">{rec.metalNote}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-rose-200/10">
                <WishlistButton id={`gift-${answers[1]}-${i}`} label={rec.lab} note="Gift Idea" />
              </div>
            </div>
          ))}
        </div>
      )}

      <AdPromoBanner />
    </main>
  );
};
