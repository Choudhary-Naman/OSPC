import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Instagram, Search, X, Youtube } from 'lucide-react';
import { CATEGORIES, CONTENT, TYPE_LABEL } from '../data/content';
import { external } from '../lib/links';
import VideoThumb from '../components/VideoThumb';

const PLATFORMS = ['All', 'YouTube', 'Instagram'];
const FORMATS = ['All', 'video', 'series', 'channel'];
const fmtDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ContentExplorer() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const cat = CATEGORIES.includes(params.get('cat')) ? params.get('cat') : 'All';
  const platform = PLATFORMS.includes(params.get('platform')) ? params.get('platform') : 'All';
  const format = FORMATS.includes(params.get('format')) ? params.get('format') : 'All';

  const set = (key, value, fallback = 'All') => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const counts = useMemo(() => {
    const c = { All: CONTENT.length };
    CATEGORIES.forEach((k) => (c[k] = CONTENT.filter((i) => i.category === k).length));
    return c;
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CONTENT.filter((i) => (cat === 'All' || i.category === cat))
      .filter((i) => (platform === 'All' || i.platform === platform))
      .filter((i) => (format === 'All' || i.type === format))
      .filter((i) => !needle || [i.title, i.blurb, i.category, i.platform, ...(i.tags || [])].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => (b.date || '').localeCompare(a.date || '')); // dated videos first, newest on top
  }, [q, cat, platform, format]);

  const filtered = q || cat !== 'All' || platform !== 'All' || format !== 'All';

  return (
    <div className="explorer">
      <div className="explorer-controls">
        <div className="search">
          <Search size={18} aria-hidden="true" />
          <label htmlFor="explore-search" className="sr-only">Search content</label>
          <input
            id="explore-search"
            type="search"
            value={q}
            onChange={(e) => set('q', e.target.value, '')}
            placeholder="Search — try “back”, “travel”, “unboxing”"
            autoComplete="off"
          />
          {q && <button type="button" className="search-clear" onClick={() => set('q', '', '')} aria-label="Clear search"><X size={16} /></button>}
        </div>

        <div className="filter-row" role="group" aria-label="Category">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} type="button" className={`filter${cat === c ? ' is-on' : ''}`} aria-pressed={cat === c} onClick={() => set('cat', c)}>
              {c} <sup>{counts[c]}</sup>
            </button>
          ))}
        </div>

        <div className="filter-selects">
          <label>
            <span>Platform</span>
            <select value={platform} onChange={(e) => set('platform', e.target.value)}>
              {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          <label>
            <span>Format</span>
            <select value={format} onChange={(e) => set('format', e.target.value)}>
              {FORMATS.map((f) => <option key={f} value={f}>{f === 'All' ? 'All' : TYPE_LABEL[f]}</option>)}
            </select>
          </label>
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {results.length} {results.length === 1 ? 'destination' : 'destinations'}
        {filtered && <button type="button" className="text-link" onClick={clearAll}>Clear filters</button>}
      </p>

      {results.length === 0 ? (
        <div className="explorer-empty">
          <p className="explorer-empty-big">Nothing for “{q || 'this filter'}”.</p>
          <p>Try a broader word, or search Saket’s whole channel instead.</p>
          <button type="button" className="btn btn-ghost" onClick={clearAll}>Reset filters</button>
        </div>
      ) : (
        <ul className="results">
          {results.map((item) => <ResultCard key={item.id} item={item} />)}
        </ul>
      )}
    </div>
  );
}

function ResultCard({ item }) {
  const Icon = item.platform === 'Instagram' ? Instagram : Youtube;
  return (
    <li className={`result result-${item.type}`}>
      <a href={item.url} {...external} aria-label={`${item.title} — ${TYPE_LABEL[item.type]} on ${item.platform} (opens in new tab)`}>
        {item.type === 'video' ? (
          <VideoThumb videoId={item.videoId} title={item.title} />
        ) : (
          <div className="result-glyph" aria-hidden="true">
            <span>{item.title}</span>
          </div>
        )}
        <div className="result-body">
          <p className="result-meta">
            <Icon size={13} aria-hidden="true" /> {TYPE_LABEL[item.type]} · {item.category}
            {item.date && <> · <time dateTime={item.date}>{fmtDate.format(new Date(item.date))}</time></>}
          </p>
          <h3>{item.title}</h3>
          {item.blurb && <p className="result-blurb">{item.blurb}</p>}
        </div>
        <ArrowUpRight className="result-arrow" size={20} aria-hidden="true" />
      </a>
    </li>
  );
}
