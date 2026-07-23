import { useRef, useState } from 'react'

export default function FoodPhotoUpload({ onAnalysis }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (file) => {
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreview(url)
    setLoading(true)

    setTimeout(() => {
      onAnalysis(
        'Plato detectado: pechuga de pollo (180g), arroz integral (150g), brócoli (80g). ' +
        'Estimación: 520 kcal | P: 48g | C: 52g | G: 8g',
      )
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="bg-white/5 border border-dashed border-quiron-blue/50 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Análisis por imagen</h3>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <img src={preview} alt="Comida subida" className="w-full h-48 object-cover rounded-lg mb-3" />
      ) : (
        <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center mb-3">
          <span className="text-white/30 text-sm">Sin imagen</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="w-full py-3 bg-quiron-blue hover:bg-blue-800 text-white rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Analizando...' : '📷 Subir foto de comida'}
      </button>
    </div>
  )
}
