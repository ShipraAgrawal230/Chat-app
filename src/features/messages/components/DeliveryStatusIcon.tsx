import { Check, CheckCheck, Clock, TriangleAlert } from 'lucide-react'
import type { MessageStatus } from '@/types'

/** Ticks/clock icon shown next to timestamps on messages the current user sent. */
export function DeliveryStatusIcon({ status }: { status: MessageStatus }) {
  switch (status) {
    case 'sending':
      return <Clock className="h-3.5 w-3.5 text-slate-400" aria-label="Sending" />
    case 'sent':
      return <Check className="h-3.5 w-3.5 text-slate-400" aria-label="Sent" />
    case 'delivered':
      return <CheckCheck className="h-3.5 w-3.5 text-slate-400" aria-label="Delivered" />
    case 'read':
      return <CheckCheck className="h-3.5 w-3.5 text-sky-500" aria-label="Read" />
    case 'failed':
      return <TriangleAlert className="h-3.5 w-3.5 text-red-500" aria-label="Failed to send" />
  }
}
