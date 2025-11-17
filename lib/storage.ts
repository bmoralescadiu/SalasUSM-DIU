// lib/storage.ts
import type { Booking } from "@/types/booking"
const KEY = "mvp_reservas_v1"

const reviveDates = (b: any): Booking => ({
  ...b,
  startTime: new Date(b.startTime),
  endTime: new Date(b.endTime),
})

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return (JSON.parse(raw) as any[]).map(reviveDates)
  } catch {
    return []
  }
}

export function saveBookings(list: Booking[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function addBooking(b: Booking) {
  const list = loadBookings()
  saveBookings([...list, b])
}

export function updateBooking(b: Booking) {
  const list = loadBookings().map(x => x.id === b.id ? b : x)
  saveBookings(list)
}

export function deleteBooking(id: string) {
  saveBookings(loadBookings().filter(x => x.id !== id))
}
