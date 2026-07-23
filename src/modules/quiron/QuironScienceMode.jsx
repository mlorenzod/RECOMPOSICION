import { useState } from 'react'
import MedicalReportCard from './components/MedicalReportCard'
import MacroBreakdown from './components/MacroBreakdown'
import FoodPhotoUpload from './components/FoodPhotoUpload'

const MOCK_MACROS = { kcal: 2140, protein: 165, carbs: 220, fat: 62 }

export default function QuironScienceMode() {
  const [foodAnalysis, setFoodAnalysis] = useState(null)

  return (
    <div className="bg-quiron-bg min-h-full p-4 space-y-6 font-clinical pb-8">
      <header className="border-l-4 border-quiron-blue pl-4">
        <p className="text-quiron-blue text-xs uppercase tracking-widest">Quirónsalud Lab</p>
        <h2 className="text-2xl font-semibold text-white">Quirón Science Mode</h2>
      </header>

      <MedicalReportCard
        title="Informe nutricional diario"
        date={new Date().toLocaleDateString('es-ES')}
        status="En seguimiento"
        notes="Déficit calórico controlado. Proteína dentro de rango terapéutico."
      />

      <MacroBreakdown macros={MOCK_MACROS} />

      <FoodPhotoUpload onAnalysis={setFoodAnalysis} />

      {foodAnalysis && (
        <MedicalReportCard
          title="Análisis IA — Comida"
          date="Ahora"
          status="Procesado"
          notes={foodAnalysis}
        />
      )}
    </div>
  )
}
