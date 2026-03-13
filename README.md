# Voyage - AI Travel Discovery and Booking App

Voyage is a full-stack travel platform that helps users discover destinations by vibe, compare curated hotels, and complete bookings with a premium UX.

## Features

- AI vibe-based destination matching (Gemini)
- Destination discovery and trending places
- Hotel browsing and booking flow
- Stripe-powered payment intent + confirmation flow
- Firebase authentication on the client
- Booking persistence with MongoDB
- Booking confirmation email support via SMTP

## Tech Stack

Frontend:
- React 19 + Vite
- React Router
- Framer Motion + GSAP
- Axios
- Firebase Auth
- Stripe React SDK

Backend:
- Node.js + Express
- MongoDB + Mongoose
- Google Generative AI (Gemini)
- Stripe
- Firebase Admin
- Nodemailer

## Project Structure

- client: React frontend app
- server: Express API server

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas (or local MongoDB)
- Firebase project
- Stripe account
- Gemini API key

## Environment Setup

Create a file at server/.env with the following values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

FIREBASE_PROJECT_ID=your_firebase_project_id

SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourdomain.com
```

Notes:
- The frontend currently uses a hardcoded Firebase client config in client/src/firebase.js.
- In production, consider moving Firebase client values to Vite environment variables.

## Local Development

1. Install frontend dependencies:

```bash
cd client
npm install
```

2. Install backend dependencies:

```bash
cd ../server
npm install
```

3. (Optional) Seed sample data:

```bash
npm run seed
```

4. Run backend:

```bash
npm run dev
```

5. In a new terminal, run frontend:

```bash
cd ../client
npm run dev
```

6. Open:
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

## API Overview

- POST /api/vibe/search
- GET /api/vibe/trending
- GET /api/destinations
- GET /api/hotels/destination/:destinationId
- POST /api/bookings/create
- POST /api/payments/create-intent
- POST /api/payments/confirm

## Deploying on Vercel

Because this repository contains separate client and server apps, there are two common approaches:

1. Deploy only frontend to Vercel and host backend separately.
2. Refactor backend into Vercel serverless functions (not yet configured in this repo).

### Current recommended path for this repository

Deploy client to Vercel:

1. In Vercel, import this repository.
2. Set Root Directory to client.
3. Build Command: npm run build
4. Output Directory: dist
5. Add any required frontend environment variables if you later externalize Firebase config.
6. Deploy.

Then point frontend API requests to your hosted backend domain (instead of relative /api), if backend is not behind the same domain.

## Scripts

Frontend (client/package.json):
- npm run dev
- npm run build
- npm run preview
- npm run lint

Backend (server/package.json):
- npm run dev
- npm run start
- npm run seed

## License

This project is currently unlicensed.
