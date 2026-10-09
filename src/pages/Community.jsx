import FanForm from '../features/FanForm';
import FanWall from '../features/FanWall';
import ConsistencyTracker from '../features/ConsistencyTracker';
import Reveal from '../components/Reveal';

export default function Community() {
  return (
    <main id="main" className="page-community">
      <header className="page-head community-head">
        <p className="kicker">Community</p>
        <h1>Your side<br /><em>of the story.</em></h1>
        <nav className="subnav" aria-label="On this page">
          <a href="#write"><span>A</span> Write in</a>
          <a href="#wall"><span>B</span> Fan wall</a>
          <a href="#tracker"><span>C</span> Tracker</a>
        </nav>
      </header>

      <section id="write" className="c-section write" aria-labelledby="write-title">
        <Reveal className="write-aside">
          <p className="section-letter" aria-hidden="true">A</p>
          <h2 id="write-title">Write in.</h2>
          <p>A transformation, a training question, an idea for a video. Say it here.</p>
          <ol className="how">
            <li><b>Private by default.</b> Your message goes to a database that visitors can’t read.</li>
            <li><b>Wall is opt-in.</b> Tick the box if you’d like it featured.</li>
            <li><b>A human approves.</b> Nothing is public until a moderator publishes it — first name only, never your email.</li>
          </ol>
          <p className="aside-note">This is a fan project. Messages aren’t guaranteed to reach Saket.</p>
        </Reveal>
        <Reveal delay={100}>
          <FanForm />
        </Reveal>
      </section>

      <section id="wall" className="c-section wall-section" aria-labelledby="wall-title">
        <div className="wall-head">
          <p className="section-letter" aria-hidden="true">B</p>
          <h2 id="wall-title">The fan wall.</h2>
          <p>Shared with permission, approved by hand.</p>
        </div>
        <FanWall limit={24} />
      </section>

      <section id="tracker" className="c-section tracker-section" aria-labelledby="tracker-title">
        <div className="tracker-intro">
          <p className="section-letter" aria-hidden="true">C</p>
          <h2 id="tracker-title">Twelve weeks.<br /><em>One habit.</em></h2>
          <p>Pick something small, set how many days a week, and tap the days you showed up. It lives only in this browser.</p>
        </div>
        <ConsistencyTracker />
      </section>
    </main>
  );
}
