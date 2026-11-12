import type { Conversation, User } from '@/types'

export interface ConversationDisplay {
  name: string
  avatarUrl: string
  /** Online status to show next to the name. Undefined for groups (no single presence to show). */
  isOnline?: boolean
  lastSeenAt?: string
  /** The other participant, for direct conversations only — used by the chat header and info panel. */
  otherUser?: User
}

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=1'

/**
 * Direct conversations don't store their own name/avatar — they're derived
 * from the other participant so renaming a user doesn't require touching
 * every conversation record.
 */
export function getConversationDisplay(
  conversation: Conversation,
  users: User[],
  currentUserId: string,
): ConversationDisplay {
  if (conversation.type === 'group') {
    return {
      name: conversation.name ?? 'Group',
      avatarUrl: conversation.avatarUrl ?? FALLBACK_AVATAR,
    }
  }

  const otherUserId = conversation.participantIds.find((id) => id !== currentUserId)
  const otherUser = users.find((user) => user.id === otherUserId)

  return {
    name: otherUser?.name ?? 'Unknown user',
    avatarUrl: otherUser?.avatarUrl ?? FALLBACK_AVATAR,
    isOnline: otherUser?.isOnline,
    lastSeenAt: otherUser?.lastSeenAt,
    otherUser,
  }
}
