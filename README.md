# Saket Gokhale — fan-made creator site

An independent, fan-made concept. Not official, not affiliated with or endorsed by Saket Gokhale.

React + Vite + React Router + Supabase. Three pages:

| Route | What it is |
|---|---|
| `/` | Cinematic hero with Saket's photo, the training-split index, verified bio facts, recent uploads, fan-wall preview |
| `/explore` | Searchable / filterable index of real videos, channel series and feeds (filters live in the URL, so you can share them) |
| `/community` | Fan message form (Supabase), moderated public fan wall, private 12-week consistency tracker |

---

## 1. Add Saket's photo (required for the hero)

Put a photo at:

```
public/images/saket-hero.jpg
```

* Portrait or landscape both work; ~1600 px wide, under ~400 KB is ideal.
* Use a photo you have the right to use (e.g. one he has shared publicly that you credit, or one you took with permission).
* The subject should sit on the **right** half; the headline sits on the left. If his face is cropped badly, change `--hero-focus` in `src/styles.css` (e.g. `--hero-focus: 60% 15%`).
* Until the file exists the site shows a designed "SG" fallback (in `npm run dev` it also shows a small "Add a photo at…" hint — that hint never appears in the live build).

**Optional depth effect:** a transparent PNG cut-out of just him at `public/images/saket-cutout.png` is layered *in front of* the outlined "GOKHALE" lettering. Skip it and nothing breaks.

## 2. Run locally (Windows + VS Code)

```
npm install
copy .env.example .env      (only if you don't already have a .env)
npm run dev
```

`.env` needs:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable/anon-key
```

Never put the `service_role` / secret key here.

## 3. Database — one optional migration for the fan wall

Your existing `fan_messages` table keeps working with **no changes**.

To turn on the public fan wall, open Supabase → **SQL Editor** → New query → paste `supabase/migrations/001_fan_wall.sql` → **Run**. It only *adds*:

1. `fan_messages.publish_consent` (true/false, defaults to false — old rows stay private).
2. A separate `fan_wall` table containing only first name, category and message — **no emails**. Visitors can read it but cannot write to it.
3. A moderator-only function `publish_to_fan_wall(id)`. Website visitors are blocked from calling it.

**Moderating** (in SQL Editor):

```sql
-- waiting for approval
select id, name, category, message, created_at from fan_messages
where publish_consent and id not in (select source_message_id from fan_wall where source_message_id is not null);

select public.publish_to_fan_wall(42);              -- approve message 42
delete from fan_wall where source_message_id = 42;  -- take it down again
```

Until you run the migration, the wall shows "not set up yet", and the form explains that ticking "Feature my message" needs the update.

## 4. Deploy (Vercel)

Push to GitHub → import at vercel.com/new → add both `VITE_SUPABASE_*` variables in Settings → Environment Variables → deploy. `vercel.json` rewrites every route to `index.html`, so `/explore` and `/community` work on refresh.

## Editing content

All video/series/feed links live in `src/data/content.js`. To add a video, copy the id from its URL (`youtube.com/watch?v=THIS_PART`) and add an entry. Never invent ids or titles.

## Project structure

```
src/
  App.jsx                 routes, scroll/title handling, page transition
  components/             Header, Footer, CreatorImage, Reveal, VideoThumb
  features/               ContentExplorer, FanForm, FanWall, ConsistencyTracker
  pages/                  Home, Explore, Community, NotFound
  data/content.js         the content library
  lib/links.js            verified creator URLs + safe external-link props
  lib/supabase.js         client from env vars + friendly error messages
supabase/schema.sql       base table + insert-only RLS (safe to re-run)
supabase/migrations/      001_fan_wall.sql
```
