import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { User } from '@/types'

interface AddMembersModalProps {
  candidateUsers: User[]
  onConfirm: (userIds: string[]) => void
  onClose: () => void
}

export function AddMembersModal({ candidateUsers, onConfirm, onClose }: AddMembersModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  function toggle(userId: string) {
    setSelectedIds((ids) => (ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId]))
  }

  return (
    <Modal title="Add members" onClose={onClose}>
      {candidateUsers.length === 0 ? (
        <p className="text-sm text-slate-500">Everyone is already in this group.</p>
      ) : (
        <ul className="space-y-1">
          {candidateUsers.map((user) => (
            <li key={user.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggle(user.id)}
                  className="h-4 w-4 accent-emerald-600"
                />
                <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                <span className="text-sm text-slate-900 dark:text-slate-100">{user.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {candidateUsers.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button disabled={selectedIds.length === 0} onClick={() => onConfirm(selectedIds)}>
            Add {selectedIds.length > 0 ? selectedIds.length : ''}
          </Button>
        </div>
      )}
    </Modal>
  )
}
