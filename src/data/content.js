import { INSTAGRAM, INSTAGRAM_REELS, YOUTUBE_SHORTS, YOUTUBE_VIDEOS, channelSearch, watchUrl } from '../lib/links';

/*
  CONTENT LIBRARY
  ---------------
  type:     'video'   → a single YouTube upload (needs a real 11-character video id)
            'series'  → a search inside Saket's channel (always resolves to his own videos)
            'channel' → a whole feed (all videos, shorts, Instagram profile/reels)
  category: 'Training' | 'Lifestyle' | 'Travel'
  platform: 'YouTube' | 'Instagram'

  The 'video' entries below are recent uploads from @SaketGokhaleVlogs (titles and ids
  as listed by the public channel tracker sponsorradar.com, Oct 2026). To add a video,
  copy its id from the YouTube URL (youtube.com/watch?v=THIS_PART) and add an entry.
  Never invent ids or titles.
*/

export const CATEGORIES = ['Training', 'Lifestyle', 'Travel'];

export const CONTENT = [
  // ── Recent uploads ─────────────────────────────────────────────
  { id: 'v-SUoe70fptUg', type: 'video', videoId: 'SUoe70fptUg', title: "I'm Traveling Again After 1 Year", category: 'Travel', platform: 'YouTube', date: '2026-10-03', tags: ['vlog', 'trip'] },
  { id: 'v-28Olm-HC2IY', type: 'video', videoId: '28Olm-HC2IY', title: 'Back Day + Uniqlo With The Boys', category: 'Training', platform: 'YouTube', date: '2026-09-30', tags: ['back', 'gym', 'vlog'] },
  { id: 'v-SylvU4K5iTQ', type: 'video', videoId: 'SylvU4K5iTQ', title: 'Chest Day + Ganesh Chaturthi', category: 'Training', platform: 'YouTube', date: '2026-09-24', tags: ['chest', 'gym', 'festival'] },
  { id: 'v-gmZ37CBlBU8', type: 'video', videoId: 'gmZ37CBlBU8', title: "for old time's sake", category: 'Lifestyle', platform: 'YouTube', date: '2026-09-20', tags: ['vlog'] },
  { id: 'v-QdpNSChjPvo', type: 'video', videoId: 'QdpNSChjPvo', title: 'Arm Day + Nostalgic Unboxing', category: 'Training', platform: 'YouTube', date: '2026-09-13', tags: ['arms', 'gym', 'unboxing'] },
  { id: 'v-vTevo1hpd0g', type: 'video', videoId: 'vTevo1hpd0g', title: 'Back Day + A Surprise Package ;)', category: 'Training', platform: 'YouTube', date: '2026-09-04', tags: ['back', 'gym'] },
  { id: 'v-0QbKU7ZQN8g', type: 'video', videoId: '0QbKU7ZQN8g', title: 'The Mumbai Vlog: Hotel Room Tour, Shoot Bts & Chest Day', category: 'Travel', platform: 'YouTube', date: '2026-04-09', tags: ['mumbai', 'chest', 'bts'] },

  // ── Series: searches inside the channel ────────────────────────
  { id: 's-chest', type: 'series', title: 'Chest Day', blurb: 'Every chest session he has filmed, in one search.', category: 'Training', platform: 'YouTube', url: channelSearch('chest day'), tags: ['chest', 'push'] },
  { id: 's-back', type: 'series', title: 'Back Day', blurb: 'Pulls, rows and the vlogs around them.', category: 'Training', platform: 'YouTube', url: channelSearch('back day'), tags: ['back', 'pull'] },
  { id: 's-arms', type: 'series', title: 'Arm Day', blurb: 'Biceps, triceps and the occasional unboxing.', category: 'Training', platform: 'YouTube', url: channelSearch('arm day'), tags: ['arms', 'biceps', 'triceps'] },
  { id: 's-travel', type: 'series', title: 'On the Road', blurb: 'Trips, hotel rooms and training away from home.', category: 'Travel', platform: 'YouTube', url: channelSearch('vlog travel'), tags: ['trip', 'travel'] },
  { id: 's-unboxing', type: 'series', title: 'Unboxings', blurb: 'Packages, gear and surprises.', category: 'Lifestyle', platform: 'YouTube', url: channelSearch('unboxing'), tags: ['gear', 'tech'] },

  // ── Feeds ──────────────────────────────────────────────────────
  { id: 'c-videos', type: 'channel', title: 'Every upload', blurb: 'The full YouTube archive, newest first.', category: 'Lifestyle', platform: 'YouTube', url: YOUTUBE_VIDEOS, tags: ['all', 'vlogs'] },
  { id: 'c-shorts', type: 'channel', title: 'Shorts', blurb: 'Quick cuts from the gym and beyond.', category: 'Training', platform: 'YouTube', url: YOUTUBE_SHORTS, tags: ['short', 'quick'] },
  { id: 'c-reels', type: 'channel', title: 'Reels', blurb: 'Short-form training clips on Instagram.', category: 'Training', platform: 'Instagram', url: INSTAGRAM_REELS, tags: ['short', 'reels'] },
  { id: 'c-ig', type: 'channel', title: '@saketgokhale', blurb: 'Day-to-day posts and stories.', category: 'Lifestyle', platform: 'Instagram', url: INSTAGRAM, tags: ['profile', 'photos'] },
].map((item) => ({ ...item, url: item.url ?? watchUrl(item.videoId) }));

export const latestVideos = (n = 6) =>
  CONTENT.filter((c) => c.type === 'video').sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);

export const TYPE_LABEL = { video: 'Video', series: 'Series', channel: 'Feed' };
