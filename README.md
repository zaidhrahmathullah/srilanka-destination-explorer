# Sri Lanka Destination Explorer

A full-stack application built for the **Scripterlab Software Engineer Internship assessment**. Visitors can explore destinations in Sri Lanka and view current weather. A predefined administrator can sign in and manage destination records.

**Live application:** https://srilanka-destination-explorer.up.railway.app  
**Backend API base:** https://srilanka-destination-explorer-production.up.railway.app/api  
**Repository:** https://github.com/zaidhrahmathullah/srilanka-destination-explorer

## Features

### Public website
- Browse destinations, including seeded Colombo, Kandy and Galle records.
- Open a destination's detail page with its description, image (or placeholder), and current weather.
- View temperature, readable weather condition, relative humidity and wind speed.
- See a weather-unavailable state without losing the destination details.
- Responsive layout and loading/error/empty states.

### Administrator
- Sign in with the predefined administrator account; no public registration.
- View, create, edit and delete destinations.
- Confirm deletions before removing records.
- Log out and restrict admin-only pages and API mutations.

## Technology stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 | UI and page rendering |
| Backend | NestJS 12, TypeScript | REST API, business logic and authorization |
| Database | MongoDB with Mongoose | Persistent destination and administrator documents |
| Authentication | bcrypt, JWT, HTTP-only cookie | Password verification and authenticated admin sessions |
| External API | Open-Meteo | Live weather based on destination coordinates |
| Hosting | Railway | Separate frontend, backend and MongoDB services |

## Architecture

```text
Visitor / Admin browser
        |
        +-- Next.js frontend (Railway)
        |     |-- Public pages: server-side requests for destinations/weather
        |     `-- Admin UI: browser requests with credentials: "include"
        |
        `-----------------------> NestJS REST API (Railway)
                                  |-- /api/destinations
                                  |-- /api/destinations/:id/weather
                                  |-- /api/auth/login, /logout, /me
                                  |-- DTO validation + JWT guard
                                  |
                                  +--> MongoDB (Railway private network)
                                  `--> Open-Meteo (weather lookup)
```

The frontend communicates with NestJS rather than querying MongoDB or Open-Meteo directly. Weather is requested when a destination detail page is viewed; it is **not stored in MongoDB**.

## Repository structure

```text
.
├── apps/
│   ├── api/                        # NestJS application
│   │   ├── src/
│   │   │   ├── auth/               # Login, JWT guard, admin schema, password utilities
│   │   │   ├── destinations/       # CRUD controller/service, DTOs, Mongoose schema
│   │   │   ├── seed/               # Initial admin and destination data
│   │   │   ├── weather/            # Open-Meteo integration and response types
│   │   │   ├── app.module.ts       # NestJS modules and MongoDB connection
│   │   │   `── main.ts             # Bootstrap, CORS, cookies and validation
│   │   ├── test/                   # Backend e2e test
│   │   `── package.json
│   `── web/                        # Next.js application
│       ├── public/                 # Logo and placeholder images
│       ├── src/
│       │   ├── app/                # Public/admin App Router pages and layouts
│       │   ├── components/         # Admin, destination, weather and layout UI
│       │   ├── lib/                # API client and server-side data functions
│       │   `── types/              # Frontend TypeScript interfaces
│       `── package.json
└── .gitignore
```

Both applications have **independent `package.json` and `package-lock.json` files**. Run npm commands in the corresponding application directory.

## Prerequisites

- Node.js and npm compatible with the versions in the applications' `package.json` files.
- A running MongoDB instance (local or hosted).
- Git.
- Internet access for Open-Meteo weather requests.

## Local installation

Clone the repository:

```bash
git clone https://github.com/zaidhrahmathullah/srilanka-destination-explorer.git
cd srilanka-destination-explorer
```

Install dependencies separately:

```bash
cd apps/api
npm ci
cd ../web
npm ci
```

### Backend configuration

Create `apps/api/.env` (do **not** commit it):

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/srilanka_destination_explorer
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_demo_password
WEB_ORIGIN=http://localhost:3000
PORT=4000
NODE_ENV=development
```

Use a valid MongoDB URI. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used by the **seed script** to create the initial account. Changing `ADMIN_PASSWORD` later does not automatically change the existing password stored in MongoDB.

### Frontend configuration

Create `apps/web/.env.local` (do **not** commit it):

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

`NEXT_PUBLIC_API_BASE_URL` is exposed to the browser, so it must contain only the public API address, **never a secret**.

### Seed the database

Start MongoDB first. Then:

```bash
cd apps/api
npm run seed
```

The seed script creates the predefined administrator and the three destinations **Colombo, Kandy and Galle**. It checks for existing records before inserting them. It does not overwrite an existing administrator password. The script requires `MONGODB_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### Start the applications

In terminal 1:

```bash
cd apps/api
npm run start:dev
```

In terminal 2:

```bash
cd apps/web
npm run dev
```

Open http://localhost:3000. The local API base is http://localhost:4000/api.

## API reference

