"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Grid3x3, Table, DoorOpen, Projector, Volume2, Clock } from "lucide-react"
import type { BookingFilters as Filters } from "@/types/booking"
import { TIME_BLOCKS } from "@/types/booking"

interface BookingFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  viewMode: "week" | "month"
  onViewModeChange: (mode: "week" | "month") => void
}

const activityTypes = [
  { value: "all", label: "Todas las actividades", color: "bg-muted" },
  { value: "class", label: "Clases", color: "bg-primary" },
  { value: "lab", label: "Laboratorios", color: "bg-info" },
  { value: "ayudantia", label: "Ayudantías", color: "bg-success" },
  { value: "seminar", label: "Seminarios", color: "bg-warning" },
  { value: "certamen", label: "Certámenes", color: "bg-destructive" },
  { value: "evento", label: "Eventos", color: "bg-purple" },
]

const tableTypes = [
  { value: "all", label: "Todos los tipos" },
  { value: "individual", label: "Mesas individuales" },
  { value: "grupal", label: "Mesas grupales" },
  { value: "auditorio", label: "Tipo auditorio" },
]

const roomTypes = [
  { value: "all", label: "Todos los tipos" },
  { value: "aula", label: "Aula" },
  { value: "laboratorio", label: "Laboratorio" },
  { value: "sala-estudio", label: "Sala de estudio" },
  { value: "auditorio", label: "Auditorio" },
]

export function BookingFilters({ filters, onFiltersChange, viewMode, onViewModeChange }: BookingFiltersProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4 text-foreground">Filtros</h3>

        {/* View Mode - Movido arriba del botón Hoy */}
        <div className="mb-6">
          <Label className="text-foreground mb-3 block">Vista</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              onClick={() => onViewModeChange("week")}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Semanal
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              onClick={() => onViewModeChange("month")}
              className="gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              Mensual
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="search" className="text-foreground">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por título, profesor..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Activity Type */}
        <div className="space-y-3 mb-6">
          <Label className="text-foreground">Tipo de Actividad</Label>
          <div className="space-y-2">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onFiltersChange({ ...filters, activityType: type.value as any })}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  filters.activityType === type.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Horario */}
        <div className="space-y-3 mb-6">
          <Label className="text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horario
          </Label>
          <div className="space-y-2">
            <button
              onClick={() => onFiltersChange({ ...filters, timeBlock: "all" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.timeBlock === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Todos los horarios
            </button>
            {TIME_BLOCKS.filter((block) => !block.isLunch).map((block) => (
              <button
                key={block.id}
                onClick={() => onFiltersChange({ ...filters, timeBlock: block.id.toString() })}
                className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                  filters.timeBlock === block.id.toString()
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                <span>{block.label}</span>
                <span className="text-xs opacity-75">
                  {block.startTime} - {block.endTime}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Label className="text-foreground flex items-center gap-2">
            <Table className="h-4 w-4" />
            Tipo de Mesas
          </Label>
          <div className="space-y-2">
            {tableTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onFiltersChange({ ...filters, tableType: type.value as any })}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                  filters.tableType === type.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Label className="text-foreground flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            Tipo de Sala
          </Label>
          <div className="space-y-2">
            {roomTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onFiltersChange({ ...filters, roomType: type.value as any })}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                  filters.roomType === type.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Label className="text-foreground flex items-center gap-2">
            <Projector className="h-4 w-4" />
            Proyector
          </Label>
          <div className="space-y-2">
            <button
              onClick={() => onFiltersChange({ ...filters, hasProjector: "all" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.hasProjector === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Todas las salas
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, hasProjector: "yes" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.hasProjector === "yes"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Con proyector
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, hasProjector: "no" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.hasProjector === "no"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Sin proyector
            </button>
          </div>
        </div>

        {/* Sistema de Audio */}
        <div className="space-y-3 mb-6">
          <Label className="text-foreground flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Sistema de Audio
          </Label>
          <div className="space-y-2">
            <button
              onClick={() => onFiltersChange({ ...filters, hasAudioSystem: "all" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.hasAudioSystem === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Todas las salas
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, hasAudioSystem: "yes" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.hasAudioSystem === "yes"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Con sistema de audio
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, hasAudioSystem: "no" })}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                filters.hasAudioSystem === "no"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              }`}
            >
              Sin sistema de audio
            </button>
          </div>
        </div>
      </div>

      {/* Legend - Actualizando colores en la leyenda */}
      <div className="pt-6 border-t border-border">
        <Label className="text-foreground mb-3 block">Leyenda</Label>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-muted-foreground">Clases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-info" />
            <span className="text-muted-foreground">Laboratorios</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-muted-foreground">Ayudantías</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-muted-foreground">Seminarios</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">Certámenes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple" />
            <span className="text-muted-foreground">Eventos</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
