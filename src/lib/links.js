// Verified creator destinations.
// Instagram: supplied by the site owner.
// YouTube: channel "Saket Gokhale" (@SaketGokhaleVlogs, channel ID UCfgrg0SXgNkZ7rTbnZCp6tg),
// bio: "capturing the best moments of my life on video :)" · "certified nutrition & fitness coach".

export const INSTAGRAM = 'https://www.instagram.com/saketgokhale/';
export const INSTAGRAM_REELS = 'https://www.instagram.com/saketgokhale/reels/';
export const YOUTUBE = 'https://www.youtube.com/@SaketGokhaleVlogs';
export const YOUTUBE_VIDEOS = `${YOUTUBE}/videos`;
export const YOUTUBE_SHORTS = `${YOUTUBE}/shorts`;

/** Searches inside Saket's own channel — a real destination, no invented video IDs. */
export const channelSearch = (query) => `${YOUTUBE}/search?query=${encodeURIComponent(query)}`;

export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const thumbUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Props for every external link: new tab, no opener, no referrer leakage. */
export const external = { target: '_blank', rel: 'noopener noreferrer' };
