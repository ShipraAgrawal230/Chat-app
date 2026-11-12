import type { Message, MessageStatus } from '@/types'

export type RealtimeEvent =
  | { type: 'message:incoming'; message: Message }
  | { type: 'message:status'; conversationId: string; messageId: string; status: MessageStatus }
  | { type: 'typing:start'; conversationId: string; userId: string }
  | { type: 'typing:stop'; conversationId: string; userId: string }
  | { type: 'presence:change'; userId: string; isOnline: boolean }

type Listener = (event: RealtimeEvent) => void

/**
 * Minimal pub/sub bus standing in for a WebSocket connection. Both the
 * realtime simulator (producer) and the Zustand stores (consumers) depend
 * only on this interface, so swapping in a real socket later means
 * replacing `realtimeSimulator.ts` without touching the stores.
 */
class RealtimeEmitter {
  private readonly target = new EventTarget()

  emit(event: RealtimeEvent): void {
    this.target.dispatchEvent(new CustomEvent<RealtimeEvent>('event', { detail: event }))
  }

  subscribe(listener: Listener): () => void {
    const handler = (e: Event) => listener((e as CustomEvent<RealtimeEvent>).detail)
    this.target.addEventListener('event', handler)
    return () => this.target.removeEventListener('event', handler)
  }
}

export const realtimeEmitter = new RealtimeEmitter()
