# Geo Dashboard

> A scalable geospatial project management platform that visualizes 100,000+ infrastructure projects across India through an interactive map and high-performance data grid.

🔗 **[Live Demo](https://geo-dashboard-sigma.vercel.app/)** &nbsp;·&nbsp; 📡 **[Backend API](https://geo-dashboard-api.onrender.com)** &nbsp;·&nbsp; ⚠️ *Backend hosted on Render free tier — allow ~30s for cold start on first load*

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## What it does

Geo Dashboard lets users search, filter, sort, and paginate through large project datasets while simultaneously visualizing them on a live map. Selecting a table row centers the map on that project's marker — and clicking a marker highlights the corresponding row. The system was built specifically to handle datasets at scale without degrading UI performance.

---

## Screenshots

> <img width="1366" height="768" alt="Screenshot (107)" src="https://github.com/user-attachments/assets/624e6c42-6761-4b0b-8058-cd3bcf443a9c" />

> <img width="1366" height="768" alt="Screenshot (108)" src="https://github.com/user-attachments/assets/ff847280-b99f-4748-a253-1c6ce9135adf" />

> <img width="1366" height="768" alt="Screenshot (109)" src="https://github.com/user-attachments/assets/1fa20b4b-2eef-4cf0-b7a4-abd7b7552aa8" />

><img width="1366" height="768" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/5f0f7aa1-1d56-4b69-b6a7-bd5f3ff56178" />

><img width="1366" height="768" alt="Screenshot (112)" src="https://github.com/user-attachments/assets/7764db21-042a-42fa-804a-162b27a9365e" />

---

## Architecture

```
React + Vite  →  MUI DataGrid + Leaflet Map  →  Axios
                                                   │
                                              Node / Express
                                                   │
                                            MongoDB Atlas
                                          (100,000+ records)
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Material UI, MUI DataGrid, React Leaflet, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend), Render (backend), GitHub CI/CD |

---

## Key Features

**High-Performance Data Grid**
- Server-side pagination, sorting, and filtering — no full dataset loaded in browser
- Debounced search to minimise redundant API calls
- MUI DataGrid virtualisation keeps rendering fast at any page

**Interactive Map**
- Leaflet map with project markers plotted across India
- Bidirectional sync: selecting a table row centres the map, clicking a marker highlights the row
- Custom marker styling

**Scalable Backend**
- Dynamic MongoDB queries with compound indexing on sorted/filtered fields
- Paginated API reduces payload size per request
- Structured query parameters for composable filtering

---

## API Reference

```
GET /api/projects
```

| Parameter | Type | Description |
|---|---|---|
| `page` | Number | Page number |
| `limit` | Number | Records per page |
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

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api/projects
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Seed Database

Generate 100,000 project records with realistic Indian city coordinates:

```bash
node scripts/seedData.js
```

---

## Engineering Decisions

**Why server-side pagination?**
Loading 100k records client-side would mean ~15–20MB of JSON in the browser on first load. Server-side pagination keeps each response under 50KB regardless of total dataset size.

**Why MUI DataGrid virtualisation?**
Even with paginated data, rendering hundreds of DOM rows simultaneously causes layout thrashing. DataGrid virtualisation only renders rows currently in the viewport.

**Why debounced search?**
Without debouncing, every keystroke fires an API request. A 300ms debounce reduces search-triggered requests by ~80% during normal typing.

---

## Author

**Sanket Parab** 
