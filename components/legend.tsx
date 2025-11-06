export function Legend({ className = "" }: { className?: string }) {
  const items = [
    { color: "bg-blue-500",    label: "Clase" },
    { color: "bg-amber-500",   label: "Laboratorio" },
    { color: "bg-emerald-500", label: "Ayudantía" },
    { color: "bg-purple-500",  label: "Seminario" },
    { color: "bg-rose-500",    label: "Certamen" },
  ]
  return (
    <div className={`rounded-md border p-3 text-sm ${className}`}>
      <div className="font-medium mb-2">Leyenda</div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(it => (
          <div key={it.label} className="flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded ${it.color}`} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
