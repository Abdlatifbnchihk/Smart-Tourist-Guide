# 🤖 AGENT.md — AI Agent Operating Guide

This file gives any AI coding agent (Claude Code, Copilot Workspace, Cursor, etc.) the context needed to work productively and safely in the **Smart Tourist Guide Morocco** repository.

---

## Project Summary

Smart Tourist Guide Morocco is a full-stack tourism platform (Laravel 11 API + React/Vite SPA) covering hotel booking, transport/driver booking, attraction discovery, reviews, favorites, and AI-generated itineraries powered by the Anthropic Claude API.

## Where to Look First

| Need | Read |
|---|---|
| Database schema, table columns, relationships | `docs/database.md` |
| API endpoints and request/response shapes | `docs/api.md` |
| System/architecture diagrams | `docs/architecture.md` |
| Coding conventions | `docs/coding-standards.md` |
| Git branching/commit rules | `docs/git-workflow.md` |
| Deployment steps | `docs/deployment.md` |
| Folder layout | `docs/project-structure.md` |

**Always consult `docs/database.md` before writing any migration, model, or query** — it is the single source of truth for column names, types, and relationships.

---

## Ground Rules for Agents

1. **Never invent schema.** If a column or relationship isn't in `docs/database.md`, propose an addition to that doc first, don't silently add columns.
2. **Follow `docs/coding-standards.md`** for naming, folder placement, and patterns (thin controllers, Service classes, Form Requests, API Resources).
3. **Every new endpoint must be documented** in `docs/api.md` in the same PR.
4. **Every new migration needs a working `down()` method.**
5. **Write tests** for new business logic (Feature test for endpoints, Unit test for services).
6. **Commit using Conventional Commits** (see `docs/git-workflow.md`).
7. **Do not commit secrets.** `.env` files are gitignored; use `.env.example` as the template.
8. **Currency fields use `decimal`, never `float`.**
9. **Polymorphic relations** (`reviews`, `favorites`) use the existing morph map — don't create parallel one-off tables for new reviewable/favoritable types.

---

## Common Tasks — Quick Recipes

### Add a new API endpoint
1. Add route in `backend/routes/api.php` under `/api/v1`.
2. Create/extend a `FormRequest` in `app/Http/Requests`.
3. Add controller method (thin) → delegate to a `Service` class.
4. Wrap response in an `Http/Resources` class.
5. Document in `docs/api.md`.
6. Add a Feature test in `tests/Feature`.

### Add a new database table
1. Design the table per the format in `docs/database.md` (Purpose, Columns, Relationships, Business Rules, Laravel Relationships, Validation, Indexes, Example Record).
2. Add the section to `docs/database.md`.
3. Generate migration: `php artisan make:migration create_<table>_table`.
4. Generate model + relationships: `php artisan make:model <Model>`.
5. Update the Mermaid ERD in `docs/database.md`.

### Add a new frontend page
1. Create `frontend/src/pages/<PageName>.tsx`.
2. Add route in the router config.
3. Create a `services/<domain>Service.ts` API wrapper if one doesn't exist.
4. Create a `hooks/use<Thing>.ts` React Query hook.
5. Compose UI from `components/` — keep pages thin, push reusable UI down.

---

## Testing Commands

```bash
# Backend
cd backend && php artisan test

# Frontend
cd frontend && npm run test
```

## Local Dev Bootstrap

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Non-Negotiables (Safety Rails for Agents)

- Do not disable authentication middleware to "make tests pass."
- Do not remove validation rules to work around a failing request.
- Do not log or print user passwords, tokens, or payment details.
- Do not modify `docs/database.md` retroactively to match a bad migration — fix the migration instead.
- When in doubt about a business rule, check the **Business Rules** subsection of the relevant table in `docs/database.md` before assuming behavior.