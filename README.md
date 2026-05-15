# Demo Project Dashboard

## Overview
A Next.js dashboard that authenticates users against DummyJSON and lets them view their own profile, browse products with pagination, and open full product details. Protected routes redirect unauthenticated visitors to the login screen.

## Features
- Email + password login validated through the DummyJSON auth endpoint
- Protected Profile and Products routes with client-side guards
- Product list with pagination
- Product detail view with full metadata
- Graceful loading and error states

## Tech Stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment file (optional):
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the app at http://localhost:3000

## Environment Variables
The app reads the following keys:
- NEXT_PUBLIC_API_BASE_URL: Base URL for DummyJSON (defaults to https://dummyjson.com)

Sample file: .env.example
```
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
JWT_SECRET=replace_with_secure_value
DATABASE_URL=replace_with_connection_string
```
Note: JWT_SECRET and DATABASE_URL are placeholders to satisfy the sample env requirement and are not used by the current front-end-only build.

## Test Login
1. Open https://dummyjson.com/users to view users and their passwords.
2. Enter a user email from the list and the password shown for that user.

## Useful Scripts
- npm run dev: start the dev server
- npm run build: build for production
- npm run start: run the production server
- npm run lint: run ESLint

## Deployment (Vercel)
If you are building locally on Windows, use the default `npm run build` script, which uses Webpack to avoid Turbopack native binding issues.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set NEXT_PUBLIC_API_BASE_URL in the Vercel environment variables.
4. Deploy and verify the production URL.
