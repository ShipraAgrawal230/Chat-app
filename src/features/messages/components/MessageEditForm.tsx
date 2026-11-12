import { useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'

interface MessageEditFormValues {
  text: string
}

interface MessageEditFormProps {
  initialText: string
  onSave: (text: string) => void
  onCancel: () => void
}

/** Inline "edit sent message" form, submitted with Enter and cancelled with Escape. */
export function MessageEditForm({ initialText, onSave, onCancel }: MessageEditFormProps) {
  const { register, handleSubmit, setFocus } = useForm<MessageEditFormValues>({
    defaultValues: { text: initialText },
  })
  const { ref, ...textareaProps } = register('text', { required: true })
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setFocus('text')
  }, [setFocus])

  function submit(values: MessageEditFormValues) {
    const trimmed = values.text.trim()
    if (trimmed.length > 0) onSave(trimmed)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-1.5">
      <textarea
        {...textareaProps}
        ref={(el) => {
          ref(el)
          textareaRef.current = el
        }}
        rows={2}
        className="w-full resize-none rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmit(submit)()
          }
          if (event.key === 'Escape') onCancel()
        }}
      />
      <div className="flex justify-end gap-2 text-xs">
        <button type="button" onClick={onCancel} className="text-slate-500 hover:underline">
          Cancel
        </button>
        <button type="submit" className="font-medium text-emerald-600 hover:underline">
          Save
        </button>
      </div>
    </form>
  )
}
