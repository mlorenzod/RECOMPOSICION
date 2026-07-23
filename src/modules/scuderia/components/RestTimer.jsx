import { useRestTimer } from '../../../hooks/useRestTimer'

const SEMAPHORE = [
  { max: 30, color: 'bg-scuderia-red', label: 'BOX BOX' },
  { max: 60, color: 'bg-scuderia-yellow', label: 'WARM UP' },
  { max: Infinity, color: 'bg-green-500', label: 'GREEN FLAG' },
]

export default function RestTimer({ defaultSeconds = 90 }) {
  const { seconds, isRunning, start, pause, reset } = useRestTimer(defaultSeconds)
  const phase = SEMAPHORE.find((s) => seconds <= s.max) ?? SEMAPHORE[2]

  return (
    <div className="bg-[#161618] border border-scuderia-red/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-scuderia-yellow text-sm uppercase tracking-widest">
          Semáforo de descanso
        </h3>
        <span className="text-xs text-white/40">{phase.label}</span>
      </div>

      <div className="flex justify-center gap-3 mb-4">
        {['bg-scuderia-red', 'bg-scuderia-yellow', 'bg-green-500'].map((color) => (
          <div
            key={color}
            className={`w-10 h-10 rounded-full border-2 border-white/20 transition-all
              ${phase.color === color ? `${color} shadow-lg scale-110` : 'bg-white/5'}`}
          />
        ))}
      </div>

      <p className="text-center text-5xl font-bold text-white font-mono mb-4">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={isRunning ? pause : start}
          className="flex-1 py-2 bg-scuderia-red rounded-lg text-white font-bold"
        >
          {isRunning ? 'Pausa' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex-1 py-2 bg-white/10 rounded-lg text-white"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
