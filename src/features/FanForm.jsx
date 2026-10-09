import { useRef, useState } from 'react';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Loader2, Settings } from 'lucide-react';
import { supabase, supabaseConfigError, describeError } from '../lib/supabase';

// Must match the CHECK constraint in supabase/schema.sql
export const FAN_CATEGORIES = ['Transformation story', 'Training question', 'Video idea', 'Other'];
const LIMITS = { name: 80, email: 254, messageMin: 10, messageMax: 1200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: '', email: '', category: FAN_CATEGORIES[0], message: '', publish: false, website: '' };

// Remove control characters (keep newlines/tabs in messages) and normalise whitespace.
const clean = (s, multiline = false) =>
  (multiline ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : s.replace(/[\u0000-\u001F\u007F]/g, ' '))
    .replace(multiline ? /[ \t]+/g : /\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

function validate(f) {
  const e = {};
  const name = clean(f.name);
  const email = clean(f.email);
  const message = clean(f.message, true);
  if (!name) e.name = 'Tell us what to call you.';
  else if (name.length > LIMITS.name) e.name = `Keep it under ${LIMITS.name} characters.`;
  if (!email) e.email = 'An email is needed in case a reply is ever sent.';
  else if (!EMAIL_RE.test(email) || email.length > LIMITS.email) e.email = 'That email doesn’t look right — check for typos.';
  if (!FAN_CATEGORIES.includes(f.category)) e.category = 'Pick one of the options.';
  if (message.length < LIMITS.messageMin) e.message = `Write at least ${LIMITS.messageMin} characters (${message.length} so far).`;
  else if (message.length > LIMITS.messageMax) e.message = `That’s ${message.length - LIMITS.messageMax} characters over the limit.`;
  return { errors: e, data: { name, email, category: f.category, message } };
}

export default function FanForm({ onSent }) {
  const [form, setForm] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ kind: 'idle', text: '' }); // idle | sending | success | error
  const inFlight = useRef(false);
  const formRef = useRef(null);

  const sending = status.kind === 'sending';

  const update = (e) => {
    const { name, type, value, checked } = e.target;
    const next = { ...form, [name]: type === 'checkbox' ? checked : value };
    setForm(next);
    if (touched[name]) setErrors(validate(next).errors);
    if (status.kind === 'error' || status.kind === 'success') setStatus({ kind: 'idle', text: '' });
  };
  const blur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(form).errors);
  };

  async function submit(e) {
    e.preventDefault();
    if (inFlight.current) return; // hard guard against double submits
    const { errors: errs, data } = validate(form);
    setErrors(errs);
    setTouched({ name: true, email: true, category: true, message: true });
    if (Object.keys(errs).length) {
      formRef.current?.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      setStatus({ kind: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }
    if (form.website) {
      // Honeypot filled → almost certainly a bot. Pretend nothing happened, store nothing.
      setForm(EMPTY);
      return;
    }
    if (!supabase) {
      setStatus({ kind: 'config', text: supabaseConfigError });
      return;
    }

    inFlight.current = true;
    setStatus({ kind: 'sending', text: 'Sending your message…' });
    const row = form.publish ? { ...data, publish_consent: true } : data;
    try {
      // No .select() — visitors have no read access, so we only ask for confirmation of the insert.
      const { error } = await supabase.from('fan_messages').insert([row]);
      if (error) throw error;
      setStatus({
        kind: 'success',
        text: form.publish
          ? 'Saved. Thanks — if it’s approved by a moderator, your first name and message will appear on the fan wall.'
          : 'Saved privately. Thanks for writing in.',
      });
      setForm(EMPTY);
      setTouched({});
      setErrors({});
      onSent?.();
    } catch (err) {
      setStatus({ kind: 'error', text: describeError(err, 'insert') });
    } finally {
      inFlight.current = false;
    }
  }

  const fieldProps = (name) => ({
    id: `fan-${name}`,
    name,
    value: form[name],
    onChange: update,
    onBlur: blur,
    disabled: sending,
    'aria-invalid': touched[name] && errors[name] ? 'true' : undefined,
    'aria-describedby': touched[name] && errors[name] ? `fan-${name}-error` : undefined,
  });
  const fieldError = (name) =>
    touched[name] && errors[name] ? <p id={`fan-${name}-error`} className="field-error">{errors[name]}</p> : null;

  const msgLen = clean(form.message, true).length;

  return (
    <form ref={formRef} className="fan-form" onSubmit={submit} noValidate aria-busy={sending}>
      {supabaseConfigError && (
        <div className="notice notice-config" role="note">
          <Settings size={18} aria-hidden="true" />
          <div>
            <strong>Form not connected yet.</strong> {supabaseConfigError} Add both values to <code>.env</code> (locally) or Vercel → Settings → Environment Variables, then restart/redeploy.
          </div>
        </div>
      )}

      <div className="form-row two">
        <div className="field">
          <label htmlFor="fan-name">Name</label>
          <input {...fieldProps('name')} autoComplete="given-name" maxLength={LIMITS.name} placeholder="First name is fine" />
          {fieldError('name')}
        </div>
        <div className="field">
          <label htmlFor="fan-email">Email <span className="label-note">never shown publicly</span></label>
          <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} placeholder="you@example.com" />
          {fieldError('email')}
        </div>
      </div>

      <fieldset className="field chips-field" disabled={sending}>
        <legend>What’s it about?</legend>
        <div className="chip-radios">
          {FAN_CATEGORIES.map((c) => (
            <label key={c} className={`chip-radio${form.category === c ? ' is-on' : ''}`}>
              <input type="radio" name="category" value={c} checked={form.category === c} onChange={update} />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="fan-message">Message</label>
        <textarea {...fieldProps('message')} rows={6} maxLength={LIMITS.messageMax + 200} placeholder="Where you started, what changed, what you’d love to see filmed next…" />
        <div className="field-meta">
          {fieldError('message') || <span />}
          <span className={`counter${msgLen > LIMITS.messageMax ? ' over' : ''}`} aria-live="off">{msgLen}/{LIMITS.messageMax}</span>
        </div>
      </div>

      <label className="consent">
        <input type="checkbox" name="publish" checked={form.publish} onChange={update} disabled={sending} />
        <span>
          <strong>Feature my message on the fan wall.</strong> Only your first name and message would be shown, and only after a moderator approves it. Leave unticked to keep it private.
        </span>
      </label>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="fan-website">Website</label>
        <input id="fan-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? <><Loader2 className="spin" size={17} aria-hidden="true" /> Sending…</> : <>Send message <ArrowUpRight size={17} aria-hidden="true" /></>}
        </button>
        <p className="privacy-note">Stored in this site’s database for review. Don’t include health or other sensitive details.</p>
      </div>

      <div className="status-slot" role="status" aria-live="polite">
        {status.kind === 'success' && <p className="notice notice-success"><CheckCircle2 size={18} aria-hidden="true" /> {status.text}</p>}
        {(status.kind === 'error' || status.kind === 'config') && <p className="notice notice-error"><AlertTriangle size={18} aria-hidden="true" /> {status.text}</p>}
      </div>
    </form>
  );
}
