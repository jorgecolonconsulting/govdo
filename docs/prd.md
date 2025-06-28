# GovDo Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- **G1** Provide government‑staff users with an at‑a‑glance list of communication tasks that can be filtered by *Pending*, *Completed*, and *All*.
- **G2** Enable users to create, edit, complete, and delete tasks in ≤ 3 taps on mobile web.
- **G3** Maintain a tamper‑evident audit trail of every task change via MariaDB system‑versioned tables.
- **G4** Deliver an MVP within **1 business week**, leaving optional AI‑powered suggestions as a stretch goal.

### Background Context
GovDo is a **mobile‑first web application**.  The application demonstrates the team’s Laravel + React capability while solving a real need: tracking resident‑facing communication tasks (alerts, notices, outreach campaigns, etc.).  Government staff often juggle dozens of such items without a lightweight tool—GovDo fills that gap.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025‑06‑24 | 1.0 | Initial draft | PM |
| 2025‑06‑26 | 1.1 | Removed FR8, clarified NFR3, updated tech stack to Heroku + Laravel 11 | PO |

---

## Requirements

### Functional (FR)
- **FR1** The system **lists** all tasks with filter chips for *Pending*, *Completed*, *All*.
- **FR2** Users can **create** a new task (title, description, priority, due date).
- **FR3** Users can **edit** any field of a pending task.
- **FR4** Users can **mark a task complete** and the UI reflects status instantly.
- **FR5** Users can **delete** a task with a confirmation prompt.
- **FR6** The list sorts with **new or recently changed tasks at the top** (no scroll‑position preservation needed).
- **FR7** The API exposes **`GET /tasks/history`** returning a paginated audit trail of all task changes.

### Non‑Functional (NFR)
- **NFR1** Runs on **Heroku** Hobby dyno; boot ≤ 750 ms cold start.
- **NFR2** Uses **MariaDB 10.11 (JawsDB add‑on)** with system‑versioned tables; observer user has *no* SELECT privileges.
- **NFR3** Responsive mobile‑first design; must render comfortably on ≥ 360 px width and scale up to desktop (*in scope*).
- **NFR4** All endpoints respond < 300 ms median under 500 req/s (stress test target).
- **NFR5** HTTPS enforced; secure cookies, HSTS `max‑age=31536000; preload`.

---

## User Interface Design Goals
1. **Mobile Web First**  – Only uses single columns; sticky header with app title and filter chips. It uses well-known accepted UX patterns that are appropriate for mobile web.
2. **Zero‑Clutter Interaction**  – FAB‑style “+ New Task” button; Bottom Sheet for task filters.
3. **Government Branding**  – follows portal’s color tokens under the section `Color Guidelines`. And Averia Serif Libre Google Font for headings and Inter for everything else.
4. **Accessibility**  – WCAG 2.1 AA contrast; focus rings

## Color Use Guidelines 

### Main brand colors

#### Primary Color

#0087bd <span style="display:inline-block;width:10px; height:10px; background-color:#0087bd;"></span>

#### Secondary Color

#8071b7 <span style="display:inline-block;width:10px; height:10px; background-color:#8071b7;"></span>

### Palette

#### Blue Palette

#40a5ce <span style="display:inline-block;width:10px; height:10px; background-color:#40a5ce;"></span>

#0087bd <span style="display:inline-block;width:10px; height:10px; background-color:#0087bd;"></span>

#0073a0 <span style="display:inline-block;width:10px; height:10px; background-color:#0073a0;"></span>

#### Orange Palette

#f29e6a <span style="display:inline-block;width:10px; height:10px; background-color:#f29e6a;"></span>

#ee7e38 <span style="display:inline-block;width:10px; height:10px; background-color:#ee7e38;"></span>

#ca6b30 <span style="display:inline-block;width:10px; height:10px; background-color:#ca6b30;"></span>

#### Purple Palette

#a094c9 <span style="display:inline-block;width:10px; height:10px; background-color:#a094c9;"></span>

