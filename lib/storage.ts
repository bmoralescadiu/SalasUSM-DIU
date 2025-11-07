// lib/storage.ts
import type { Booking } from "@/types/booking"

const STORAGE_KEY = "usm_bookings"

// Convierte a Date lo que venga del JSON
function toDate(v: unknown) {
  // permite timestamp, ISO string, etc.
  return v instanceof Date ? v : new Date(v as any)
}

function normalize(b: any): Booking {
  return {
    ...b,
    startTime: toDate(b.startTime),
    endTime: toDate(b.endTime),
  }
}

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.map(normalize) : []
  } catch {
    return []
  }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    /* noop */
  }
}