All endpoints below are relative to `/api`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/destinations` | Public | List destinations |
| GET | `/destinations/:id` | Public | Destination details |
| POST | `/destinations` | Admin JWT | Create destination |
| PATCH | `/destinations/:id` | Admin JWT | Update destination |
| DELETE | `/destinations/:id` | Admin JWT | Delete destination |
| GET | `/destinations/:id/weather` | Public | Current weather for saved coordinates |
| POST | `/auth/login` | Public | Verify admin credentials; set session cookie |
| GET | `/auth/me` | Admin JWT | Check authenticated session |
| POST | `/auth/logout` | Public | Clear session cookie |

**Destination data:** `name` (required text), `description` (required text), `latitude` (required number), `longitude` (required number), and optional `imageUrl`. The backend validates incoming DTOs.

Example read-only request:

```bash
curl https://srilanka-destination-explorer-production.up.railway.app/api/destinations
```

### Authentication and security

- Passwords are stored as bcrypt hashes, not plaintext.
- The backend signs JWTs and sends the session token in an HTTP-only `admin_token` cookie.
- The frontend sends authenticated requests with `credentials: "include"`.
- CORS allows the configured `WEB_ORIGIN` and credentials.
- In production the cookie uses `Secure` and `SameSite=None` to support the separate Railway frontend/backend origins. Browser policies that block third-party cookies may affect this arrangement.
- NestJS `JwtAuthGuard` protects create, update, delete and `/auth/me` endpoints. Hiding frontend routes alone is **not** the security boundary.
- Global `ValidationPipe` uses `whitelist`, `forbidNonWhitelisted` and `transform`.

## Weather integration

The NestJS weather endpoint first retrieves the destination from MongoDB, then calls Open-Meteo with that destination's latitude and longitude. It requests:

- `temperature_2m`
- `relative_humidity_2m`
- `weather_code`
- `wind_speed_10m`

The backend maps numeric weather codes to readable conditions, validates the upstream response and applies an 8-second request timeout. If Open-Meteo fails, the backend returns a weather error and the frontend displays the destination without weather details.

## Railway deployment

The production setup uses **three permanent Railway services**:

1. **MongoDB** — database with a persistent volume and private `MONGO_URL`.
2. **Backend** — root directory `apps/api`, build command `npm run build`, start command `npm run start:prod`.
3. **Frontend** — root directory `apps/web`, build command `npm run build`, start command `npm run start`.

### Railway environment variables

**Backend**

```dotenv
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=<long-random-secret>
ADMIN_EMAIL=<demo-admin-email>
ADMIN_PASSWORD=<demo-admin-password-for-initial-seeding>
WEB_ORIGIN=https://srilanka-destination-explorer.up.railway.app
NODE_ENV=production
```

Railway supplies the backend's listening `PORT`. The NestJS server binds to `0.0.0.0`.

**Frontend**

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://srilanka-destination-explorer-production.up.railway.app/api
```

After changing a `NEXT_PUBLIC_` variable, rebuild/redeploy the frontend so the new value is included in the client bundle.

### Production database seeding (temporary Railway service)

Railway's MongoDB private connection is intended for services within its project network. To initialize production data without making MongoDB publicly accessible:

1. Create a **temporary** Railway service named `Database-Seeder` from the repository.
2. Set its root directory to `apps/api`.
3. Set the start command to `npm run seed`.
4. Add the following environment variable references:

   ```dotenv
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   ADMIN_EMAIL=${{Backend.ADMIN_EMAIL}}
   ADMIN_PASSWORD=${{Backend.ADMIN_PASSWORD}}
   ```

5. Run the service and verify the logs confirm the administrator, Colombo, Kandy and Galle were created.
6. Verify the data appears in the public API and website.
7. **Delete only the temporary `Database-Seeder` service.** Keep MongoDB, Backend and Frontend.

This one-time seeding service was used during the actual production deployment and then removed. The reusable seed script remains in source control.

## Testing and verification

Run checks from the relevant application directory:

```bash
# Backend
cd apps/api
npm run build
npm run test

# Frontend (in a separate terminal)
cd apps/web
npm run lint
npm run build
```

End-to-end tests may require additional test configuration or running services. A successful build does not replace browser/API testing.

Manual production checks completed during deployment:

- Public homepage and destination details.
- Current weather, including readable conditions and units.
- Admin login, logout and session persistence.
- Protected admin routes after logout.
- Create, read, update and delete destinations.
- Public pages reflecting database changes.
- Responsive UI and an Incognito login check.

## Demo administrator access

Admin login: https://srilanka-destination-explorer.up.railway.app/admin/login

**Demo credentials:** Supply the actual *rotated, test-only* admin email and password securely with the assessment submission. Do not publish a real reusable personal password or JWT secret in the repository. The assessment requires reviewers to receive test credentials; they can be provided in the submission email.

## Troubleshooting

| Symptom | Check |
|---|---|
| Backend fails to start | `MONGODB_URI`, MongoDB availability, backend logs |
| Frontend cannot fetch API | `NEXT_PUBLIC_API_BASE_URL`, backend URL, redeployment |
| Browser reports CORS failure | Exact frontend origin in backend `WEB_ORIGIN` |
| Login returns 200 but `/auth/me` returns 401 | Cookie attributes, browser third-party-cookie policy, `credentials: "include"` |
| Seed skips admin | Account already exists; changing environment password will not update stored hash |
| Weather unavailable | Open-Meteo connectivity, upstream response and backend logs |
| Destinations missing | Seed output, MongoDB connection and `/api/destinations` |

## Assessment and scope

This application was developed for Scripterlab's Software Engineer Internship full-stack assessment. It intentionally focuses on a single predefined administrator, destination CRUD, a public website, live weather, and Railway deployment. Public user registration, multi-user administration and forecasts are outside the required scope.

**Submission deadline:** 22 October 2026, 5:00 PM Sri Lanka time.
