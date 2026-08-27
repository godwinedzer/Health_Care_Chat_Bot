<div align="center">
  <h1>🚁 ChopperOnline - Frontend Application</h1>
  <p><strong>React + Vite + TypeScript Client</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

> **Note:** This directory contains the frontend client application for ChopperOnline. For the full project overview, backend setup, and system architecture, please see the [Main Project README](../README.md).

## 🚀 Getting Started

This project is bootstrapped with Vite to provide a lightning-fast development experience with instant Hot Module Replacement (HMR).

### Prerequisites

*   Node.js (v18.x or later)

### Installation

Navigate to this directory and install the dependencies:

```bash
npm install
```

### Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

To create a production-ready build:

```bash
npm run build
```

The built files will be located in the `dist` directory, ready to be served by any static file server or deployed to platforms like Vercel, Netlify, or Firebase Hosting.

## 📂 Project Structure

*   `src/components/` - Reusable UI components and page layouts (Chatbot, Disease List, Header, etc.)
*   `src/services/` - API integration logic (fetching data from the Express backend)
*   `src/App.tsx` - Main application routing entry point

## 🔧 Linting and Code Quality

This project uses ESLint with TypeScript configurations to ensure code quality.

```bash
# Run the linter
npm run lint
```
