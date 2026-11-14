# Madrasa Hazri — Complete Project Documents (All 6 in One File)

## Fehrist (Contents)
1. PRD — Product Requirements
2. TRD — Technical Requirements
3. App Flow
4. UI/UX Design Brief
5. Backend Schema
6. Implementation Plan


---

# 01 — Product Requirements Document (PRD)

**Project name:** Madrasa Hazri (Urdu display name: مدرسہ حاضری)
**Short name (PWA):** Hazri
**Document set:** 01_PRD, 02_TRD, 03_App_Flow, 04_UI_UX_Design_Brief, 05_Backend_Schema, 06_Implementation_Plan (all must stay consistent).

---

## 1. Purpose & Goals

A mobile-first Progressive Web App (PWA) for a madrasa teacher (ustaad) to:

1. Mark daily **attendance (hazri)** of students, organised by class.
2. Record each student's daily **Sabaq, Sabqi and Manzil** (Hifz lessons) in detail.
3. Open any student and see their full **date-wise history** (attendance + sabaq + sabqi + manzil).
4. Sign in with Google on any device and see the same data everywhere (cloud sync via Supabase).

The app must feel like a native mobile app when opened on a phone and must be installable from the browser ("Install app" / "Add to Home screen").

## 2. Target Users & Roles

- **Single role only: Ustaad (teacher).** There is **NO admin panel, NO admin role, NO parent role, NO multi-user management.**
- Every person who signs in with Google is an independent account. Each account sees and edits **only its own data** (its own classes, students, attendance, lesson records).
- No data sharing between accounts in v1.

## 3. Language & Locale

- App UI language: **Urdu only, right-to-left (RTL)**. `<html lang="ur" dir="rtl">`.
- Dates are stored as ISO dates (`YYYY-MM-DD`) and displayed in Gregorian format with Latin digits (e.g. 14-11-2026), with Urdu month/day names where space allows.
- Student names are free text (Urdu or any script).

## 4. Features

### 4.1 Authentication
- Only one sign-in method: **"Google se login" button** (Supabase Auth, Google OAuth). No email/password form, no sign-up form.
- First Google sign-in automatically creates the account and profile.
- Session persists on the device; user can log out from Settings.
- Logging in with the same Google account on any device shows the same data.

### 4.2 Classes
- User can create, rename, reorder and delete classes.
- On first login, these default classes are created automatically (user may edit/delete them): **درجہ حفظ**, **کلاس 1**, **کلاس 2**, **کلاس 3**.
- A class with students cannot be deleted until students are moved or removed (show clear Urdu message).

### 4.3 Students
- Add / edit / archive (deactivate) / delete students.
- Fields: name (required), class (required), father name (optional), roll number (optional), phone (optional).
- Students are added **once**; they then appear automatically in Attendance and Lessons screens (no repeated adding).
- Search by name and filter by class.
- Archived students are hidden from daily screens but their history is kept and viewable.
- Deleting a student permanently deletes their attendance and lesson history (requires explicit confirmation).

### 4.4 Attendance (Hazri) section
- Pick a date (default today) and a class (or "all classes").
- List shows all active students of that class with three status choices: **حاضر (present)**, **غائب (absent)**, **رخصت (leave)**.
- "Mark all present" shortcut, then user changes exceptions.
- Saving is per-student upsert (one record per student per date). Re-opening a date shows previously saved statuses and allows editing.
- Summary line: count of present / absent / leave for the selected date and class.

### 4.5 Lessons section (Sabaq / Sabqi / Manzil)
- Pick date and class; list of students is shown. Tap a student to open the lesson entry form for that date.
- Entry form has **three separate sections, in this order: Sabaq → Sabqi → Manzil.**
- Each of the three sections records:
  - **Suna / Nahi suna** (heard: yes/no) — سنایا / نہیں سنایا
  - **Kitni lines** (lines count, integer ≥ 0)
  - **Ghaltiyan** (mistakes count, integer ≥ 0)
  - **Grade:** اچھا (acha) / ٹھیک (theek) / کمزور (kamzor)
  - Optional free-text **note** (e.g. para/surah/ayat reference or ustaad remark)
- Each section is saved independently (one record per student, per date, per lesson type).
- If "Nahi suna" is selected, lines/mistakes are set to 0 and grade is empty.
- Student rows in the list show small status chips (Sabaq ✓/✗, Sabqi ✓/✗, Manzil ✓/✗) for the chosen date so the ustaad can see who is pending.

### 4.6 Student Detail (history)
- Opened by tapping a student name in Students list (or from Lessons/Attendance lists).
- Header: student name, class, optional details, quick stats (attendance %, days present/absent/leave, average lines for Sabaq in selected range).
- Below: **date-wise history list**, newest first. Each date card shows:
  - Attendance status for that date (Present / Absent / Leave)
  - Sabaq: suna/nahi suna, lines, mistakes, grade, note
  - Sabqi: same fields
  - Manzil: same fields
