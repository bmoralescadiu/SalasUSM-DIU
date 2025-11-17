"use client"

import { Room } from "@/data/rooms"
import { Users, Projector, Speaker, MonitorCog, ClipboardList } from "lucide-react"

type Props = {
  room: Room
  participants: number
  onParticipantsChange?: (n: number) => void
  needs: { projector: boolean; audio: boolean }
  onNeedsChange?: (next: { projector: boolean; audio: boolean }) => void
}

export default function RoomDetails({ room, participants, onParticipantsChange, needs, onNeedsChange }: Props) {
  const pct = Math.min(100, Math.round((participants / room.capacity) * 100))

  const has = (k: Room["equipment"][number]) => room.equipment.includes(k)

  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{room.building} — {room.name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" /> Capacidad {room.capacity}
        </div>
      </div>

      {/* Barra de capacidad */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span>Capacidad utilizada</span>
          <span>{participants}/{room.capacity} ({pct}%)</span>
        </div>
        <div className="h-2 w-full rounded bg-muted overflow-hidden">
          <div
            className={`h-full ${pct < 80 ? "bg-emerald-500" : pct < 100 ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Equipamiento */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Chip active={has("projector")} icon={<Projector className="h-4 w-4" />} label="Proyector" />
        <Chip active={has("audio")}     icon={<Speaker className="h-4 w-4" />}   label="Audio" />
        <Chip active={has("pc")}        icon={<MonitorCog className="h-4 w-4" />} label="PCs" />
        <Chip active={has("whiteboard")} icon={<ClipboardList className="h-4 w-4" />} label="Pizarra" />
      </div>

      {/* Controles (participantes/necesidades) */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Participantes</label>
          <input
            type="number"
            min={1}
            max={room.capacity}
            value={participants}
            onChange={(e) => onParticipantsChange?.(Math.max(1, Math.min(room.capacity, Number(e.target.value) || 1)))}
            className="w-full rounded border bg-background p-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Necesidades</label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-2 py-1 rounded border text-xs ${needs.projector ? "bg-foreground text-background" : "hover:bg-muted"}`}
              onClick={() => onNeedsChange?.({ ...needs, projector: !needs.projector })}
            >
              Proyector
            </button>
            <button
              type="button"
              className={`px-2 py-1 rounded border text-xs ${needs.audio ? "bg-foreground text-background" : "hover:bg-muted"}`}
              onClick={() => onNeedsChange?.({ ...needs, audio: !needs.audio })}
            >
              Audio
            </button>
          </div>
        </div>
      </div>

      {/* Layout simple (mapa de asientos) */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Distribución (referencial)</div>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${room.layout.cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: room.layout.rows * room.layout.cols }, (_, i) => (
            <div key={i} className="h-3 rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chip({ active, icon, label }: { active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <div className={`flex items-center gap-2 rounded border px-2 py-1 ${active ? "bg-foreground text-background" : "bg-background"}`}>
      {icon}<span>{label}</span>
    </div>
  )
}
