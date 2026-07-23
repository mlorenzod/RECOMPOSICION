export default function WeeklyVolumeTachometer({ current, goal }) {
  const pct = Math.min((current / goal) * 100, 100)
  const rotation = (pct / 100) * 270 - 135
  const arcLength = 251

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-64 h-40" aria-hidden="true">
        <path
          d="M 20 100 A 80 80 0 1 1 180 100"
          fill="none"
          stroke="#2a2a2e"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 1 1 180 100"
          fill="none"
          stroke="#DC2626"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * arcLength} ${arcLength}`}
        />
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos((rotation * Math.PI) / 180)}
          y2={100 + 60 * Math.sin((rotation * Math.PI) / 180)}
          stroke="#FACC15"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="#FACC15" />
      </svg>
      <p className="text-scuderia-yellow text-2xl font-bold -mt-6">
        {current.toLocaleString('es-ES')}{' '}
        <span className="text-sm text-white/50">kg·reps</span>
      </p>
      <p className="text-white/40 text-xs uppercase tracking-widest">
        Objetivo: {goal.toLocaleString('es-ES')} ({pct.toFixed(0)}%)
      </p>
    </div>
  )
}
