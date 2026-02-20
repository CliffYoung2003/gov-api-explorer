# Gov API Explorer — UK Police Data (Vite + React)

This project is a responsive rich web application that interacts with the UK Police public API to explore crime data by location, date and category.

It demonstrates progressive API interrogation, where initial API calls populate available options, and further user selections trigger additional requests to refine and expand the displayed data.

The application contains only publicly available, unclassified open data.

---

## 🌍 Live Demo

https://CliffYoung2003.github.io/gov-api-explorer/

---

## 📌 Project Overview

The application allows users to:

- Select a UK city (or use their current location)
- Choose an available month (loaded from the API)
- Select a crime category (loaded dynamically based on the month)
- Search for street-level crimes
- View investigation outcomes for individual crimes
- Retrieve neighbourhood information for the selected location

The interface updates dynamically based on user input and makes multiple API calls as required.

No dedicated database is used — all data is retrieved live from the API and cached in memory for the session only.

---

## 🏛 Government API Used

**UK Police Data API**  
https://data.police.uk/docs/

Endpoints used:

- `/crime-last-updated`
- `/crimes-street-dates`
- `/crime-categories?date=YYYY-MM`
- `/crimes-street/{category}?date&lat&lng`
- `/outcomes-for-crime/{crimeId}`
- `/locate-neighbourhood?q=lat,lng`
- `/{force}/{neighbourhood}`

All data is publicly accessible and unclassified.

---

## 🧱 Technical Stack

- React (Open Source Framework)
- Vite (build tool)
- GitHub Pages (deployment via GitHub Actions)
- No backend
- No database
- No server-side storage

---

## 🔄 How the Application Interacts with the API

The application performs multiple dependent API calls:

1. Load available crime months  
2. Load crime categories for the selected month  
3. Retrieve street crimes for selected location + month + category  
4. Retrieve investigation outcomes for selected crime  
5. Retrieve neighbourhood details based on location  

Each selection by the user updates the interface and triggers additional API requests as required.

---

## 💻 Running Locally

Clone the repository and install dependencies:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

---

## 🚀 Deployment

This project is deployed using GitHub Actions and GitHub Pages.

To deploy:

1. Ensure `vite.config.js` has the correct base path:
   ```js
   const repoBase = "/gov-api-explorer/";
   ```
2. Push to the `main` branch.
3. In GitHub repository settings → Pages → Source: **GitHub Actions**

The workflow automatically builds and deploys the project.

---

## 📱 Responsiveness & Usability

- Mobile-first responsive layout
- Two-column layout on larger screens
- Simple city selector (no need to manually enter coordinates)
- Clear status and error handling
- Accessible colour contrast

---

## 📎 Submission Notes

- Built using an open-source framework (React)
- No database required
- Dynamic content generated entirely via HTTP API calls
- Source code available via GitHub
- Live hosted demo available via GitHub Pages

---

Data source: https://data.police.uk/
