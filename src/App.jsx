import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Community from './pages/Community';
import NotFound from './pages/NotFound';

const TITLES = {
  '/': 'Saket Gokhale — The work, on camera',
  '/explore': 'Explore — Saket Gokhale (fan site)',
  '/community': 'Community — Saket Gokhale (fan site)',
};

/** Scroll to top (or to #hash) on navigation, and keep the document title in sync. */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] || 'Page not found — Saket Gokhale (fan site)';
    if (hash) {
      // wait a frame so the new page has rendered
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function Shell() {
  const location = useLocation();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <RouteEffects />
      <Header />
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<main id="main" className="page-home"><Home /></main>} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community" element={<Community />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
