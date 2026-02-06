## PRODILY — Frontend

Prodily is a productivity and culture management platform that leverages autonomous AI agents to drive employee engagement, performance, retention, and organizational alignment. This frontend implements a modular, AI‑enhanced experience that integrates with existing workplace tools, delivering real‑time productivity insights, morale analysis, performance gamification, and AI‑driven coaching across diverse enterprise environments and team structures.

### Tech stack

- **React (TypeScript, Vite)**: Application framework and tooling
- **React Router**: Client-side routing
- **TanStack Query**: API data fetching, caching, and server state
- **Tailwind CSS**: Utility‑first CSS styling
- **Open Sans**: Primary font
- **Zustand**: Client state management
- **shadcn/ui**: Component library and primitives
- **React Icons**: Icon library
- **Zod**: Schema validation and form validation
- **XState**: Statecharts for onboarding flows
- **Vercel**: Hosting and deployment
- **FE repo**: GitHub (link TBD)

### Onboarding screens

- **Team Lead**: wizzywizpad@gmail.com
- **Team Member**: Saviour Ise
- **HR**: Yoma

### Reusable components

- **Task card**
- **Daily Mood check‑in**
- **Weekly streak**
- **Progress bar**
- **Auth / Onboarding card**
- **Select role card**
- **Progress stepper**
- **Team card (onboarding)**
- **View team card**
- **View member page**
- **View team page**
- **Task review card**
- **Meeting card**
- **Mood card**
- **Tabs (settings screen)**
- **Tabs**
- **Mood emoji card**
- **Team analysis card**
- **Status card**
- **Flight risk card**
- **Wellness trend card**
- **Payroll card**
- **Mood Heatmap**
- **Timesheet weekly overview**

### General pages

- **Layout**
- **Authentication flow**
- **Profile screens**

### Folder structure

```text
public/
  assets/
    images/
    icons/
    fonts/
src/
  components/           # shadcn components
  pages/                # general pages
  layout/
    dashboard/
    settings/
  shared/
    pages/
    components/
    utils/
    typings/
  super-admin/
    pages/
    components/
    utils/
    typings/
  hr/
    pages/
    components/
    utils/
    typings/
  team-member/
    pages/
    components/
    utils/
    typings/
  team-leader/
    pages/
    components/
    utils/
    typings/
  config/               # state management and TanStack Query config
```

### Notes

- All React code should be written using functional components and hooks.
- XState is primarily scoped to onboarding; expand as needed for complex flows.
- Routing: Use React Router with layout shells in `src/layout/` (`dashboard`, `settings`), nested routes for role areas under their respective folders, and lazy‑loaded route modules for code‑splitting where appropriate.

### Typography

- **Primary font**: Open Sans
- **Include**: via Google Fonts link in `index.html` or self‑host under `public/assets/fonts`.
- **Tailwind**: set `theme.extend.fontFamily.sans` to include "Open Sans" with sensible system fallbacks.

### Links

- **Frontend Repository (GitHub)**: https://github.com/Prodd-AI/Frontend/
- **Figma Design**: https://www.figma.com/design/ixIxtSJqkHCEARAdqTBNal/ProdAI?node-id=0-1&p=f&t=pFo7uQBZtvYXW9o0-0

### Important Instructions

- **DO NOT ADD ERROR METHODS FOR API CALLS EXCEPT FOR CUSTOM REASONS. THESE HAS BEEN SETUP**
- **Files and folders**: use kebab-case (e.g., `team-member`, `view-team-card.page.tsx`).
- **Variables**: use snake_case (e.g., `current_user_id`, `team_member_count`).
- **Filename type segment**: include the file type in the name (e.g., `.page.tsx`, `.utils.ts`, `.d.ts`). Examples: `hr.page.tsx`, `getMessage.utils.ts`, `team-member.d.ts`.
- **Branching**: create a personal feature branch per task (e.g., `your-name`).
- **Pull Requests**: always open PRs to the `dev` branch; do not push directly to `main`.
