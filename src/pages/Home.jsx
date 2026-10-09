import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Instagram } from 'lucide-react';
import CreatorImage, { CreatorCutout } from '../components/CreatorImage';
import Reveal from '../components/Reveal';
import VideoThumb from '../components/VideoThumb';
import FanWall from '../features/FanWall';
import { CONTENT, latestVideos } from '../data/content';
import { INSTAGRAM, YOUTUBE, YOUTUBE_VIDEOS, external } from '../lib/links';

const SPLIT = ['s-chest', 's-back', 's-arms', 's-travel', 's-unboxing'].map((id) => CONTENT.find((c) => c.id === id));
const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });

function useHeroParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.setProperty('--hero-y', `${y * 0.25}px`);
        el.style.setProperty('--hero-fade', `${1 - y / window.innerHeight}`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, []);
  return ref;
}

export default function Home() {
  const heroRef = useHeroParallax();
  const videos = latestVideos(6);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="hero-media">
          <CreatorImage priority alt="Saket Gokhale" className="hero-photo" />
        </div>
        <p className="hero-giant" aria-hidden="true">GOKHALE</p>
        <CreatorCutout className="hero-cutout" />
        <div className="hero-lines" aria-hidden="true" />

        <div className="hero-content">
          <p className="kicker hero-kicker"><span className="kicker-bar" />Certified nutrition &amp; fitness coach</p>
          <h1 id="hero-title" className="hero-title">
            <span className="line"><span>The work,</span></span>
            <span className="line"><em>on camera.</em></span>
          </h1>
          <p className="hero-intro">
            Saket Gokhale films his training days, trips and everything in between. This fan-built space maps that work — and gives you a place to log your own.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/explore">Explore the work <ArrowRight size={17} aria-hidden="true" /></Link>
            <a className="hero-ig" href={INSTAGRAM} {...external}>
              <Instagram size={15} aria-hidden="true" /> @saketgokhale
            </a>
          </div>
        </div>

        <div className="hero-foot" aria-hidden="true">
          <span className="scroll-cue"><span className="scroll-line" /> Scroll</span>
          <span className="hero-tags">Chest · Back · Arms · On the road</span>
        </div>
      </section>

      {/* ── THE SPLIT — typographic index ───────────────── */}
      <section className="split section" aria-labelledby="split-title">
        <Reveal className="section-head">
          <p className="kicker">01 — The split</p>
          <h2 id="split-title">Pick a day.<br /><em>He’s probably filmed it.</em></h2>
        </Reveal>
        <ol className="split-list">
          {SPLIT.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 70}>
              <a href={s.url} {...external}>
                <span className="split-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="split-name">{s.title}</span>
                <span className="split-blurb">{s.blurb}</span>
                <ArrowUpRight className="split-arrow" size={28} aria-hidden="true" />
                <span className="sr-only">(searches Saket’s YouTube channel, opens in new tab)</span>
              </a>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── STORY — verified only ───────────────────────── */}
      <section className="story section" aria-labelledby="story-title">
        <Reveal className="story-media">
          <CreatorImage alt="Portrait of Saket Gokhale" className="story-photo" />
          <span className="story-caption">Fig. 01 — The subject</span>
        </Reveal>
        <div className="story-copy">
          <Reveal>
            <p className="kicker">02 — In his words</p>
            <blockquote className="story-quote" id="story-title">
              “Capturing the best moments of my life on video.”
            </blockquote>
            <p className="story-source">— from his YouTube channel bio</p>
          </Reveal>
          <Reveal as="dl" className="facts" delay={120}>
            <div><dt>Credential</dt><dd>Certified nutrition &amp; fitness coach</dd></div>
            <div><dt>Format</dt><dd>Vlogs built around the training split — chest day, back day, arm day — and the life around it.</dd></div>
            <div><dt>Find him</dt><dd><a href={YOUTUBE} {...external}>YouTube · @SaketGokhaleVlogs</a><a href={INSTAGRAM} {...external}>Instagram · @saketgokhale</a></dd></div>
          </Reveal>
        </div>
      </section>

      {/* ── RECENT — horizontal reel ────────────────────── */}
      <section className="recent section" aria-labelledby="recent-title">
        <Reveal className="section-head row">
          <div>
            <p className="kicker">03 — Recently uploaded</p>
            <h2 id="recent-title">Fresh off <em>the edit.</em></h2>
          </div>
          <Link to="/explore?format=video" className="text-link">All videos in Explore <ArrowRight size={15} aria-hidden="true" /></Link>
        </Reveal>
        <ul className="reel" aria-label="Recent videos — scroll sideways">
          {videos.map((v, i) => (
            <li key={v.id} className="reel-item">
              <a href={v.url} {...external}>
                <VideoThumb videoId={v.videoId} title={v.title} />
                <span className="reel-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="reel-title">{v.title}</span>
                <time className="reel-date" dateTime={v.date}>{fmt.format(new Date(v.date))}</time>
                <span className="sr-only">(YouTube, opens in new tab)</span>
              </a>
            </li>
          ))}
          <li className="reel-item reel-more">
            <a href={YOUTUBE_VIDEOS} {...external}>
              <span>The full archive</span>
              <ArrowUpRight size={32} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </section>

      {/* ── YOUR TURN — community bridge ────────────────── */}
      <section className="turn section" aria-labelledby="turn-title">
        <Reveal className="turn-left">
          <p className="kicker">04 — Your turn</p>
          <h2 id="turn-title">He logs his days.<br /><em>Log yours.</em></h2>
          <p>A private consistency tracker that lives in your browser, and a fan wall for the stories people choose to share.</p>
          <div className="turn-links">
            <Link className="btn btn-outline" to="/community#tracker">Start a tracker <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="text-link" to="/community#write">Write in</Link>
          </div>
        </Reveal>
        <Reveal className="turn-right" delay={120}>
          <p className="mini-label">From the fan wall</p>
          <FanWall compact limit={3} />
        </Reveal>
      </section>

      {/* ── CLOSING ─────────────────────────────────────── */}
      <section className="closing" aria-labelledby="closing-title">
        <p className="closing-giant" aria-hidden="true">SHOW<br />UP.</p>
        <Reveal className="closing-copy">
          <h2 id="closing-title">Day one or day five hundred — the next rep is the same.</h2>
          <Link className="btn btn-primary" to="/community">Join the community <ArrowRight size={17} aria-hidden="true" /></Link>
        </Reveal>
      </section>
    </>
  );
}
