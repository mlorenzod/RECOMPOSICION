import { useEffect } from 'react'

export default function LapRecordAlert({ alert, onDismiss }) {
  useEffect(() => {
    if (!alert) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [alert, onDismiss])

  if (!alert) return null

  return (
    <div className="fixed inset-x-4 top-20 z-50 animate-bounce" role="alert">
      <div className="bg-scuderia-yellow text-black rounded-xl p-4 shadow-2xl border-2 border-scuderia-red">
        <p className="font-bold text-lg uppercase tracking-wider">🏁 Lap Record!</p>
        <p className="font-mono">
          {alert.exercise}: {alert.weight}kg × {alert.reps}
        </p>
        <button type="button" onClick={onDismiss} className="text-xs underline mt-1">
          Cerrar
        </button>
      </div>
    </div>
  )
}
