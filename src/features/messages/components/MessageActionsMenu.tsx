import { Copy, Pencil, Reply, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'

interface MessageActionsMenuProps {
  isOwnMessage: boolean
  align: 'start' | 'end'
  onReply: () => void
  onCopy: () => void
  onEdit: () => void
  onDelete: () => void
}

/** Hover-revealed toolbar of per-message actions (reply, copy, edit, delete). */
export function MessageActionsMenu({ isOwnMessage, align, onReply, onCopy, onEdit, onDelete }: MessageActionsMenuProps) {
  return (
    <div
      className={cn(
        'absolute top-0 flex -translate-y-1/2 items-center gap-0.5 rounded-full border border-slate-200 bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800',
        align === 'end' ? 'right-2' : 'left-2',
      )}
    >
      <IconButton label="Reply" size="sm" onClick={onReply}>
        <Reply className="h-4 w-4" />
      </IconButton>
      <IconButton label="Copy text" size="sm" onClick={onCopy}>
        <Copy className="h-4 w-4" />
      </IconButton>
      {isOwnMessage && (
        <>
          <IconButton label="Edit message" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </IconButton>
          <IconButton label="Delete message" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </>
      )}
    </div>
  )
}
