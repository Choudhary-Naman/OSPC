import { useState } from 'react';
import { Play } from 'lucide-react';
import { thumbUrl } from '../lib/links';

/** YouTube thumbnail with a graceful typographic fallback if it can't load. */
export default function VideoThumb({ videoId, title }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`thumb${failed ? ' thumb-failed' : ''}`}>
      {!failed && <img src={thumbUrl(videoId)} alt="" loading="lazy" decoding="async" width="480" height="360" onError={() => setFailed(true)} />}
      {failed && <span className="thumb-fallback" aria-hidden="true">{title.slice(0, 1)}</span>}
      <span className="thumb-play" aria-hidden="true"><Play size={16} fill="currentColor" /></span>
    </div>
  );
}
