import conversationsSeed from '@/data/conversations.json'
import messagesSeed from '@/data/messages.json'
import usersSeed from '@/data/users.json'
import { MOCK_LATENCY_MS } from '@/lib/constants'
import type { Conversation, Message, User } from '@/types'

/**
 * Stands in for a real backend. Every exported function mimics a network
 * call: it's async and resolves after a randomized delay, so the rest of
 * the app (loading states, optimistic UI) has to behave as it would against
 * a real API. All UI code talks to the app only through this module and
 * never imports the JSON seed files directly.
 */

function delay<T>(value: T): Promise<T> {
  const [min, max] = MOCK_LATENCY_MS
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchUsers(): Promise<User[]> {
  return delay(usersSeed as User[])
}

export async function fetchConversations(): Promise<Conversation[]> {
  return delay(conversationsSeed as Conversation[])
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const messages = (messagesSeed as Message[])
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return delay(messages)
}

interface SendMessagePayload {
  conversationId: string
  senderId: string
  text: string
  replyToId?: string
}

/** Simulates persisting a new message and returns the server-confirmed record. */
export async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  const message: Message = {
    id: `m-${crypto.randomUUID()}`,
    conversationId: payload.conversationId,
    senderId: payload.senderId,
    text: payload.text,
    replyToId: payload.replyToId,
    createdAt: new Date().toISOString(),
    status: 'sent',
    reactions: [],
  }
  return delay(message)
}

export async function editMessage(_messageId: string, text: string): Promise<{ text: string; editedAt: string }> {
  return delay({ text, editedAt: new Date().toISOString() })
}

export async function deleteMessage(_messageId: string): Promise<void> {
  return delay(undefined)
}
