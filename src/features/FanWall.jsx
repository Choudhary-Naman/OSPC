import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareQuote, RotateCcw } from 'lucide-react';
import { supabase, describeError } from '../lib/supabase';

/*
  Reads ONLY from public.fan_wall — a separate, moderator-filled table that holds first name,
  category and message. The private fan_messages table (with emails) is never queried here.
*/
export default function FanWall({ limit = 12, compact = false, refreshKey = 0 }) {
  const [state, setState] = useState({ kind: 'loading', posts: [], text: '' });

  const load = useCallback(async () => {
    if (!supabase) {
      setState({ kind: 'unavailable', posts: [], text: 'The fan wall appears once the site is connected to its database.' });
      return;
    }
    setState((s) => ({ ...s, kind: 'loading' }));
    const { data, error } = await supabase
      .from('fan_wall')
      .select('id, display_name, category, message, published_at')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) {
      const text = describeError(error, 'read');
      setState({ kind: error.code === 'PGRST205' || error.code === '42P01' ? 'unavailable' : 'error', posts: [], text });
      return;
    }
    setState({ kind: data.length ? 'ready' : 'empty', posts: data, text: '' });
  }, [limit]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (state.kind === 'loading') {
    return (
      <div className={`wall${compact ? ' wall-compact' : ''}`} aria-busy="true" aria-label="Loading fan wall">
        {Array.from({ length: compact ? 3 : 4 }).map((_, i) => <div key={i} className="wall-card skeleton" />)}
      </div>
    );
  }

  if (state.kind !== 'ready') {
    return (
      <div className="wall-empty">
        <MessageSquareQuote size={28} aria-hidden="true" />
        <p>
          {state.kind === 'empty' ? 'No messages have been approved for the wall yet.' : state.text}
        </p>
        {state.kind === 'error' && (
          <button type="button" className="btn btn-ghost" onClick={load}><RotateCcw size={15} aria-hidden="true" /> Try again</button>
        )}
        {state.kind === 'empty' && compact && <Link className="text-link" to="/community#write">Be the first to write in</Link>}
      </div>
    );
  }

  const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <ul className={`wall${compact ? ' wall-compact' : ''}`}>
      {state.posts.map((p) => (
        <li key={p.id} className="wall-card">
          <span className="wall-cat">{p.category}</span>
          <blockquote>{p.message}</blockquote>
          <p className="wall-by">
            — {p.display_name}
            <time dateTime={p.published_at}>{fmt.format(new Date(p.published_at))}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
