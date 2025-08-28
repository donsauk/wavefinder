# Repository Guidelines

## Project Structure & Module Organization
- Backend: `app/` (models, controllers, middleware), config in `config/`, routes in `routes/` (`web.php`, `channels.php`, `console.php`).
- Frontend: `resources/js/` (Inertia + React). Use `Pages/` for route views, `Components/` for reusable UI, optional `Layouts/` for page wrappers; styles in `resources/css/`.
- Views: `resources/views/app.blade.php` hosts the Inertia app shell.
- Database: migrations in `database/migrations/`, factories/seeders in `database/`.
- Tooling/entry: `vite.config.js`, `public/index.php`, `phpunit.xml`.

## Build, Test, and Development Commands
- Install deps: `composer install && npm ci`
- Env + key: `cp .env.example .env && php artisan key:generate`
- Migrate data: `php artisan migrate` (then optional: `php artisan radio:download`)
- Dev (app+queue+vite+ws): `composer dev`
- Frontend dev: `npm run dev` (Vite HMR)
- Build assets: `npm run build`
- Tests: `composer test` or `php artisan test`

## Coding Style & Naming Conventions
- PHP: PSR-12 via Laravel Pint. Run: `vendor/bin/pint`.
- Classes: StudlyCase (`App\\…`), methods/vars camelCase. Migrations are timestamped snake_case.
- React: 2-space indent; components PascalCase (e.g., `StationCard.jsx`); pages live in `resources/js/Pages` and export a default.
- Routing: Use Ziggy `route('name')` in React; define in `routes/web.php`.

## Inertia & UI Patterns
- Data flow: Controllers render with `Inertia::render()`; pass props instead of creating separate APIs.
- Forms: Use `useForm()`; redirect with flash messages (see `FlashMessage.jsx`).
- UX: Prefer `preserveState`/`preserveScroll` for updates.
- Styling: Use TailwindCSS with daisyUI components first (e.g., `btn btn-primary`, `card`, `alert`). Avoid custom CSS when daisyUI covers it. Keep shared pieces in `Components/` and wrappers in `Layouts/`.

## Testing Guidelines
- Framework: PHPUnit via Laravel runner.
- Location: `tests/Feature` and `tests/Unit`; files end with `Test.php`.
- Conventions: `test_*` methods or `@test`; use DB traits (e.g., `RefreshDatabase`).
- Run: `composer test`. Enable coverage via Xdebug if needed.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise subject (≤72 chars), include scope when useful (e.g., `browse:`), reference issues (`#123`).
- PRs: include description, linked issues, test steps, screenshots for UI, and call out migrations/breaking changes.

## Security & Configuration Tips
- Keep secrets in `.env` (SQLite default provided). Run migrations before local testing of sessions/queues/cache.
- Realtime/WebSockets: `php artisan reverb:start`; configure broadcasting in `.env` as needed.
