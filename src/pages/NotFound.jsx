import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main id="main" className="page-404">
      <p className="giant-404" aria-hidden="true">404</p>
      <h1>Rest day. This page doesn’t exist.</h1>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/">Back to home <ArrowRight size={16} aria-hidden="true" /></Link>
        <Link className="text-link" to="/explore">Explore content</Link>
      </div>
    </main>
  );
}
