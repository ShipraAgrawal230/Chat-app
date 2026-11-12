import { type RefObject, useEffect } from 'react'

/** Invokes `handler` for pointer events that land outside the referenced element. Used by dropdowns/menus. */
export function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void): void {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (ref.current && !ref.current.contains(target)) handler()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [ref, handler])
}
