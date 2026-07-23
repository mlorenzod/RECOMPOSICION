const MACRO_CONFIG = [
  { key: 'protein', label: 'Proteína', unit: 'g', color: 'bg-quiron-blue', max: 200 },
  { key: 'carbs', label: 'Carbohidratos', unit: 'g', color: 'bg-sky-400', max: 300 },
  { key: 'fat', label: 'Grasas', unit: 'g', color: 'bg-amber-400', max: 100 },
]

export default function MacroBreakdown({ macros }) {
  return (
    <div className="bg-white/5 border border-quiron-blue/30 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-1">Desglose de macros</h3>
      <p className="text-3xl font-bold text-white mb-4">
        {macros.kcal} <span className="text-sm text-white/40">kcal</span>
      </p>

      <div className="space-y-3">
        {MACRO_CONFIG.map(({ key, label, unit, color, max }) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">{label}</span>
              <span className="text-white font-mono">{macros[key]}{unit}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((macros[key] / max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
