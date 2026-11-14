import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProModal } from './components/modals/ProModal';
import { AuthModal } from './components/modals/AuthModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { LocaleModal } from './components/modals/LocaleModal';

// Pages
import { HomePage } from './pages/HomePage';
import { VaultPage } from './pages/VaultPage';
import { PlannerPage } from './pages/PlannerPage';
import { SizingPage } from './pages/SizingPage';
import { StylingPage } from './pages/StylingPage';
import { CarePage } from './pages/CarePage';
import { GiftPage } from './pages/GiftPage';
import { LayeringPage } from './pages/LayeringPage';
import { AnniversaryPage } from './pages/AnniversaryPage';
import { GoldPage } from './pages/GoldPage';
import { DiamondPage } from './pages/DiamondPage';
import { EarringsPage } from './pages/EarringsPage';
import { BeadingPage } from './pages/BeadingPage';
import { WishlistPage } from './pages/WishlistPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { blogArticles, ArticleContent } from './data/blogData';

export const App: React.FC = () => {
  const { currentRoute, navigate } = useApp();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  // Clean slug helper
  const cleanRoute = currentRoute.replace(/^\/+|\/+$/g, '').toLowerCase();

  const renderContent = () => {
    switch (cleanRoute) {
      case '':
      case 'index':
      case 'home':
        return <HomePage />;
      case 'vault':
        return <VaultPage />;
      case 'planner':
        return <PlannerPage />;
      case 'sizing':
        return <SizingPage />;
      case 'styling':
        return <StylingPage />;
      case 'care':
        return <CarePage />;
      case 'gift':
        return <GiftPage />;
      case 'layering':
        return <LayeringPage />;
      case 'anniversary':
        return <AnniversaryPage />;
      case 'gold':
        return <GoldPage />;
      case 'diamond':
        return <DiamondPage />;
      case 'earrings':
        return <EarringsPage />;
      case 'beading':
        return <BeadingPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'blog':
        return <BlogPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'privacy':
        return <PrivacyPage />;
      default: {
        // Check if matching an article slug or substring
        const matchingArticle = blogArticles.find(
          (a: ArticleContent) => a.slug === cleanRoute || cleanRoute.includes(a.slug) || a.slug.includes(cleanRoute)
        );
        if (matchingArticle) {
          return <ArticlePage slug={matchingArticle.slug} />;
        }
        // Fallback: Check if it's shop or product route, or return ArticlePage with raw slug
        return (
          <div className="py-20 px-4 text-center max-w-xl mx-auto">
            <h2 className="text-4xl gt text-[var(--gold)] mb-3">Page Not Found</h2>
            <p className="muted mb-6">The page or article "{currentRoute}" could not be located in McGee Jewelry.</p>
            <button
              onClick={() => navigate('index')}
              className="btn btn-gold px-6 py-2 rounded-full cursor-pointer"
            >
              Back to Studio Home
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--gold)] selection:text-black">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>
      <Footer />

      {/* Global Application Modals */}
      <ProModal />
      <AuthModal />
      <ProfileModal />
      <LocaleModal />
    </div>
  );
};

export default App;
