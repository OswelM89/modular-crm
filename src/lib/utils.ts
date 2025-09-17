import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency utility
export const formatCurrency = (amount: number, currency = 'MXN', locale = 'es-MX') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format date utility
export const formatDate = (date: Date | string, locale = 'es-MX') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

// Truncate text utility  
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Generate initials from name
export const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.charAt(0)?.toUpperCase() || 'U'
  const last = lastName?.charAt(0)?.toUpperCase() || 'U'
  return `${first}${last}`
}