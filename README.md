# thenovembercouple.com

The November Couple's site: home, trips, trip planners, journal, and a brand / media-kit page.
Built with Next.js 15 (App Router), Tailwind v4, Supabase and Resend, and hosted on Vercel.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # booking-rule + calendar unit tests
npm run build      # production build (validates all content)
```

The site runs without any keys. The planner, the calendar download and all pages work. Saving a trip, newsletter sign-up and the brand form show a friendly "not switched on yet" message until you add the keys below.

## Adding a new trip (no code changes)

1. Create `content/destinations/<slug>/`, copying `japan/` as a template:
   - `destination.json` holds the name, timezone (IANA, e.g. `Asia/Makassar`), currency, cities, categories and essentials.
   - `itinerary.json` holds your day-by-day plan. Set `activity` to an activity slug to link an entry.
   - `activities.json` is the catalog. Each activity has a `booking.rule` (see below).
2. Register it with one line in `content/destinations/index.ts`.
3. Run `npm run build`. The content is validated, and a typo (an unknown slug or a bad date) fails the build with a clear message.

### Booking rules

All times are in the destination's local time zone.

| `type` | Example | Meaning |
|---|---|---|
| `daysBefore` | `{ "days": 60, "time": "14:00" }` | Tokyo Disney: 60 days before at 2 PM |
| `monthsBefore` | `{ "months": 3 }` | USJ: 3 months before |
| `monthlyRelease` | `{ "dayOfMonth": 10, "monthsAhead": 1, "time": "10:00" }` | Ghibli: the whole month goes on sale on the 10th of the month before |
| `lottery` | `{ "entryMonthsBefore": 3 }` | Nintendo Museum: lottery entries open 3 months before |
| `recommended` | `{ "daysBefore": 14 }` | No release date; book about 2 weeks ahead |
| `none` | `{}` | Walk in |

Update `lastVerified` whenever you re-check a rule. It's shown on the activity page.

### Photos

Put images in `public/images/` and set `"image": "/images/xyz.jpg"` on an activity, or `coverImage` on a destination, or `heroImage` in `content/site.ts`. Anything without a photo shows an elegant typographic placeholder.

## Going live

1. **Supabase**: create a project and run `supabase/schema.sql` in the SQL editor.
2. **Resend**: verify `thenovembercouple.com` as a sending domain.
3. **Vercel**: import the repo and add the env vars from `.env.example`.
4. **Reminder emails** need `/api/cron/reminders` called every 10–15 minutes with `Authorization: Bearer $CRON_SECRET`:
   - On Vercel **Pro**, add a `vercel.json` with `{"crons":[{"path":"/api/cron/reminders","schedule":"*/10 * * * *"}]}`. Vercel sends the secret automatically.
   - On the **Hobby** plan, crons run at most daily, which is too coarse for "opens in 1 hour" reminders. Use a free external scheduler (e.g. cron-job.org, or a GitHub Actions schedule) to call the URL with the header instead.
5. Optional extras:
   - The Turnstile keys add spam protection to the brand form.
   - The affiliate IDs are appended automatically to outbound links through `/go/...`.

## Content to fill in

- `content/media-kit.json`: stats, audience, partners, case studies, and the PDF link.
- `app/about/page.tsx`: your story and facts. The current text is placeholder copy.
- `content/journal/*.mdx`: posts. Two drafts are included.
- `app/privacy/page.tsx`: a template. Have it reviewed for your jurisdiction.