#8071b7 <span style="display:inline-block;width:10px; height:10px; background-color:#8071b7;"></span>

#6d609c <span style="display:inline-block;width:10px; height:10px; background-color:#6d609c;"></span>

#### Pink Palette

#e37b92 <span style="display:inline-block;width:10px; height:10px; background-color:#e37b92;"></span>

#d94f6d <span style="display:inline-block;width:10px; height:10px; background-color:#d94f6d;"></span>

#b8455d <span style="display:inline-block;width:10px; height:10px; background-color:#b8455d;"></span>

#### Neutral Colors

#1f1f29 <span style="display:inline-block;width:10px; height:10px; background-color:#1f1f29;"></span>

#f5f5f3 <span style="display:inline-block;width:10px; height:10px; background-color:#f5f5f3;"></span>

#faffff <span style="display:inline-block;width:10px; height:10px; background-color:#faffff;"></span>


### Color Instructions to follow closely

* Prefer (#0087bd <span style="display:inline-block;width:10px; height:10px; background-color:#0087bd;"></span>) for Headings
* Use (#1f1f29 <span style="display:inline-block;width:10px; height:10px; background-color:#1f1f29;"></span>) for body text if the background is light

---

## Technical Assumptions
- **Monorepo:** Turborepo
```
monorepo/
├── resources/
├── packages/
│   └── ui/
├── apps/
│   └── web/   # Laravel 11 + Inertia
└── composer.json
```
- **Backend:** Laravel 11, PHP 8.3, Breeze + Fortify for auth; no SSO.
- **Frontend:** Inertia.js with React 19, Tailwind v3, Heroicons.
- **Database:** MariaDB 10.11 (JawsDB) with system‑versioned `tasks` table.
- **Auth:** Session cookies (secure, httpOnly, SameSite=Lax).
- **Docker:** Local dev via `docker-compose` (PHP‑FPM, Apache, mariadb, mailpit).
- **CI/CD:** GitHub Actions → Heroku container registry; post‑deploy DB migrate & seed.

## Epics

| # | Epic Title | Goal |
|---|------------|------|
| 1 | **Foundation & MVP Todo CRUD** | Deliver full vertical slice: auth, task CRUD, filters, audit API, Heroku deploy |

### Epic 1 Details

#### Story 1.1 Project Scaffolding & CI
*Init Turborepo, create Laravel 11 app, add Tailwind & Inertia boilerplate with React & SSR, add shadcn, configure Heroku pipeline.*

#### Story 1.2 DB Schema & Versioning
*Create `tasks` table with system‑versioning & `modified_by` column; seed demo data.*

#### Story 1.3 Task List & Filters
*Blade/Inertia page listing tasks, filter chips, live sorting.*

#### Story 1.4 Task CRUD Modals
*Create/Edit modal, form validates title required, delete confirmation. UX must be implemented using shadcn componenets and actions should take "≤3 taps" from the start of the page where the action originates. Find a good UX solution to show an error when there's a network error such as a 500.*

#### Story 1.5 Audit Trail Endpoint & Page
*`GET /tasks/history` API + UI list with pagination; visible only to Admin role.*

#### Story 1.6 E2E & Snapshot Tests
*Pest snapshot tests for UI, Dusk flows for mobile viewport, load test script (Artillery).*  

---

## Product Owner Session Summary - 2025-06-28

### Epic 1 Assessment Complete
**Final Status**: PASS 91% - Ready for Development  
**User Stories**: Available in `/docs/epic-1-user-stories.md`  
**Checklist Results**: Available in `/docs/po-checklist-results.md`  
**Development Roadmap**: Available in `/docs/development-roadmap.md`

### Next Actions
- ✅ **Product Owner Assessment**: COMPLETED
- 🔄 **Development Ready**: Begin Stories 1.1 & 1.2 in parallel
- 📅 **Timeline**: 10-14 days for MVP completion
- 🎯 **Success Criteria**: All acceptance criteria validated and performance targets met

*Product Owner: Sarah | Session Complete*
