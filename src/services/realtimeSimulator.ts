import { realtimeEmitter } from '@/services/realtimeEmitter'
import type { Conversation, Message, User } from '@/types'

const CANNED_REPLIES = [
  "Sounds good, I'll take a look.",
  'Got it, thanks for the update!',
  'Can we sync on this later today?',
  "I'll have that ready shortly.",
  "That works for me 👍",
  'Let me double check and get back to you.',
  'Interesting, tell me more.',
  "Just saw this, on it now.",
]

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randomDelay(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs)
}

interface SimulationOptions {
  conversations: Conversation[]
  users: User[]
  currentUserId: string
}

/**
 * Stands in for a live WebSocket connection: periodically emits typing and
 * incoming-message events for random conversations, and occasional presence
 * flips, onto the shared `realtimeEmitter`. Returns a cleanup function that
 * cancels every pending timer so nothing fires after the caller unmounts.
 */
export function startRealtimeSimulation({ conversations, users, currentUserId }: SimulationOptions): () => void {
  let cancelled = false
  const timeouts = new Set<ReturnType<typeof setTimeout>>()

  function schedule(fn: () => void, ms: number): void {
    const id = setTimeout(() => {
      timeouts.delete(id)
      if (!cancelled) fn()
    }, ms)
    timeouts.add(id)
  }

  function otherParticipant(conversation: Conversation): User | undefined {
    const candidateIds = conversation.participantIds.filter((id) => id !== currentUserId)
    const id = randomItem(candidateIds)
    return users.find((user) => user.id === id)
  }

  function scheduleIncomingMessage(): void {
    schedule(
      () => {
        const conversation = randomItem(conversations)
        const sender = otherParticipant(conversation)
        if (sender) {
          realtimeEmitter.emit({ type: 'typing:start', conversationId: conversation.id, userId: sender.id })
          schedule(() => {
            realtimeEmitter.emit({ type: 'typing:stop', conversationId: conversation.id, userId: sender.id })
            const message: Message = {
              id: `m-${crypto.randomUUID()}`,
              conversationId: conversation.id,
              senderId: sender.id,
              text: randomItem(CANNED_REPLIES),
              createdAt: new Date().toISOString(),
              status: 'delivered',
              reactions: [],
            }
            realtimeEmitter.emit({ type: 'message:incoming', message })
          }, randomDelay(1200, 2600))
        }
        scheduleIncomingMessage()
      },
      randomDelay(14000, 26000),
    )
  }

  function schedulePresenceFlip(): void {
    schedule(() => {
      const user = randomItem(users.filter((u) => u.id !== currentUserId))
      realtimeEmitter.emit({ type: 'presence:change', userId: user.id, isOnline: !user.isOnline })
      schedulePresenceFlip()
    }, randomDelay(20000, 40000))
  }

  if (conversations.length > 0 && users.length > 1) {
    scheduleIncomingMessage()
    schedulePresenceFlip()
  }

  return () => {
    cancelled = true
    timeouts.forEach(clearTimeout)
    timeouts.clear()
  }
}
