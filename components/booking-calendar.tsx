"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarView } from "@/components/calendar-view"
import { BookingFilters } from "@/components/booking-filters"
import { BookingModal } from "@/components/booking-modal"
import { ConflictAlert } from "@/components/conflict-alert"
import { Calendar } from "lucide-react"
import type { Booking, BookingFilters as Filters } from "@/types/booking"
import { TIME_BLOCKS } from "@/types/booking"

const mockBookings: Booking[] = [
  {
    id: "1",
    title: "Clase de Matemáticas",
    type: "class",
    room: "Sala A101",
    building: "A",
    instructor: "Prof. García",
    startTime: new Date(2025, 4, 30, 9, 40),
    endTime: new Date(2025, 4, 30, 10, 50),
    participants: 25,
    tableType: "individual",
    roomType: "aula",
    hasProjector: true,
    hasAudioSystem: true,
    recurrence: "once",
  },
  {
    id: "2",
    title: "Laboratorio de Física",
    type: "lab",
    room: "Laboratorio 3",
    building: "B",
    instructor: "Prof. Martínez",
    startTime: new Date(2025, 4, 30, 11, 5),
    endTime: new Date(2025, 4, 30, 12, 15),
    participants: 15,
    tableType: "grupal",
    roomType: "laboratorio",
    hasProjector: true,
    hasAudioSystem: true,
    recurrence: "once",
  },
  {
    id: "3",
    title: "Ayudantía de Programación",
    type: "ayudantia",
    room: "Sala C203",
    building: "C",
    instructor: "Ayud. López",
    startTime: new Date(2025, 4, 30, 14, 40),
    endTime: new Date(2025, 4, 30, 15, 50),
    participants: 8,
    tableType: "grupal",
    roomType: "aula",
    hasProjector: true,
    hasAudioSystem: false,
    recurrence: "weekly",
  },
  {
    id: "4",
    title: "Seminario de Investigación",
    type: "seminar",
    room: "Sala E305",
    building: "E",
    instructor: "Dr. Rodríguez",
    startTime: new Date(2025, 5, 2, 16, 5),
    endTime: new Date(2025, 5, 2, 17, 15),
    participants: 50,
    tableType: "auditorio",
    roomType: "auditorio",
    hasProjector: true,
    hasAudioSystem: true,
    recurrence: "once",
  },
  {
    id: "5",
    title: "Certamen de Cálculo",
    type: "certamen",
    room: "Aula Magna",
    building: "F",
    instructor: "Prof. Silva",
    startTime: new Date(2025, 5, 3, 8, 15),
    endTime: new Date(2025, 5, 3, 9, 25),
    participants: 120,
    tableType: "individual",
    roomType: "auditorio",
    hasProjector: false,
    hasAudioSystem: true,
    recurrence: "once",
  },
]

