# Geo Dashboard

> A scalable geospatial project management platform that visualizes 100,000+ generated infrastructure project records across India through an interactive map and high-performance data grid.

🔗 **[Live Demo](https://geo-dashboard-sigma.vercel.app/)** &nbsp;·&nbsp; 📡 **[Backend API](https://geo-dashboard-api.onrender.com)** &nbsp;·&nbsp; ⚠️ *Backend hosted on Render free tier — allow ~30s for cold start on first load*

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## What it does

Geo Dashboard lets users search, filter, sort, and paginate through large project datasets while simultaneously visualizing them on a live map. Selecting a table row centers the map on that project's marker and clicking a marker highlights the corresponding row — including markers folded into a cluster, which the map automatically zooms into to reveal. The system was built specifically to handle datasets at scale without degrading UI performance.

---

## Screenshots

> <img width="1366" height="768" alt="Screenshot (121)" src="https://github.com/user-attachments/assets/26cbfe8f-2c72-4da8-a0c6-519e62dd3a8d" />

><img width="1366" height="768" alt="Screenshot (122)" src="https://github.com/user-attachments/assets/2261fd65-e7c2-4cab-9f5d-d89a29520986" />

> <img width="1366" height="768" alt="Screenshot (123)" src="https://github.com/user-attachments/assets/6de20753-b6c1-4c29-9c94-79fc40b5131f" />

> <img width="1366" height="768" alt="Screenshot (109)" src="https://github.com/user-attachments/assets/1fa20b4b-2eef-4cf0-b7a4-abd7b7552aa8" />

><img width="1366" height="768" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/5f0f7aa1-1d56-4b69-b6a7-bd5f3ff56178" />

><img width="1366" height="768" alt="Screenshot (112)" src="https://github.com/user-attachments/assets/7764db21-042a-42fa-804a-162b27a9365e" />

---

## Architecture

```
React + Vite  →  MUI DataGrid + Leaflet Map (clustered)  →  Axios
                                                                │
                                                    Node / Express
                                            (Helmet, rate limiting, CORS allowlist)
                                                                │
                                                     MongoDB Atlas
                                          (100,000+ records, indexed)
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Material UI, MUI DataGrid, React Leaflet, react-leaflet-cluster, Axios |
| Backend | Node.js, Express.js, Mongoose, Helmet, express-rate-limit |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend), Render (backend), GitHub CI/CD |

---

## Key Features

**High-Performance Data Grid**
- Server-side pagination, sorting, and filtering — no full dataset loaded in browser
- Debounced search to minimise redundant API calls
- Renders on MUI DataGrid, which virtualises rows internally (only in-viewport rows are rendered); render buffers tuned via `rowBufferPx`/`columnBufferPx`

**Interactive Map**
- Leaflet map with project markers plotted across India
- Marker clustering (`react-leaflet-cluster`) groups nearby markers at low zoom for readability and fewer rendered DOM nodes
- Bidirectional sync: selecting a table row centres the map, clicking a marker highlights the row; if the target marker is folded into a cluster, the map automatically zooms/spiderfies to reveal it (`zoomToShowLayer`)
- Custom marker styling for default vs. selected state

**Scalable Backend**
- Dynamic MongoDB queries with indexes on `projectName`, `projectNumber`, `createdAt`, and a compound `{status, projectNumber}` index
- Paginated API reduces payload size per request; `limit` is capped server-side at 100 regardless of client input
- Structured query parameters for composable filtering

**Security**
- Helmet sets baseline security response headers (disables `X-Powered-By`, adds `X-Content-Type-Options`, a default CSP, etc.)
- CORS allowlist restricts cross-origin requests to configured frontend origins only (`FRONTEND_URL`, `FRONTEND_URL_LOCAL`)
- Rate limiting on `/api/projects` (300 requests / 15 min per IP) returns `429` once exceeded

---

## API Reference

```
GET /api/projects
```

| Parameter | Type | Description |
|---|---|---|
| `page` | Number | Page number |
| `limit` | Number | Records per page (capped server-side at 100) |
| `search` | String | Filter by project name |
| `status` | String | Filter by status |
| `sortBy` | String | Field to sort by |
| `order` | String | `asc` or `desc` |

**Example**
```
GET /api/projects?page=1&limit=50&search=Highway&status=Active&sortBy=projectNumber&order=asc
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` (see `frontend/.env.example`):
```
VITE_API_URL=http://localhost:5000/api/projects
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` (see `backend/.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=https://your-deployed-frontend-url
FRONTEND_URL_LOCAL=http://localhost:5173
```

### Seed Database

Generate 100,000 project records with realistic Indian city coordinates:

```bash
cd backend
node scripts/seedData.js
```

---

## Engineering Decisions

**Why server-side pagination?**
Loading 100k records client-side would mean ~15–20MB of JSON in the browser on first load. Server-side pagination keeps each response under 50KB regardless of total dataset size, and the `limit` parameter is capped at 100 server-side so a client can't request an oversized page and defeat this on purpose.

**Why rely on MUI DataGrid's built-in virtualisation?**
Even with paginated data, rendering hundreds of DOM rows simultaneously causes layout thrashing. DataGrid only renders rows currently in the viewport; render buffers were tuned rather than the virtualisation itself being custom-built.

**Why debounced search?**
Without debouncing, every keystroke fires an API request. A 300ms debounce reduces search-triggered requests during normal typing.

**Why marker clustering with automatic zoom-to-reveal?**
With up to 50 markers per page rendered close together on a national map, individual pins overlap and become unreadable. Clustering groups nearby markers into a count bubble; selecting a row that's inside a cluster calls `zoomToShowLayer` to zoom/spiderfy until that specific marker is visible, rather than just re-centring on a spot that may still show a cluster bubble.

**Why a CORS allowlist instead of open CORS?**
The API was previously open to any origin. Restricting it to explicitly configured frontend URLs (local + deployed) prevents arbitrary third-party sites from calling the API from a browser context.

**Why rate limiting?**
Protects the API from being hammered by a single client (accidental retry loops or intentional abuse) without requiring authentication for a public read-only dataset.

---

## Known Limitations

- Map clustering operates on the current page of data (up to 50 records) passed down from the table, not the full 100k-record dataset — showing all records on the map at once would require a separate lightweight endpoint returning only coordinates.
- Search uses an unanchored `$regex` match, which can't use the `projectName` index for substring matches; it's index-assisted for sorting/filtering but not for the search itself.

---

## Author

**Sanket Parab**
