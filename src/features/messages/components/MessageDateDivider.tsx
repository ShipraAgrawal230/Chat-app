export function MessageDateDivider({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center justify-center" role="separator" aria-label={label}>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {label}
      </span>
    </div>
  )
}
