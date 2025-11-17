// lib/storage.ts
import type { Booking } from "@/types/booking"

const STORAGE_KEY = "mvp_reservas_v1"

const hasLS = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined"

/** Normaliza un registro crudo desde localStorage al tipo Booking */
function reviveBooking(raw: any): Booking | null {
  if (!raw) return null

  // Compatibilidad de claves/tipos
  const typeMap: Record<string, Booking["type"]> = {
    class: "class",
    lab: "lab",
    ayudantia: "ayudantia",
    seminar: "seminar",
    certamen: "certamen",
    evento: "evento",
    event: "evento", // migración de versiones antiguas
  }

  const buildingOk = (b: any): Booking["building"] =>
    ["A", "B", "C", "E", "F", "K"].includes(b) ? b : "A"

  const start = raw.startTime ? new Date(raw.startTime) : null
  const end = raw.endTime ? new Date(raw.endTime) : null

  if (!start || Number.isNaN(start.getTime())) return null
  if (!end || Number.isNaN(end.getTime())) return null

  const booking: Booking = {
    id: String(raw.id ?? crypto.randomUUID()),
    title: String(raw.title ?? "Reserva"),
    type: typeMap[String(raw.type)] ?? "evento",
    room: String(raw.room ?? "Sala A101"),
    building: buildingOk(raw.building),
    instructor: String(raw.instructor ?? "—"),
    startTime: start,
    endTime: end,
    participants: Number.isFinite(raw.participants) ? Number(raw.participants) : 1,
    tableType: raw.tableType ?? undefined,
    roomType: raw.roomType ?? undefined,
    hasProjector: Boolean(raw.hasProjector),
    hasAudioSystem: Boolean(raw.hasAudioSystem),
    recurrence: raw.recurrence === "weekly" ? "weekly" : "once",
  }

  return booking
}

/** Intenta importar datos de claves viejas si existieran */
function importLegacy(): Booking[] {
  if (!hasLS()) return []
  const keys = ["mvp_reservas", "bookings", "reservas"]
  for (const k of keys) {
    const txt = localStorage.getItem(k)
    if (!txt) continue
    try {
      const arr = JSON.parse(txt)
      const list = (Array.isArray(arr) ? arr : []).map(reviveBooking).filter(Boolean) as Booking[]
      if (list.length) {
        // guarda en la nueva clave y limpia la vieja
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(list)))
        localStorage.removeItem(k)
        return list
      }
    } catch {
      // ignora
    }
  }
  return []
}

/** Convierte Booking[] a JSON serializable (fechas en ISO) */
function serialize(list: Booking[]) {
  return list.map(b => ({
    ...b,
    startTime: b.startTime.toISOString(),
    endTime: b.endTime.toISOString(),
  }))
}

/* ==================== API pública ==================== */

export function loadBookings(): Booking[] {
  if (!hasLS()) return []
  const txt = localStorage.getItem(STORAGE_KEY)
  if (!txt) {
    // intentar migrar de claves anteriores
    const legacy = importLegacy()
    return legacy
  }
  try {
    const arr = JSON.parse(txt)
    return (Array.isArray(arr) ? arr : []).map(reviveBooking).filter(Boolean) as Booking[]
  } catch {
    return []
  }
}

export function saveBookings(list: Booking[]) {
  if (!hasLS()) return
  const json = JSON.stringify(serialize(list))
  // escritura “segura”
  const tmp = STORAGE_KEY + "__tmp"
  localStorage.setItem(tmp, json)
  localStorage.removeItem(STORAGE_KEY)
  localStorage.setItem(STORAGE_KEY, json)
  localStorage.removeItem(tmp)
}

export function getBooking(id: string): Booking | null {
  const all = loadBookings()
  return all.find(b => b.id === id) ?? null
}

export function upsertBooking(b: Booking) {
  const all = loadBookings()
  const idx = all.findIndex(x => x.id === b.id)
  if (idx >= 0) all[idx] = b
  else all.push(b)
  saveBookings(all)
}

export function replaceBooking(id: string, patch: Partial<Booking>): Booking[] {
  const all = loadBookings()
  const idx = all.findIndex(b => b.id === id)
  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      ...patch,
      // si el patch trae strings ISO, conviértelos a Date
      startTime: patch.startTime ? new Date(patch.startTime) : all[idx].startTime,
      endTime: patch.endTime ? new Date(patch.endTime) : all[idx].endTime,
    }
    saveBookings(all)
  }
  return all
}

export function deleteBooking(id: string) {
  const all = loadBookings().filter(b => b.id !== id)
  saveBookings(all)
}

export function clearBookings() {
  if (!hasLS()) return
  localStorage.removeItem(STORAGE_KEY)
}
