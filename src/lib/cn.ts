import { type ClassValue, clsx } from 'clsx'

/** Thin wrapper around clsx so class-name composition reads consistently across components. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
