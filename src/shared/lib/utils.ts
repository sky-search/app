import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomChatId() {
  return Math.random().toString(36).substring(2, 9)
}

export function formatStringDate(dateString: string | null) {
  if (!dateString) return ""

  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}
