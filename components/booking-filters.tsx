"use client"

import { useMemo } from "react"
import type { BookingFilters as Filters } from "@/types/booking"
import { TIME_BLOCKS } from "@/types/booking"
import { Button } from "@/components/ui/button"

type Props = {
  filters: Filters
  onFiltersChange: (f: Filters) => void
  viewMode: "week" | "month"
  onViewModeChange: (m: "week" | "month") => void
}

/* Colores coherentes con la leyenda */
const typeMeta: Record<
  NonNullable<Filters["activityType"]>,
  { label: string; dotClass: string }
> = {
  all:        { label: "Todas las actividades", dotClass: "bg-foreground" },
  class:      { label: "Clases",        dotClass: "bg-blue-500"    },
  lab:        { label: "Laboratorios",  dotClass: "bg-amber-500"   },
  ayudantia:  { label: "Ayudantías",    dotClass: "bg-emerald-500" },
  seminar:    { label: "Seminarios",    dotClass: "bg-purple-500"  },
  certamen:   { label: "Certámenes",    dotClass: "bg-rose-500"    },
  // si manejas "event" mantenemos violeta suave o ajusta a tu leyenda
  event:      { label: "Eventos",       dotClass: "bg-purple-500"  },
}

export function BookingFilters({ filters, onFiltersChange, viewMode, onViewModeChange }: Props) {
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch })

  const types = useMemo(() => ([
    "all", "class", "lab", "ayudantia", "seminar", "certamen", "event"
  ] as Array<NonNullable<Filters["activityType"]>>), [])

  return (
    <aside className="rounded-md border p-3 space-y-4">
      {/* Tipo de actividad (con puntos de color iguales a la leyenda) */}
      <section>
        <div className="text-sm font-medium mb-2">Tipo de Actividad</div>
        <div className="space-y-2">
          {types.map((t) => {
            const active = filters.activityType === t
            const meta = typeMeta[t]
            return (
              <button
                key={t}
                type="button"
                onClick={() => set({ activityType: t })}
                className={`w-full rounded-md px-3 py-2 text-left flex items-center gap-3 border ${active ? "bg-foreground text-background" : "bg-muted/50 hover:bg-muted"}`}
              >
                <span className={`inline-block h-3 w-3 rounded ${active ? "bg-background" : meta.dotClass}`} />
                <span className="text-sm">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Bloque horario */}
      <section>
        <div className="text-sm font-medium mb-2">Bloque horario</div>
        <select
          className="w-full rounded-md border bg-background p-2 text-sm"
          value={filters.timeBlock}
          onChange={(e) => set({ timeBlock: e.target.value })}
        >
          <option value="all">Todos</option>
          {TIME_BLOCKS.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.label}
            </option>
          ))}
        </select>
      </section>

      {/* Buscar */}
      <section>
        <div className="text-sm font-medium mb-2">Buscar</div>
        <input
          type="text"
          placeholder="Sala, docente, edificio…"
          value={filters.searchQuery}
          onChange={(e) => set({ searchQuery: e.target.value })}
          className="w-full rounded-md border bg-background p-2 text-sm"
        />
      </section>

      {/* Vista */}
      <section className="flex gap-2">
        <Button
          variant={viewMode === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("week")}
        >
          Semana
        </Button>
        <Button
          variant={viewMode === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("month")}
        >
          Mes
        </Button>
      </section>
    </aside>
  )
}
