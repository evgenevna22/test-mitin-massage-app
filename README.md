# Mitin Massage

Mitin Massage is a small Telegram Mini App for booking massage appointments through Telegram messanger. Telegram provides all authentication data needed to verify each user.

## What it does

- Shows the calendar with free appointment times.
- Lets clients book an available time and receive a confirmation in Telegram.
- Notifies the administrator when a new appointment is made.
- Lets administrator creates appointment slots for several dates at once, with a chosen time range, duration, and break.
- Shows up a few upcoming booked appointments in the admin area.
- Determines access from the visitor's Telegram ID. Administrators can also switch to the client view to see the experience from the other side.
- Verifies `Telegram.WebApp.initData` on the API, except in development mode to make local testing easier.

## Built with

| Area | Technologies |
| --- | --- |
| Frontend | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" alt="Vue.js" width="15" height="15" /> Vue 3, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" width="15" height="15" />  TypeScript, Vite, Vue Router, Pinia, PrimeVue |
| Backend | Node.js, Express, TypeScript, Zod |
| Services | Telegram Bot API / Web Apps, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" alt="Firebase" width="15" height="15" /> Firebase Admin SDK, Cloud Firestore |

## Project layout

```text
.
├── frontend/  # Telegram Web App and its interface
└── backend/   # REST API, Telegram validation, Firestore, and bot
```

## Running locally

The project uses Node.js and `pnpm`.

1. Install Node.js and `pnpm` from [the official guide](https://nodejs.org/en/download).

2. Start by installing dependencies for both parts of the app:

```bash
cd frontend && pnpm install
cd ../backend && pnpm install
```

3. The frontend needs the URL of the API. Create `frontend/.env` with:

```dotenv
VITE_API_URL=http://localhost:2222
```

4. The backend reads its configuration from `backend/.env`:

```dotenv
BOT_TOKEN=<bot_token>
PORT=2222
NODE_ENV=development
MASTER_TELEGRAM_ID=<primary_admin_telegram_id>
ADMIN_TELEGRAM_ID=<notification_admin_telegram_id>
FIREBASE_PROJECT_ID=<firebase_project_id>
FIREBASE_CLIENT_EMAIL=<service_account_client_email>
FIREBASE_PRIVATE_KEY=<service_account_private_key>
```

5. If `FIREBASE_PRIVATE_KEY` is stored on one line in the `.env` file, keep line breaks as `\n`.
With those values in place, run the API in one terminal:

```bash
cd backend
pnpm dev
```

Then run the interface in another:

```bash
cd frontend
pnpm dev
```

Vite serves the app at `http://localhost:5173` by default, while the API listens on `http://localhost:2222`.

For development: uses `ADMIN_TELEGRAM_ID` as the current user, making it possible to explore the app and API outside Telegram.

For production: requests come from the Telegram Web App; the server checks the `x-telegram-init-data` header and validates that the signed data is still fresh.

## API

Every route except `/` and `/health` expects Telegram authentication. Routes below `/admin` are also restricted to administrator IDs.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check that the server is available |
| `GET` | `/role` | Read the current role and role-switching permission |
| `GET` | `/slots/month/:month` | Get slots for a month |
| `GET` | `/slots/date/:date` | Get free slots for a date |
| `PUT` | `/slots/:id/book` | Book a slot |
| `PATCH` | `/slots/:id/cancel` | Cancel the current user's appointment |
| `POST` | `/admin/slots` | Create slots for one or more dates |
| `GET` | `/admin/upcoming` | Get up to 10 upcoming booked slots |

A slot-creation request looks like this:

```json
{
  "dates": ["2026-09-10", "2026-09-11"],
  "time": {
    "start": "10:00",
    "end": "18:00",
    "duration": "01:00",
    "gap": "00:15"
  }
}
```

## Useful commands

| Directory | Command | What it does |
| --- | --- | --- |
| `frontend` | `pnpm dev` | Start the Vite development server |
| `frontend` | `pnpm build` | Check types and build the production app |
| `frontend` | `pnpm typecheck` | Run ESLint with automatic fixes |
| `backend` | `pnpm dev` | Start the API with file watching |
| `backend` | `pnpm build` | Compile TypeScript into `dist/` |
| `backend` | `pnpm start` | Run the compiled server |

## Deployment notes

The frontend is ready for Vercel: [frontend/vercel.json](frontend/vercel.json) sends SPA routes back to `index.html`. Before publishing, point `VITE_API_URL` at the public API, allow the frontend's URL in [backend/src/index.ts](backend/src/index.ts), and provide the production environment values to the backend. The Telegram bot's `/start` handler in [backend/src/telegram/handlers.ts](backend/src/telegram/handlers.ts) should point to the deployed frontend URL.
