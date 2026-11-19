# Studio Srijan website

A minimal, editorial redesign of [studiosrijan.com](https://www.studiosrijan.com/), built with React, TypeScript and Vite.

## Run it

```sh
npm install
npm run dev
```

## Updating content

Everything the studio says lives in **`src/content.ts`**; no layout code needs to change. Text and images come from the Studio Srijan company profile, and contact details from the current studiosrijan.com.

- **Projects:** each project has a title, type, location, optional status (e.g. "Upcoming"), a description and its images in `public/projects/<folder>/`. The first image is the cover.
- **Principal Architect:** awards, the book and press live under `principal`. Add YouTube videos to `videos` or podcast episodes to `podcasts` and those sections appear automatically.
- **Team, story, vision, mission and values:** under `studio`, `vision`, `mission` and `values`.

Pages: Home, Projects (filter by type), Project detail (photo slideshow), Team, Principal Architect, Location (map + directions), Contact. The contact form opens the visitor's email app addressed to the studio; there's no server. A short logo animation plays once per visit.