- Date range filter (This week / This month / All / Custom).
- Tapping a date card allows editing that day's attendance and lesson records.

### 4.7 Settings
- Shows Google profile name, email, avatar.
- "Install app" button (shown when the browser provides the install prompt) plus short instructions for manual install (Chrome ⋮ menu → Install app / Add to Home screen).
- Logout button.

### 4.8 PWA / Installability
- Installable on Android (Chrome) and iOS (Safari Add to Home Screen) with app icon, name, splash colour, standalone display mode.
- Opens full-screen without browser bar, behaves like a mobile app.

## 5. Business Rules

1. One attendance record per student per date.
2. One lesson record per student per date per lesson type (sabaq / sabqi / manzil).
3. A student belongs to exactly one class at a time. Changing class does not alter past records.
4. All data is private to the signed-in account.
5. Future dates are allowed for selection but show a subtle warning; attendance for future dates should be blocked (see App Flow).
6. Grade values are fixed: acha, theek, kamzor.

## 6. Functional Requirements (summary)
- Google OAuth login/logout; protected routes.
- CRUD: classes, students.
- Upsert: attendance, lesson_records.
- Read: student history with date range filter.
- Data syncs across devices through Supabase (online required).

## 7. Non-Functional Requirements
- Mobile-first, responsive (mobile → tablet → desktop), one-hand friendly, large tap targets (min 44px).
- Fast: initial load under ~3s on 4G; lists virtualise or paginate if > 200 students.
- Secure: Row Level Security on every table; no secrets in frontend.
- Accessible: sufficient contrast, labels for all controls, RTL-correct focus order.
- Reliable: clear loading, empty, success and error states in Urdu.

## 8. Scope Exclusions (v1)
- No admin panel, no parent/student login, no multi-teacher sharing.
- No offline data entry/sync queue (app shell loads offline, but data actions need internet; show an Urdu "internet nahi hai" message).
- No AI features, no AI Gateway, no image upload (so no storage bucket). Only app icons and the Google avatar.
- No fee management, exams, SMS/WhatsApp notifications, or report PDF export (can be future work).
- No English/Roman Urdu UI.


---

# 02 — Technical Requirements Document (TRD)

Project: **Madrasa Hazri** (see 01_PRD.md). Table/column names here must match **05_Backend_Schema.md** exactly.

---

## 1. Tech Stack
- **Frontend:** React 18 + TypeScript, built with **Vite**
- **Routing:** react-router-dom v6 (BrowserRouter, SPA)
- **Styling:** Tailwind CSS (build-time install, **not** CDN), using logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) for RTL
- **Data fetching/cache:** @tanstack/react-query
- **Backend/DB/Auth:** Supabase (PostgreSQL, Auth with Google OAuth) via `@supabase/supabase-js`
- **PWA:** `vite-plugin-pwa` (manifest + service worker, auto-update)
- **Icons:** lucide-react (UI icons) + PNG app icons in `public/icons/`
- **Hosting:** Cloudflare (Workers & Pages from GitHub). No Vercel.
- **Package manager:** npm (`package-lock.json` only)

## 2. Architecture
Single-page app. All data access goes from the browser to Supabase using the **anon/publishable key**; security is enforced by **RLS** (owner-only on every table). No custom backend server, no Cloudflare Functions needed in v1 (no AI, no secrets).

```
Browser (PWA) ──supabase-js──> Supabase Auth (Google OAuth)
                         └──> Supabase Postgres (RLS: user_id = auth.uid())
```

## 3. Frontend Folder Structure
```
/
├─ index.html                (lang="ur" dir="rtl", Urdu fonts, theme-color meta)
├─ package.json  package-lock.json  .npmrc  vite.config.ts  tsconfig.json
├─ tailwind.config.js  postcss.config.js  .env.example  .gitignore
├─ public/
│  ├─ _redirects             (/*  /index.html  200)
│  └─ icons/                 (icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png, favicon.png)
└─ src/
   ├─ main.tsx  App.tsx  index.css
   ├─ lib/        supabase.ts  date.ts  grades.ts
   ├─ i18n/       ur.ts                (ALL UI strings, Urdu)
   ├─ types/      db.ts                (TS types matching 05_Backend_Schema)
   ├─ contexts/   AuthContext.tsx
   ├─ services/   profileService.ts  classesService.ts  studentsService.ts
   │              attendanceService.ts  lessonRecordsService.ts
   ├─ hooks/      useClasses.ts  useStudents.ts  useAttendance.ts  useLessonRecords.ts  useInstallPrompt.ts
   ├─ components/ AppShell.tsx  BottomNav.tsx  ProtectedRoute.tsx  ClassFilter.tsx  DateBar.tsx
   │              StudentRow.tsx  AttendanceToggle.tsx  LessonSection.tsx  GradeSelector.tsx
   │              StudentFormSheet.tsx  ClassFormSheet.tsx  ConfirmDialog.tsx
   │              EmptyState.tsx  LoadingState.tsx  ErrorState.tsx  Toast.tsx  InstallBanner.tsx
   └─ pages/      LoginPage.tsx  AttendancePage.tsx  LessonsPage.tsx  LessonEntryPage.tsx
                  StudentsPage.tsx  StudentDetailPage.tsx  ClassesPage.tsx  SettingsPage.tsx  NotFoundPage.tsx
```

