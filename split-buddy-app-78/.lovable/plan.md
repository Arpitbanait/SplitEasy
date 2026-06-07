## SplitEasy Frontend Plan

A friendly, Splitwise-style web app (white + mint green `#1cc29f` on slate `#0f172a`) wired to your deployed FastAPI at `https://spliteasy-r7md.onrender.com`. Every backend route gets a real UI.

### Tech & wiring
- TanStack Start (already scaffolded) + TanStack Query + Tailwind v4 + shadcn/ui.
- `VITE_API_URL` defaults to your Render URL; one typed `apiFetch()` client adds `Authorization: Bearer <token>` from `localStorage`, handles JSON + `application/x-www-form-urlencoded` (login), and surfaces backend errors as toasts.
- Auth context provider: holds user + token, hydrates from `localStorage`, exposes `login / signup / logout`. Route guard via `_authenticated/route.tsx` redirects to `/auth` when no token.
- WebSocket hook (`/ws/...`) subscribes after login to refresh notifications + balances live (invalidates relevant React Query keys on message).

> Heads up: your `/auth/login` is OAuth2 form-data (`username`+`password`), and `/groups/{id}/add-member` takes `{name, email}`. The client handles both correctly. CORS must allow the Lovable preview origin — if you see CORS errors I'll show you the one-liner to add to FastAPI.

### Routes & screens
```
/                       Marketing landing (hero + CTA → /auth)
/auth                   Tabbed Login / Signup (OAuth2 form for login)
/_authenticated/
  /dashboard            GET /dashboard/ — total owed, total owe, recent activity,
                        net balance card, quick actions
  /groups               GET /groups/my-groups — grid of group cards + "New group" dialog
                        (POST /groups/create)
  /groups/$groupId      GET /groups/{id} (details + members),
                        GET /groups/{id}/summary (totals),
                        GET /expenses/group/{id}/expenses (timeline),
                        GET /expenses/group/{id}/balances (who-owes-whom),
                        GET /groups/{id}/simplified-balances (debt-simplify view),
                        Tabs: Expenses · Balances · Simplified · Members · Settle up
                        Actions: Add expense, Add member, Edit/Delete expense,
                                 Settle (POST /expenses/settle), Mock pay
  /expenses/new         POST /expenses/create (group optional, participant multi-select,
                        equal split for v1 — extensible)
  /balances             GET /expenses/balances/direct — non-group 1:1 balances
  /payments             GET /payments/history + "Mock pay" dialog (POST /payments/mock-pay)
  /notifications        GET /notifications + mark-as-read
  /settings             /auth/me profile + logout
```
All UI navigation uses `<Link>` (typed params); mutations use `useMutation` + `queryClient.invalidateQueries` so balances refresh after every add/settle/pay.

### Key UX pieces (Splitwise feel)
- Group card: name, member avatars, your net balance colored green/red.
- Expense row: payer avatar, description, amount, "you owe / you are owed X" line.
- Balances tab: grouped list "X owes Y ₹Z" with one-tap **Settle up** that opens the mock-pay sheet.
- Add-expense sheet: amount, description, payer (defaults to you), participants chip-picker, optional group selector.
- Empty states, skeletons, toast feedback, mobile-first responsive layout.

### Technical details
- Files: `src/lib/api.ts` (fetch client + endpoint helpers), `src/lib/auth.tsx` (context), `src/lib/ws.ts` (websocket), `src/integrations/api/types.ts` (TS types mirroring your Pydantic schemas), route files under `src/routes/` matching the map above, reusable components in `src/components/` (GroupCard, ExpenseRow, BalanceList, AddExpenseDialog, SettleDialog, MockPayDialog, NotificationsBell, AppShell with sidebar).
- React Query keys: `["me"]`, `["dashboard"]`, `["groups"]`, `["group", id]`, `["group", id, "summary"|"expenses"|"balances"|"simplified"]`, `["balances","direct"]`, `["payments"]`, `["notifications"]`.
- Token storage: `localStorage["spliteasy_token"]`; 401 responses auto-logout + redirect to `/auth`.
- No Lovable Cloud / Supabase needed — your FastAPI is the entire backend.

### Out of scope for v1
- Non-equal split methods (shares, percentages, exact) — your `CreateExpense` currently takes a flat participants list; happy to add split modes later if you want to extend the backend.
- Receipt uploads, currencies switching, recurring expenses.

Approve and I'll build it.