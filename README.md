# Dor — Indian Artisan Marketplace

**Dor** is a web platform that connects skilled Indian artisans directly with retail customers and B2B buyers. The platform provides craftspeople with a space to showcase handcrafted products and authentic craft stories, interact with individual shoppers through custom enquiries, and process bulk B2B purchase requests.

**Live Demo:** [https://dor-artisan-marketplace.vercel.app/](https://dor-artisan-marketplace.vercel.app/)

---

## Features

- **Product Catalog Browsing & Filtering**: Explore handcrafted items organized by categories, materials, and craft types.
- **Artisan Profiles & Craft Stories**: Discover artisan backgrounds, craft summaries, and traditional storytelling.
- **Customer Enquiry System**: Direct communication channel for retail customers to enquire about products or custom work from artisans.
- **B2B Bulk Request & Negotiation**: Business buyers can submit bulk order requests, negotiate quantities and unit pricing, and communicate with artisans via structured message threads.
- **Role-Based Access Control**: Tailored workflows and route protection for `customer`, `artisan`, `business`, and `admin` roles.
- **Business & Artisan Dashboards**: Dedicated interfaces for tracking order statuses, managing profiles, handling enquiries, and negotiating B2B requests.

---

## Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Realtime, Storage)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [Oxlint](https://oxc.rs/)

---

## Repository Structure

```text
.
├── public/                  # Static assets and SPA routing rules (_redirects)
├── scripts/                 # Supabase test and database seeding utility scripts
│   ├── seed.ts
│   ├── test-categories.ts
│   └── test-supabase.ts
├── src/
│   ├── components/          # Reusable UI components, layout, and auth wrappers
│   │   ├── auth/            # Protected, Artisan, and Business route guards
│   │   ├── business/        # B2B bulk request modal components
│   │   ├── enquiries/       # Customer enquiry modals
│   │   ├── layout/          # Navbar, Footer, and AppLayout components
│   │   └── ui/              # Base UI components (Buttons, Cards, MessageThread, badges)
│   ├── contexts/            # React context providers (AuthContext)
│   ├── hooks/               # Custom React hooks for data fetching & state management
│   ├── lib/                 # Supabase client setup, role utilities, and storage helpers
│   ├── pages/               # Page views grouped by user persona (artisan, business, customer, auth)
│   ├── routes/              # Central routing configuration (AppRouter)
│   ├── services/            # API integration layer for Supabase queries
│   └── types/               # TypeScript type definitions for domain models
├── index.html
├── package.json             # NPM dependencies and script targets
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment configuration
└── vite.config.ts           # Vite build tool configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- An active [Supabase](https://supabase.com/) project with database and authentication configured.

### Environment Setup

Create a `.env` file in the root directory of your project and configure your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rohitkdm2666/artisans-website.git
   cd artisans-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
- **`npm run build`**: Compiles TypeScript types (`tsc -b`) and builds the production bundle with Vite.
- **`npm run preview`**: Boots a local web server to preview the production build.
- **`npm run lint`**: Runs code quality checks using [Oxlint](https://oxc.rs/).

---

## Deployment

This application is deployed on **Vercel**.

- Live URL: [https://dor-artisan-marketplace.vercel.app/](https://dor-artisan-marketplace.vercel.app/)
- SPA route fallback is handled through both `public/_redirects` and `vercel.json` rewrites to prevent 404 errors on deep path refreshes.
