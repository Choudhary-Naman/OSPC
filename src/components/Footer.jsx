import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Youtube } from 'lucide-react';
import { INSTAGRAM, YOUTUBE, external } from '../lib/links';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="footer-mark" aria-hidden="true">SG</p>
        <nav className="footer-nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/community">Community</Link>
        </nav>
        <div className="footer-social">
          <a href={INSTAGRAM} {...external}><Instagram size={16} aria-hidden="true" /> Instagram <ArrowUpRight size={14} aria-hidden="true" /></a>
          <a href={YOUTUBE} {...external}><Youtube size={16} aria-hidden="true" /> YouTube <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
      <p className="footer-legal">
        An independent fan-made concept. Not created, endorsed or operated by Saket Gokhale. All videos and posts belong to their creator and are linked, not copied.
      </p>
    </footer>
  );
}
