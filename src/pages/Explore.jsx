import ContentExplorer from '../features/ContentExplorer';
import { YOUTUBE, external } from '../lib/links';

export default function Explore() {
  return (
    <main id="main" className="page-explore">
      <header className="page-head explore-head">
        <p className="kicker">Explore</p>
        <h1>
          <span className="outline">Every</span> session,<br />
          <em>one index.</em>
        </h1>
        <p className="page-lede">
          Recent uploads, the training-split series and every feed — filter by what you want to watch tonight. All links go straight to Saket’s own channels.
        </p>
      </header>
      <ContentExplorer />
      <p className="explore-footnote">
        Can’t find something? <a href={YOUTUBE} {...external}>Browse the channel directly</a>. Series links run a search inside his channel, so they always show his latest matching videos.
      </p>
    </main>
  );
}
