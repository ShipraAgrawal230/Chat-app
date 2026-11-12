/** Id of the logged-in user in this demo (there is no real auth layer). */
export const CURRENT_USER_ID = 'u1'

/** Quick-pick emoji set for the reaction picker. */
export const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'] as const

/** Simulated network latency range (ms) for mock API calls. */
export const MOCK_LATENCY_MS: [min: number, max: number] = [250, 600]
