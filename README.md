# Gov API Explorer — UK Police Data (Vite + React)

A database-free rich web application that progressively queries the UK Police API to generate dynamic content.

## Live demo
https://CliffYoung2003.github.io/gov-api-explorer/

## Build & run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## GitHub Pages deployment (GitHub Actions)
1. In `vite.config.js`, set:
   `const repoBase = "/<your-repo-name>/";`
2. Push to GitHub on the `main` branch.
3. In GitHub repo settings:
   Settings → Pages → Build and deployment → Source: **GitHub Actions**
4. Visit the Pages URL once the workflow finishes.

## API endpoints used
- /crime-last-updated
- /crimes-street-dates
- /crime-categories?date=YYYY-MM
- /crimes-street/{category}?date&lat&lng
- /outcomes-for-crime/{crimeId}
- /locate-neighbourhood?q=lat,lng
- /{force}/{neighbourhood}

Data source: https://data.police.uk/docs/
