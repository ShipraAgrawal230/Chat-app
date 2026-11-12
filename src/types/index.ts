/**
 * Core domain models shared across the app. Kept in one place so every
 * feature (conversations, messages, groups) agrees on the same shapes.
 */

export interface User {
  id: string
  name: string
  avatarUrl: string
  isOnline: boolean
  /** ISO timestamp, only meaningful when `isOnline` is false. */
  lastSeenAt: string
}

export type ConversationType = 'direct' | 'group'

export interface Conversation {
  id: string
  type: ConversationType
  /** Participant user ids, including the current user. */
  participantIds: string[]
  /** Group display name. Undefined for direct chats (derived from the other participant). */
  name?: string
  /** Group avatar. Undefined for direct chats (derived from the other participant). */
  avatarUrl?: string
  unreadCount: number
  createdAt: string
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface MessageReaction {
  emoji: string
  userIds: string[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
  editedAt?: string
  status: MessageStatus
  /** Id of the message this one replies to, if any. */
  replyToId?: string
  reactions: MessageReaction[]
}

/** Conversation list filter tabs. */
export type ConversationFilter = 'all' | 'unread' | 'groups'

/** Per-conversation set of user ids currently typing. */
export type TypingState = Record<string, string[]>
