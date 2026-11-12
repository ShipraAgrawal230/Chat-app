import { type RefObject, useEffect, useRef } from 'react'

const NEAR_BOTTOM_THRESHOLD_PX = 120

/**
 * Scrolls a message container to the bottom when it makes sense to:
 * - always, when switching to a different conversation
 * - on new messages, only if the reader was already near the bottom
 *   (so scrolling up to read history is never interrupted)
 */
export function useAutoScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  { conversationId, messageCount }: { conversationId: string; messageCount: number },
): void {
  const isNearBottomRef = useRef(true)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    function handleScroll() {
      if (!element) return
      const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight
      isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD_PX
    }

    element.addEventListener('scroll', handleScroll)
    return () => element.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    isNearBottomRef.current = true
    element.scrollTop = element.scrollHeight
    // A conversation switch always jumps to the latest message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    const element = containerRef.current
    if (!element || !isNearBottomRef.current) return
    element.scrollTop = element.scrollHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageCount])
}
