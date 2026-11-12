# ChatSphere

A modern, responsive chat application (Slack/WhatsApp Web–style) built as a take-home assignment. Supports direct and group conversations, message editing/deletion/replies/reactions, typing indicators, simulated real-time delivery, and full light/dark theming — all on the frontend, backed by a mock data + mock "realtime" layer (no server required).

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State management | Redux Toolkit + React Redux |
| Forms | React Hook Form |
| Icons | Lucide |

## Getting started

Requires Node.js 20+.

```bash
cd chat-app
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

Other scripts:

```bash
npm run build    # type-check + production build
npm run preview  # preview the production build locally
npm run lint     # oxlint
```

There is no backend to run and no environment variables to configure — everything (users, conversations, message history) is seeded from the JSON files in `src/data/` and served through a mock API / mock realtime layer. See [ARCHITECTURE.md](./ARCHITECTURE.md) for how that's structured.

## Feature coverage

**Implemented:** conversation list with search, unread/group filters, unread badges, and online presence; message thread with text send/receive, replies, edit, delete, copy, emoji reactions, date-grouped history, auto-scroll, and delivery/read ticks; simulated typing indicators and simulated incoming messages/presence changes; group info panel with mock add/remove member; responsive three-pane layout that collapses to single-panel navigation on mobile; persisted light/dark theme; loading, empty, and error states; debounced conversation search; optimistic message sending with delivered/read progression; Enter-to-send / Shift+Enter-for-newline keyboard shortcut.

**Deliberately out of scope** (see trade-offs below): virtualized message list, infinite scroll / pagination, IndexedDB persistence, offline queueing, file attachments, and a real WebSocket connection.

## Assumptions, shortcuts, and trade-offs

- **No backend.** The assignment explicitly marks a backend as not required and recommends mock data/API — this app uses an in-memory mock API (`src/services/mockApi.ts`, simulated latency) and a mock realtime event bus (`src/services/realtimeSimulator.ts`) instead of Express/MongoDB, so there's no server process to run or database to seed.
- **Single logged-in user.** There's no auth; `CURRENT_USER_ID` (`src/lib/constants.ts`) hardcodes "You" as the active user, matching the take-home's "no backend" scope.
- **State resets on reload.** Nothing is persisted beyond the theme preference (`localStorage`). Sent messages, edits, reactions, and membership changes live only in memory for the session. This was a deliberate scope cut — see "Advanced challenges" below.
- **No virtualized list.** The assignment lists this as an *optional* advanced challenge. Message rendering is kept efficient through memo-friendly components, grouped-by-day rendering, and narrow `useAppSelector` subscriptions (components only re-render when the slice of state they read changes) rather than a windowing library. For truly large histories (10,000+ messages) a library like `@tanstack/react-virtual` would be the next step; it was left out to keep `MessageBubble`/`MessageList` simple and easy to read, per the brief's request for very readable code.
- **Soft-skip on infinite scroll, offline queue, attachment previews, IndexedDB, and real WebSockets.** All optional per the brief. Typing indicators and incoming messages *are* simulated (that part is a core requirement, not optional) via a small pub/sub event bus standing in for a socket connection — see `useRealtimeSync`.
- **Message deletion is a hard delete** (removed from the client-side store) rather than a soft-delete tombstone, since there's no server of record to reconcile against.
- **Group/direct display names are derived, not stored.** A direct conversation has no `name`/`avatarUrl` of its own — it's resolved from the other participant at render time (`getConversationDisplay`), so renaming a user doesn't require touching every conversation record.
- **"Last message" preview requires the conversation's messages to be loaded.** On startup the app eagerly loads every conversation's message history (small mock dataset, so this is cheap) specifically so the sidebar can show accurate previews and the search can match message text. A real backend would more likely return previews inline with the conversation list.
- **No automated test suite.** The brief lists unit tests as an expected deliverable, but they were intentionally left out of this submission by request — the app was instead verified manually end-to-end (every feature below was clicked through in both themes and at mobile/desktop widths).

## Project structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full breakdown, folder-by-folder, and the reasoning behind the state management split.
