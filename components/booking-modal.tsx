"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Calendar, User, Users, Repeat, Volume2, Projector, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Booking } from "@/types/booking"
import { TIME_BLOCKS, AVAILABLE_ROOMS } from "@/types/booking"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (booking: Omit<Booking, "id">) => boolean
  selectedSlot: { date: Date; time: string } | null
  conflicts: Booking[]
}

export function BookingModal({ isOpen, onClose, onSubmit, selectedSlot, conflicts }: BookingModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "class" as Booking["type"],
    room: "",
    instructor: "",
    date: "",
    timeBlock: "",
    participants: 0,
    tableType: "",
    roomType: "",
    requiresProjector: false,
    requiresAudioSystem: false,
    recurrence: "once" as "once" | "weekly",
  })

  useEffect(() => {
    if (selectedSlot) {
      const year = selectedSlot.date.getFullYear()
      const month = String(selectedSlot.date.getMonth() + 1).padStart(2, "0")
      const day = String(selectedSlot.date.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`

      const matchingBlock = TIME_BLOCKS.find((block) => block.startTime === selectedSlot.time)

      setFormData((prev) => ({
        ...prev,
        date: dateStr,
        timeBlock: matchingBlock ? matchingBlock.id.toString() : "",
      }))
    }
  }, [selectedSlot])

  const availableRooms = useMemo(() => {
    return AVAILABLE_ROOMS.filter((room) => {
      // Verificar capacidad
      if (formData.participants > 0 && room.capacity < formData.participants) {
        return false
      }
      // Verificar proyector
      if (formData.requiresProjector && !room.hasProjector) {
        return false
      }
      // Verificar sistema de audio
      if (formData.requiresAudioSystem && !room.hasAudioSystem) {
        return false
      }
      // Verificar tipo de mesas
      if (formData.tableType && formData.tableType !== "" && room.tableType !== formData.tableType) {
        return false
      }
      // Verificar tipo de sala
      if (formData.roomType && formData.roomType !== "" && room.roomType !== formData.roomType) {
        return false
      }
      return true
    })
  }, [
    formData.participants,
    formData.requiresProjector,
    formData.requiresAudioSystem,
    formData.tableType,
    formData.roomType,
  ])

  const selectedRoomInfo = useMemo(() => {
    return AVAILABLE_ROOMS.find((room) => room.name === formData.room)
  }, [formData.room])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedBlock = TIME_BLOCKS.find((block) => block.id.toString() === formData.timeBlock)
    if (!selectedBlock || !selectedRoomInfo) return

    const [year, month, day] = formData.date.split("-").map(Number)
    const [startHours, startMinutes] = selectedBlock.startTime.split(":").map(Number)
    const [endHours, endMinutes] = selectedBlock.endTime.split(":").map(Number)

    const startDate = new Date(year, month - 1, day, startHours, startMinutes, 0, 0)
    const endDate = new Date(year, month - 1, day, endHours, endMinutes, 0, 0)

    const booking: Omit<Booking, "id"> = {
      title: formData.title,
      type: formData.type,
      room: formData.room,
      building: selectedRoomInfo.building,
      instructor: formData.instructor,
      startTime: startDate,
      endTime: endDate,
      participants: formData.participants,
      tableType: formData.tableType,
      roomType: formData.roomType,
      hasProjector: selectedRoomInfo.hasProjector,
      hasAudioSystem: selectedRoomInfo.hasAudioSystem,
      recurrence: formData.recurrence,
    }

    const success = onSubmit(booking)
    if (success) {
      setFormData({
        title: "",
        type: "class",
        room: "",
        instructor: "",
        date: "",
        timeBlock: "",
        participants: 0,
        tableType: "",
        roomType: "",
        requiresProjector: false,
        requiresAudioSystem: false,
        recurrence: "once",
      })
    }
  }

  const availableBlocks = TIME_BLOCKS.filter((block) => !block.isLunch)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nueva Reserva</DialogTitle>
          <DialogDescription>
            Complete los detalles de la reserva. El sistema detectará automáticamente conflictos de horarios.
          </DialogDescription>
        </DialogHeader>

        {conflicts.length > 0 && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <div className="font-semibold mb-2">¡Conflicto de horarios detectado!</div>
              <div className="space-y-2">
                {conflicts.map((conflict) => (
                  <div key={conflict.id} className="text-sm bg-background/50 p-2 rounded">
                    <div className="font-medium">{conflict.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Edificio {conflict.building} - {conflict.room} • {conflict.instructor} •
                      {conflict.startTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} -
                      {conflict.endTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm">
                Por favor, seleccione otro horario, sala o instructor para evitar el conflicto.
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title" className="text-foreground">
                Título de la Actividad *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Clase de Matemáticas Avanzadas"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-foreground">
                Tipo de Actividad *
              </Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Clase</SelectItem>
                  <SelectItem value="lab">Laboratorio</SelectItem>
                  <SelectItem value="ayudantia">Ayudantía</SelectItem>
                  <SelectItem value="seminar">Seminario</SelectItem>
                  <SelectItem value="certamen">Certamen</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instructor" className="text-foreground">
                Instructor/Profesor *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Ej: Prof. García"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="participants" className="text-foreground">
                Número de Participantes *
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="participants"
                  type="number"
                  value={formData.participants || ""}
                  onChange={(e) => setFormData({ ...formData, participants: Number.parseInt(e.target.value) || 0 })}
                  placeholder="25"
                  className="pl-9"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date" className="text-foreground">
                Fecha *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <Label htmlFor="timeBlock" className="text-foreground">
                Bloque Horario *
              </Label>
              <Select
                value={formData.timeBlock}
                onValueChange={(value) => setFormData({ ...formData, timeBlock: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar bloque horario" />
                </SelectTrigger>
                <SelectContent>
                  {availableBlocks.map((block) => (
                    <SelectItem key={block.id} value={block.id.toString()}>
                      {block.label} ({block.startTime} - {block.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-3 p-4 bg-muted/30 rounded-lg">
              <Label className="text-foreground font-semibold">Requisitos de la Sala</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresProjector}
                    onChange={(e) => setFormData({ ...formData, requiresProjector: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Projector className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Requiere Proyector</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresAudioSystem}
                    onChange={(e) => setFormData({ ...formData, requiresAudioSystem: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Requiere Sistema de Audio</span>
                </label>
              </div>
            </div>

            <div className="col-span-2">
              <Label htmlFor="room" className="text-foreground">
                Sala *
              </Label>
              <Select
                value={formData.room}
                onValueChange={(value) => setFormData({ ...formData, room: value })}
                disabled={formData.participants === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Primero ingrese el número de participantes" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No hay salas disponibles con los requisitos seleccionados
                    </div>
                  ) : (
                    availableRooms.map((room) => (
                      <SelectItem key={room.name} value={room.name}>
                        <div className="flex flex-col gap-1 py-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium">{room.name}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Edificio {room.building}</span>
                              <span>•</span>
                              <span>Cap: {room.capacity}</span>
                              {room.hasProjector && <Projector className="h-3 w-3" />}
                              {room.hasAudioSystem && <Volume2 className="h-3 w-3" />}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">
                              {room.roomType === "sala-estudio" ? "Sala de estudio" : room.roomType}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              Mesas {room.tableType === "auditorio" ? "tipo auditorio" : `${room.tableType}es`}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedRoomInfo && (
                <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Información de la sala:</div>
                      <div className="text-muted-foreground mt-1 space-y-1">
                        <div>
                          • Tipo:{" "}
                          {selectedRoomInfo.roomType === "sala-estudio"
                            ? "Sala de estudio"
                            : selectedRoomInfo.roomType.charAt(0).toUpperCase() + selectedRoomInfo.roomType.slice(1)}
                        </div>
                        <div>
                          • Mesas:{" "}
                          {selectedRoomInfo.tableType === "auditorio"
                            ? "Tipo auditorio"
                            : `${selectedRoomInfo.tableType.charAt(0).toUpperCase() + selectedRoomInfo.tableType.slice(1)}es`}
                        </div>
                        <div>• Edificio {selectedRoomInfo.building}</div>
                        <div>• Capacidad máxima: {selectedRoomInfo.capacity} personas</div>
                        <div>• Proyector: {selectedRoomInfo.hasProjector ? "Sí" : "No"}</div>
                        <div>• Sistema de audio: {selectedRoomInfo.hasAudioSystem ? "Sí" : "No"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="tableType" className="text-foreground">
                Tipo de Mesas
              </Label>
              <Select
                value={formData.tableType}
                onValueChange={(value) => setFormData({ ...formData, tableType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Mesas individuales</SelectItem>
                  <SelectItem value="grupal">Mesas grupales</SelectItem>
                  <SelectItem value="auditorio">Tipo auditorio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="roomType" className="text-foreground">
                Tipo de Sala
              </Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData({ ...formData, roomType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aula">Aula</SelectItem>
                  <SelectItem value="laboratorio">Laboratorio</SelectItem>
                  <SelectItem value="sala-estudio">Sala de estudio</SelectItem>
                  <SelectItem value="auditorio">Auditorio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="recurrence" className="text-foreground">
                Periodicidad *
              </Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value: any) => setFormData({ ...formData, recurrence: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Una sola ocasión</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="weekly">
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      <span>Semanalmente (repetir cada semana)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={conflicts.length > 0 || !formData.room}>
              {conflicts.length > 0 ? "Resolver Conflictos" : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
