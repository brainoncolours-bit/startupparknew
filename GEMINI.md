# Project: Startup Park Ecosystem

This project is a high-performance, visually immersive web application for "Startup Park," an ecosystem for entrepreneurs. It leverages React 19, Vite 8, and Three.js to create a modern, interactive experience with complex scroll-driven animations and 3D elements.

## Tech Stack

- **Framework:** React 19 (Functional Components, Hooks)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4, PostCSS
- **3D Rendering:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** GSAP (with ScrollTrigger), Framer Motion
- **Routing:** React Router DOM 7
- **Smooth Scrolling:** Lenis
- **Icons:** Lucide React

## Project Structure

- `src/main.jsx`: Application entry point.
- `src/App.jsx`: Root component, manages routing, Lenis smooth scrolling, and GSAP global configuration.
- `src/Components/`: Contains shared UI components like `Navbar` and `Footer`.
- `src/Pages/`: Contains main page components:
    - `Home.jsx`: Features heavy 3D integration and the **Exclusive Card** pre-booking section.
    - `Blogs.jsx` & `BlogDetail.jsx`: Public blog ecosystem.
    - `Admin/`:
        - `Login.jsx`: Secure admin entry.
        - `Dashboard.jsx`: Tabbed management for **Blog Posts** and **Card Pre-bookings**.
        - `CreatePost.jsx` & `EditPost.jsx`: Forms for managing blog content.
- `src/lib/supabase.js`: Centralized Supabase client configuration.

## Supabase Integration

- **Auth:** Managed via Supabase Auth for the `/admin` section.
- **Storage:** Managed via Supabase Storage. A public bucket named `blog-images` is required for image uploads.
- **Database:**
    - `posts`: Stores blog titles, descriptions, and statuses.
    - `post_images`: Stores public URLs of images uploaded to Supabase Storage.
    - `pre_bookings`: Stores user expressions of interest (name, phone) for the new card.
- **Environment:** Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a `.env` file.

## Development Conventions

### Dynamic Content
- **Blogs:** Managed via the "Blog Posts" tab in the admin dashboard. Always filter by `status === 'published'` for public views.
- **Pre-bookings:** Data captured via `PreBookModal.jsx` and managed in the "Card Pre-bookings" tab in the admin dashboard.
- **Images:** Uses direct device uploads to Supabase Storage.

### 3D & Animations
- **GSAP & ScrollTrigger:** Prefer `useLayoutEffect` for initializing ScrollTriggers to prevent layout shifts. Always use `gsap.context()` for easy cleanup.
- **Three.js:** Components using `@react-three/fiber` should ideally be wrapped in `Suspense`. Use `instancedMesh` for high-performance rendering of repeated objects.
- **Performance:** Optimize `dpr` and `antialias` settings in `<Canvas />`.

### Styling & Layout
- **Tailwind CSS:** Primary styling method.
- **Fluid UI:** Use `clamp()` for typography and spacing to ensure seamless scaling.
- **Aesthetics:** Dark theme with high-contrast text, backdrop blurs, and subtle glassmorphism.

## Building and Running

- `npm run dev`: Start development server.
- `npm run build`: Create production build.
- `npm run lint`: Run ESLint checks.
- `npm run preview`: Preview production build locally.
