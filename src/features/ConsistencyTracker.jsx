import { useMemo, useState } from 'react';
import { Check, Flame, Lock, Pencil, RotateCcw, Target } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const STORAGE_KEY = 'sg-consistency-v1';
const WEEKS = 12;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GOAL_IDEAS = ['Train', 'Go for a walk', 'Stretch for 10 minutes', 'Sleep before midnight'];

const keyOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -((x.getDay() + 6) % 7)); };

const fmtLong = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });

export default function ConsistencyTracker() {
  const [data, setData] = useLocalStorage(STORAGE_KEY, null);
  const [draft, setDraft] = useState({ goal: '', target: 4 });
  const [editing, setEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const today = new Date();
  const todayKey = keyOf(today);

  const weeks = useMemo(() => {
    const first = addDays(startOfWeek(today), -7 * (WEEKS - 1));
    return Array.from({ length: WEEKS }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)));
  }, [todayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => {
    const days = data?.days || {};
    const target = data?.target || 1;
    let streak = 0;
    let cursor = days[todayKey] ? today : addDays(today, -1);
    while (days[keyOf(cursor)]) { streak++; cursor = addDays(cursor, -1); }
    const weekCounts = weeks.map((w) => w.filter((d) => days[keyOf(d)]).length);
    return {
      streak,
      thisWeek: weekCounts[weekCounts.length - 1],
      hitWeeks: weekCounts.filter((c) => c >= target).length,
      total: Object.keys(days).length,
      weekCounts,
    };
  }, [data, weeks, todayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  function startGoal(e) {
    e.preventDefault();
    const goal = draft.goal.trim().slice(0, 60);
    if (!goal) return;
    setData((prev) => ({ goal, target: Number(draft.target), days: prev?.days || {} }));
    setEditing(false);
  }

  function toggle(d) {
    const k = keyOf(d);
    setData((prev) => {
      const days = { ...prev.days };
      if (days[k]) delete days[k];
      else days[k] = true;
      return { ...prev, days };
    });
  }

  function reset() {
    setData(undefined);
    setConfirmReset(false);
    setEditing(false);
    setDraft({ goal: '', target: 4 });
  }

  // ── Setup state ───────────────────────────────────────────
  if (!data || editing) {
    return (
      <form className="tracker tracker-setup" onSubmit={startGoal}>
        <p className="tracker-kicker"><Target size={16} aria-hidden="true" /> Set one habit. Keep it small.</p>
        <div className="field">
          <label htmlFor="tracker-goal">I want to consistently…</label>
          <input
            id="tracker-goal"
            value={draft.goal}
            onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
            maxLength={60}
            placeholder="e.g. train"
            required
          />
          <div className="goal-ideas">
            {GOAL_IDEAS.map((g) => (
              <button type="button" key={g} className="chip" onClick={() => setDraft({ ...draft, goal: g })}>{g}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="tracker-target">Days per week</label>
          <div className="target-picker">
            <input id="tracker-target" type="range" min="1" max="7" value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} />
            <output htmlFor="tracker-target">{draft.target}×</output>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={!draft.goal.trim()}>Start tracking</button>
          {editing && <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>}
        </div>
        <p className="tracker-private"><Lock size={13} aria-hidden="true" /> Saved only in this browser. Nothing is sent anywhere.</p>
      </form>
    );
  }

  // ── Tracking state ────────────────────────────────────────
  const weekProgress = Math.min(1, stats.thisWeek / data.target);
  return (
    <div className="tracker">
      <div className="tracker-head">
        <div>
          <p className="tracker-kicker">Your habit</p>
          <h3 className="tracker-goal">{data.goal} <em>{data.target}× a week</em></h3>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => { setDraft({ goal: data.goal, target: data.target }); setEditing(true); }}
        >
          <Pencil size={14} aria-hidden="true" /> Edit
        </button>
      </div>

      <dl className="tracker-stats">
        <div className="stat-week" style={{ '--p': weekProgress }}>
          <dt>This week</dt>
          <dd>{stats.thisWeek}<span>/{data.target}</span></dd>
        </div>
        <div><dt><Flame size={14} aria-hidden="true" /> Streak</dt><dd>{stats.streak}<span> day{stats.streak === 1 ? '' : 's'}</span></dd></div>
        <div><dt>Weeks on target</dt><dd>{stats.hitWeeks}<span>/{WEEKS}</span></dd></div>
        <div><dt>Days logged</dt><dd>{stats.total}</dd></div>
      </dl>

      <div className="grid-wrap">
        <div className="day-labels" aria-hidden="true">{DAY_LABELS.map((d) => <span key={d}>{d.slice(0, 1)}</span>)}</div>
        <div className="habit-grid" role="group" aria-label={`Last ${WEEKS} weeks. Select a day to mark it done.`}>
          {weeks.map((week, wi) => (
            <div
              key={wi}
              className={`habit-week${stats.weekCounts[wi] >= data.target ? ' hit' : ''}${wi === WEEKS - 1 ? ' current' : ''}`}
              title={`Week of ${fmtShort.format(week[0])}: ${stats.weekCounts[wi]}/${data.target}`}
            >
              {week.map((d) => {
                const k = keyOf(d);
                const future = k > todayKey;
                const done = Boolean(data.days[k]);
                return (
                  <button
                    key={k}
                    type="button"
                    className={`habit-day${done ? ' done' : ''}${k === todayKey ? ' today' : ''}`}
                    aria-pressed={done}
                    aria-label={`${fmtLong.format(d)}${k === todayKey ? ' (today)' : ''}: ${done ? 'done' : 'not done'}`}
                    disabled={future}
                    onClick={() => toggle(d)}
                  >
                    {done && <Check size={12} strokeWidth={3} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="grid-foot">
        <span>{fmtShort.format(weeks[0][0])}</span>
        <span>Today</span>
      </div>

      <div className="tracker-actions">
        {!data.days[todayKey] ? (
          <button type="button" className="btn btn-primary" onClick={() => toggle(today)}><Check size={16} aria-hidden="true" /> Log today</button>
        ) : (
          <p className="logged-today"><Check size={16} aria-hidden="true" /> Today’s done.</p>
        )}
        {!confirmReset ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(true)}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
        ) : (
          <div className="confirm" role="alertdialog" aria-label="Confirm reset">
            <span>Erase your habit and all {stats.total} logged days?</span>
            <button type="button" className="btn btn-danger btn-sm" onClick={reset}>Erase</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)} autoFocus>Keep</button>
          </div>
        )}
      </div>
      <p className="tracker-private"><Lock size={13} aria-hidden="true" /> A visitor tool, not an official Saket service. Stored only in this browser.</p>
    </div>
  );
}
