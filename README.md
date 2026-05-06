# Paris Techno Business Plan Interview

A full-stack interview app for collecting structured business-plan inputs for a techno event company in Paris.

## Run

```bash
node server.js
```

Open `http://127.0.0.1:3000`.

If your shell does not expose `node`, use the bundled Codex runtime path:

```bash
/Users/guillaumeperney/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.js
```

## Features

- React wizard questionnaire with 10 structured sections
- Three respondents per question for partner/cofounder analysis
- Shareable respondent links: `?person=1`, `?person=2`, `?person=3`
- Admin link: `?admin=1`
- Local browser persistence via `localStorage`
- Backend persistence to `data/interviews.json`
- JSON export with raw answers and generated analysis
- PDF summary export
- Progress tracking
- Interviewer notes
- Per-person motivation and alignment scoring
- Group motivation, group alignment, disagreement detection, and total investment
- 3-person comparison view inside each interview
- Minimal dark UI with techno-inspired accent styling

## Architecture

- `server.js`: dependency-free Node.js HTTP server and JSON API
- `public/index.html`: app shell and CDN dependencies
- `public/app.js`: React interview application
- `public/styles.css`: global styling
- `data/interviews.json`: local backend data store

The frontend uses React, Tailwind's browser build, and jsPDF from CDNs so the app can run without a package install in this workspace.

## Sharing Workflow

1. Open the admin view.
2. Create or load an interview.
3. Click `Save` once.
4. Copy the generated links in `Share Links`.
5. Send one personal link to each respondent.
6. Keep the admin link for yourself.

Each personal link only shows one respondent column. When a respondent saves, the app merges that person's answers with the existing interview so the other two respondent columns are preserved.
