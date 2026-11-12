import { cn } from '@/lib/cn'

interface BadgeProps {
  count: number
  className?: string
}

/** Unread-count pill. Caps the display at 99+ so it never wraps the layout. */
export function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-semibold text-white',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