## 4. Routes (must match 03_App_Flow.md)
| Path | Page | Auth |
|------|------|------|
| `/login` | LoginPage | public (redirect to `/attendance` if signed in) |
| `/` | redirect → `/attendance` | protected |
| `/attendance` | AttendancePage | protected |
| `/lessons` | LessonsPage | protected |
| `/lessons/:studentId` | LessonEntryPage (query `?date=YYYY-MM-DD`) | protected |
| `/students` | StudentsPage | protected |
| `/students/:studentId` | StudentDetailPage | protected |
| `/classes` | ClassesPage | protected |
| `/settings` | SettingsPage | protected |
| `*` | NotFoundPage | public |

Bottom navigation (mobile): **حاضری** (`/attendance`), **سبق** (`/lessons`), **طلبہ** (`/students`), **ترتیبات** (`/settings`). Classes page is reached from Students page and Settings.

## 5. Supabase Integration
- `src/lib/supabase.ts` creates a single client with `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`; options `{ auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }`.
- **Never hardcode keys.** If env vars are missing, show a clear dev-time error screen.
- All DB calls live in `src/services/*` only; pages/components call services through hooks.
- Every insert sets `user_id` from the signed-in user (also defaulted in DB as `auth.uid()`).
- Use `upsert` with `onConflict` for attendance (`student_id,attendance_date`) and lesson records (`student_id,record_date,lesson_type`).
- Service/data layer uses the **exact** table and column names from 05_Backend_Schema.md.

## 6. Authentication Approach
- Google OAuth only: `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/attendance' } })`.
- `AuthContext` exposes `{ session, user, loading, signInWithGoogle, signOut }` via `onAuthStateChange`.
- `ProtectedRoute` redirects unauthenticated users to `/login`.
- A DB trigger creates the `profiles` row and default classes on first sign-in (see schema).
- **No admin concept anywhere in code.**

### Required external configuration (done later via ChatGPT/Supabase + user, not in AI Studio)
1. Google Cloud Console → OAuth client (Web). Authorised redirect URI = `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`.
2. Supabase → Authentication → Providers → Google enabled with that Client ID/Secret.
3. Supabase → Authentication → URL Configuration: **Site URL** = Cloudflare production URL; **Redirect URLs** include the Cloudflare URL(s) and `http://localhost:5173`.

## 7. Storage Strategy
No Supabase Storage buckets in v1 (no uploads). Avatar is the Google profile picture URL stored in `profiles.avatar_url`.

