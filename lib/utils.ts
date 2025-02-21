import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const auth_url = process.env.NEXT_PUBLIC_BASE_URL
export const backend_url = process.env.NEXT_PUBLIC_QUADBASE_URL