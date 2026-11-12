import { format, isThisWeek, isToday, isYesterday } from 'date-fns'

/** Short time for a single message bubble, e.g. "9:15 AM". */
export function formatMessageTime(isoDate: string): string {
  return format(new Date(isoDate), 'h:mm a')
}

/** Compact timestamp for the conversation list: time today, weekday this week, else a date. */
export function formatConversationTimestamp(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return format(date, 'h:mm a')
  if (isYesterday(date)) return 'Yesterday'
  if (isThisWeek(date)) return format(date, 'EEEE')
  return format(date, 'MMM d')
}

/** Heading used above a group of messages sent on the same day. */
export function formatDateDivider(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMMM d')
}

/** "day key" (YYYY-MM-DD) used to group messages sent on the same calendar day. */
export function dayKey(isoDate: string): string {
  return format(new Date(isoDate), 'yyyy-MM-dd')
}

/** Human presence string for an offline user, e.g. "Last seen 9:15 AM" or "Last seen Yesterday". */
export function formatLastSeen(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return `Last seen ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return 'Last seen yesterday'
  return `Last seen ${format(date, 'MMM d')}`
}
