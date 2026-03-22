/**
 * App.jsx — Application shell
 *
 * Responsibilities:
 *   - Route-level AnimatePresence for page transitions
 *   - Renders <Home /> as the default route
 *   - Can be extended with React Router for multi-page navigation
 *
 * To add routing:
 *   npm install react-router-dom
 *   Then replace the direct <Home /> render with <Routes> + <Route> blocks.
 */

import { AnimatePresence } from "framer-motion";
import Home from "./Home";

export default function App() {
  return (
    /**
     * AnimatePresence sits at the app level so page-exit animations
     * can fire before the next page mounts.
     *
     * mode="wait" ensures the exiting page fully unmounts before
     * the entering page begins its animation.
     */
    <AnimatePresence mode="wait">
      <Home key="home" />
    </AnimatePresence>
  );
}

// ─── main.jsx (entry point — do not modify unless bootstrapping fresh) ─────────
//
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
//
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
//
// ─── vite.config.js (recommended) ─────────────────────────────────────────────
//
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// export default defineConfig({ plugins: [react()] });
//
// ─── Dependencies ──────────────────────────────────────────────────────────────
//
// npm install framer-motion
// npm install -D vite @vitejs/plugin-react