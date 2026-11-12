# Architecture

## Data flow

```
┌─────────────────────┐        ┌──────────────────────────┐
│   src/data/*.json    │──────▶ │   services/mockApi.ts     │  simulated REST:
│ users / conversations │        │  (delay(), typed fetches) │  fetchUsers, fetchConversations,
│      / messages       │        └────────────┬──────────────┘  fetchMessages, sendMessage,
└─────────────────────┘                       │                 editMessage, deleteMessage
                                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           Redux store (configureStore)                      │
│   usersSlice   conversationsSlice   messagesSlice   uiSlice   themeSlice    │
└───────────────────────────────┬───────────────────────────────────────────┘
                                 │  useAppSelector (subscribe to one slice each)
                                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          Feature components (React)                         │
│   features/conversations      features/messages      features/groups       │
│   (Sidebar, list, search)     (ChatWindow, bubbles)   (info panel, modal)   │
└───────────────────────────────┬───────────────────────────────────────────┘
                                 ▲
                                 │  emits events (incoming message, typing,
                                 │  presence, status) consumed by useRealtimeSync
┌───────────────────────────────┴───────────────────────────────────────────┐
│         services/realtimeEmitter.ts  +  services/realtimeSimulator.ts       │
│   A tiny pub/sub bus standing in for a WebSocket connection. The simulator  │
│   periodically emits "typing", "incoming message", and "presence" events;   │
│   useRealtimeSync subscribes and dispatches the matching Redux action.      │
└───────────────────────────────────────────────────────────────────────────┘
```

Everything above the mock API is written exactly as it would be against a real backend: components never import the JSON seed files directly, only `services/mockApi.ts` and `services/realtimeEmitter.ts`. Swapping in a real Express + MongoDB API would mean rewriting `mockApi.ts`'s function bodies to use `fetch`, and swapping `realtimeSimulator.ts` for a real `socket.io`/WebSocket client that calls `realtimeEmitter.emit(...)` — nothing in the component tree or store would need to change.

## Component layout (desktop)

```
┌──────────────┬─────────────────────────────────┬────────────────┐
│   Sidebar     │          ChatWindow              │  GroupInfoPanel │
│  (340px)      │          (flex-1)                │   (320px,       │
│               │                                   │   groups only,  │
│ - search      │  ChatHeader                       │   toggled)      │
│ - filter tabs │  MessageList (grouped by day)      │                 │
│ - conv. list  │  TypingIndicator                   │  - member list  │
│               │  MessageInput (React Hook Form)    │  - add/remove   │
└──────────────┴─────────────────────────────────┴────────────────┘
```

On viewports under `768px` (`useMediaQuery`), only one panel renders at a time, driven by `ui.mobilePanel` (`'list' | 'chat' | 'info'`) — selecting a conversation switches to `'chat'`, the header back-arrow returns to `'list'`.

## State management

The store is a single `configureStore` combining five slices (`src/store/*.ts`), each owning a clearly bounded concern — this is the normalized-tree shape Redux is built for, just kept in small, single-purpose files instead of one giant reducer:

