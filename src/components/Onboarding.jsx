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

// Objetivos con claves que usará el App
const GOALS = [
  { id: 'recomposicion', name: 'Recomposición Corporal', desc: 'Perder grasa y ganar músculo a la vez' },
  { id: 'ganar_musculo', name: 'Hipertrofia Pura', desc: 'Maximizar masa muscular' },
  { id: 'perder_peso', name: 'Pérdida de Grasa Acelerada', desc: 'Mantener músculo en déficit' },
  { id: 'mantenimiento', name: 'Mantenimiento', desc: 'Conservar tu forma actual' }
];

// Niveles de actividad
const ACTIVITY_LEVELS = [
  { id: 'sedentaria', label: 'Sedentaria', desc: 'Poco o ningún ejercicio' },
  { id: 'ligera', label: 'Ligera', desc: '1-3 días/semana' },
  { id: 'moderada', label: 'Moderada', desc: '3-5 días/semana' },
  { id: 'intensa', label: 'Intensa', desc: '6-7 días/semana' }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEquip, setSelectedEquip] = useState(['barbell', 'dumbbells', 'bench']);
  const [formData, setFormData] = useState({
    goal: 'recomposicion',
    activity: 'moderada',
    restricciones: '',
    banned: '',
    favs: '',
    edad: '',
    peso: '',
    altura: ''
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
      sub: "La IA personalizará tus rangos de repeticiones y déficit/superávit.",
      content: (
        <div className="space-y-3">
          {GOALS.map((item) => (
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
    // PASO 2: DATOS PERSONALES
    {
      title: "Datos básicos para afinar tu plan",
      sub: "Esto permite a la IA calcular tus necesidades calóricas y adaptar las recetas.",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">Edad</label>
              <input 
                type="number" 
                placeholder="30" 
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00A3E0]"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">Peso (kg)</label>
              <input 
                type="number" 
                placeholder="80" 
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00A3E0]"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Altura (cm)</label>
            <input 
              type="number" 
              placeholder="175" 
              value={formData.altura}
              onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00A3E0]"
            />
          </div>
        </div>
      )
    },
    // PASO 3: NIVEL DE ACTIVIDAD
    {
      title: "¿Cuál es tu nivel de actividad física?",
      sub: "Define tu punto de partida para el cálculo de calorías.",
      content: (
        <div className="space-y-3">
          {ACTIVITY_LEVELS.map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({ ...formData, activity: item.id })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                formData.activity === item.id 
                  ? 'bg-white/10 border-[#0066FF] ring-1 ring-[#0066FF]' 
                  : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <h4 className="font-extrabold text-sm text-white">{item.label}</h4>
                <p className="text-[11px] text-gray-400">{item.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${formData.activity === item.id ? 'bg-[#0066FF] text-white' : 'border border-white/20 text-transparent'}`}>✓</div>
            </div>
          ))}
        </div>
      )
    },
    // PASO 4: RESTRICCIONES ALIMENTARIAS
    {
      title: "Restricciones alimentarias",
      sub: "Para que las recetas IA nunca incluyan lo que no puedes comer.",
      content: (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-amber-400 block mb-1">🚫 ¿Alguna restricción? (ej: sin lactosa, vegetariano...)</label>
            <input 
              type="text" 
              placeholder="Ej: Sin lactosa, vegetariano, sin frutos secos..." 
              value={formData.restricciones}
              onChange={(e) => setFormData({ ...formData, restricciones: e.target.value })}
              className="w-full bg-black/50 border border-amber-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00A3E0]"
            />
          </div>
          <div className="text-[10px] text-gray-400 italic">
            Déjalo en blanco si no tienes restricciones.
          </div>
        </div>
      )
    },
    // PASO 5: EQUIPAMIENTO (ESTILO PULSO / BWS)
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
    // PASO 6: NUTRICIÓN Y CENSURA DE ALIMENTOS
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
      // Construir el objeto final para App.js
      const profileData = {
        name: formData.name || '', // Se rellena desde App.js
        email: '', // Se rellena desde App.js
        objetivo: formData.goal,               // 'recomposicion', 'ganar_musculo', etc.
        actividad: formData.activity,           // 'sedentaria', 'ligera', etc.
        restricciones: formData.restricciones || 'ninguna',
        edad: parseInt(formData.edad) || 30,
        peso: parseFloat(formData.peso) || 70,
        altura: parseInt(formData.altura) || 170,
        bannedFoods: formData.banned,
        favFoods: formData.favs,
        equipment: selectedEquip,
        // Conservamos compatibilidad con lo anterior
        goal: formData.goal,
        days: 4
      };
      onComplete(profileData);
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

        {/* AVISO LEGAL (recordatorio) */}
        {currentStep === steps.length - 1 && (
          <div className="bg-amber-400/10 border border-amber-400/40 rounded-xl p-3 flex items-start gap-2 text-[10px] text-amber-200">
            <span className="text-base">⚠️</span>
            <div>
              <p className="font-bold text-amber-400">Recomendación generada por IA</p>
              <p className="text-amber-200/80 mt-0.5">
                Esta app usa inteligencia artificial. Las sugerencias no sustituyen el consejo de un profesional de la salud. Consulta a tu médico o nutricionista antes de realizar cambios importantes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}