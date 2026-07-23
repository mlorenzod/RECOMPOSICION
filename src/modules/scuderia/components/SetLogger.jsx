import { useState } from 'react'
import { detectPR } from '../../../utils/prDetection'

const EXERCISES = ['Sentadilla', 'Press banca', 'Peso muerto', 'Dominadas']

export default function SetLogger({ onLog, previousSets }) {
  const [exercise, setExercise] = useState(EXERCISES[0])
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const w = parseFloat(weight)
    const r = parseInt(reps, 10)
    if (!w || !r) return

    const isPR = detectPR(previousSets, exercise, w, r)
    onLog({ exercise, weight: w, reps: r, isPR, timestamp: Date.now() })
    setWeight('')
    setReps('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#161618] border border-scuderia-red/30 rounded-xl p-4 space-y-3"
    >
      <h3 className="text-scuderia-yellow text-sm uppercase tracking-widest">
        Registro de vuelta
      </h3>

      <select
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
      >
        {EXERCISES.map((ex) => (
          <option key={ex} value={ex}>{ex}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          step="0.5"
          min="0"
          placeholder="Kg (68)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
        />
        <input
          type="number"
          min="1"
          placeholder="Reps (5)"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-scuderia-red hover:bg-red-700 text-white font-bold rounded-lg uppercase tracking-wider transition"
      >
        🏁 Registrar set
      </button>
    </form>
  )
}
