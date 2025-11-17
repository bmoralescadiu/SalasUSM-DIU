"use client"

type Props = {
  value: "once" | "weekly"
  onChange: (v: "once" | "weekly") => void
}

export default function RecurrenceToggle({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-md border overflow-hidden">
        <button
          type="button"
          className={`px-3 py-2 text-sm ${value === "once" ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
          onClick={() => onChange("once")}
        >
          Esporádica
        </button>
        <button
          type="button"
          className={`px-3 py-2 text-sm ${value === "weekly" ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
          onClick={() => onChange("weekly")}
        >
          Repetitiva (semanal)
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {value === "once"
          ? "Esta reserva se crea solo para la fecha y bloque seleccionados."
          : "Se crearán instancias semanales del mismo día y bloque (p.ej., 12 semanas)."}
      </p>
    </div>
  )
}
