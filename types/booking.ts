export interface Booking {
  id: string
  title: string
  type: "class" | "lab" | "ayudantia" | "seminar" | "certamen" | "evento"
  room: string
  building: "A" | "B" | "C" | "E" | "F" | "K"
  instructor: string
  startTime: Date
  endTime: Date
  participants: number
  tableType?: string
  roomType?: string
  hasProjector?: boolean
  hasAudioSystem?: boolean
  recurrence?: "once" | "weekly"
}

export interface BookingFilters {
  activityType: "all" | "class" | "lab" | "ayudantia" | "seminar" | "certamen" | "evento"
  searchQuery: string
  tableType: "all" | "individual" | "grupal" | "auditorio"
  roomType: "all" | "aula" | "laboratorio" | "sala-estudio" | "auditorio"
  hasProjector: "all" | "yes" | "no"
  hasAudioSystem: "all" | "yes" | "no"
  timeBlock: "all" | string
}

export interface TimeBlock {
  id: number
  label: string
  startTime: string
  endTime: string
  isLunch: boolean
}

export const TIME_BLOCKS: TimeBlock[] = [
  { id: 1, label: "Bloque 1-2", startTime: "08:15", endTime: "09:25", isLunch: false },
  { id: 2, label: "Bloque 3-4", startTime: "09:40", endTime: "10:50", isLunch: false },
  { id: 3, label: "Bloque 5-6", startTime: "11:05", endTime: "12:15", isLunch: false },
  { id: 4, label: "Bloque 7-8", startTime: "12:30", endTime: "13:40", isLunch: false },
  { id: 5, label: "Almuerzo", startTime: "13:40", endTime: "14:40", isLunch: true },
  { id: 6, label: "Bloque 9-10", startTime: "14:40", endTime: "15:50", isLunch: false },
  { id: 7, label: "Bloque 11-12", startTime: "16:05", endTime: "17:15", isLunch: false },
  { id: 8, label: "Bloque 13-14", startTime: "17:30", endTime: "18:40", isLunch: false },
  { id: 9, label: "Bloque 15-16", startTime: "18:55", endTime: "20:05", isLunch: false },
]

export interface Room {
  name: string
  building: "A" | "B" | "C" | "E" | "F" | "K"
  capacity: number
  hasProjector: boolean
  hasAudioSystem: boolean
  tableType: "individual" | "grupal" | "auditorio"
  roomType: "aula" | "laboratorio" | "sala-estudio" | "auditorio"
}

export const AVAILABLE_ROOMS: Room[] = [
  {
    name: "Sala A101",
    building: "A",
    capacity: 30,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "individual",
    roomType: "aula",
  },
  {
    name: "Sala A201",
    building: "A",
    capacity: 50,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "individual",
    roomType: "aula",
  },
  {
    name: "Sala B102",
    building: "B",
    capacity: 25,
    hasProjector: false,
    hasAudioSystem: true,
    tableType: "individual",
    roomType: "aula",
  },
  {
    name: "Sala B301",
    building: "B",
    capacity: 80,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "grupal",
    roomType: "aula",
  },
  {
    name: "Sala C203",
    building: "C",
    capacity: 40,
    hasProjector: true,
    hasAudioSystem: false,
    tableType: "individual",
    roomType: "aula",
  },
  {
    name: "Sala C401",
    building: "C",
    capacity: 120,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "auditorio",
    roomType: "auditorio",
  },
  {
    name: "Sala K105",
    building: "K",
    capacity: 20,
    hasProjector: false,
    hasAudioSystem: false,
    tableType: "individual",
    roomType: "sala-estudio",
  },
  {
    name: "Sala K202",
    building: "K",
    capacity: 45,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "individual",
    roomType: "aula",
  },
  {
    name: "Sala E101",
    building: "E",
    capacity: 60,
    hasProjector: true,
    hasAudioSystem: false,
    tableType: "individual",
    roomType: "aula",
  },
  {
    name: "Sala E305",
    building: "E",
    capacity: 100,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "auditorio",
    roomType: "auditorio",
  },
  {
    name: "Auditorio",
    building: "F",
    capacity: 180,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "auditorio",
    roomType: "auditorio",
  },
  {
    name: "Aula Magna",
    building: "F",
    capacity: 35,
    hasProjector: false,
    hasAudioSystem: true,
    tableType: "auditorio",
    roomType: "auditorio",
  },
  {
    name: "Laboratorio 3",
    building: "B",
    capacity: 28,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "individual",
    roomType: "laboratorio",
  },
  {
    name: "Laboratorio 1",
    building: "B",
    capacity: 28,
    hasProjector: true,
    hasAudioSystem: true,
    tableType: "individual",
    roomType: "laboratorio",
  },
]
