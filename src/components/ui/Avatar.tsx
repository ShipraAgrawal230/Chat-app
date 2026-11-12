import { cn } from '@/lib/cn'

interface AvatarProps {
  src: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  /** Renders an online/offline presence dot in the corner when provided. */
  isOnline?: boolean
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

const DOT_SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3.5 w-3.5',
}

export function Avatar({ src, name, size = 'md', isOnline, className }: AvatarProps) {
  return (
    <span className={cn('relative inline-block shrink-0', className)}>
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover bg-slate-200 dark:bg-slate-700', SIZE_CLASSES[size])}
      />
      {isOnline !== undefined && (
        <span
          aria-label={isOnline ? 'Online' : 'Offline'}
          className={cn(
            'absolute right-0 bottom-0 rounded-full ring-2 ring-white dark:ring-slate-900',
            DOT_SIZE_CLASSES[size],
            isOnline ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500',
          )}
        />
      )}
    </span>
  )
}
