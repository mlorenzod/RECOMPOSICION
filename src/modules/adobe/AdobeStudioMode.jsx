import { useState } from 'react'
import ProgressGallery from './components/ProgressGallery'
import BeforeAfterSlider from './components/BeforeAfterSlider'

const MOCK_PHOTOS = [
  { id: 1, date: '2026-01-15', label: 'Frontal', tone: 'from-gray-800 to-gray-950' },
  { id: 2, date: '2026-03-01', label: 'Frontal', tone: 'from-gray-700 to-gray-900' },
  { id: 3, date: '2026-05-10', label: 'Lateral', tone: 'from-gray-600 to-gray-800' },
  { id: 4, date: '2026-07-01', label: 'Lateral', tone: 'from-gray-500 to-gray-700' },
]

export default function AdobeStudioMode() {
  const [selected, setSelected] = useState([MOCK_PHOTOS[0], MOCK_PHOTOS[1]])

  return (
    <div className="bg-adobe-bg min-h-full p-4 space-y-6 font-studio pb-8">
      <header>
        <p className="text-adobe-accent text-xs uppercase tracking-widest">Lightroom Private</p>
        <h2 className="text-2xl font-light text-white">Adobe Studio Mode</h2>
      </header>

      <BeforeAfterSlider before={selected[0]} after={selected[1]} />

      <ProgressGallery photos={MOCK_PHOTOS} onSelectPair={(a, b) => setSelected([a, b])} />
    </div>
  )
}
