# LA Model Management

A modern full-stack web application for a modeling agency, built with React (Vite), Tailwind CSS, Node.js, and Express.

---

## Folder Structure

```
LA Model Manegment/
│
├── client/                # Frontend (React + Vite)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable UI components
│   │   │   ├── common/    # Navbar, Footer, Button, etc.
│   │   │   ├── home/      # Home page sections (Hero, FeaturedModels, etc.)

# LA Model Management

A modern full-stack web application for a modeling agency, built with React (Vite), Tailwind CSS, Node.js, and Express.

---

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Application Flow](#application-flow)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Home Page:** Modern hero section, agency highlights, featured models, Instagram feed, and latest news.
- **Model Directory:** Browse all models, filter by categories (Women, Men, New Faces, Direct, Special Booking, Juniors), and view detailed model profiles with stats, photos, videos, and social links.
- **News/Blog:** Read latest news and blog articles, with detail pages for each post.
- **Press Page:** Agency press and editorial features.
- **Become a Model:** Application form for aspiring models, with backend email notification and database storage.
- **Contact Page:** Contact form for general inquiries, with backend email notification.
- **Admin/Uploads:** (If enabled) Upload and manage model photos/videos via backend endpoints.
- **Responsive Design:** Fully responsive and mobile-friendly UI.
- **Animations:** Smooth transitions and interactive UI using Framer Motion.
- **Scroll-to-Top:** Automatic scroll to top on route change for better UX.

---

## Folder Structure

```
LA Model Manegment/
│
├── client/                # Frontend (React + Vite)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable UI components
│   │   │   ├── common/    # Navbar, Footer, Button, etc.
│   │   │   ├── home/      # Home page sections (Hero, FeaturedModels, etc.)
│   │   │   ├── layout/    # Layout wrappers
│   │   │   └── models/    # Model-related components
│   │   ├── data/          # Static data (e.g., countries.js)
│   │   ├── pages/         # Route pages (Home, About, Blogs, Contact, Models, etc.)
│   │   │   └── models/    # Model category/detail pages
│   │   ├── services/      # API service modules
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── ...                # Vite, Tailwind, config files
│
├── server/                # Backend (Node.js + Express)
│   ├── config/            # Config files (cloudinary, database)
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── services/          # Service modules (email, upload)
│   ├── uploads/           # Uploaded files
│   ├── utils/             # Utility functions
│   ├── server.js          # Entry point
│   └── package.json       # Backend dependencies
│
└── README.md              # Project documentation
```

---

## Application Flow

1. **Frontend (client/):**
   - User lands on the Home page (`/`).
   - Navigation via Navbar to About, Press, News, Models, Contact, etc.
   - Model categories and details are browsable under `/models` and `/model/:slug`.
   - News/Blogs are available at `/news` and `/news/:slug`.
   - Forms (e.g., Become a Model, Contact) submit data to the backend API.

2. **Backend (server/):**
   - Handles API requests for models, blogs, applications, contacts, uploads, etc.
   - Uses MongoDB for data storage (models, blogs, contacts, etc.).
   - Handles file uploads (Cloudinary integration).
   - Sends emails for contact/application forms.

3. **API Communication:**
   - Frontend uses `src/services/api.js` to communicate with backend endpoints.
   - Data is fetched and rendered in React components/pages.

4. **Styling & Animations:**
   - Tailwind CSS for utility-first styling.
   - Framer Motion for animations.
   - Responsive and modern UI.

---

## Getting Started

1. **Install dependencies:**
   - `cd client && npm install`
   - `cd ../server && npm install`
2. **Configure environment variables:**
   - Set up `.env` files for both client and server as needed (API URLs, DB credentials, etc.).
3. **Run the app:**
   - Start backend: `cd server && npm run dev`
   - Start frontend: `cd client && npm run dev`
4. **Build for production:**
   - Frontend: `cd client && npm run build`

---

## Usage

- All routes are managed in `client/src/App.jsx`.
- Scroll-to-top and navigation behaviors are handled globally.
- For any issues, check the browser console and server logs.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## License

MIT
