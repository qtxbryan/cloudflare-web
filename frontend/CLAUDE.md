# CloudFlare Web App Assignment  — CLAUDE.md
 
This file defines conventions, architecture rules, and coding standards for the CloudFlare Web App Assignmentfrontend.
The frontend is built with React + TypeScript + Tailwind CSS, bundled with Vite.
 
---
 
## What This App Does
 
CloudFlare Web App Assignmentfrontend. is an enterprise internal AI gateway portal. It has two pages:
- A public landing page (`/`) that markets the product
- A protected secure portal (`/secure`) where authenticated users can submit prompts and receive AI responses
The `/secure` page receives identity information (email, timestamp, country) injected by a Cloudflare Worker via response headers.
 
---

## Folder Structure

```
src/
├── main.tsx                        # Entry point
├── App.tsx                         # Root component and routing
├── pages/                          # One file per route, no business logic
│   ├── LandingPage.tsx             # Route: /
│   └── SecurePortal.tsx            # Route: /secure
├── components/
│   ├── ui/                         # Generic stateless UI primitives only
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/                     # Structural components used across pages
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── portal/                     # Feature components for /secure page
│       ├── IdentityBanner.tsx
│       ├── ChatInterface.tsx
│       └── SecurityBadge.tsx
├── context/                        # React Context providers
│   └── AuthContext.tsx
├── api/                            # All fetch calls to backend, never inline
│   └── inferenceApi.ts
├── hooks/                          # Custom React hooks
│   └── useInference.ts
├── utils/                          # Pure helper functions, no React imports
│   └── formatTimestamp.ts
├── types/                          # Shared TypeScript types and interfaces
│   └── AuthTypes.ts
└── assets/                         # Static assets
```
 
---

## Folder Rules
 
- `pages/` — one file per route only, no business logic, no direct API calls. Pages compose components, read from context, and pass props down.
- `components/ui/` — only generic context-free primitives (Button, Input, Card, Badge). No business logic. No API calls. No knowledge of app domain.
- `components/layout/` — structural components used across multiple pages (Navbar, Footer). No business logic.
- `components/<feature>/` — feature components that compose `ui/` primitives and consume hooks. No direct fetch calls.
- `hooks/` — all custom hooks. Must be prefixed with `use`. Call `api/` functions from here, never fetch directly.
- `utils/` — pure functions only. No React imports ever. No side effects.
- `api/` — all fetch calls live here only. Never inline in components, pages, or hooks.
- `context/` — React Context providers and their types. Keep providers thin.
- `types/` — shared TypeScript interfaces and types only. No logic, no imports from React.


---
 
## Naming Conventions
 
| Type | Convention | Example |
|---|---|---|
| Pages | PascalCase | `LandingPage.tsx`, `SecurePortal.tsx` |
| Components | PascalCase | `IdentityBanner.tsx`, `ChatInterface.tsx` |
| Hooks | camelCase prefixed with `use` | `useInference.ts`, `useAuth.ts` |
| Utils | camelCase | `formatTimestamp.ts`, `parseResponse.ts` |
| Types files | PascalCase suffixed with `Types` | `AuthTypes.ts`, `InferenceTypes.ts` |
| API files | camelCase suffixed with `Api` | `inferenceApi.ts` |
| Context files | PascalCase suffixed with `Context` | `AuthContext.tsx` |
 
---

## TypeScript Rules
 
- No `any` types — use `unknown` and narrow explicitly if needed
- Every component must have an explicit prop type defined directly above the component
- Every `api/` function must have explicit parameter and return types
- Every Context value must have an explicit interface
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and aliases
---

## Component Rules
 
- No inline `fetch` or `axios` calls inside components — always go through `api/`
- No inline `style` props except for truly dynamic computed values
- Tailwind utility classes only for styling
- Named exports preferred over default exports for components
- Props must be destructured in the function signature, not accessed via a props object
- Keep components under 150 lines — split if larger
---

## State Management Rules
 
- Local UI state: `useState`
- Derived state: `useMemo`, `useCallback`
- Shared app state: React Context in `context/`
- Server/async state: custom hooks in `hooks/` that call `api/` functions
- No external state library (Redux, Zustand, etc.) unless explicitly added

---

## API Layer Rules
 
- All functions in `api/` must be `async` and return typed Promises
- Handle non-2xx responses by throwing a typed error, never silently failing
- Never hardcode base URLs — read from `import.meta.env.VITE_API_BASE_URL`
- Never expose API keys in the frontend
---

## Styling Rules
 
- Tailwind CSS utility classes only
- Mobile-first responsive design using Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- No inline `style` props except for truly dynamic values

---

## Build Output

- Vite build output is set to `outDir: '../backend/dist'` in `vite.config.ts`
- Never change the outDir
- Running `npm run build` from `frontend/` always outputs to `backend/dist/`
- Never manually place files in `backend/dist/` — it is always generated by the build
- `backend/dist/` is gitignored

--- 

## Environment Variables
 
All environment variables must be prefixed with `VITE_` to be accessible in the frontend.
 
```
VITE_API_BASE_URL=http://localhost:8000
```
 
Never access `process.env` — use `import.meta.env` only.

--- 