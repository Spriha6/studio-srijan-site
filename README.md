# Studio Srijan website

A minimal, editorial redesign of [studiosrijan.com](https://www.studiosrijan.com/), built with React, TypeScript and Vite.

## Run it

```sh
npm install
npm run dev
```

## Updating content

Everything the studio says lives in **`src/content.ts`** — no layout code needs to change.

- **Projects:** replace the placeholder entries. Put photos in `public/projects/<slug>/` and list them in `images` (the first image is the cover). Remove `placeholder: true` once an entry is real.
- **Team:** add names, roles and portraits (`public/team/...`).
- **Services:** the one-line descriptions are drafts — confirm them with the studio.
- **Contact details** come from the current site.

Pages: Home, Projects (filter by discipline), Project detail, Team, Location (map + directions), Contact. The contact form opens the visitor's email app addressed to the studio; there's no server.
