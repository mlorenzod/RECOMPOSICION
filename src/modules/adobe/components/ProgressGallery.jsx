import { useState } from 'react'

export default function ProgressGallery({ photos, onSelectPair }) {
  const [first, setFirst] = useState(null)

  const handleSelect = (photo) => {
    if (!first) {
      setFirst(photo)
      return
    }
    onSelectPair(first, photo)
    setFirst(null)
  }

  return (
    <div>
      <h3 className="text-white/70 text-sm mb-1">Galería privada</h3>
      <p className="text-white/40 text-xs mb-3">
        {first
          ? `Seleccionada: ${first.label} (${first.date}). Elige la segunda foto.`
          : 'Selecciona 2 fotos para comparar Antes / Después'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => handleSelect(photo)}
            className={`aspect-[3/4] rounded-lg bg-gradient-to-br ${photo.tone} border-2 transition
              ${first?.id === photo.id ? 'border-adobe-accent scale-[1.02]' : 'border-transparent hover:border-adobe-accent/50'}`}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-xs p-2">
              <span className="font-semibold">{photo.label}</span>
              <span>{photo.date}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
