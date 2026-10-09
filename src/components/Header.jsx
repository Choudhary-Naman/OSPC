import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Instagram, Menu, X } from 'lucide-react';
import { INSTAGRAM, external } from '../lib/links';

const NAV = [
  { to: '/', label: 'Home', num: '01', end: true },
  { to: '/explore', label: 'Explore', num: '02' },
  { to: '/community', label: 'Community', num: '03' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, focus first link, Escape closes, return focus to toggle.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <Link to="/" className="brand" aria-label="Saket Gokhale — home">
        <span className="brand-mark" aria-hidden="true">SG</span>
        <span className="brand-name">Saket Gokhale<small>Fan-made · Unofficial</small></span>
      </Link>

      <nav className="nav-desktop" aria-label="Primary">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <span className="nav-num">{n.num}</span>{n.label}
          </NavLink>
        ))}
      </nav>

      <a className="header-ig" href={INSTAGRAM} {...external} aria-label="Saket Gokhale on Instagram (opens in new tab)">
        <Instagram size={16} aria-hidden="true" /> <span>@saketgokhale</span>
      </a>

      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div id="mobile-menu" ref={panelRef} className="nav-mobile" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <span className="nav-num">{n.num}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <a className="nav-mobile-ig" href={INSTAGRAM} {...external}>
          <Instagram size={18} aria-hidden="true" /> @saketgokhale <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
