"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import type { Booking } from "@/types/booking"

interface ConflictAlertProps {
  conflicts: Booking[]
  onClose: () => void
}

export function ConflictAlert({ conflicts, onClose }: ConflictAlertProps) {
  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 animate-in slide-in-from-bottom-5">
      <Alert variant="destructive" className="bg-destructive/95 border-destructive shadow-lg">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="flex items-center justify-between text-destructive-foreground">
          Conflicto Detectado
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 text-destructive-foreground hover:bg-destructive-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="text-destructive-foreground/90">
          <div className="mt-2 space-y-2">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="text-sm bg-background/10 p-2 rounded">
                <div className="font-medium">{conflict.title}</div>
                <div className="text-xs mt-1">
                  {conflict.room} • {conflict.instructor}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm">Modifique el horario, sala o instructor para continuar.</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