## 8. PWA Requirements
- `vite-plugin-pwa` with `registerType: 'autoUpdate'`.
- Manifest: `name: "مدرسہ حاضری"`, `short_name: "حاضری"`, `lang: "ur"`, `dir: "rtl"`, `display: "standalone"`, `start_url: "/"`, `scope: "/"`, `orientation: "portrait"`, `background_color` and `theme_color` from design brief, icons 192, 512, 512 maskable.
- Service worker precaches the app shell (JS/CSS/HTML/icons/fonts). **Supabase API requests must NOT be cached** (use NetworkOnly for `*.supabase.co`) so data is always fresh and per-user.
- `navigateFallback: '/index.html'` for SPA offline shell.
- `useInstallPrompt` hook captures `beforeinstallprompt` and shows an "Install app" button in Settings and an optional dismissible banner; on iOS show short manual instructions.
- `index.html` includes `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `theme-color`, `apple-mobile-web-app-capable`, `apple-touch-icon`.
- Respect safe-area insets for bottom nav.

## 9. Security Requirements
- RLS enabled on all tables; policies restrict to `user_id = auth.uid()` (see schema).
- Only the anon/publishable key in frontend. **Service-role key must never appear in code or repo.**
- Validate inputs client-side (required name, non-negative integers, allowed grade values) and by DB CHECK constraints.
- No `dangerouslySetInnerHTML`. `.env` ignored by git; commit only `.env.example`.

## 10. Cloudflare Deployment Requirements
- Build command: `npm run build` · Output directory: `dist`
- `public/_redirects` containing: `/*    /index.html   200` (SPA fallback so refresh on `/students` doesn't 404)
- Root `.npmrc` containing only: `legacy-peer-deps=true`
- Only `package-lock.json` (delete `bun.lock` / `bun.lockb` if present)
- `package.json` scripts: `dev`, `build` (`tsc -b && vite build` or `vite build`), `preview`
- Node version: set `engines.node >= 20` and add `.nvmrc` with `20`.
- Env vars must be set in Cloudflare **before** build (Vite inlines them at build time).

## 11. Environment Variables (complete list)
| Name | Where | Value source |
|------|-------|--------------|
| `VITE_SUPABASE_URL` | Cloudflare build env, local `.env` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Cloudflare build env, local `.env` | Supabase anon / publishable key |

No other variables. No AI Gateway variables (no AI features).

## 12. AI Gateway
Not applicable (no AI features in v1).


---

# 03 — App Flow (User Experience)

Single role: **Ustaad**. There is **no admin flow**. Routes and names match 02_TRD.md; data names match 05_Backend_Schema.md.

---

## 1. Auth Flow
1. User opens the site/app → if no session → `/login`.
2. `/login` shows app logo, name, one button: **"گوگل سے لاگ اِن کریں"** (Sign in with Google). Nothing else (no email/password).
3. Tap → Google account chooser → return to app → session created → redirect to `/attendance`.
4. First-ever login: trigger creates profile + default classes (درجہ حفظ, کلاس 1, کلاس 2, کلاس 3). If the user has zero students, Attendance shows an empty state with button "پہلا طالب علم شامل کریں" → `/students`.
5. Returning on any device with same Google account → same data appears.
6. Logout: Settings → "لاگ آؤٹ" → confirm → `/login`.
7. Auth errors (cancelled/failed): stay on `/login` with Urdu error toast "لاگ اِن نہیں ہو سکا، دوبارہ کوشش کریں".

## 2. Navigation
Mobile bottom bar (always visible on protected pages): **حاضری** · **سبق** · **طلبہ** · **ترتیبات**. Desktop/tablet: same items as a side rail (right side for RTL). Back arrow on detail pages.

## 3. Pages & Flows

### 3.1 `/attendance` — حاضری
- Top: DateBar (prev day / date picker / next day / "آج" today) and ClassFilter (all / each class).
- List of active students for the chosen class. Each row: name + 3-way toggle **حاضر / غائب / رخصت** (colour coded; unmarked = neutral).
- Sticky top summary: حاضر X · غائب Y · رخصت Z · باقی N.
- Button "سب حاضر" marks all unmarked students present.
- Each toggle tap saves immediately (upsert into `attendance`); show subtle saving → saved indicator; on error revert and toast.
- Tap student name → `/students/:studentId`.
- Future date: toggles disabled with message "آنے والی تاریخ کی حاضری نہیں لگ سکتی".
- States: loading skeleton; empty (no students / no students in class); error with retry.

### 3.2 `/lessons` — سبق
- DateBar + ClassFilter (same as attendance).
- List of students; each row shows name and three chips for that date: **سبق · سبقی · منزل**, each ✓ (سنایا), ✗ (نہیں سنایا) or – (not recorded). Optional small badge if marked absent that day.
- Tap a student → `/lessons/:studentId?date=YYYY-MM-DD`.

### 3.3 `/lessons/:studentId` — Lesson entry
- Header: student name, class, date (changeable), back button.
- Three sections stacked/tabbed in this order: **سبق → سبقی → منزل** (lesson types `sabaq`, `sabqi`, `manzil`).
- Each section fields: toggle **سنایا / نہیں سنایا** (`heard`); number stepper **لائنیں** (`lines_count`); number stepper **غلطیاں** (`mistakes_count`); **گریڈ** buttons اچھا / ٹھیک / کمزور (`grade`); optional **نوٹ** (`note`).
- If نہیں سنایا → lines/mistakes forced 0, grade cleared and disabled.
- Per-section **محفوظ کریں** button (upsert into `lesson_records`); success toast "محفوظ ہو گیا". Existing records are pre-filled for editing.
- "اگلا طالب علم" button jumps to next student in the same class list for fast entry.

### 3.4 `/students` — طلبہ
- Search box, ClassFilter, list of students (name, class, small attendance % optional).
- "+" button → StudentFormSheet (name*, class*, father name, roll no, phone) → save → appears everywhere automatically.
- Row menu: edit, archive/unarchive, delete (ConfirmDialog warns that history will be deleted too).
- Toggle "آرکائیو شدہ دکھائیں" to see archived students.
- Link to `/classes` ("کلاسز کا انتظام").
- Tap row → `/students/:studentId`.

### 3.5 `/students/:studentId` — Student detail
- Header: name, class, extra info, edit button.
- Stats cards (for selected range): attendance %, present/absent/leave counts, days Sabaq heard, average lines.
- Range chips: ہفتہ / مہینہ / سب / custom range.
- **History list (newest first)**: one card per date having any record. Card shows:
  - Date (and weekday)
  - Hazri status badge
  - Sabaq block: سنایا/نہیں سنایا, لائنیں, غلطیاں, گریڈ, نوٹ
  - Sabqi block (same)
  - Manzil block (same)
- Tap a card → edit sheet with the same attendance toggle and the three lesson sections for that date.
- Empty: "ابھی کوئی ریکارڈ نہیں".

### 3.6 `/classes` — کلاسز
- List with drag/arrow reorder; add class; rename; delete.
- Delete blocked if class has students: message "اس کلاس میں طلبہ موجود ہیں، پہلے انہیں دوسری کلاس میں منتقل کریں".

### 3.7 `/settings` — ترتیبات
- Profile card (Google name, email, avatar).
- "ایپ انسٹال کریں" (shows when install prompt available; otherwise short manual instructions for Chrome ⋮ → Install app, iOS Share → Add to Home Screen).
- Link to کلاسز.
- لاگ آؤٹ.

## 4. Global States
- **Loading:** skeleton rows / spinner with Urdu text "لوڈ ہو رہا ہے…".
- **Empty:** friendly illustration/icon + Urdu text + primary action.
- **Error:** Urdu message + "دوبارہ کوشش کریں".
- **Offline:** banner "انٹرنیٹ نہیں ہے"; data actions disabled; app shell still opens.
- **Success:** short toast.
- **Session expired:** redirect to `/login`.

## 5. Permissions
Every authenticated user can only read/write their own rows (enforced by RLS). No role-based screens exist.

## 6. Key Forms & Validation
- Student: name required (1–100 chars), class required.
- Class: name required, unique per user.
- Lesson: lines & mistakes integers ≥ 0 (max 999); grade only acha/theek/kamzor.
- Attendance: status only present/absent/leave.


---

# 04 — UI/UX Design Brief

Project: **Madrasa Hazri**. Urdu-only, RTL, mobile-first PWA. Page names/routes match 03_App_Flow.md.

---

## 1. Design Style
Calm, clean, respectful and modern; Islamic-educational feel without clutter. Soft rounded cards, generous spacing, subtle geometric (Islamic pattern) accent used sparingly (e.g. login header only). Should feel like a native mobile app, not a website.

## 2. Colour Palette (define as CSS variables / Tailwind theme)
| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#0F766E` (deep teal-green) | main buttons, active nav, headers |
| `primary-dark` | `#115E59` | pressed states |
| `primary-soft` | `#CCFBF1` | selected backgrounds |
| `accent` | `#B45309` (warm gold-brown) | highlights, small badges |
| `bg` | `#F6F8F7` | app background |
| `surface` | `#FFFFFF` | cards |
| `text` | `#0F172A` | main text |
| `text-muted` | `#64748B` | secondary text |
| `present` | `#16A34A` | حاضر / suna / acha |
| `absent` | `#DC2626` | غائب / nahi suna / kamzor |
| `leave` | `#D97706` | رخصت / theek |
| `border` | `#E2E8F0` | dividers |
PWA `theme_color` = `#0F766E`, `background_color` = `#F6F8F7`.
Colour is never the only indicator: always pair with text label/icon.

## 3. Typography
- UI/body: **Noto Naskh Arabic** (clear for small sizes; Google Fonts, with fallback `serif`).
- Headings / app name / big numbers: **Noto Nastaliq Urdu** (use sparingly, increase `line-height` to ~2 to avoid clipping).
- Sizes: body 16px minimum; list names 18px; headings 20–24px; stat numbers 24px.
- Digits: Latin digits (0–9).
- Every font has a real fallback stack (`'Noto Naskh Arabic', 'Segoe UI', Tahoma, serif`).

## 4. Layout
- `<html dir="rtl" lang="ur">`; use Tailwind logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`) and flex/grid that mirror correctly.
- Mobile: single column, top app bar (title + contextual action), scrollable content, **fixed bottom navigation** with 4 items (حاضری, سبق, طلبہ, ترتیبات), respecting `env(safe-area-inset-bottom)`.
- Tablet/desktop: content centred max-width ~720px (lists) or side rail on the right with content to its left; never stretch lists edge to edge on wide screens.
- Floating action button (bottom, above nav) for "add student" on Students page.

## 5. Components
- **AppShell / BottomNav / top bar**
- **DateBar:** prev/next arrows (mirrored for RTL), tappable date, "آج" chip.
- **ClassFilter:** horizontal scrollable chips (all + each class).
- **StudentRow:** card with name, small class label, trailing control (attendance toggle or lesson chips).
- **AttendanceToggle:** segmented 3-button control (حاضر / غائب / رخصت), min height 44px, selected state filled with status colour.
- **LessonSection:** collapsible/tabbed card titled سبق / سبقی / منزل; contains heard switch, two number steppers (− / + large buttons), GradeSelector, note textarea, save button.
- **GradeSelector:** three pill buttons اچھا (green) / ٹھیک (amber) / کمزور (red).
- **Stat cards:** 2×2 grid on mobile.
- **History card:** date header + attendance badge + three compact blocks (سبق, سبقی, منزل) each with ✓/✗, lines, mistakes, grade chip.
- **Sheets/Modals:** bottom sheet on mobile (student form, class form, edit day), centred dialog on desktop; **ConfirmDialog** for destructive actions (red button).
- **Toast** (top, auto-dismiss 2.5s), **Skeleton**, **EmptyState**, **ErrorState**, **InstallBanner**.

## 6. Responsive Behaviour
Design for 360×800 first; test 360, 390, 768, 1024, 1440. Touch targets ≥ 44×44px. No horizontal page scroll (only chip rows scroll). Numeric inputs use `inputmode="numeric"`.

## 7. Animations
Subtle only: 150–200ms transitions on toggles, sheet slide-up, toast fade, skeleton shimmer. Respect `prefers-reduced-motion`.

## 8. Accessibility
- Contrast ≥ WCAG AA.
- Visible focus rings; all icon buttons have `aria-label` (Urdu).
- Segmented controls use `role="radiogroup"` / `aria-checked`.
- Correct RTL reading and focus order; arrows/chevrons mirrored.
- Form errors announced inline in Urdu.

## 9. Login Page
Centred: app icon, name "مدرسہ حاضری", one-line tagline "حاضری اور سبق کا مکمل ریکارڈ", one large white button with Google logo and text "گوگل سے لاگ اِن کریں". Light Islamic geometric pattern as faint background header.

## 10. Icons & Imagery
- No photography. UI icons from lucide-react (mirror directional icons in RTL).
- PWA icons: simple emblem (open book / Quran stand silhouette on teal `#0F766E`), sizes 192, 512, 512 maskable (safe zone ~80%), 180 apple-touch, 32/48 favicon. Generate as PNG files in `public/icons/` (AI Studio may generate simple SVG-to-PNG placeholders; final artwork can be replaced later via the images workflow).
- Google "G" logo for login button must be an inline SVG (no remote image).


---

# 05 — Backend Schema (Supabase / PostgreSQL)

**Planning document only.** AI Studio does not create the database; ChatGPT + Supabase plugin will create it later from this file and the actual code. Table/column names here are the source of truth for the frontend `src/types/db.ts` and `src/services/*`.

No admin role. Single ownership model: every row has `user_id` = the signed-in teacher (`auth.uid()`).

---

## 1. Auth
- Supabase Auth, **Google provider only**. Email/password sign-ups disabled.
- Table `auth.users` is managed by Supabase.

## 2. Tables

### 2.1 `profiles`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | FK → `auth.users(id)` ON DELETE CASCADE |
| `full_name` | text | from Google metadata |
| `email` | text | |
| `avatar_url` | text | Google picture URL |
| `created_at` | timestamptz | default `now()` |

### 2.2 `classes`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | default `gen_random_uuid()` |
| `user_id` | uuid NOT NULL | FK → `auth.users(id)` ON DELETE CASCADE, default `auth.uid()` |
| `name` | text NOT NULL | |
| `sort_order` | integer NOT NULL | default 0 |
| `created_at` | timestamptz | default `now()` |
UNIQUE (`user_id`, `name`)

### 2.3 `students`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | default `gen_random_uuid()` |
| `user_id` | uuid NOT NULL | FK → `auth.users(id)` ON DELETE CASCADE, default `auth.uid()` |
| `class_id` | uuid NOT NULL | FK → `classes(id)` **ON DELETE RESTRICT** |
| `name` | text NOT NULL | CHECK `char_length(name) BETWEEN 1 AND 100` |
| `father_name` | text | nullable |
| `roll_no` | text | nullable |
| `phone` | text | nullable |
| `is_active` | boolean NOT NULL | default `true` (false = archived) |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | default `now()` (trigger-updated) |

### 2.4 `attendance`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | default `gen_random_uuid()` |
| `user_id` | uuid NOT NULL | FK → `auth.users(id)` ON DELETE CASCADE, default `auth.uid()` |
| `student_id` | uuid NOT NULL | FK → `students(id)` ON DELETE CASCADE |
| `attendance_date` | date NOT NULL | |
| `status` | text NOT NULL | CHECK IN (`'present'`,`'absent'`,`'leave'`) |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | default `now()` |
UNIQUE (`student_id`, `attendance_date`)

### 2.5 `lesson_records`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | default `gen_random_uuid()` |
| `user_id` | uuid NOT NULL | FK → `auth.users(id)` ON DELETE CASCADE, default `auth.uid()` |
| `student_id` | uuid NOT NULL | FK → `students(id)` ON DELETE CASCADE |
| `record_date` | date NOT NULL | |
| `lesson_type` | text NOT NULL | CHECK IN (`'sabaq'`,`'sabqi'`,`'manzil'`) |
| `heard` | boolean NOT NULL | default `false` (سنایا / نہیں سنایا) |
| `lines_count` | integer NOT NULL | default 0, CHECK `>= 0 AND <= 999` |
| `mistakes_count` | integer NOT NULL | default 0, CHECK `>= 0 AND <= 999` |
| `grade` | text | nullable, CHECK IN (`'acha'`,`'theek'`,`'kamzor'`) |
| `note` | text | nullable |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | default `now()` |
UNIQUE (`student_id`, `record_date`, `lesson_type`)
Extra CHECK: if `heard = false` then `lines_count = 0`, `mistakes_count = 0` and `grade IS NULL`.

## 3. Relationships
`auth.users 1—N classes`, `auth.users 1—N students`, `classes 1—N students`, `students 1—N attendance`, `students 1—N lesson_records`, `auth.users 1—1 profiles`.

## 4. Indexes
- `students (user_id, class_id)`; `students (user_id, is_active)`
- `attendance (user_id, attendance_date)`; (unique index on `student_id, attendance_date` already)
- `lesson_records (user_id, record_date)`; (unique index on `student_id, record_date, lesson_type` already)
- `classes (user_id, sort_order)`

## 5. Row Level Security (RLS)
Enable RLS on **all five tables**. No policies for `anon` role (unauthenticated users get nothing).

- `profiles`: `SELECT`/`UPDATE` where `id = auth.uid()`. (Insert only through trigger.)
- `classes`: `SELECT`/`INSERT`/`UPDATE`/`DELETE` for `authenticated` with `user_id = auth.uid()` (and `WITH CHECK user_id = auth.uid()`).
- `students`: same owner policy; additionally on INSERT/UPDATE `WITH CHECK` that `class_id` belongs to a class with `user_id = auth.uid()`.
- `attendance`: same owner policy; `WITH CHECK` that `student_id` belongs to a student with `user_id = auth.uid()`.
- `lesson_records`: same owner policy; `WITH CHECK` that `student_id` belongs to a student with `user_id = auth.uid()`.

Grant table privileges only to `authenticated` (not `anon`). **No service-role key in frontend.**

## 6. Functions & Triggers
1. **`handle_new_user()`** (SECURITY DEFINER, `set search_path = public`) — trigger `AFTER INSERT ON auth.users`:
   - inserts into `profiles` (`id`, `full_name` from `raw_user_meta_data->>'full_name'` or `name`, `email`, `avatar_url` from `raw_user_meta_data->>'avatar_url'` or `picture`);
   - inserts default classes for that user: `درجہ حفظ` (sort 1), `کلاس 1` (2), `کلاس 2` (3), `کلاس 3` (4).
2. **`set_updated_at()`** — `BEFORE UPDATE` trigger on `students`, `attendance`, `lesson_records` to set `updated_at = now()`.

## 7. Storage
No buckets in v1.

## 8. Required Backend Operations (used by services)
- classes: list (ordered), create, update (name/sort_order), delete.
- students: list (filters: class, is_active, name search), get by id, create, update, set `is_active`, delete.
- attendance: list by `attendance_date` (+ optional class via students join), upsert on (`student_id`,`attendance_date`), list by student & date range.
- lesson_records: list by `record_date` (all students), get by student+date (3 rows), upsert on (`student_id`,`record_date`,`lesson_type`), list by student & date range.
- profile: get current profile.

## 9. Auth Provider Settings (to be done in Supabase dashboard / by ChatGPT report)
Google provider enabled; email provider sign-ups disabled; Site URL = Cloudflare production URL; Redirect URLs include Cloudflare URL(s) and `http://localhost:5173`.


---

# 06 — Implementation Plan (internal build order for Google AI Studio)

This is an **internal execution plan** for AI Studio. Build the **entire app in one go** by following 01–05 exactly. Do not skip anything, do not leave placeholders, do not ask the user questions.

Names of tables, columns, routes, env vars and folders must match 02_TRD.md and 05_Backend_Schema.md **exactly**.

---

## 0. Non-negotiable rules
1. React 18 + TypeScript + Vite + Tailwind (build-time) + react-router-dom v6 + @tanstack/react-query + @supabase/supabase-js + vite-plugin-pwa + lucide-react.
2. **Urdu only, RTL** everywhere. All UI strings live in `src/i18n/ur.ts`.
3. **No admin panel, no roles, no email/password.** Only "Sign in with Google" via Supabase Auth.
4. Supabase client from env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; never hardcode keys. Do not create or require a database inside AI Studio; just write Supabase-ready code. If env vars are missing, show a clear setup screen instead of crashing.
5. All Supabase calls only inside `src/services/*`.
6. Deployment-ready for Cloudflare: `npm run build` → `dist`, `public/_redirects` (`/*    /index.html   200`), root `.npmrc` with only `legacy-peer-deps=true`, only `package-lock.json` (no `bun.lock`/`bun.lockb`), `.nvmrc` = 20, `.env.example` with the two variables, `.gitignore` including `.env`.
7. No localStorage hacks for data; data lives in Supabase. Supabase handles its own auth session storage.

## 1. Build order
**Step A — Project setup:** Vite React-TS scaffold, dependencies, Tailwind theme (colours/fonts from 04), `index.html` with `lang="ur" dir="rtl"`, Google Fonts (Noto Naskh Arabic, Noto Nastaliq Urdu) with fallbacks, viewport-fit=cover, theme-color, apple meta tags.

**Step B — PWA:** `vite-plugin-pwa` config (manifest per TRD §8, icons in `public/icons/`, autoUpdate, precache app shell, **NetworkOnly for `*.supabase.co`**, navigateFallback `/index.html`). Generate simple PNG/SVG-based icons (teal background, white open-book emblem) in sizes 192, 512, 512 maskable, 180 apple-touch, favicon. `useInstallPrompt` hook + `InstallBanner`.

**Step C — Foundation:** `lib/supabase.ts`, `lib/date.ts` (ISO date helpers, Urdu date formatting), `lib/grades.ts` (acha/theek/kamzor labels+colours), `types/db.ts` (types for `profiles`, `classes`, `students`, `attendance`, `lesson_records` exactly as schema), `i18n/ur.ts`, React Query provider, `AuthContext`, `ProtectedRoute`.

**Step D — Design system & layout:** `AppShell`, `BottomNav` (حاضری, سبق, طلبہ, ترتیبات) with safe-area, desktop side rail on the right, `Toast`, `ConfirmDialog`, bottom-sheet component, `EmptyState`, `LoadingState`, `ErrorState`, offline banner.

**Step E — Services & hooks:** `profileService`, `classesService`, `studentsService`, `attendanceService`, `lessonRecordsService` implementing the operations in 05 §8 (use `upsert` with the specified `onConflict` keys), plus matching hooks with React Query invalidation.

**Step F — Pages (all routes in TRD §4):**
1. `LoginPage` — single Google button (inline SVG Google logo), error toast.
2. `AttendancePage` — DateBar, ClassFilter, student rows with `AttendanceToggle` (حاضر/غائب/رخصت), summary bar, "سب حاضر", immediate upsert per tap, future-date lock.
3. `LessonsPage` — DateBar, ClassFilter, student rows with 3 status chips (سبق/سبقی/منزل) for the date, navigate to entry.
4. `LessonEntryPage` — three `LessonSection`s in order Sabaq → Sabqi → Manzil, each with heard switch, lines stepper, mistakes stepper, GradeSelector, note, per-section save, prefill existing, force 0/clear grade when not heard, "اگلا طالب علم".
5. `StudentsPage` — search, class filter, add/edit sheet, archive/unarchive, delete with confirm, link to classes.
6. `StudentDetailPage` — header, stats cards, range chips, date-wise history cards (attendance + sabaq + sabqi + manzil), tap to edit a day.
7. `ClassesPage` — add/rename/reorder/delete (blocked with Urdu message if students exist; handle FK RESTRICT error).
8. `SettingsPage` — profile card, install button + manual instructions, classes link, logout with confirm.
9. `NotFoundPage`.

**Step G — Polish:** loading/empty/error/success states on every page, validation per 03 §6, accessibility (aria-labels in Urdu, radiogroups), animations per 04, `prefers-reduced-motion`, 44px tap targets, RTL mirroring check of arrows/chevrons.

**Step H — QA pass (self-check before finishing):**
- App builds with `npm run build` with no TypeScript errors.
- Refreshing any route works (SPA fallback).
- No hardcoded Supabase URL/key anywhere; only `import.meta.env.VITE_*`.
- Every service uses exact table/column names from 05.
- No admin code, no email/password UI.
- Layout verified at 360, 390, 768, 1024 widths, RTL correct, no horizontal scroll.
- Manifest valid; install prompt works; app opens standalone.

## 2. Dependencies between steps
A → B/C → D → E → F → G → H. Pages in F depend on services (E) and layout (D).

## 3. Final Checklist (all must be true)
- [ ] 5 DB tables referenced exactly: `profiles`, `classes`, `students`, `attendance`, `lesson_records`
- [ ] Routes exactly as TRD §4
- [ ] Sabaq/Sabqi/Manzil each record: heard, lines_count, mistakes_count, grade, note
- [ ] Student detail shows date-wise attendance + all three lesson types
- [ ] Google-only login, no admin
- [ ] Urdu RTL UI, i18n file complete
- [ ] PWA installable; Supabase calls never cached by service worker
- [ ] Cloudflare files present: `_redirects`, `.npmrc`, `.nvmrc`, `.env.example`, `package-lock.json`

