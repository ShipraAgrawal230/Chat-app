import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { CURRENT_USER_ID } from '@/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { memberAdded, memberRemoved } from '@/store/conversationsSlice'
import { groupInfoHidden } from '@/store/uiSlice'
import { AddMembersModal } from '@/features/groups/components/AddMembersModal'
import { MemberRow } from '@/features/groups/components/MemberRow'

export function GroupInfoPanel() {
  const dispatch = useAppDispatch()
  const activeConversationId = useAppSelector((state) => state.ui.activeConversationId)
  const conversation = useAppSelector((state) =>
    state.conversations.conversations.find((c) => c.id === activeConversationId),
  )
  const users = useAppSelector((state) => state.users.users)
  const [isAddingMembers, setIsAddingMembers] = useState(false)

  if (!conversation) return null

  const members = conversation.participantIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is NonNullable<typeof user> => Boolean(user))
  const candidateUsers = users.filter((user) => !conversation.participantIds.includes(user.id))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Group info</h2>
        <IconButton label="Close group info" onClick={() => dispatch(groupInfoHidden())}>
          <X className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="flex flex-col items-center gap-2 border-b border-slate-200 px-4 py-6 dark:border-slate-800">
        <Avatar src={conversation.avatarUrl ?? ''} name={conversation.name ?? 'Group'} size="lg" />
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{conversation.name}</p>
        <p className="text-xs text-slate-400">{members.length} members</p>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Members</p>
          <button
            type="button"
            onClick={() => setIsAddingMembers(true)}
            className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <ul>
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isCurrentUser={member.id === CURRENT_USER_ID}
              onRemove={() => dispatch(memberRemoved({ conversationId: conversation.id, userId: member.id }))}
            />
          ))}
        </ul>
      </div>

      {isAddingMembers && (
        <AddMembersModal
          candidateUsers={candidateUsers}
          onClose={() => setIsAddingMembers(false)}
          onConfirm={(userIds) => {
            userIds.forEach((id) => dispatch(memberAdded({ conversationId: conversation.id, userId: id })))
            setIsAddingMembers(false)
          }}
        />
      )}
    </div>
  )
}
