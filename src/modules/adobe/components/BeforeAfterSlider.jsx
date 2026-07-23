import { useState, useRef, useCallback } from 'react'

export default function BeforeAfterSlider({ before, after }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const handlePointerDown = (e) => {
    dragging.current = true
    updatePosition(e.clientX ?? e.touches?.[0]?.clientX)
  }

  const handlePointerMove = (e) => {
    if (!dragging.current) return
    updatePosition(e.clientX ?? e.touches?.[0]?.clientX)
  }

  const handlePointerUp = () => {
    dragging.current = false
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-white/40">
        <span>Antes — {before?.date}</span>
        <span>Después — {after?.date}</span>
      </div>

      <div
        ref={containerRef}
        className="relative h-72 rounded-lg overflow-hidden cursor-col-resize select-none border border-adobe-accent/30 touch-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${after?.tone ?? 'from-gray-700 to-gray-900'} flex items-center justify-center`}>
          <div className="text-center text-white/30">
            <span className="text-4xl block mb-1">DESPUÉS</span>
            <span className="text-sm">{after?.label}</span>
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-br ${before?.tone ?? 'from-gray-900 to-black'} flex items-center justify-center`}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="text-center text-white/30">
            <span className="text-4xl block mb-1">ANTES</span>
            <span className="text-sm">{before?.label}</span>
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-adobe-accent pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-adobe-accent flex items-center justify-center text-white text-xs shadow-lg">
            ↔
          </div>
        </div>
      </div>
    </div>
  )
}
