"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react"
import type { Booking } from "@/types/booking"
import { TIME_BLOCKS } from "@/types/booking"

/* ================== Tipos de props ================== */
type Props = {
  bookings: Booking[]
  onSlotClick: (date: Date, time: string) => void
  onReschedule: (bookingId: string, newStart: Date, newEnd: Date) => boolean
  onDeleteBooking: (bookingId: string, deleteAllWeekly?: boolean) => void
  viewMode: "week" | "month"
}

/* ================== Helpers de fechas ================== */
const todayAt0 = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const hhmm = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`

const parseHHMM = (s: string): [number, number] => {
  const [h, m] = s.split(":").map(Number)
  return [h || 0, m || 0]
}
const withTime = (base: Date, time: string) => {
  const [h, m] = parseHHMM(time)
  const d = new Date(base)
  d.setHours(h, m, 0, 0)
  return d
}

const startOfWeek = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay() === 0 ? 7 : d.getDay() // 1..7 (Lun..Dom)
  d.setDate(d.getDate() - (day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}
const addDays = (d: Date, days: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const startOfMonthGrid = (date: Date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstWeekDay = first.getDay() === 0 ? 7 : first.getDay() // 1..7
  return addDays(first, -(firstWeekDay - 1))
}
const monthGridDays = (cursor: Date) => {
  const start = startOfMonthGrid(cursor)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i)) // 6x7
}

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

/* ========== Colores consistentes (leyenda/filtros/eventos) ========== */
const typeStyle = (t: Booking["type"]) => {
  switch (t) {
    case "class":     return { chip: "bg-blue-500/15 border-blue-500/30",    dot: "bg-blue-500" }
    case "lab":       return { chip: "bg-amber-500/15 border-amber-500/30",  dot: "bg-amber-500" }
    case "ayudantia": return { chip: "bg-emerald-500/15 border-emerald-500/30", dot: "bg-emerald-500" }
    case "seminar":   return { chip: "bg-purple-500/15 border-purple-500/30",  dot: "bg-purple-500" }
    case "certamen":  return { chip: "bg-rose-500/15 border-rose-500/30",      dot: "bg-rose-500" }
    case "evento":    return { chip: "bg-muted border-border",                dot: "bg-muted-foreground" }
    default:          return { chip: "bg-muted border-border",                dot: "bg-muted-foreground" }
  }
}

/* ================== Componente principal ================== */
export function CalendarView({
  bookings,
  onSlotClick,
  onReschedule,
  onDeleteBooking,
  viewMode,
}: Props) {
  const [cursorDate, setCursorDate] = useState<Date>(() => todayAt0())

  const weekStart = useMemo(() => startOfWeek(cursorDate), [cursorDate])
  const weekDays  = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])
  const monthDays = useMemo(() => monthGridDays(cursorDate), [cursorDate])

  const goPrev  = () => setCursorDate(viewMode === "week" ? addDays(cursorDate, -7) : new Date(cursorDate.getFullYear(), cursorDate.getMonth() - 1, 1))
  const goNext  = () => setCursorDate(viewMode === "week" ? addDays(cursorDate, 7)  : new Date(cursorDate.getFullYear(), cursorDate.getMonth() + 1, 1))
  const goToday = () => setCursorDate(todayAt0())

  const eventsOfDay = (date: Date) =>
    bookings
      .filter((b) => isSameDay(b.startTime, date))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  const blockByStart = useMemo(() => {
    const map = new Map<string, (typeof TIME_BLOCKS)[number]>()
    TIME_BLOCKS.forEach((b) => map.set(b.startTime, b))
    return map
  }, [])

  return (
    <div className="space-y-4">
      {/* barra de navegación */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrev}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={goToday} className="gap-1">
            <CalendarIcon className="h-4 w-4" /> Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={goNext}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {viewMode === "week"
            ? <>Semana del <strong>{weekStart.toLocaleDateString()} – {addDays(weekStart, 6).toLocaleDateString()}</strong></>
            : <><strong>{cursorDate.toLocaleString(undefined, { month: "long" })} {cursorDate.getFullYear()}</strong></>}
        </div>
      </div>

      {viewMode === "week" ? (
        <WeekView
          weekDays={weekDays}
          bookings={bookings}
          onSlotClick={onSlotClick}
          onDeleteBooking={onDeleteBooking}
          blockByStart={blockByStart}
        />
      ) : (
        <MonthView
          monthDays={monthDays}
          cursorDate={cursorDate}
          eventsOfDay={eventsOfDay}
          onSlotClick={onSlotClick}
          onReschedule={onReschedule}
          onDeleteBooking={onDeleteBooking}
        />
      )}
    </div>
  )
}

/* =================== VISTA SEMANAL =================== */
function WeekView({
  weekDays,
  bookings,
  onSlotClick,
  onDeleteBooking,
  blockByStart,
}: {
  weekDays: Date[]
  bookings: Booking[]
  onSlotClick: (date: Date, time: string) => void
  onDeleteBooking: (id: string, allWeekly?: boolean) => void
  blockByStart: Map<string, (typeof TIME_BLOCKS)[number]>
}) {
  const byDayBlock = useMemo(() => {
    const m = new Map<string, Booking[]>()
    for (const b of bookings) {
      const key = `${b.startTime.getFullYear()}-${b.startTime.getMonth()}-${b.startTime.getDate()}::${hhmm(b.startTime)}`
      if (!m.has(key)) m.set(key, [])
      m.get(key)!.push(b)
    }
    return m
  }, [bookings])

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="w-32 p-2 text-left">Bloque</th>
            {weekDays.map((d) => (
              <th key={d.toDateString()} className="p-2 text-left">
                <div className="font-medium">
                  {dayNames[(d.getDay() + 6) % 7]} {d.getDate()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {d.toLocaleString(undefined, { month: "short" })}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_BLOCKS.map((block) => (
            <tr key={block.id} className="border-t">
              <td className="p-2 align-top">
                <div className="font-medium">{block.label}</div>
                <div className="text-xs text-muted-foreground">{block.startTime}</div>
              </td>

              {weekDays.map((day) => {
                const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}::${block.startTime}`
                const events = byDayBlock.get(key) ?? []
                const isEmpty = events.length === 0

                return (
                  <td key={key} className="p-1 align-top">
                    {isEmpty ? (
                      <button
                        type="button"
                        className="w-full rounded border border-dashed p-6 text-center text-muted-foreground hover:bg-muted"
                        onClick={() => onSlotClick(day, block.startTime)}
                        aria-label={`Crear reserva el ${day.toLocaleDateString()} a las ${block.startTime}`}
                      >
                        + Crear
                      </button>
                    ) : (
                      <div className="space-y-1">
                        {events.map((ev) => {
                          const st = hhmm(ev.startTime)
                          const et = hhmm(ev.endTime)
                          const color = typeStyle(ev.type).chip
                          return (
                            <div key={ev.id} className={`rounded-md border ${color} p-2`}>
                              <div className="font-medium leading-tight">{st}–{et} · {ev.title}</div>
                              <div className="text-xs text-muted-foreground leading-tight">{ev.building}-{ev.room}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                <button
                                  className="hover:text-destructive"
                                  onClick={() => onDeleteBooking(ev.id, ev.recurrence === "weekly")}
                                  title={ev.recurrence === "weekly" ? "Eliminar serie" : "Eliminar"}
                                >
                                  Eliminar{ev.recurrence === "weekly" ? " serie" : ""}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* =================== VISTA MENSUAL =================== */
function MonthView({
  monthDays,
  cursorDate,
  eventsOfDay,
  onSlotClick,
  onReschedule,
  onDeleteBooking,
}: {
  monthDays: Date[]
  cursorDate: Date
  eventsOfDay: (d: Date) => Booking[]
  onSlotClick: (date: Date, time: string) => void
  onReschedule: (bookingId: string, newStart: Date, newEnd: Date) => boolean
  onDeleteBooking: (bookingId: string, deleteAllWeekly?: boolean) => void
}) {
  const month = cursorDate.getMonth()

  // bloques seleccionables (si no quieres crear en almuerzo, filtra aquí)
  const selectableBlocks = TIME_BLOCKS // .filter(b => !b.isLunch)

  return (
    <div className="space-y-2">
      {/* cabecera días */}
      <div className="grid grid-cols-7 text-xs text-muted-foreground px-1">
        {dayNames.map((n) => (<div key={n} className="p-2">{n}</div>))}
      </div>

      {/* grilla 7x6 */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((dayDate) => {
          const isCurrentMonth = dayDate.getMonth() === month
          const isToday = isSameDay(dayDate, todayAt0())
          const events = eventsOfDay(dayDate)

          return (
            <div
              key={dayDate.toISOString()}
              className={`min-h-28 rounded-md border p-1 ${isCurrentMonth ? "" : "opacity-50"} ${isToday ? "ring-1 ring-primary" : ""}`}
            >
              {/* Crear nueva reserva desde el día (elige bloque) */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left rounded-md px-2 py-1 hover:bg-muted focus:outline-none focus:ring"
                    aria-label={`Crear reserva el ${dayDate.toLocaleDateString()}`}
                  >
                    <span className="text-sm font-medium">{dayDate.getDate()}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-2 space-y-1 w-56" align="start">
                  {selectableBlocks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className="w-full text-left rounded px-2 py-1 hover:bg-accent"
                      onClick={() => onSlotClick(dayDate, b.startTime)}
                    >
                      {b.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              {/* eventos del día */}
              <div className="mt-1 space-y-1">
                {events.map((ev) => {
                  const st = hhmm(ev.startTime)
                  const color = typeStyle(ev.type).chip

                  /* ======= SNIPPET INTEGRADO (badge “⟲ serie”) ======= */
                  return (
                    <div key={ev.id} className={`rounded border ${color} px-2 py-1 text-xs`}>
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {st} · {ev.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {ev.building}-{ev.room}
                          </div>
                        </div>
                        {ev.recurrence === "weekly" && (
                          <span title="Reserva repetitiva" className="text-[10px] px-1 rounded bg-foreground/10">
                            ⟲ serie
                          </span>
                        )}
                      </div>
                      {/* ... resto del popover de acciones si lo tienes */}
                      {/* ======= Acciones: editar bloque / eliminar ======= */}
                      <div className="mt-1 flex justify-end">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-muted"
                              aria-label="Acciones"
                              title="Acciones"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="p-2 space-y-2 w-60" align="end">
                            <div className="text-xs font-medium text-muted-foreground px-1">Editar bloque</div>
                            <div className="grid grid-cols-2 gap-1">
                              {selectableBlocks.map((b) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  className="text-left rounded px-2 py-1 hover:bg-accent"
                                  onClick={() => {
                                    const newStart = withTime(ev.startTime, b.startTime)
                                    const newEnd   = withTime(ev.startTime, b.endTime)
                                    onReschedule(ev.id, newStart, newEnd)
                                  }}
                                >
                                  {b.label}
                                </button>
                              ))}
                            </div>

                            <div className="h-px bg-border my-1" />

                            <button
                              type="button"
                              className="w-full text-left rounded px-2 py-1 hover:bg-accent"
                              onClick={() => onDeleteBooking(ev.id, false)}
                            >
                              Eliminar
                            </button>

                            {ev.recurrence === "weekly" && (
                              <button
                                type="button"
                                className="w-full text-left rounded px-2 py-1 hover:bg-accent text-destructive"
                                onClick={() => onDeleteBooking(ev.id, true)}
                              >
                                Eliminar serie
                              </button>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
