import { useState } from 'react'
import { scuderiaTheme } from './theme'
import WeeklyVolumeTachometer from './components/WeeklyVolumeTachometer'
import SetLogger from './components/SetLogger'
import RestTimer from './components/RestTimer'
import LapRecordAlert from './components/LapRecordAlert'

export default function ScuderiaMode() {
  const [sets, setSets] = useState([])
  const [prAlert, setPrAlert] = useState(null)

  const weeklyVolume = sets.reduce((acc, s) => acc + s.weight * s.reps, 0)
  const weeklyGoal = 25000

  const handleNewSet = (set) => {
    setSets((prev) => [...prev, set])
    if (set.isPR) setPrAlert(set)
  }

  return (
    <div className={`${scuderiaTheme.bg} min-h-full p-4 space-y-6 font-racing`}>
      <LapRecordAlert alert={prAlert} onDismiss={() => setPrAlert(null)} />

      <section className="text-center">
        <p className={`text-xs uppercase tracking-[0.3em] ${scuderiaTheme.highlight}`}>
          Pit Lane Status
        </p>
        <h2 className="text-2xl font-bold text-white mt-1">Scuderia Mode</h2>
      </section>

      <WeeklyVolumeTachometer current={weeklyVolume} goal={weeklyGoal} />

      <SetLogger onLog={handleNewSet} previousSets={sets} />

      <RestTimer defaultSeconds={90} />

      <div className={`${scuderiaTheme.card} rounded-xl p-4`}>
        <h3 className={`text-sm uppercase ${scuderiaTheme.highlight} mb-3`}>Telemetría</h3>
        {sets.length === 0 ? (
          <p className="text-white/40 text-sm">Sin sets registrados en esta sesión.</p>
        ) : (
          <ul className="space-y-2">
            {sets.slice().reverse().map((s, i) => (
              <li key={i} className="flex justify-between text-white/80 text-sm font-mono">
                <span>{s.exercise}</span>
                <span className={s.isPR ? 'text-scuderia-yellow' : ''}>
                  {s.weight}kg × {s.reps} {s.isPR && '🏁 PR'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
