import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { sendMessage } from '@/store/messagesSlice'
import { replyTargetChanged } from '@/store/uiSlice'
import { ReplyComposeBanner } from '@/features/messages/components/ReplyComposeBanner'

interface MessageInputProps {
  conversationId: string
}

interface MessageFormValues {
  text: string
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const dispatch = useAppDispatch()
  const messages = useAppSelector((state) => state.messages.messagesByConversation[conversationId])
  const replyTargetId = useAppSelector((state) => state.ui.replyTargetByConversation[conversationId])

  const repliedMessage = messages?.find((m) => m.id === replyTargetId)

  const { register, handleSubmit, reset } = useForm<MessageFormValues>({ defaultValues: { text: '' } })
  const { ref, ...textareaProps } = register('text', { required: true })

  function submit(values: MessageFormValues) {
    const text = values.text.trim()
    if (text.length === 0) return
    void dispatch(sendMessage({ conversationId, text, replyToId: replyTargetId ?? undefined }))
    reset({ text: '' })
    dispatch(replyTargetChanged({ conversationId, messageId: null }))
  }

  return (
    <div className="border-t border-slate-200 dark:border-slate-800">
      {repliedMessage && (
        <ReplyComposeBanner
          repliedMessage={repliedMessage}
          onCancel={() => dispatch(replyTargetChanged({ conversationId, messageId: null }))}
        />
      )}

      <form onSubmit={handleSubmit(submit)} className="flex items-end gap-2 px-4 py-3">
        <textarea
          {...textareaProps}
          ref={ref}
          rows={1}
          placeholder="Type a message"
          aria-label="Message input"
          className="max-h-32 flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleSubmit(submit)()
            }
          }}
        />
        <IconButton label="Send message" type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
          <Send className="h-4 w-4" />
        </IconButton>
      </form>
    </div>
  )
}
