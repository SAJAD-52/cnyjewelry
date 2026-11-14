import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WishlistButton } from '../components/shared/WishlistButton';
import { AdPromoBanner } from '../components/shared/AdPromoBanner';

interface FaceShapeData {
  d: string;
  g: string[];
  a: string;
  n: string;
}

const FACE_SHAPES: Record<string, FaceShapeData> = {
  Oval: {
    d: 'Balanced proportions with gently rounded contours and a tapered chin.',
    g: ['Almost any style works effortlessly', 'Statement chandelier drops', 'Sculptural medium hoops'],
    a: 'Very little. Avoid overly massive silhouettes that overwhelm petite facial features.',
    n: 'Versatile with any chain length. Try a classic 45 cm (18 in) princess necklace.',
  },
  Round: {
    d: 'Soft curves with comparable width and length and gentle cheekbones.',
    g: ['Long, narrow linear drops', 'Angular and geometric silhouettes', 'Vertical bar studs'],
    a: 'Small circular button studs and wide chunky circular hoops that exaggerate roundness.',
    n: 'V-shaped plunging necklaces or longer 50–60 cm chains to visually elongate.',
  },
  Square: {
    d: 'A prominent, well-defined jawline with a forehead of matching width.',
    g: ['Round and oval cascading drops', 'Curved fluid hoops', 'Soft pear-cut teardrops'],
    a: 'Boxy, square or sharp geometric earrings that mirror and harden the jawline.',
    n: 'Soft curved pendants, pearls, and scoop-neck draped layers.',
  },
  Heart: {
    d: 'A wider forehead and high cheekbones tapering gracefully down to a pointed chin.',
    g: ['Teardrops and pyramid triangles', 'Elaborate chandelier drops', 'Wider-at-base designs'],
    a: 'Top-heavy designs and oversized ear studs that add unnecessary volume around temples.',
    n: 'Medium to long chains accented with centered drop pendants.',
  },
  Oblong: {
    d: 'An elongated facial structure with a relatively straight cheek contour.',
    g: ['Wide bold hoops and chunky huggies', 'Cluster gemstone studs', 'Short wide sculptural forms'],
    a: 'Super-long threaders or thin vertical drops that visually lengthen the silhouette.',
    n: 'Close-fitting chokers and short 38–40 cm collar chains to introduce horizontal balance.',
  },
};

export const EarringsPage: React.FC = () => {
  const { markFeatureUsed } = useApp();
  const [currentShape, setCurrentShape] = useState<string>('Oval');

  useEffect(() => {
    markFeatureUsed('earrings');
  }, []);

  const data = FACE_SHAPES[currentShape];

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-5 pb-24 pt-10">
      <div className="max-w-2xl mb-10">
        <span className="chip text-xs mb-3 inline-block">Face Match Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl gt">Earrings for your face shape</h1>
        <p className="muted text-base sm:text-lg mt-3">
          Discover earring silhouettes that harmoniously balance your facial contours, plus essential tips for sensitive lobes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Face shape selector */}
        <div className="glass p-6 sm:p-7 rounded-3xl h-fit">
          <h2 className="serif text-3xl gt">Your face shape</h2>
          <div className="grid gap-3 mt-5" role="group" aria-label="Face shape">
            {Object.keys(FACE_SHAPES).map((k) => (
              <button
                key={k}
                onClick={() => setCurrentShape(k)}
                className={`chip p-4 rounded-2xl block text-left cursor-pointer transition-all ${
                  currentShape === k ? 'border-rose-400 bg-rose-500/10' : ''
                }`}
                aria-pressed={currentShape === k}
              >
                <b className="serif text-xl block">{k}</b>
                <span className="block muted text-xs mt-1 leading-snug">{FACE_SHAPES[k].d}</span>
              </button>
            ))}
          </div>
          <p className="muted text-xs mt-5 leading-relaxed">
            Not sure? Stand in front of a mirror and compare the widest part of your cheekbones against your jawline.
          </p>
        </div>

        {/* Results output */}
        <div className="glass p-6 sm:p-8 rounded-3xl lg:col-span-2">
          <div className="fade">
            <h2 className="serif text-3xl sm:text-4xl gt">
              Earrings for an {currentShape.toLowerCase()} face
            </h2>

            <div className="grid sm:grid-cols-3 gap-3.5 mt-5">
              {data.g.map((x) => (
                <div key={x} className="stat flex flex-col justify-between">
                  <p className="text-sm font-medium">{x}</p>
                  <div className="mt-3">
                    <WishlistButton
                      id={`ear-${currentShape}-${x}`}
                      label={`${x} (${currentShape} face)`}
                      note="Earrings styling"
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="serif text-2xl sm:text-3xl gt mt-8">Go lightly with</h3>
            <p className="muted text-sm mt-1 leading-relaxed">{data.a}</p>

            <h3 className="serif text-2xl sm:text-3xl gt mt-6">Necklace pairing tip</h3>
            <p className="muted text-sm mt-1 leading-relaxed">{data.n}</p>
          </div>
        </div>
      </div>

      {/* Sensitive ears advice */}
      <div className="glass p-6 sm:p-8 rounded-3xl mt-8">
        <h2 className="serif text-3xl gt">Sensitive ears & hypoallergenic metals</h2>
        <p className="muted text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
          If earrings cause redness, itching, or inflammation, nickel sensitivity is almost always responsible. Look for medical implant-grade titanium (ASTM F136), pure niobium, platinum, or solid gold of 14k and above with verified nickel-free alloy solder. Avoid mystery costume plated posts, which frequently leech nickel as surface micro-layers wear thin.
        </p>
      </div>

      <AdPromoBanner />
    </main>
  );
};
