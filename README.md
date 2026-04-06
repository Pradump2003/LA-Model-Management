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

## Features

- Modern landing page with hero, highlights, featured models, Instagram feed, and news
- Model directory: browse, filter, and view detailed model profiles (stats, photos, videos, social links)
- News/blog: latest stories and articles with detail pages
- Press page: agency press and editorial features
- Become a Model: application form with backend email and database storage
- Contact page: contact form with backend email
- Admin/uploads: (if enabled) upload and manage model photos/videos
- Responsive, mobile-friendly UI
- Smooth animations (Framer Motion)
- Automatic scroll-to-top on route change

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
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── postcss.config.js  # PostCSS config
│   ├── vite.config.js     # Vite config
│   └── ...                # Other config files
│
├── server/                # Backend (Node.js + Express)
│   ├── config/            # Config files (cloudinary, database)
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── services/          # Service modules (email, upload)
│   ├── uploads/           # Uploaded files
│   │   └── temp/          # Temporary upload storage
│   ├── utils/             # Utility functions
│   ├── server.js          # Entry point
│   ├── package.json       # Backend dependencies
│   └── ...                # Other config files
│
└── README.md              # Project documentation
```

---

## Getting Started

1. **Install dependencies:**
   - `cd client && npm install`
   - `cd ../server && npm install`
2. **Configure environment variables:**
   - Set up `.env` files for both client and server as needed (API URLs, DB credentials, etc.)
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
