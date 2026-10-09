import { useState } from 'react';

/*
  Saket's photo lives at  public/images/saket-hero.jpg
  Optional cut-out (transparent PNG of just him) at  public/images/saket-cutout.png
  If a file is missing, a designed fallback is shown instead — never a stock photo.
*/
export const HERO_SRC = '/images/saket-hero.jpg';
export const CUTOUT_SRC = '/images/saket-cutout.png';

export default function CreatorImage({ src = HERO_SRC, alt, className = '', priority = false, fallbackLabel = 'SG' }) {
  const [state, setState] = useState('loading'); // loading | ready | failed

  return (
    <div className={`creator-image ${className} is-${state}`}>
      {state !== 'failed' && (
        <img
          src={src}
          alt={alt}
          width="1600"
          height="2000"
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={() => setState('ready')}
          onError={() => setState('failed')}
        />
      )}
      {state !== 'ready' && (
        <div className="creator-fallback" aria-hidden="true">
          <span>{fallbackLabel}</span>
        </div>
      )}
      {state === 'failed' && import.meta.env.DEV && (
        <p className="dev-hint">
          Add a photo at <code>public/{src.replace(/^\//, '')}</code>
        </p>
      )}
    </div>
  );
}

/** Optional foreground cut-out; renders nothing if the file isn't there. */
export function CreatorCutout({ className = '' }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return <img className={`creator-cutout ${className}`} src={CUTOUT_SRC} alt="" aria-hidden="true" decoding="async" onError={() => setOk(false)} />;
}
