"use client"

import { useEffect, useMemo, useState } from "react"
import type { Booking } from "@/types/booking"
import { TIME_BLOCKS } from "@/types/booking"
import { ROOMS } from "@/data/rooms"              // rooms.ts que hiciste acorde a booking.ts
import { Button } from "@/components/ui/button"
import { X, Users } from "lucide-react"

// Si ya creaste el toggle de recurrencia, descomenta esta línea y usa <RecurrenceToggle/>
// import RecurrenceToggle from "@/components/recurrence-toggle"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (b: Omit<Booking, "id">) => boolean
  selectedSlot: { date: Date; time: string } | null
  conflicts: Booking[]
}

// utilidades
const parseHHMM = (s: string): [number, number] => {
  const [h, m] = s.split(":").map(Number)
  return [h || 0, m || 0]
}
const withTime = (base: Date, hhmm: string) => {
  const [h, m] = parseHHMM(hhmm)
  const d = new Date(base)
  d.setHours(h, m, 0, 0)
  return d
}

export function BookingModal({ isOpen, onClose, onSubmit, selectedSlot, conflicts }: Props) {
  if (!isOpen) return null

  const defaultDate = selectedSlot?.date ?? new Date()
  const defaultBlock = TIME_BLOCKS.find(b => b.startTime === selectedSlot?.time) ?? TIME_BLOCKS[0]

  // estado del formulario
  const [title, setTitle] = useState("")
  const [instructor, setInstructor] = useState("")
  const [activityType, setActivityType] = useState<Booking["type"]>("class")
  const [recurrence, setRecurrence] = useState<NonNullable<Booking["recurrence"]>>("once")

  // edificio/sala (coinciden con tu Room)
  const [building, setBuilding] = useState<Booking["building"]>(ROOMS[0]?.building ?? "A")
  const roomsOfBuilding = useMemo(() => ROOMS.filter(r => r.building === building), [building])
  const [roomName, setRoomName] = useState<string>(roomsOfBuilding[0]?.name ?? ROOMS[0]?.name ?? "Sala A101")

  // bloque horario
  const [blockId, setBlockId] = useState<number>(defaultBlock.id)

  // capacidad/prestaciones
  const [participants, setParticipants] = useState<number>(10)
  const [needs, setNeeds] = useState<{ projector: boolean; audio: boolean }>({ projector: true, audio: false })

  // sincroniza bloque al abrir con el slot elegido
  useEffect(() => {
    if (selectedSlot?.time) {
      const b = TIME_BLOCKS.find(bb => bb.startTime === selectedSlot.time)
      if (b) setBlockId(b.id)
    }
  }, [selectedSlot])

  // cuando cambia edificio, aseguro una sala válida
  useEffect(() => {
    if (!roomsOfBuilding.find(r => r.name === roomName)) {
      setRoomName(roomsOfBuilding[0]?.name ?? roomName)
    }
  }, [building]) // eslint-disable-line

  const room = useMemo(() => ROOMS.find(r => r.name === roomName), [roomName])

  // arma start/end según TIME_BLOCKS (usa endTime de tu tipo)
  const block = TIME_BLOCKS.find(b => b.id === blockId) ?? TIME_BLOCKS[0]
  const startTime = withTime(defaultDate, block.startTime)
  const endTime   = withTime(defaultDate, block.endTime)

  // VALIDACIONES usando hasProjector / hasAudioSystem
  const validCapacity   = room ? participants <= room.capacity : true
  const validProjector  = !needs.projector || (room ? room.hasProjector : true)
  const validAudio      = !needs.audio     || (room ? room.hasAudioSystem : true)

  const canSave =
    title.trim().length > 0 &&
    !!room &&
    validCapacity &&
    validProjector &&
    validAudio

  const handleSubmit = () => {
    if (!room || !canSave) return
    const payload: Omit<Booking, "id"> = {
      title: title.trim(),
      type: activityType,
      room: room.name,
      building: room.building,
      instructor: instructor.trim() || "—",
      startTime,
      endTime,
      participants,
      tableType: room.tableType,
      roomType: room.roomType,
      hasProjector: room.hasProjector,
      hasAudioSystem: room.hasAudioSystem,
      recurrence,
    }
    const ok = onSubmit(payload)
    if (ok) onClose()
  }

  const buildings = Array.from(new Set(ROOMS.map(r => r.building))) as Booking["building"][]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4">
      <div className="w-full max-w-2xl rounded-md border bg-background shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="space-y-0.5">
            <div className="text-lg font-semibold">Nueva reserva</div>
            <div className="text-xs text-muted-foreground">
              {recurrence === "once" ? "Reserva esporádica" : "Reserva repetitiva (semanal)"} ·{" "}
              {defaultDate.toLocaleDateString()} · {block.label}
            </div>
          </div>
          <button className="p-1 rounded hover:bg-muted" onClick={onClose} aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* body */}
        <div className="p-4 space-y-4">
          {/* Tipo de reserva (inline para evitar dependencias) */}
          <section className="space-y-2">
            <label className="text-sm font-medium">Tipo de reserva</label>
            <div className="inline-flex rounded-md border overflow-hidden">
              <button
                type="button"
                className={`px-3 py-2 text-sm ${recurrence === "once" ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
                onClick={() => setRecurrence("once")}
              >
                Esporádica
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm ${recurrence === "weekly" ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
                onClick={() => setRecurrence("weekly")}
              >
                Repetitiva (semanal)
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {recurrence === "once"
                ? "Se crea solo para la fecha y bloque seleccionados."
                : "Se crean instancias semanales del mismo día y bloque."}
            </p>
          </section>

          {/* Datos básicos */}
          <section className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm">Título</label>
              <input
                className="w-full rounded border bg-background p-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Docente/Responsable</label>
              <input
                className="w-full rounded border bg-background p-2 text-sm"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm">Tipo de actividad</label>
              <select
                className="w-full rounded border bg-background p-2 text-sm"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as Booking["type"])}
              >
                <option value="class">Clase</option>
                <option value="lab">Laboratorio</option>
                <option value="ayudantia">Ayudantía</option>
                <option value="seminar">Seminario</option>
                <option value="certamen">Certamen</option>
                <option value="evento">Evento</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm">Bloque horario</label>
              <select
                className="w-full rounded border bg-background p-2 text-sm"
                value={String(blockId)}
                onChange={(e) => setBlockId(Number(e.target.value))}
              >
                {TIME_BLOCKS.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.label} ({b.startTime}–{b.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm">Edificio</label>
              <select
                className="w-full rounded border bg-background p-2 text-sm"
                value={building}
                onChange={(e) => setBuilding(e.target.value as Booking["building"])}
              >
                {buildings.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm">Sala</label>
              <select
                className="w-full rounded border bg-background p-2 text-sm"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              >
                {roomsOfBuilding.map(r => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Capacidad y prestaciones (visual simple y 100% acorde a tus tipos) */}
          {room && (
            <section className="rounded-md border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{room.building} — {room.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Capacidad {room.capacity}
                </div>
              </div>

              {/* barra capacidad */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Capacidad utilizada</span>
                  <span>{participants}/{room.capacity} ({Math.min(100, Math.round((participants / room.capacity) * 100))}%)</span>
                </div>
                <div className="h-2 w-full rounded bg-muted overflow-hidden">
                  <div
                    className={`h-full ${
                      participants <= room.capacity * 0.8 ? "bg-emerald-500"
                      : participants <= room.capacity ? "bg-amber-500"
                      : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.round((participants / room.capacity) * 100))}%` }}
                  />
                </div>
              </div>

              {/* controles de participantes y necesidades */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Participantes</label>
                  <input
                    type="number"
                    min={1}
                    value={participants}
                    onChange={(e) => setParticipants(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded border bg-background p-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Necesidades</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-2 py-1 rounded border text-xs ${needs.projector ? "bg-foreground text-background" : "hover:bg-muted"}`}
                      onClick={() => setNeeds(prev => ({ ...prev, projector: !prev.projector }))}
                    >
                      Proyector {room.hasProjector ? "" : "(no disponible)"}
                    </button>
                    <button
                      type="button"
                      className={`px-2 py-1 rounded border text-xs ${needs.audio ? "bg-foreground text-background" : "hover:bg-muted"}`}
                      onClick={() => setNeeds(prev => ({ ...prev, audio: !prev.audio }))}
                    >
                      Audio {room.hasAudioSystem ? "" : "(no disponible)"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* mensajes de validación */}
          <section className="text-xs space-y-1">
            {!validCapacity   && <p className="text-rose-600">⚠️ Participantes exceden la capacidad de la sala.</p>}
            {!validProjector  && <p className="text-rose-600">⚠️ Se requiere proyector, pero la sala no dispone.</p>}
            {!validAudio      && <p className="text-rose-600">⚠️ Se requiere audio, pero la sala no dispone.</p>}
            {conflicts.length > 0 && <p className="text-rose-600">⚠️ Existen conflictos de horario con otras reservas.</p>}
          </section>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-2 p-3 border-t">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!canSave}>
            Guardar {recurrence === "weekly" ? "(serie semanal)" : ""}
          </Button>
        </div>
      </div>
    </div>
  )
}