export function BookingCalendar() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [filters, setFilters] = useState<Filters>({
    activityType: "all",
    searchQuery: "",
    tableType: "all",
    roomType: "all",
    hasProjector: "all",
    hasAudioSystem: "all",
    timeBlock: "all",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [conflicts, setConflicts] = useState<Booking[]>([])
  const [viewMode, setViewMode] = useState<"week" | "month">("week")

  const handleSlotClick = (date: Date, time: string) => {
    setSelectedSlot({ date, time })
    setIsModalOpen(true)
  }

  const checkConflicts = (newBooking: Omit<Booking, "id">): Booking[] => {
    return bookings.filter((booking) => {
      const newStart = newBooking.startTime.getTime()
      const newEnd = newBooking.endTime.getTime()
      const existingStart = booking.startTime.getTime()
      const existingEnd = booking.endTime.getTime()

      const timeOverlap =
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)

      const roomConflict = booking.room === newBooking.room && booking.building === newBooking.building
      const instructorConflict = booking.instructor === newBooking.instructor

      return timeOverlap && (roomConflict || instructorConflict)
    })
  }

  const handleBookingSubmit = (newBooking: Omit<Booking, "id">) => {
    const foundConflicts = checkConflicts(newBooking)

    if (foundConflicts.length > 0) {
      setConflicts(foundConflicts)
      return false
    }

    const booking: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substr(2, 9),
    }

    if (newBooking.recurrence === "weekly") {
      const weeklyBookings: Booking[] = []
      for (let i = 0; i < 12; i++) {
        const weekOffset = i * 7 * 24 * 60 * 60 * 1000
        weeklyBookings.push({
          ...booking,
          id: Math.random().toString(36).substr(2, 9),
          startTime: new Date(newBooking.startTime.getTime() + weekOffset),
          endTime: new Date(newBooking.endTime.getTime() + weekOffset),
        })
      }
      setBookings([...bookings, ...weeklyBookings])
    } else {
      setBookings([...bookings, booking])
    }

    setIsModalOpen(false)
    setConflicts([])
    return true
  }

  const handleReschedule = (bookingId: string, newStartTime: Date, newEndTime: Date) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return false

    const updatedBooking = {
      ...booking,
      startTime: newStartTime,
      endTime: newEndTime,
    }

    const foundConflicts = checkConflicts(updatedBooking)

    if (foundConflicts.length > 0) {
      setConflicts(foundConflicts)
      return false
    }

    setBookings(bookings.map((b) => (b.id === bookingId ? updatedBooking : b)))
    setConflicts([])
    return true
  }

  const handleDeleteBooking = (bookingId: string, deleteAllWeekly?: boolean) => {
    const booking = bookings.find((b) => b.id === bookingId)

    if (booking && booking.recurrence === "weekly" && deleteAllWeekly) {
      // Eliminar todas las instancias semanales futuras
      const bookingTime = booking.startTime.toTimeString().slice(0, 5)
      const bookingDay = booking.startTime.getDay()

      setBookings(
        bookings.filter((b) => {
          if (b.room !== booking.room || b.title !== booking.title) return true
          const bTime = b.startTime.toTimeString().slice(0, 5)
          const bDay = b.startTime.getDay()
          return !(bTime === bookingTime && bDay === bookingDay && b.startTime >= booking.startTime)
        }),
      )
    } else {
      setBookings(bookings.filter((b) => b.id !== bookingId))
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filters.activityType !== "all" && booking.type !== filters.activityType) {
      return false
    }
    if (filters.tableType !== "all" && booking.tableType !== filters.tableType) {
      return false
    }
    if (filters.roomType !== "all" && booking.roomType !== filters.roomType) {
      return false
    }
    if (filters.hasProjector === "yes" && !booking.hasProjector) {
      return false
    }
    if (filters.hasProjector === "no" && booking.hasProjector) {
      return false
    }
    if (filters.hasAudioSystem === "yes" && !booking.hasAudioSystem) {
      return false
    }
    if (filters.hasAudioSystem === "no" && booking.hasAudioSystem) {
      return false
    }
    // Filtro por horario
    if (filters.timeBlock !== "all") {
      const selectedBlock = TIME_BLOCKS.find((block) => block.id.toString() === filters.timeBlock)
      if (selectedBlock) {
        const bookingStartTime = booking.startTime.toTimeString().slice(0, 5)
        if (bookingStartTime !== selectedBlock.startTime) {
          return false
        }
      }
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        booking.title.toLowerCase().includes(query) ||
        booking.instructor.toLowerCase().includes(query) ||
        booking.room.toLowerCase().includes(query) ||
        booking.building.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sistema de Reservas</h1>
              <p className="text-muted-foreground mt-1">Gestiona y previene conflictos de horarios</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Nueva Reserva
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <BookingFilters
              filters={filters}
              onFiltersChange={setFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <CalendarView
              bookings={filteredBookings}
              onSlotClick={handleSlotClick}
              onReschedule={handleReschedule}
              onDeleteBooking={handleDeleteBooking}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setConflicts([])
        }}
        onSubmit={handleBookingSubmit}
        selectedSlot={selectedSlot}
        conflicts={conflicts}
      />

      {/* Conflict Alert */}
      {conflicts.length > 0 && <ConflictAlert conflicts={conflicts} onClose={() => setConflicts([])} />}
    </div>
  )
}
