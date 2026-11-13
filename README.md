# Yuling Chou's Personal Website

A Next.js personal website for Yu-Ling (Ruby) Chou.

## Customize

Most personal content lives in `app/data.ts`:

- `PERSONAL_INFO`: name and title
- `PROJECTS`: projects, publications, links, awards, and images
- `SOCIAL_LINKS`: GitHub, LinkedIn, CV, Scholar, or other links
- `EMAIL`: contact email, hidden when empty
- `PHOTO_GALLERY`: filenames for images placed in `public/img/photos`

Project images can go in `public/img/projects`, PDFs in `public/pdf`, and
gallery photos in `public/img/photos`.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
```

Built with Next.js, React, Tailwind CSS, and Motion.
