import React, { useState } from 'react';

// Opciones de material con imágenes de calidad
const EQUIPMENT_LIST = [
  { id: 'barbell', label: 'Barra y Discos', sub: 'Hasta 68kg+', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' },
  { id: 'dumbbells', label: 'Mancuernas', sub: 'Ajustables o fijas', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
  { id: 'bench', label: 'Banco Plano/Inclinable', sub: 'Para empujes', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { id: 'pullup', label: 'Barra Dominadas', sub: 'Espalda y core', img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80' },
  { id: 'bands', label: 'Banda Elástica', sub: 'Resistencia extra', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' },
  { id: 'rope', label: 'Comba', sub: 'Acondicionamiento', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEquip, setSelectedEquip] = useState(['barbell', 'dumbbells', 'bench']);
  const [formData, setFormData] = useState({
    goal: 'recomp',
    days: 4,
    banned: '',
    favs: ''
  });

  const toggleEquip = (id) => {
    if (selectedEquip.includes(id)) {
      setSelectedEquip(selectedEquip.filter(item => item !== id));
    } else {
      setSelectedEquip([...selectedEquip, id]);
    }
  };

  const steps = [
    // PASO 1: OBJETIVO
    {
      title: "¿Cuál es tu objetivo principal?",
      sub: "BWS Algorithm personalizará tus rangos de repeticiones y déficit/superávit.",
      content: (
        <div className="space-y-3">
          {[
            { id: 'recomp', name: 'Recomposicion Corporal', desc: 'Perder grasa y ganar músculo a la vez' },
            { id: 'hypertrophy', name: 'Hipertrofia Pura', desc: 'Maximizar masa muscular' },
            { id: 'fatloss', name: 'Pérdida de Grasa Acelerada', desc: 'Mantener músculo en déficit' }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({ ...formData, goal: item.id })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                formData.goal === item.id 
                  ? 'bg-white/10 border-[#E10600] ring-1 ring-[#E10600]' 
                  : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                <p className="text-[11px] text-gray-400">{item.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${formData.goal === item.id ? 'bg-[#E10600] text-white' : 'border border-white/20 text-transparent'}`}>✓</div>
            </div>
          ))}
        </div>
      )
    },
    // PASO 2: MATERIAL (ESTILO PULSO / BWS)
    {
      title: "¿Qué equipamiento tienes?",
      sub: "Selecciona todo lo que tengas. Si no marcas nada, adaptaremos a peso corporal.",
      content: (
        <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {EQUIPMENT_LIST.map((eq) => {
            const isChecked = selectedEquip.includes(eq.id);
            return (
              <div 
                key={eq.id}
                onClick={() => toggleEquip(eq.id)}
                className={`relative rounded-2xl overflow-hidden border transition-all cursor-pointer group select-none ${
                  isChecked 
                    ? 'border-[#E10600] ring-2 ring-[#E10600]/40 scale-[1.02]' 
                    : 'border-white/10 opacity-50 hover:opacity-90'
                }`}
              >
                <img src={eq.img} alt={eq.label} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2.5 flex flex-col justify-end">
                  <span className="text-xs font-black text-white leading-tight">{eq.label}</span>
                  <span className="text-[9px] text-gray-300 font-mono">{eq.sub}</span>
                </div>
                <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                  isChecked ? 'bg-[#E10600] text-white' : 'bg-black/60 text-transparent border border-white/20'
                }`}>
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      )
    },
    // PASO 3: NUTRICIÓN Y CENSURA DE ALIMENTOS
    {
      title: "Nutrición a tu medida",
      sub: "Para no imponerte comidas molestas. Adherencia 100% garantizada.",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-red-400 block mb-1">🚫 Alimentos Censurados / Odiados</label>
            <input 
              type="text" 
              placeholder="Ej: Brócoli, lactosa, cilantro, marisco..." 
              value={formData.banned}
              onChange={(e) => setFormData({ ...formData, banned: e.target.value })}
              className="w-full bg-black/50 border border-red-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00A3E0]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-emerald-400 block mb-1">❤️ Alimentos Favoritos</label>
            <input 
              type="text" 
              placeholder="Ej: Arroz, ternera, avena, aguacate, claras..." 
              value={formData.favs}
              onChange={(e) => setFormData({ ...formData, favs: e.target.value })}
              className="w-full bg-black/50 border border-emerald-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00A3E0]"
            />
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ ...formData, equipment: selectedEquip });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141417] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 relative">
        
        {/* HEADER DE BARRA DE PROGRESO */}
        <div className="flex items-center justify-between gap-4">
          {currentStep > 0 ? (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-xs text-gray-400 hover:text-white font-mono"
            >
              ← Atrás
            </button>
          ) : <div className="w-8"></div>}

          <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-cyan-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          <span className="text-[10px] text-gray-400 font-mono">{currentStep + 1}/{steps.length}</span>
        </div>

        {/* TÍTULOS DE LA PREGUNTA */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white tracking-tight">{steps[currentStep].title}</h2>
          <p className="text-xs text-gray-400 leading-relaxed">{steps[currentStep].sub}</p>
        </div>

        {/* CONTENIDO INTERACTIVO */}
        <div className="py-2">
          {steps[currentStep].content}
        </div>

        {/* BOTÓN CONTINUAR */}
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black rounded-2xl active:scale-95 transition-all text-xs tracking-wider shadow-xl"
        >
          {currentStep === steps.length - 1 ? 'GENERAR MI PLAN IA' : 'CONTINUAR →'}
        </button>

      </div>
    </div>
  );
}