// data/rooms.ts
import type { Room } from "@/types/booking"

/** Catálogo de salas (mismo esquema que en types/booking.ts) */
export const ROOMS: Room[] = [
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

/** Lista de edificios presentes en el catálogo (derivada de ROOMS) */
export const BUILDINGS = Array.from(new Set(ROOMS.map(r => r.building))) as Room["building"][]

/** Helpers prácticos */
export const getRoomsByBuilding = (building: Room["building"]) =>
  ROOMS.filter(r => r.building === building)

export const findRoom = (name: string) =>
  ROOMS.find(r => r.name === name)

export const roomMatchesNeeds = (
  room: Room,
  needs: { projector?: boolean; audio?: boolean }
) => {
  if (needs.projector && !room.hasProjector) return false
  if (needs.audio && !room.hasAudioSystem) return false
  return true
}

export const validateCapacity = (room: Room, participants: number) =>
  participants <= room.capacity

export const formatRoom = (room: Room) =>
  `${room.building} — ${room.name}`
