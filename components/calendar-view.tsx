"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Building2, Trash2 } from "lucide-react"
import type { Booking } from "@/types/booking"
import { TIME_BLOCKS } from "@/types/booking"

interface CalendarViewProps {
  bookings: Booking[]
  onSlotClick: (date: Date, time: string) => void
  onReschedule: (bookingId: string, newStartTime: Date, newEndTime: Date) => boolean
  onDeleteBooking: (bookingId: string, deleteAllWeekly?: boolean) => void
  viewMode: "week" | "month"
}

const getTypeColor = (type: string) => {
  const colors = {
    class: "bg-primary/20 border-primary text-foreground",
    lab: "bg-info/20 border-info text-foreground",
    ayudantia: "bg-success/20 border-success text-foreground",
    seminar: "bg-warning/20 border-warning text-foreground",
    certamen: "bg-destructive/20 border-destructive text-foreground",
    evento: "bg-purple/20 border-purple text-foreground",
  }
  return colors[type as keyof typeof colors] || "bg-muted border-border"
}

export function CalendarView({ bookings, onSlotClick, onReschedule, onDeleteBooking, viewMode }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 30))
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  })

  const getWeekDays = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay() + 1)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return day
    })
  }

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    return Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1)
    })
  }

  const weekDays = getWeekDays(currentDate)
  const monthDays = getMonthDays(currentDate)

  const getBookingsForSlot = (date: Date, startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)

    const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes, 0, 0)
    const slotEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes, 0, 0)

    return bookings.filter((booking) => {
      const bookingStart = booking.startTime.getTime()
      const bookingEnd = booking.endTime.getTime()
      const slotStartTime = slotStart.getTime()
      const slotEndTime = slotEnd.getTime()

      return (
        (bookingStart >= slotStartTime && bookingStart < slotEndTime) ||
        (bookingEnd > slotStartTime && bookingEnd <= slotEndTime) ||
        (bookingStart <= slotStartTime && bookingEnd >= slotEndTime)
      )
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const handleDeleteClick = (booking: Booking) => {
    if (booking.recurrence === "weekly") {
      setDeleteDialog({ open: true, booking })
    } else {
      onDeleteBooking(booking.id)
    }
  }

  const handleConfirmDelete = (deleteAll: boolean) => {
    if (deleteDialog.booking) {
      onDeleteBooking(deleteDialog.booking.id, deleteAll)
      setDeleteDialog({ open: false, booking: null })
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "short" })
  }

  return (
    <>
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {viewMode === "week"
                ? `${weekDays[0].toLocaleDateString("es-ES", { day: "numeric", month: "short" })} - ${weekDays[6].toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`
                : "Vista mensual"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => (viewMode === "week" ? navigateWeek("prev") : navigateMonth("prev"))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Hoy
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => (viewMode === "week" ? navigateWeek("next") : navigateMonth("next"))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            {viewMode === "week" ? (
              <div className="grid grid-cols-8 gap-3 mb-3">
                <div className="text-sm font-medium text-muted-foreground p-3">Hora</div>
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-semibold text-foreground">{formatDayName(day)}</div>
                    <div
                      className={`text-xs mt-1 ${
                        day.toDateString() === new Date().toDateString()
                          ? "text-primary font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatDate(day)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 mb-3">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                  <div key={day} className="text-center p-2 text-sm font-semibold text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* Time Slots */}
            {viewMode === "week" ? (
              <div className="space-y-3">
                {TIME_BLOCKS.map((slot) => (
                  <div key={slot.id} className="grid grid-cols-8 gap-3">
                    <div className="text-xs font-medium p-3 flex flex-col justify-start bg-muted/20 rounded-lg">
                      <span className="font-semibold text-foreground text-sm">{slot.label}</span>
                      <span className="text-[11px] mt-1 text-muted-foreground">{slot.startTime}</span>
                      <span className="text-[11px] text-muted-foreground">{slot.endTime}</span>
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const slotBookings = getBookingsForSlot(day, slot.startTime, slot.endTime)
                      const hasBookings = slotBookings.length > 0
                      const isLunchTime = slot.isLunch

                      return (
                        <div
                          key={dayIndex}
                          onClick={() => !hasBookings && !isLunchTime && onSlotClick(day, slot.startTime)}
                          className={`min-h-[90px] p-2 rounded-lg border transition-all ${
                            isLunchTime
                              ? "bg-muted/30 border-border cursor-not-allowed opacity-50"
                              : hasBookings
                                ? "bg-muted/50 border-border cursor-default"
                                : "bg-card border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
                          }`}
                        >
                          {isLunchTime && (
                            <div className="text-xs text-muted-foreground text-center py-6">Horario de almuerzo</div>
                          )}
                          {slotBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className={`p-2 rounded-md border-l-4 ${getTypeColor(booking.type)} mb-1 text-xs relative group`}
                            >
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteClick(booking)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>

                              <div className="font-semibold mb-1 text-foreground pr-8">{booking.title}</div>
                              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {booking.startTime.toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{booking.endTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                <Building2 className="h-3 w-3" />
                                <span>Edificio {booking.building}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{booking.room}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{booking.instructor}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: (monthDays[0].getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] p-2 rounded-lg bg-muted/20" />
                ))}
                {/* Days of the month */}
                {monthDays.map((day) => {
                  const dayBookings = bookings.filter((booking) => {
                    return (
                      booking.startTime.getDate() === day.getDate() &&
                      booking.startTime.getMonth() === day.getMonth() &&
                      booking.startTime.getFullYear() === day.getFullYear()
                    )
                  })
                  const isToday = day.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[100px] p-2 rounded-lg border transition-all ${
                        isToday
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className={`text-sm font-semibold mb-2 ${isToday ? "text-primary" : "text-foreground"}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayBookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className={`text-[10px] p-1 rounded border-l-2 ${getTypeColor(booking.type)} truncate relative group cursor-pointer hover:pr-6 transition-all`}
                            title={booking.title}
                          >
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-0.5 right-0.5 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(booking)
                              }}
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                            {booking.title}
                          </div>
                        ))}
                        {dayBookings.length > 3 && (
                          <div className="text-[10px] text-muted-foreground">+{dayBookings.length - 3} más</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Dialog for confirming deletion of weekly bookings */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, booking: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar reserva semanal</DialogTitle>
            <DialogDescription>Esta reserva se repite semanalmente. ¿Qué deseas eliminar?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => handleConfirmDelete(false)}>
              Solo esta reserva
            </Button>
            <Button variant="destructive" onClick={() => handleConfirmDelete(true)}>
              Todas las reservas semanales
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
