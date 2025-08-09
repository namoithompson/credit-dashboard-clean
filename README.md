# Credit Dashboard (Clean)

This is a clean, production‑ready credit dashboard built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **NextAuth**.  It implements the pages and behaviour described in the project specification and follows a simple design system extracted from provided screenshots.

## Features

- **Home**: Displays a summary of the user’s credit scores across the three Australian bureaus.  Shows empty states until a PDF is uploaded.
- **Credit Report**: Tabbed interface for Overview, Accounts, Defaults and Judgements.  Empty until data is present.
- **Disputes**: Toggle between current and completed disputes with a placeholder table.
- **Account Settings**: Sectioned form for personal, contact and login details.  Supports file uploads for identification and billing documents.
- **Billing**: Manage local payment methods without an external gateway.
- **RBAC**: Roles enforced on API routes using a helper in `lib/rbac.ts`.  `CLIENT` users only see their own data, while `STAFF` and `ADMIN` can manage everything.
- **NextAuth**: Simple credentials provider with session enrichment for user ID and role.
- **Prisma**: SQLite in development; Postgres in production.  Models defined for Users, Clients, Documents, BureauScores, Disputes, Activities, and PaymentMethods.
- **PDF Extraction**: Upload PDF reports to extract bureau scores using basic heuristics.  Extraction logic lives in `lib/extractor.ts` and is unit tested.
- **CI**: GitHub Actions workflow runs `npm ci`, `prisma generate`, TypeScript type checking and `vitest` tests.

## Local Development (macOS)

1. **Clone the repo** and install dependencies:

   ```bash
   git clone git@github.com:namoithompson/credit-dashboard-clean.git
   cd credit-dashboard-clean
   npm install
   ```

2. **Create a `.env` file** based on `.env.example` and set `NEXTAUTH_SECRET` to a random string (e.g. run `openssl rand -base64 32`).  When using SQLite locally the default values can remain unchanged.

3. **Run migrations and generate Prisma client**:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Create the first admin** by visiting `/setup` and submitting the form.  Afterwards, log in at `/login`.

## Deployment

When deploying to Vercel:

1. Provision a Postgres database (e.g. via Neon or Supabase) and set `DB_PROVIDER=postgresql` and `DATABASE_URL` accordingly in the Vercel project settings.
2. Set `NEXTAUTH_URL` to the Vercel URL and `NEXTAUTH_SECRET` to the same secret used locally.
3. Define `FILE_STORAGE_ROOT` to an appropriate path or keep it as a temporary directory (files are not persisted across deployments).
4. Add the environment variables via the Vercel dashboard.
5. The CI workflow will run on each pull request; ensure it passes before merging to `main`.  Vercel preview deployments will be automatically created for each PR once the GitHub App is authorised.

## Extending the Extractor

To swap the PDF extraction logic to use Azure Document Intelligence instead of the built‑in heuristics, replace the implementation in `lib/extractor.ts` with calls to the Azure SDK.  Ensure that the `ExtractionResult` type is still returned and update the unit tests accordingly.
