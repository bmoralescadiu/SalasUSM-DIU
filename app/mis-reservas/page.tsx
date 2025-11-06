// app/mis-reservas/page.tsx
"use client"

import { useEffect, useState } from "react"
import type { Booking } from "@/types/booking"
import { loadBookings, deleteBooking } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function MisReservasPage() {
  const [list, setList] = useState<Booking[]>([])
  useEffect(() => setList(loadBookings()), [])

  const onDelete = (id: string) => {
    deleteBooking(id)
    setList(loadBookings())
  }

  return (
    <main className="container mx-auto p-4 space-y-3">
      <h1 className="text-xl font-semibold">Mis reservas</h1>

      {list.length === 0 && (
        <p className="text-sm text-muted-foreground">Aún no tienes reservas.</p>
      )}

      {list.map(b => (
        <Card key={b.id} className="p-3 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">{b.title}</div>
            <div>{b.building}-{b.room} · {b.startTime.toLocaleString()} — {b.endTime.toLocaleTimeString()}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => location.href='/?edit='+b.id}>Editar</Button>
            <Button variant="destructive" onClick={() => onDelete(b.id)}>Cancelar</Button>
          </div>
        </Card>
      ))}
    </main>
  )
}
