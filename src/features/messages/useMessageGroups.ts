import { useMemo } from 'react'
import { dayKey, formatDateDivider } from '@/lib/formatDate'
import type { Message } from '@/types'

export interface MessageGroup {
  dateKey: string
  label: string
  messages: Message[]
}

/** Buckets a flat, chronological message list into day groups for the "Today / Yesterday / ..." dividers. */
export function useMessageGroups(messages: Message[]): MessageGroup[] {
  return useMemo(() => {
    const groups: MessageGroup[] = []

    for (const message of messages) {
      const key = dayKey(message.createdAt)
      const lastGroup = groups[groups.length - 1]
      if (lastGroup?.dateKey === key) {
        lastGroup.messages.push(message)
      } else {
        groups.push({ dateKey: key, label: formatDateDivider(message.createdAt), messages: [message] })
      }
    }

    return groups
  }, [messages])
}