| Slice | Owns | Why separate |
|---|---|---|
| `usersSlice` | User records, presence | Presence changes (simulated) are independent of conversations/messages and would cause unrelated re-renders if bundled in. |
| `conversationsSlice` | Conversation metadata, unread counts, search/filter UI state, membership | The "list" concern — everything the sidebar needs, independent of which messages are loaded. |
| `messagesSlice` | Messages keyed by conversation id, typing state, all message mutations (send/edit/delete/react) | The heaviest-churn slice (every keystroke's debounce, every reaction, every simulated delivery tick touches it) — isolating it means typing in the sidebar search box never re-renders message bubbles. |
| `uiSlice` | Active conversation id, mobile panel, in-progress reply target, in-progress edit id | Pure *view* state — never persisted, never fetched, reset-safe. Kept out of the domain slices so "what's selected" doesn't get conflated with "what exists." |
| `themeSlice` | Light/dark preference | The only slice that persists — `store/index.ts` subscribes to the store and writes `theme.theme` to `localStorage` on change, instead of reaching for a full persistence middleware for one string. |

Async work (loading users/conversations/messages, sending/editing/deleting a message) is handled with `createAsyncThunk`, each wired to its slice's `pending`/`fulfilled`/`rejected` cases in `extraReducers` rather than `useEffect` calling into the store imperatively. `sendMessage` is the interesting one: the `pending` reducer inserts a "sending" placeholder immediately — keyed by the thunk's own `requestId`, so no separate id generator is needed — the UI shows it right away (optimistic send), `fulfilled` swaps that placeholder for the server-confirmed message, and `rejected` marks it failed. After confirmation, the same thunk schedules the delivered/read status ticks via `setTimeout` + `dispatch`, simulating what a recipient's client would report back.

Components read state with the typed `useAppSelector` (`src/store/hooks.ts`) scoped to the exact slice they need (`useAppSelector((state) => state.messages.typing[id])`) rather than larger objects, so each component only re-renders when the slice it actually reads changes — e.g. editing a message doesn't re-render the conversation list, and a typing indicator in one conversation doesn't re-render another. Writes go through `useAppDispatch` plus the slice's exported action creators/thunks; nothing calls the store directly from a component except `useRealtimeSync`, which reads `store.getState()` once per incoming realtime event to check the active conversation (see below) — that's a plain subscription outside React, not a component re-render path.

Derived/computed data (filtered + sorted conversation list, messages grouped by day, direct-conversation display name/avatar) is **not** stored — it's computed with `useMemo` in small hooks (`useVisibleConversations`, `useMessageGroups`, `getConversationDisplay`) from the raw slice state. This avoids an entire class of "derived state got out of sync with its source" bugs, and keeps the slices themselves free of redundant fields to keep in sync.

## Project structure

```
src/
  types/             Shared domain types (User, Conversation, Message, ...)
  data/               Mock JSON seed data (users, conversations, messages)
  services/           mockApi.ts (fake REST), realtimeEmitter.ts + realtimeSimulator.ts (fake socket)
  store/              Redux slices, the store itself, and typed hooks — see table above
  lib/                Framework-agnostic helpers: cn, formatDate, constants
  hooks/              Generic reusable hooks: useDebouncedValue, useMediaQuery, useOnClickOutside, useRealtimeSync
  components/ui/      Dumb, reusable UI primitives: Avatar, Badge, Button, IconButton, Modal, EmptyState, Spinner
  features/
    conversations/    Sidebar, search, filters, list, and the direct/group display-name resolver
    messages/          Chat window, message bubble, input, reactions, typing indicator, date grouping
    groups/            Group info panel, member list, add-members modal
    theme/              Theme toggle
  App.tsx             Responsive layout + app-level bootstrapping (data load, theme sync, realtime sync)
```

This is a feature-based structure: anything specific to "messages" (components, hooks, grouping logic) lives under `features/messages/`, not spread across generic `components/`/`hooks/` folders. Only genuinely cross-feature building blocks (`Avatar`, `Modal`, `useDebouncedValue`, ...) live outside a feature folder.

## Efficient rendering, without a virtualization library

`MessageBubble` only needs the day-group's slice of messages, not the full array, and each bubble subscribes individually to the store (its own reactions, its own edit state) rather than the parent `MessageList` re-rendering every bubble on any change. Combined with grouping messages by day once (memoized in `useMessageGroups`) and keeping derived UI state (reply target, editing id) out of the messages array itself, this keeps re-renders scoped to the message that actually changed. A full virtualized list (e.g. `@tanstack/react-virtual`) was scoped out as the brief marks it optional — see the README's trade-offs section for what adding it would involve.

## Event handling and cleanup

Every subscription in the app is set up and torn down symmetrically:

- `useRealtimeSync` starts the realtime simulator and subscribes to `realtimeEmitter` in a `useEffect`, returning a cleanup that stops the simulator's timers and unsubscribes.
- `useAutoScroll`, `useMediaQuery`, and `useOnClickOutside` each add exactly one DOM listener in a `useEffect` and remove it in the returned cleanup.
- `Modal` adds its `Escape`-to-close listener on mount and removes it on unmount.

No `setInterval`/`addEventListener` in the codebase is left without a matching teardown.
