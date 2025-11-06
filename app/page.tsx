// app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Landing() {
  return (
    <main className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      <Card className="p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reserva una sala</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Consulta disponibilidad por fecha y bloque, y crea reservas sin solapes.
          </p>
        </div>
        <div className="mt-6">
          <Button asChild size="lg"><Link href="/disponibilidad">Ir a disponibilidad</Link></Button>
        </div>
      </Card>
      <Card className="p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Mis reservas</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Revisa, edita o cancela tus reservas activas.
          </p>
        </div>
        <div className="mt-6">
          <Button variant="secondary" asChild size="lg"><Link href="/mis-reservas">Ver mis reservas</Link></Button>
        </div>
      </Card>
    </main>
  )
}
