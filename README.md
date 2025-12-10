# Peerflex

Peerflex is a comprehensive student life platform designed to connect students, provide essential services, and enhance the overall academic and social experience. It features a robust set of tools for networking, resource sharing, and event management.

## Features

- **Authentication & User Management**
  - Secure Login and Signup via Supabase
  - Password Reset functionality
  - User Profile management

- **Academic Resources**
  - **Notes Sharing:** Create, edit, and view academic notes.
  - **Portfolio Templates:** Access templates to showcase work.
  - **Software Projects:** Showcase and explore software projects.

- **Social & Community**
  - **Chat:** Real-time messaging with peers.
  - **Events:** Discover, create, and join campus events.
  - **Hangout Spots:** Find and recommend the best local hangout spots.

- **Services**
  - Explore various services offered within the platform.
  - Service preview capabilities.

- **UI/UX**
  - **Responsive Design:** Optimized for all devices.
  - **Dark Mode:** Built-in dark mode support.
  - **Interactive Elements:** Smooth animations using Framer Motion and GSAP.
  - **3D Visuals:** Integrated 3D elements using Three.js and React Three Fiber.
  - **Maps:** Interactive maps using Leaflet for events and hangout spots.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Backend / Database:** Supabase
- **Animations:** Framer Motion, GSAP
- **3D Graphics:** Three.js, React Three Fiber
- **Maps:** Leaflet, React Leaflet
- **Forms:** React Hook Form, Zod

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Peerflex
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your Supabase credentials and other necessary environment variables. You can use `.env.example` as a reference.
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
