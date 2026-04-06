
# LA Model Management

Full-stack modeling agency web app.

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + MongoDB (Mongoose) + Cloudinary (uploads) + Email service

---

## Table of Contents

- [Functionality](#functionality)
- [App Flow](#app-flow)
- [Routes](#routes)
- [Folder Structure](#folder-structure)
- [Environment Variables (.env)](#environment-variables-env)
- [Install & Run](#install--run)
- [Build](#build)
- [Troubleshooting](#troubleshooting)

---

## Functionality

- **Home**: hero, featured models, divisions, Instagram feed, latest news.
- **Models directory**: browse by division/category, open model details.
- **Model detail**: hero image, stats, portfolio grid (photos), videos modal, social links, “Back” button.
- **News/Blog**: list news posts and open article details by slug.
- **Press**: press/editorial feature page.
- **Become a Model**: application submission to backend.
- **Contact**: contact form submission to backend.
- **Uploads**: image/video uploads handled by backend (Cloudinary integration).
- **UX**: scroll-to-top on route change (via `ScrollToTop` component).

---

## App Flow

1. User navigates the SPA (React Router).
2. Pages call the backend via `client/src/services/api.js`.
3. Backend routes → controllers → MongoDB models.
4. Upload endpoints store media (Cloudinary) and return URLs.
5. Forms (contact/application) persist data and can trigger emails.

---

## Routes

Frontend routes are defined in `client/src/App.jsx`.

### Public pages

- `/` → Home
- `/about` → About
- `/press` → Press
- `/news` → Blogs/News list
- `/news/:slug` → Blog detail
- `/contact` → Contact
- `/apply` → Become a model
- `/application-success` → Application success page

### Models

- `/models` → All models
- `/models/women` → Women
- `/models/men` → Men
- `/models/new-faces` → New Faces
- `/models/direct` → Direct
- `/models/special-booking` → Special Booking
- `/models/juniors` → Juniors
- `/models/:slug` and `/model/:slug` → Model detail

---

## Folder Structure

```
LA Model Manegment/
├── client/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   │   ├── Button.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Navbar.jsx
│       │   │   └── ScrollToTop.jsx
│       │   ├── home/
│       │   │   ├── Divisions.jsx
│       │   │   ├── FeaturedModels.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── InstagramFeed.jsx
│       │   │   └── LatestNews.jsx
│       │   ├── layout/
│       │   │   └── Layout.jsx
│       │   └── models/
│       │       ├── ModelGrid.jsx
│       │       └── ModelPageLayout.jsx
│       ├── data/
│       │   └── countries.js
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── ApplicationSuccess.jsx
│       │   ├── BecomeModel.jsx
│       │   ├── BlogDetail.jsx
│       │   ├── Blogs.jsx
│       │   ├── Contact.jsx
│       │   ├── Home.jsx
│       │   ├── ModelDetail.jsx
│       │   ├── Models.jsx
│       │   ├── Press.jsx
│       │   └── models/
│       │       ├── AllModels.jsx
│       │       ├── Direct.jsx
│       │       ├── Juniors.jsx
│       │       ├── Men.jsx
│       │       ├── ModelDetail.jsx
│       │       ├── NewFaces.jsx
│       │       ├── SpecialBooking.jsx
│       │       └── Women.jsx
│       └── services/
│           └── api.js
│
└── server/
	├── package.json
	├── server.js
	├── config/
	│   ├── cloudinary.config.js
	│   └── database.config.js
	├── controllers/
	│   ├── application.controller.js
	│   ├── blogs.controller.js
	│   ├── contacts.controller.js
	│   ├── model.controller.js
	│   └── upload.controller.js
	├── middlewares/
	│   ├── auth.middleware.js
	│   └── upload.middleware.js
	├── models/
	│   ├── application.js
	│   ├── blogs.js
	│   ├── contact.js
	│   └── model.js
	├── routes/
	│   ├── application.routes.js
	│   ├── blogs.routes.js
	│   ├── contact.routes.js
	│   ├── model.routes.js
	│   └── upload.routes.js
	├── services/
	│   ├── email.service.js
	│   └── upload.service.js
	├── uploads/
	│   └── temp/
	└── utils/
		├── ApiResponse.utils.js
		└── ErrorHandler.utils.js
```

---

## Environment Variables (.env)

You’ll typically have **two** `.env` files:

### 1) Server: `server/.env`

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/la_models

# CORS (client dev URL)
CLIENT_URL=http://localhost:5173

# Cloudinary (uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (example keys; depends on your implementation)
EMAIL_FROM=no-reply@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
```

### 2) Client: `client/.env`

Create `client/.env`:

```env
# Vite env vars must start with VITE_
VITE_API_BASE_URL=http://localhost:5000/api
```

Note: exact variable names must match what your code reads. If your API client uses a different key, update accordingly in `client/src/services/api.js`.

---

## Install & Run

### Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)

### 1) Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Run development servers

Terminal 1 (backend):

```bash
cd server
npm run dev
```

Terminal 2 (frontend):

```bash
cd client
npm run dev
```

Open:

- Frontend: http://localhost:5173
- Backend (example): http://localhost:5000

---

## Build

Frontend production build:

```bash
cd client
npm run build
```

Preview frontend build:

```bash
cd client
npm run preview
```

---

## Troubleshooting

### “Invalid hook call”

This usually happens when hooks like `useLocation()` are called **outside** a component. Ensure hook calls are inside function components (or custom hooks).

### Page opens at bottom after navigation

Ensure `ScrollToTop` is mounted once in `App.jsx` (already included in this project).

### API requests failing

- Check `VITE_API_BASE_URL` in `client/.env`
- Check backend is running and CORS allows the client URL
- Check server logs for route errors

