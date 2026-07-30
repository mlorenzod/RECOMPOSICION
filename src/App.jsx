import React, { useState, useEffect, useRef } from 'react';

// DICCIONARIO DE IMÁGENES GASTRONÓMICAS DE ALTA CALIDAD
const RECIPE_IMAGES_DB = {
  pollo: ['https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80'],
  carne: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'],
  pescado: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80'],
  ensalada: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80'],
  pasta: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800&q=80'],
  default: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80']
};

const selectRecipeImage = (title = '', ingredients = []) => {
  const text = (title + ' ' + ingredients.join(' ')).toLowerCase();
  if (text.includes('pollo') || text.includes('pavo')) return RECIPE_IMAGES_DB.pollo[Math.floor(Math.random() * RECIPE_IMAGES_DB.pollo.length)];
  if (text.includes('carne') || text.includes('ternera')) return RECIPE_IMAGES_DB.carne[Math.floor(Math.random() * RECIPE_IMAGES_DB.carne.length)];
  if (text.includes('salmon') || text.includes('pescado')) return RECIPE_IMAGES_DB.pescado[Math.floor(Math.random() * RECIPE_IMAGES_DB.pescado.length)];
  if (text.includes('ensalada') || text.includes('bowl')) return RECIPE_IMAGES_DB.ensalada[Math.floor(Math.random() * RECIPE_IMAGES_DB.ensalada.length)];
  return RECIPE_IMAGES_DB.default[Math.floor(Math.random() * RECIPE_IMAGES_DB.default.length)];
};

const AVAILABLE_EQUIPMENT_OPTIONS = [
  { id: 'mancuernas', label: 'Mancuernas' },
  { id: 'barra', label: 'Barra y Discos' },
  { id: 'banco', label: 'Banco Ajustable' },
  { id: 'kettlebell', label: 'Pesas Rusas (Kettlebells)' },
  { id: 'polea', label: 'Poleas / Cables' },
  { id: 'dominadas', label: 'Barra de Dominadas' },
  { id: 'fondos', label: 'Barra de Fondos' },
  { id: 'cuerda', label: 'Cuerda de Tríceps' },
  { id: 'calistenia', label: 'Peso Corporal' }
];

const OnboardingModal = ({ onComplete }) => {
  const [formData, setEditForm] = useState({
    peso: '75',
    altura: '175',
    edad: '28',
    genero: 'hombre',
    actividad: 'moderado',
    objetivo: 'Recomposición',
    equipamientoArray: ['mancuernas', 'banco']
  });

  const handleEquipmentToggle = (equipId) => {
    const currentEquip = formData.equipamientoArray || [];
    const exists = currentEquip.includes(equipId);
    let updated = exists 
      ? currentEquip.filter(item => item !== equipId) 
      : [...currentEquip, equipId];
    setEditForm({ ...formData, equipamientoArray: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.equipamientoArray || formData.equipamientoArray.length === 0) {
      return alert("Selecciona al menos un tipo de equipamiento disponible.");
    }
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-fadeIn overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl my-auto">
        <div className="text-center space-y-2 border-b border-white/10 pb-4">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Evaluación Inicial</span>
          <h2 className="text-2xl font-black text-white">Configura tu Perfil</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Peso (kg)</label>
              <input 
                type="number" step="0.1" required 
                value={formData.peso} 
                onChange={(e) => setEditForm({ ...formData, peso: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-bold text-white outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Altura (cm)</label>
              <input 
                type="number" required 
                value={formData.altura} 
                onChange={(e) => setEditForm({ ...formData, altura: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-bold text-white outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Edad</label>
              <input 
                type="number" required 
                value={formData.edad} 
                onChange={(e) => setEditForm({ ...formData, edad: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-bold text-white outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Género</label>
              <select 
                value={formData.genero} 
                onChange={(e) => setEditForm({ ...formData, genero: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-bold text-white outline-none bg-black"
              >
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Objetivo Principal</label>
            <select 
              value={formData.objetivo} 
              onChange={(e) => setEditForm({ ...formData, objetivo: e.target.value })}
              className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-bold text-white outline-none bg-black"
            >
              <option value="Perder Grasa">Perder Grasa / Definición</option>
              <option value="Recomposición">Recomposición Corporal</option>
              <option value="Ganar Músculo">Ganar Músculo / Volumen</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Equipamiento Disponible</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {AVAILABLE_EQUIPMENT_OPTIONS.map((equip) => {
                const selected = (formData.equipamientoArray || []).includes(equip.id);
                return (
                  <button
                    key={equip.id}
                    type="button"
                    onClick={() => handleEquipmentToggle(equip.id)}
                    className={`p-2.5 rounded-2xl border text-[10px] font-bold flex items-center justify-center transition-all ${
                      selected 
                        ? 'bg-white text-black border-white' 
                        : 'bg-[#222] border-white/10 text-gray-400'
                    }`}
                  >
                    <span className="truncate">{equip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform mt-4"
          >
            Comenzar Entrenamiento
          </button>
        </form>
      </div>
    </div>
  );
};

const COMPOUND_EXERCISES = {
  squat: { name: 'Sentadilla', target: 'Pierna', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80' },
  bench: { name: 'Press Banca', target: 'Pecho', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  row: { name: 'Remo con Barra', target: 'Espalda', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
  deadlift: { name: 'Peso Muerto', target: 'Pierna/Espalda', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80' },
  overhead: { name: 'Press Militar', target: 'Hombro', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80' },
  pullup: { name: 'Dominadas', target: 'Espalda', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80' },
  lunge: { name: 'Zancadas', target: 'Pierna', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80' },
  dip: { name: 'Fondos', target: 'Pecho/Tríceps', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80' },
};

const generateWorkoutPlan = (daysPerWeek, focus) => {
  const focusMod = focus === 'fuerza' ? { reps: '5-8', sets: '4-5' } :
                   focus === 'hipertrofia' ? { reps: '8-12', sets: '3-4' } :
                   { reps: '6-10', sets: '4' };

  let sessions = [];
  if (daysPerWeek === 2) {
    sessions = [
      { name: 'Full Body A', exercises: ['squat', 'bench', 'row', 'overhead', 'deadlift'] },
      { name: 'Full Body B', exercises: ['lunge', 'pullup', 'dip', 'deadlift', 'row'] }
    ];
  } else if (daysPerWeek === 3) {
    sessions = [
      { name: 'Full Body A', exercises: ['squat', 'bench', 'row', 'overhead'] },
      { name: 'Full Body B', exercises: ['deadlift', 'pullup', 'dip', 'lunge'] },
      { name: 'Full Body C', exercises: ['squat', 'overhead', 'row', 'bench'] }
    ];
  } else if (daysPerWeek === 4) {
    sessions = [
      { name: 'Upper A', exercises: ['bench', 'row', 'overhead', 'pullup'] },
      { name: 'Lower A', exercises: ['squat', 'deadlift', 'lunge'] },
      { name: 'Upper B', exercises: ['pullup', 'dip', 'bench', 'row'] },
      { name: 'Lower B', exercises: ['deadlift', 'squat', 'lunge'] }
    ];
  }

  const weekDays = [1, 2, 3, 4, 5, 6, 7];
  const trainingDays = weekDays.slice(0, daysPerWeek);
  const plan = { days: trainingDays, focus: focus, sessions: {} };

  trainingDays.forEach((day, index) => {
    const sessionIdx = index % sessions.length;
    const session = sessions[sessionIdx];
    plan.sessions[day] = {
      name: session.name,
      exercises: session.exercises.map(exId => {
        const ex = COMPOUND_EXERCISES[exId];
        return {
          id: exId,
          name: ex.name,
          target: ex.target,
          img: ex.img,
          sets: focusMod.sets,
          reps: focusMod.reps,
          defaultPR: 20,
          alts: []
        };
      })
    };
  });

  return plan;
};

const WorkoutPlannerModal = ({ isOpen, onClose, onPlanGenerated, currentPlan }) => {
  const [step, setStep] = useState(1);
  const [days, setDays] = useState(currentPlan?.days?.length || 3);
  const [focus, setFocus] = useState(currentPlan?.focus || 'hipertrofia');

  if (!isOpen) return null;

  const handleGenerate = () => {
    const plan = generateWorkoutPlan(days, focus);
    onPlanGenerated(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 className="text-xl font-black text-white">Planificador de Entrenamiento</h3>
          <button onClick={onClose} className="text-gray-500 font-bold text-xl hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[10px] text-amber-400 font-medium leading-relaxed">
          ⚠️ <strong>Aviso de Salud:</strong> Consulta a un profesional médico antes de iniciar cualquier plan de entrenamiento físico.
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">¿Cuántos días a la semana quieres entrenar?</p>
            <div className="flex gap-3">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => { setDays(num); setStep(2); }}
                  className={`flex-1 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
                    days === num ? 'bg-white text-black' : 'bg-[#222] text-white border border-white/10'
                  }`}
                >
                  {num} días
                </button>
              ))}
            </div>
            <button onClick={onClose} className="w-full py-3 text-gray-500 text-xs font-bold uppercase tracking-widest">Cancelar</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">Elige el enfoque principal:</p>
            <div className="space-y-2">
              {[
                { id: 'fuerza', label: 'Fuerza (5-8 repeticiones)' },
                { id: 'hipertrofia', label: 'Hipertrofia (8-12 repeticiones)' },
                { id: 'mixto', label: 'Mixto (6-10 repeticiones)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setFocus(opt.id); setStep(3); }}
                  className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                    focus === opt.id ? 'bg-white text-black' : 'bg-[#222] text-white border border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="w-full py-3 text-gray-500 text-xs font-bold uppercase tracking-widest">← Atrás</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h4 className="text-white font-black text-lg">Rutina generada</h4>
              <p className="text-xs text-gray-400">
                {days} días / semana · Enfoque: {focus}
              </p>
            </div>
            <div className="bg-[#222] p-4 rounded-2xl border border-white/10 text-xs text-gray-300 space-y-2 max-h-48 overflow-y-auto">
              {generateWorkoutPlan(days, focus).days.map((d) => {
                const session = generateWorkoutPlan(days, focus).sessions[d];
                return (
                  <div key={d} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-bold">Día {d}</span>
                    <span className="text-gray-400">{session.name}</span>
                    <span className="text-gray-500">{session.exercises.length} ejercicios</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={handleGenerate} className="flex-1 py-4 bg-white text-black font-black rounded-full text-xs uppercase tracking-widest">
                Aceptar plan
              </button>
              <button onClick={() => setStep(2)} className="py-4 px-6 bg-transparent border border-white/10 text-white font-black rounded-full text-xs uppercase tracking-widest">
                Atrás
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EXERCISE_ANALYTICS = {
  bench: { name: 'Press Inclinado', history: [10, 10, 12, 12, 14, 15], unit: 'kg', gain: '+5 kg' },
  squat: { name: 'Sentadilla Búlgara', history: [5, 7.5, 7.5, 10, 10, 12.5], unit: 'kg', gain: '+7.5 kg' },
  row: { name: 'Remo Gironda', history: [25, 25, 30, 30, 35, 35], unit: 'kg', gain: '+10 kg' },
  dl: { name: 'Hip Thrust', history: [40, 45, 50, 55, 60, 65], unit: 'kg', gain: '+25 kg' }
};

const MARIO_WORLDS = [
  { id: 1, range: 'Días 1 - 10', title: 'Fase I: Foundations', items: ['Recovery Tea', '150 Studio Points'], calories: '21,000 kcal', prot: '1,650g', muscleSets: { Pecho: 16, Espalda: 16, Pierna: 12, Hombro: 10 }, trophies: ['first_log', 'world_1'] },
  { id: 2, range: 'Días 11 - 20', title: 'Fase II: Momentum', items: ['Focus Candle', 'Silver Badge'], calories: '42,000 kcal', prot: '3,300g', muscleSets: { Pecho: 32, Espalda: 32, Pierna: 24, Hombro: 20 }, trophies: ['bench_68', 'streak_7'] },
  { id: 3, range: 'Días 21 - 30', title: 'Fase III: Architecture', items: ['Silk Shield', 'Time Crown'], calories: '63,000 kcal', prot: '4,950g', muscleSets: { Pecho: 48, Espalda: 48, Pierna: 36, Hombro: 30 }, trophies: ['squat_100'] },
  { id: 4, range: 'Días 31 - 40', title: 'Fase IV: The Shift', items: ['Rose Mist', '500 Studio Points'], calories: '84,000 kcal', prot: '6,600g', muscleSets: { Pecho: 64, Espalda: 64, Pierna: 48, Hombro: 40 }, trophies: ['world_3'] },
  { id: 5, range: 'Días 41 - 50', title: 'Fase V: Peak Form', items: ['Gold Accent', 'Pro Trophy'], calories: '105,000 kcal', prot: '8,250g', muscleSets: { Pecho: 80, Espalda: 80, Pierna: 60, Hombro: 50 }, trophies: ['macro_master'] },
  { id: 6, range: 'Días 51 - 60', title: 'Fase VI: Metamorphosis', items: ['Black Card', 'Diamond Quartz'], calories: '126,000 kcal', prot: '9,900g', muscleSets: { Pecho: 96, Espalda: 96, Pierna: 72, Hombro: 60 }, trophies: ['legend_60'] }
];

const TROPHY_DEFINITIONS = {
  first_log: { title: 'First Steps', desc: 'Registra tu primera serie de entreno', icon: '✦' },
  bench_68: { title: 'Upper Strength', desc: 'Supera tu récord en tren superior', icon: '✦' },
  streak_7: { title: 'Flawless Week', desc: 'Completa 7 días de nutrición', icon: '✦' },
  world_1: { title: 'Chapter I', desc: 'Completa los primeros 10 días', icon: '✦' },
  squat_100: { title: 'Lower Dominance', desc: 'Supera tu meta en piernas', icon: '✦' },
  world_3: { title: 'Halfway Mark', desc: 'Llega al ecuador del proceso', icon: '✦' },
  macro_master: { title: 'Lens Master', desc: 'Escanea 15 platos con la cámara', icon: '✦' },
  legend_60: { title: 'The Icon', desc: 'Finaliza los 60 días completos', icon: '✦' }
};

const calculateScienceMacros = (profile) => {
  if (!profile || !profile.peso || !profile.altura || !profile.edad) {
    return { cal: 2000, protein: 140, carbs: 200, fat: 60 };
  }

  const peso = parseFloat(profile.peso);
  const altura = parseFloat(profile.altura);
  const edad = parseInt(profile.edad);

  let bmr = (10 * peso) + (6.25 * altura) - (5 * edad);
  bmr += (profile.genero === 'mujer' || profile.genero === 'femenino') ? -161 : 5;

  const activityMultipliers = { sedentario: 1.2, ligero: 1.375, moderado: 1.55, intenso: 1.725 };
  const actKey = profile.actividad ? profile.actividad.toLowerCase() : 'moderado';
  const tdee = bmr * (activityMultipliers[actKey] || 1.375);

  let targetCal = tdee;
  const obj = profile.objetivo ? profile.objetivo.toLowerCase() : '';
  if (obj.includes('perder') || obj.includes('definición') || obj.includes('grasa')) {
    targetCal -= 300; 
  } else if (obj.includes('ganar') || obj.includes('volumen') || obj.includes('músculo')) {
    targetCal += 250; 
  }

  const protein = Math.round(peso * 2.0); 
  const fat = Math.round(peso * 0.9); 
  const remainingCal = targetCal - (protein * 4) - (fat * 9);
  const carbs = Math.max(50, Math.round(remainingCal / 4)); 

  return { cal: Math.round(targetCal), protein, carbs, fat };
};

export default function App() {
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }, []);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('app_theme_dark');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => { localStorage.setItem('app_theme_dark', isDark); }, [isDark]);

  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#F9F9F9]',
    card: isDark ? 'bg-[#111111]' : 'bg-white',
    border: isDark ? 'border-white/10' : 'border-black/10',
    text: isDark ? 'text-white' : 'text-black',
    muted: isDark ? 'text-gray-500' : 'text-gray-500',
    primary: isDark ? 'bg-white text-black' : 'bg-black text-white',
    secondary: isDark ? 'bg-[#222] text-white' : 'bg-gray-100 text-black',
    navBg: isDark ? 'bg-[#050505]/95' : 'bg-[#F9F9F9]/95',
    shadow: isDark ? 'shadow-2xl shadow-white/5' : 'shadow-2xl shadow-black/5',
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('active_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [editProfile, setEditProfile] = useState(() => ({
    name: userProfile?.name || 'Atleta',
    peso: userProfile?.peso || '75',
    altura: userProfile?.altura || '175',
    edad: userProfile?.edad || '28',
    genero: userProfile?.genero || 'hombre',
    objetivo: userProfile?.objetivo || 'Recomposición',
    equipamientoArray: Array.isArray(userProfile?.equipamientoArray) ? userProfile.equipamientoArray : ['mancuernas', 'banco'],
    customMacros: userProfile?.customMacros || null
  }));

  useEffect(() => {
    if (userProfile) {
      setEditProfile({
        name: userProfile.name || 'Atleta',
        peso: userProfile.peso || '75',
        altura: userProfile.altura || '175',
        edad: userProfile.edad || '28',
        genero: userProfile.genero || 'hombre',
        objetivo: userProfile.objetivo || 'Recomposición',
        equipamientoArray: Array.isArray(userProfile.equipamientoArray) ? userProfile.equipamientoArray : ['mancuernas', 'banco'],
        customMacros: userProfile.customMacros || null
      });
    }
  }, [userProfile]);

  const [authStep, setAuthStep] = useState(userProfile ? 'app' : 'login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  const userKey = userProfile?.email ? `user_${userProfile.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'guest';
  const DEV_EMAIL = 'mlorenzod@gmail.com'; 
  const isDeveloper = userProfile?.email === DEV_EMAIL;

  const [startDate] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_reto_start_date`);
    if (saved) return new Date(saved);
    const now = new Date();
    localStorage.setItem(`${userKey}_reto_start_date`, now.toISOString());
    return now;
  });

  const [trialStartDate] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_trial_start_date`);
    if (saved) return new Date(saved);
    const now = new Date();
    localStorage.setItem(`${userKey}_trial_start_date`, now.toISOString());
    return now;
  });

  const [isPro, setIsPro] = useState(() => isDeveloper || localStorage.getItem(`${userKey}_is_pro`) === 'true');
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const calculateDaysSinceTrial = () => {
    const diffTime = Math.abs(new Date() - new Date(trialStartDate));
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysSinceTrial = calculateDaysSinceTrial();
  const trialDaysLeft = Math.max(0, 7 - daysSinceTrial);
  const isTrialActive = daysSinceTrial < 7;

  const verifyAccessOrShowPaywall = () => {
    if (isPro || isDeveloper || isTrialActive) return true;
    setShowPaywallModal(true);
    return false;
  };

  const calculateRealDay = () => {
    const diffTime = Math.abs(new Date() - new Date(startDate));
    return Math.min(60, Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));
  };

  const realDay = calculateRealDay();
  const [selectedDay, setSelectedDay] = useState(realDay);

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_workouts`);
    return saved ? JSON.parse(saved) : null;
  });

  const [workoutPlan, setWorkoutPlan] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_workout_plan`);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return generateWorkoutPlan(3, 'hipertrofia');
  });

  const [showPlanner, setShowPlanner] = useState(false);

  const [bodyLogs, setBodyLogs] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_body_logs`);
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyNutritionLogs, setDailyNutritionLogs] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_nutrition_logs`);
    return saved ? JSON.parse(saved) : {};
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_workout_logs`);
    return saved ? JSON.parse(saved) : {};
  });

  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_xp`);
    return saved ? Number(saved) : 0;
  });

  const [userPhotos, setUserPhotos] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_photos`);
    return saved ? JSON.parse(saved) : {};
  });

  const [personalizedRecipe, setPersonalizedRecipe] = useState(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [recipeError, setRecipeError] = useState(null);

  const [isAnalyzingStrategy, setIsAnalyzingStrategy] = useState(false);
  const [strategyReport, setStrategyReport] = useState(null);
  const [showStrategyModal, setShowStrategyModal] = useState(false);

  // ESTADOS DE NUTRICIÓN
  const [nutritionViewMode, setNutritionViewMode] = useState('daily');
  const [showMacroBreakdownChart, setShowMacroBreakdownChart] = useState(true); // Desplegado por defecto
  const [showCustomIngredientForm, setShowCustomIngredientForm] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientUnit, setNewIngredientNameUnit] = useState('g');
  const [newIngredientQty, setNewIngredientQty] = useState('100');
  const [isCalculatingNewIngredient, setIsCalculatingNewIngredient] = useState(false);

  // ESTADO REEMPLAZAR EJERCICIO CON IA
  const [replacingExerciseId, setReplacingExerciseId] = useState(null);

  // CÁMARA TRASERA / FRONTAL PARA PROGRESO
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");

  // CÁLCULO DINÁMICO DE MACROS OBJETIVO
  const baseTargetMacros = userProfile?.customMacros || calculateScienceMacros(userProfile);
  
  const isWeeklyView = nutritionViewMode === 'weekly';
  const targetMacros = isWeeklyView ? {
    cal: baseTargetMacros.cal * 7,
    protein: baseTargetMacros.protein * 7,
    carbs: baseTargetMacros.carbs * 7,
    fat: baseTargetMacros.fat * 7,
  } : baseTargetMacros;

  const calculateWeeklyNutrition = () => {
    let cal = 0, protein = 0, carbs = 0, fat = 0;
    const startDay = Math.max(1, selectedDay - 6);
    for (let d = startDay; d <= selectedDay; d++) {
      const log = dailyNutritionLogs[d] || { cal: 0, protein: 0, carbs: 0, fat: 0 };
      cal += log.cal;
      protein += log.protein;
      carbs += log.carbs;
      fat += log.fat;
    }
    return { cal, protein, carbs, fat };
  };

  const currentMacros = isWeeklyView 
    ? calculateWeeklyNutrition() 
    : (dailyNutritionLogs[selectedDay] || { cal: 0, protein: 0, carbs: 0, fat: 0 });

  const calPercentage = Math.min(100, Math.round((currentMacros.cal / targetMacros.cal) * 100));
  const isCalorieSurplus = currentMacros.cal > targetMacros.cal;
  const calorieExcessVal = Math.max(0, currentMacros.cal - targetMacros.cal);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(`${userKey}_body_logs`, JSON.stringify(bodyLogs));
      localStorage.setItem(`${userKey}_nutrition_logs`, JSON.stringify(dailyNutritionLogs));
      localStorage.setItem(`${userKey}_workout_logs`, JSON.stringify(logs));
      localStorage.setItem(`${userKey}_xp`, userXP.toString());
      localStorage.setItem(`${userKey}_photos`, JSON.stringify(userPhotos));
      localStorage.setItem(`${userKey}_is_pro`, isPro.toString());
      localStorage.setItem(`${userKey}_workout_plan`, JSON.stringify(workoutPlan));
      if (workouts) localStorage.setItem(`${userKey}_workouts`, JSON.stringify(workouts));
    }
  }, [bodyLogs, dailyNutritionLogs, logs, userXP, userPhotos, isPro, userKey, userProfile, workoutPlan, workouts]);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showManagePhotosModal, setShowManagePhotosModal] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const savedDaysWithPhotos = Object.keys(userPhotos).map(Number).sort((a,b) => a-b);
  const [compareDay, setCompareDay] = useState(savedDaysWithPhotos[0] || 1);
  const [compareMode, setCompareMode] = useState('blend'); 
  const [blendOpacity, setBlendOpacity] = useState(0.5);
  const [sliderPos, setSliderPos] = useState(50);
  const [showAnatomicalGuide, setShowAnatomicalGuide] = useState(true);

  const [activeLayer, setActiveLayer] = useState('top');
  const [baseScale, setBaseScale] = useState(1);
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(0);
  const [topScale, setTopScale] = useState(1);
  const [topX, setTopX] = useState(0);
  const [topY, setTopY] = useState(0);

  const fileInputRef = useRef(null);
  const mealFileInputRef = useRef(null);
  const mealCameraInputRef = useRef(null); 
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState('entreno');
  const [restDays, setRestDays] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedWorldModal, setSelectedWorldModal] = useState(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [textFoodInput, setTextFoodInput] = useState('');
  
  // ESTADOS DE CONTROL DE AUDIO INTERACTIVO
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  const [selectedMetric, setSelectedMetric] = useState('waist');
  const [selectedAnalyticsEx, setSelectedAnalyticsEx] = useState('bench');
  
  const [trackerWeight, setTrackerWeight] = useState(userProfile?.peso || '75');
  const [trackerWaist, setTrackerWaist] = useState('');
  const [trackerChest, setTrackerChest] = useState('');
  const [trackerArm, setTrackerArm] = useState('');

  // NORMALIZACIÓN DE IMAGEN CON CANVAS (UNIFICA GALERÍA Y CÁMARA)
  const compressImageForAI = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Limpiar fondo a negro antes de dibujar por transparencia en PNGs
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const base64Url = canvas.toDataURL('image/jpeg', 0.8);
          const base64Data = base64Url.split(',')[1];
          resolve({ base64Data, base64Url, mimeType: 'image/jpeg' });
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProfileSettings = (e) => {
    e.preventDefault();
    const recalculated = {
      ...editProfile,
      customMacros: editProfile.customMacros || calculateScienceMacros(editProfile)
    };
    localStorage.setItem('active_user_profile', JSON.stringify(recalculated));
    setUserProfile(recalculated);
    setShowSettingsModal(false);
    alert('¡Perfil, objetivos y macros recalculados correctamente!');
  };

  const handleEquipmentToggle = (equipId) => {
    const currentEquip = Array.isArray(editProfile?.equipamientoArray) ? editProfile.equipamientoArray : ['mancuernas'];
    const exists = currentEquip.includes(equipId);
    let updated = exists 
      ? currentEquip.filter(item => item !== equipId) 
      : [...currentEquip, equipId];
    setEditProfile({ ...editProfile, equipamientoArray: updated });
  };

  const checkMacroContradictions = (profile) => {
    if (!profile) return null;
    const science = calculateScienceMacros(profile);
    const custom = profile.customMacros || science;
    const obj = (profile.objetivo || '').toLowerCase();

    if (obj.includes('ganar') && custom.cal < science.cal - 100) {
      return "⚠️ Contradicción detectada: Has seleccionado 'Ganar Músculo', pero tus calorías fijadas están por debajo de tu gasto calórico diario. Para ganar masa muscular eficientemente se suele recomendar un ligero superávit calórico (Mifflin-St Jeor). Puedes mantener tu cifra si sigues un protocolo personalizado.";
    }
    if (obj.includes('perder') && custom.cal > science.cal + 100) {
      return "⚠️ Contradicción detectada: Has seleccionado 'Perder Grasa', pero tus calorías objetivo superan tu tasa metabólica recomendada en déficit. Puedes ajustar libremente la cifra según tu criterio o fuente nutricional.";
    }
    return null;
  };

  const handleRecalculateMacrosClick = () => {
    const science = calculateScienceMacros(editProfile);
    setEditProfile({ ...editProfile, customMacros: science });
  };

  const replaceExerciseWithAI = async (exercise) => {
    if (!verifyAccessOrShowPaywall()) return;
    setReplacingExerciseId(exercise.id);

    try {
      const equipText = (userProfile?.equipamientoArray || ['mancuernas', 'barra']).join(', ');
      const promptText = `Reemplaza el ejercicio "${exercise.name}" (Objetivo muscular: ${exercise.target}) por otro ejercicio equivalente e ideal para el mismo grupo muscular.
      El usuario solo dispone de este equipamiento: ${equipText}.
      Devuelve ÚNICAMENTE un JSON estricto:
      {"name": "Nombre del Ejercicio", "target": "${exercise.target}", "sets": "${exercise.sets}", "reps": "${exercise.reps}"}`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          parts: [{ text: promptText }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al reemplazar ejercicio');

      const rawText = data.text || (data.candidates && data.candidates[0]?.content?.parts[0]?.text) || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Respuesta de IA no válida');

      const newExData = JSON.parse(jsonMatch[0]);

      const dayOfWeek = ((selectedDay - 1) % 7) + 1;
      const updatedPlan = { ...workoutPlan };
      if (updatedPlan.sessions[dayOfWeek]) {
        updatedPlan.sessions[dayOfWeek].exercises = updatedPlan.sessions[dayOfWeek].exercises.map(ex => {
          if (ex.id === exercise.id) {
            return {
              ...ex,
              name: newExData.name || ex.name,
              sets: newExData.sets || ex.sets,
              reps: newExData.reps || ex.reps
            };
          }
          return ex;
        });
        setWorkoutPlan(updatedPlan);
        localStorage.setItem(`${userKey}_workout_plan`, JSON.stringify(updatedPlan));
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo reemplazar el ejercicio. Inténtalo nuevamente.");
    } finally {
      setReplacingExerciseId(null);
    }
  };

  const generateInitialRoutine = async (profileData) => {
    setAuthStep('generating_routine');
    try {
      const equipText = (profileData.equipamientoArray || ['mancuernas']).join(', ');
      const prompt = `Actúa como un Head Coach especialista en hipertrofia basada en evidencia. 
      Diseña una rutina Torso/Pierna (Upper/Lower) de 3 ejercicios por día para un usuario cuyo objetivo es: ${profileData.objetivo || 'Recomposición'} y dispone ÚNICAMENTE de este equipamiento: ${equipText}.
      Devuelve SOLO un JSON estricto con esta estructura exacta:
      {
        "torso": [
          { "id": "t1", "name": "Nombre Ejercicio", "target": "Músculo", "defaultPR": 20, "sets": "4 x 8-10", "img": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80", "alts": ["Alt1", "Alt2"] }
        ],
        "pierna": [
          { "id": "p1", "name": "Nombre Ejercicio", "target": "Músculo", "defaultPR": 40, "sets": "4 x 8-10", "img": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80", "alts": ["Alt1", "Alt2"] }
        ]
      }`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          parts: [{ text: prompt }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el backend');

      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const generatedWorkouts = JSON.parse(jsonMatch[0]);
        setWorkouts(generatedWorkouts);
        localStorage.setItem(`user_${profileData.email.replace(/[^a-zA-Z0-9]/g, '_')}_workouts`, JSON.stringify(generatedWorkouts));
      }
    } catch (err) {
      console.error("Error al generar rutina IA, cargando rutina base.", err);
      setWorkouts(null);
    } finally {
      setAuthStep('app');
    }
  };

  const processFoodWithGemini = async (promptContent) => {
    if (!verifyAccessOrShowPaywall()) return;
    setIsScanning(true);
    try {
      const systemInstruction = `Analiza la siguiente comida. Devuelve SOLO un JSON estricto sin bloques markdown. Formato exacto:
      {"dishName": "Nombre del plato", "foods": [{"name": "Ingrediente", "unitType": "g", "grams": 150, "unitWeight": 100, "cal": 220, "prot": 25, "carbs": 20, "fat": 8}], "goalFeedback": "Un comentario breve y motivador en máximo 12 palabras."}
      Instrucción sobre unitType: si el alimento se cuenta mejor por unidades (ej. huevo, manzana, rebanada de pan), coloca "ud", asigna grams como número de unidades y coloca en unitWeight el peso en gramos de 1 unidad. De lo contrario, asigna unitType "g" y unitWeight 1.`;

      let parts = [];
      if (typeof promptContent === 'string') {
        parts = [{ text: systemInstruction + '\n' + promptContent }];
      } else if (promptContent && promptContent.inlineData) {
        parts = [
          { text: systemInstruction },
          { inlineData: { mimeType: promptContent.inlineData.mimeType, data: promptContent.inlineData.data } }
        ];
      } else {
        throw new Error('Formato de entrada no soportado');
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          parts,
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el backend');

      const rawText = data.text || (data.candidates && data.candidates[0]?.content?.parts[0]?.text) || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Formato de respuesta inválido');
      
      const scanData = JSON.parse(jsonMatch[0]);

      const formattedFoods = scanData.foods.map(f => ({
        ...f,
        unitType: f.unitType || 'g',
        unitWeight: f.unitWeight || (f.unitType === 'ud' ? 60 : 1),
        baseCalPerUnit: (f.cal / (f.grams || 1)),
        baseProtPerUnit: (f.prot / (f.grams || 1)),
        baseCarbsPerUnit: (f.carbs / (f.grams || 1)),
        baseFatPerUnit: (f.fat / (f.grams || 1)),
      }));

      setScanResult({
        dishName: scanData.dishName,
        img: promptContent.previewUrl || null,
        foods: formattedFoods,
        goalFeedback: scanData.goalFeedback
      });
      setUserXP(prev => prev + 50);
    } catch (error) {
      console.error("Error procesando la comida:", error);
      alert("No se pudo procesar la lectura. Inténtalo de nuevo.");
    } finally {
      setIsScanning(false);
    }
  };

  const calculateCustomIngredientWithGemini = async () => {
    if (!newIngredientName.trim()) return alert("Ingresa el nombre del alimento.");
    if (!verifyAccessOrShowPaywall()) return;
    
    setIsCalculatingNewIngredient(true);
    try {
      const qtyNum = parseFloat(newIngredientQty) || 100;
      const promptText = `Devuelve ÚNICAMENTE un JSON estricto sin bloques markdown para la información nutricional de: "${qtyNum} ${newIngredientUnit === 'ud' ? 'unidades de' : 'gramos de'} ${newIngredientName}".
      Estructura estricta:
      {"name": "${newIngredientName}", "unitType": "${newIngredientUnit}", "grams": ${qtyNum}, "unitWeight": ${newIngredientUnit === 'ud' ? 60 : 1}, "cal": 150, "prot": 10, "carbs": 15, "fat": 2}`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          parts: [{ text: promptText }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al calcular ingrediente');

      const rawText = data.text || (data.candidates && data.candidates[0]?.content?.parts[0]?.text) || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Respuesta de IA no válida');

      const calcData = JSON.parse(jsonMatch[0]);

      const cal = parseFloat(calcData.cal) || 0;
      const prot = parseFloat(calcData.prot) || 0;
      const carbs = parseFloat(calcData.carbs) || 0;
      const fat = parseFloat(calcData.fat) || 0;

      const newItem = {
        name: calcData.name || newIngredientName,
        unitType: newIngredientUnit,
        grams: qtyNum,
        unitWeight: parseFloat(calcData.unitWeight) || 1,
        cal: Math.round(cal),
        prot: Math.round(prot),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        baseCalPerUnit: cal / qtyNum,
        baseProtPerUnit: prot / qtyNum,
        baseCarbsPerUnit: carbs / qtyNum,
        baseFatPerUnit: fat / qtyNum,
      };

      setScanResult(prev => ({ ...prev, foods: [...prev.foods, newItem] }));
      setNewIngredientName('');
      setShowCustomIngredientForm(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo obtener la información nutricional. Inténtalo de nuevo.");
    } finally {
      setIsCalculatingNewIngredient(false);
    }
  };

  const handleMealImageUpload = async (e) => {
    if (!verifyAccessOrShowPaywall()) return;
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsScanning(true);
      const { base64Data, base64Url, mimeType } = await compressImageForAI(file);
      await processFoodWithGemini({
        inlineData: { mimeType, data: base64Data },
        previewUrl: base64Url
      });
    } catch (err) {
      console.error(err);
      alert("Error al procesar la imagen seleccionada.");
      setIsScanning(false);
    } finally {
      e.target.value = '';
    }
  };

  const handleTextFoodSubmit = (e) => { 
    e.preventDefault(); 
    if (!verifyAccessOrShowPaywall()) return;
    if (textFoodInput.trim()) { 
      processFoodWithGemini(`Procesa: "${textFoodInput}"`); 
      setTextFoodInput(''); 
    } 
  };

  // CONTROL INTERACTIVO DE GRABACIÓN Y PREVIEW DE AUDIO
  const startAudioRecording = async () => {
    if (!verifyAccessOrShowPaywall()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingAudio(false);
  };

  const discardAudioRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlayingAudio(false);
  };

  const processAudioRecordingWithAI = () => {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      const mime = audioBlob.type.split(';')[0] || 'audio/webm';
      processFoodWithGemini({
        inlineData: {
          mimeType: mime,
          data: base64Audio
        }
      });
      discardAudioRecording();
    };
    reader.readAsDataURL(audioBlob);
  };

  const handleFoodQuantityChange = (index, newQuantity) => {
    if (!scanResult) return;
    const updatedFoods = [...scanResult.foods];
    const currentFood = { ...updatedFoods[index] };

    const qty = Math.max(0, parseFloat(newQuantity) || 0);
    currentFood.grams = qty;

    const baseCal = currentFood.baseCalPerUnit || (currentFood.cal / (qty || 1));
    const baseProt = currentFood.baseProtPerUnit || (currentFood.prot / (qty || 1));
    const baseCarbs = currentFood.baseCarbsPerUnit || (currentFood.carbs / (qty || 1));
    const baseFat = currentFood.baseFatPerUnit || (currentFood.fat / (qty || 1));

    currentFood.cal = Math.round(baseCal * qty);
    currentFood.prot = Math.round(baseProt * qty);
    currentFood.carbs = Math.round(baseCarbs * qty);
    currentFood.fat = Math.round(baseFat * qty);

    updatedFoods[index] = currentFood;
    setScanResult({ ...scanResult, foods: updatedFoods });
  };

  const handleUnitTypeToggle = (index, newUnit) => {
    if (!scanResult) return;
    const updatedFoods = [...scanResult.foods];
    const currentFood = { ...updatedFoods[index] };

    if (currentFood.unitType !== newUnit) {
      currentFood.unitType = newUnit;
      if (newUnit === 'ud') {
        currentFood.grams = 1; 
        currentFood.unitWeight = currentFood.unitWeight || 60;
        currentFood.baseCalPerUnit = currentFood.cal;
        currentFood.baseProtPerUnit = currentFood.prot;
        currentFood.baseCarbsPerUnit = currentFood.carbs;
        currentFood.baseFatPerUnit = currentFood.fat;
      } else {
        currentFood.grams = 100; 
        currentFood.baseCalPerUnit = currentFood.cal / 100;
        currentFood.baseProtPerUnit = currentFood.prot / 100;
        currentFood.baseCarbsPerUnit = currentFood.carbs / 100;
        currentFood.baseFatPerUnit = currentFood.fat / 100;
      }
    }

    updatedFoods[index] = currentFood;
    setScanResult({ ...scanResult, foods: updatedFoods });
  };

  const handleFoodNameChange = (index, newName) => {
    if (!scanResult) return;
    const updatedFoods = [...scanResult.foods];
    updatedFoods[index].name = newName;
    setScanResult({ ...scanResult, foods: updatedFoods });
  };

  const handleRemoveFoodItem = (index) => {
    if (!scanResult) return;
    const updatedFoods = scanResult.foods.filter((_, i) => i !== index);
    setScanResult({ ...scanResult, foods: updatedFoods });
  };

  const generatePersonalizedRecipe = async () => {
    if (!verifyAccessOrShowPaywall()) return;
    setIsGeneratingRecipe(true); 
    setRecipeError(null);
    
    try {
      const neededCal = Math.max(300, targetMacros.cal - currentMacros.cal);
      const neededProt = Math.max(20, targetMacros.protein - currentMacros.protein);

      const prompt = `Actúa como Chef Fitness Pro. Genera 1 receta para un objetivo de ${userProfile?.objetivo || 'Recomposición'}. Faltan ${neededCal} kcal y ${neededProt}g de proteína hoy. Restricciones: ${userProfile?.restricciones || 'ninguna'}.
      Devuelve ÚNICAMENTE JSON estricto:
      {
        "title": "Nombre",
        "prepTime": "15 min",
        "cal": ${neededCal},
        "prot": ${neededProt},
        "carbs": 35,
        "fat": 12,
        "ingredients": ["Ingrediente 1"],
        "steps": ["Paso 1."],
        "chefTip": "Nota nutricional basada en ciencia."
      }`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          parts: [{ text: prompt }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el backend');

      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Formato de respuesta inválido');
      
      const recipeData = JSON.parse(jsonMatch[0]);
      recipeData.img = selectRecipeImage(recipeData.title, recipeData.ingredients);

      setPersonalizedRecipe(recipeData);
      setUserXP(prev => prev + 30);
    } catch (err) { 
      console.error(err);
      setRecipeError('Error al crear la receta con IA. Inténtalo de nuevo.'); 
    } finally { 
      setIsGeneratingRecipe(false); 
    }
  };

  const generateStrategyStudy = async () => {
    if (!verifyAccessOrShowPaywall()) return;
    setIsAnalyzingStrategy(true);
    try {
      const prompt = `Actúa como Head Coach. Devuelve SOLO JSON.
      {"summary": "Resumen", "strengths": ["..."], "weaknesses": ["..."], "macroAdjustment": { "cal": ${targetMacros.cal}, "protein": ${targetMacros.protein}, "carbs": ${targetMacros.carbs}, "fat": ${targetMacros.fat}, "reason": "Justificación..." }, "trainingAdjustment": "...", "nutritionTip": "...", "mindsetTip": "..."}`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          parts: [{ text: prompt }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el backend');

      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setStrategyReport(JSON.parse(jsonMatch[0]));
        setShowStrategyModal(true);
      }
    } catch (err) { 
      console.error(err);
      alert('Error al generar el estudio.'); 
    } finally { 
      setIsAnalyzingStrategy(false); 
    }
  };

  const processAndAlignImage = (sourceImage, targetWidth = 1080) => {
    const targetHeight = (targetWidth * 16) / 9;
    const canvas = document.createElement('canvas'); 
    canvas.width = targetWidth; 
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    const sourceRatio = sourceImage.width / sourceImage.height;
    const targetRatio = targetWidth / targetHeight;
    let renderWidth, renderHeight, offsetX, offsetY;
    if (sourceRatio > targetRatio) {
      renderHeight = sourceImage.height; renderWidth = sourceImage.height * targetRatio;
      offsetX = (sourceImage.width - renderWidth) / 2; offsetY = 0;
    } else {
      renderWidth = sourceImage.width; renderHeight = sourceImage.width / targetRatio;
      offsetX = 0; offsetY = (sourceImage.height - renderHeight) / 2;
    }
    ctx.drawImage(sourceImage, offsetX, offsetY, renderWidth, renderHeight, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleMultipleFileUpload = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const fileTimestamp = file.lastModified || Date.now();
      const detectedDay = Math.min(60, Math.max(1, Math.floor((new Date(fileTimestamp).setHours(0,0,0,0) - new Date(startDate).setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)) + 1));
      const userChoice = window.prompt(`📸 Foto: "${file.name}"\n🎯 Día detectado: ${detectedDay}\nIndica el DÍA (1-60) para guardar:`, detectedDay);
      if (userChoice && !isNaN(parseInt(userChoice))) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => setUserPhotos(prev => ({ ...prev, [parseInt(userChoice)]: processAndAlignImage(img) }));
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  const startCamera = async () => {
    setShowCameraModal(true);
    setTimeout(async () => {
      try { 
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } }); 
        if (videoRef.current) videoRef.current.srcObject = stream; 
      } catch (err) { 
        alert("No se pudo acceder a la cámara seleccionada."); 
        setShowCameraModal(false); 
      }
    }, 300);
  };

  const toggleCameraLens = () => {
    const nextMode = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(nextMode);
    if (showCameraModal) {
      setTimeout(() => startCamera(), 100);
    }
  };

  const stopCamera = () => { 
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); 
    setShowCameraModal(false); 
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas'); 
      canvas.width = videoRef.current.videoWidth; 
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const img = new Image();
      img.onload = () => { 
        setUserPhotos(prev => ({ ...prev, [selectedDay]: processAndAlignImage(img) })); 
        stopCamera(); 
      };
      img.src = canvas.toDataURL('image/jpeg');
    }
  };

  const toggleRestDay = (dayNum) => setRestDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  
  const handleLogSet = (exId, weight, reps) => {
    const logKey = `day_${selectedDay}_${exId}`;
    setLogs(prev => ({ ...prev, [logKey]: [...(prev[logKey] || []), { weight, reps }] }));
    setUserXP(prev => prev + 25);
  };
  
  const handleConfirmScan = () => {
    if (!scanResult) return;
    const { foods } = scanResult;
    setDailyNutritionLogs(prev => ({
      ...prev, [selectedDay]: {
        cal: (prev[selectedDay]?.cal || 0) + foods.reduce((a, b) => a + (b.cal || 0), 0),
        protein: (prev[selectedDay]?.protein || 0) + foods.reduce((a, b) => a + (b.prot || 0), 0),
        carbs: (prev[selectedDay]?.carbs || 0) + foods.reduce((a, b) => a + (b.carbs || 0), 0),
        fat: (prev[selectedDay]?.fat || 0) + foods.reduce((a, b) => a + (b.fat || 0), 0)
      }
    }));
    setScanResult(null);
  };

  const handleSavePhysicalTracking = () => {
    if (!trackerWaist) return alert('Cintura requerida para el historial clínico.');
    const newLog = { 
      day: selectedDay, 
      weight: parseFloat(trackerWeight) || 0, 
      waist: parseFloat(trackerWaist) || 0, 
      chest: parseFloat(trackerChest) || 0,
      arm: parseFloat(trackerArm) || 0
    };

    const updatedLogs = [...bodyLogs.filter(b => b.day !== selectedDay), newLog].sort((a,b) => a.day - b.day);
    setBodyLogs(updatedLogs);
    localStorage.setItem(`${userKey}_body_logs`, JSON.stringify(updatedLogs));
    setUserXP(prev => prev + 50);
    alert(`¡Medidas guardadas correctamente para el Día ${selectedDay}!`);
  };

  const handlePlanGenerated = (plan) => {
    setWorkoutPlan(plan);
    localStorage.setItem(`${userKey}_workout_plan`, JSON.stringify(plan));
  };

  const isTrainingDay = (dayNum) => {
    const dayOfWeek = ((dayNum - 1) % 7) + 1;
    return workoutPlan.days.includes(dayOfWeek);
  };

  const getDayExercises = (dayNum) => {
    const dayOfWeek = ((dayNum - 1) % 7) + 1;
    if (!workoutPlan.days.includes(dayOfWeek)) return [];
    const session = workoutPlan.sessions[dayOfWeek];
    return session ? session.exercises : [];
  };

  const rootStyle = { fontFamily: "'Montserrat', sans-serif" };

  if (authStep === 'generating_routine') {
    return (
      <div style={rootStyle} className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col items-center justify-center p-6 transition-colors duration-500`}>
        <div className={`w-full max-w-sm ${theme.card} border ${theme.border} rounded-[2.5rem] p-12 shadow-2xl text-center space-y-8 animate-pulse`}>
          <div className="w-16 h-16 border-4 border-t-white border-white/20 rounded-full animate-spin mx-auto"></div>
          <div>
            <h2 className="text-2xl font-black mb-2">Diseñando protocolo...</h2>
            <p className={`text-sm ${theme.muted} leading-relaxed`}>La IA está analizando tu biometría y creando tu rutina personalizada.</p>
          </div>
        </div>
      </div>
    );
  }

  if (authStep === 'login') {
    return (
      <div style={rootStyle} className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-6 transition-colors duration-500`}>
        <div className={`w-full max-w-sm ${theme.card} border ${theme.border} rounded-[2.5rem] p-10 shadow-2xl space-y-8`}>
          <div className="text-center space-y-2">
            <span className={`text-[10px] font-bold tracking-widest ${theme.muted} uppercase block`}>Science Based</span>
            <h1 className="text-4xl font-black tracking-tight">STUDIO</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (loginName) setAuthStep('onboarding'); }} className="space-y-4">
            <div>
              <label className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Nombre</label>
              <input type="text" required value={loginName} onChange={(e) => setLoginName(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-3 text-sm outline-none transition-colors`} />
            </div>
            <div>
              <label className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Email</label>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-3 text-sm outline-none transition-colors`} />
            </div>
            <button type="submit" className={`w-full py-4 mt-6 ${theme.primary} font-black rounded-full text-xs uppercase tracking-widest transition-transform hover:scale-105`}>
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authStep === 'onboarding') return <OnboardingModal onComplete={(data) => {
    const fullProfile = { ...data, email: loginEmail, name: loginName || data.name };
    localStorage.setItem('active_user_profile', JSON.stringify(fullProfile));
    setUserProfile(fullProfile); 
    generateInitialRoutine(fullProfile);
  }} />;

  const isRestDay = restDays[selectedDay];
  const currentWorkoutType = selectedDay % 2 !== 0 ? 'torso' : 'pierna';
  const planExercises = getDayExercises(selectedDay);
  const fallbackExercises = (workouts && workouts[currentWorkoutType]) ? workouts[currentWorkoutType] : [];
  const currentExercises = planExercises.length > 0 ? planExercises : fallbackExercises;
  const currentWorldIndex = Math.floor((selectedDay - 1) / 10);
  const currentWorldObj = MARIO_WORLDS[currentWorldIndex] || MARIO_WORLDS[0];

  const scanTotalCal = scanResult ? scanResult.foods.reduce((acc, curr) => acc + (curr.cal || 0), 0) : 0;
  const scanTotalProt = scanResult ? scanResult.foods.reduce((acc, curr) => acc + (curr.prot || 0), 0) : 0;
  const scanTotalCarbs = scanResult ? scanResult.foods.reduce((acc, curr) => acc + (curr.carbs || 0), 0) : 0;
  const scanTotalFat = scanResult ? scanResult.foods.reduce((acc, curr) => acc + (curr.fat || 0), 0) : 0;

  return (
    <div style={rootStyle} className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col justify-between select-none relative transition-colors duration-500`}>
      <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleMultipleFileUpload} />
      <input type="file" ref={mealFileInputRef} accept="image/*" className="hidden" onChange={handleMealImageUpload} />
      <input type="file" ref={mealCameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleMealImageUpload} />

      {/* OVERLAY / SPINNER DE CARGA AL ANALIZAR CON IA */}
      {isScanning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 animate-fadeIn">
          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 max-w-xs w-full flex flex-col items-center space-y-6 text-center shadow-2xl">
            <div className="w-14 h-14 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin"></div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Analizando Plato</h3>
              <p className="text-xs text-gray-400 font-medium">Gemini está identificando ingredientes y estimando valores macronutricionales...</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 ${theme.navBg} backdrop-blur-xl border-b ${theme.border} px-6 py-4 flex justify-between items-center transition-colors duration-500`}>
        <div>
          <span className={`text-[9px] font-bold tracking-[0.2em] ${theme.muted} uppercase block mb-1`}>ATLETA: {userProfile?.name || 'Atleta'}</span>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            STUDIO <span className={`text-[10px] px-3 py-1 rounded-full border ${theme.border} ${theme.muted} font-bold uppercase tracking-widest`}>DÍA {selectedDay}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDark(!isDark)} className={`p-2.5 ${theme.secondary} rounded-full text-[12px]`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => setShowSettingsModal(true)} className={`p-2.5 ${theme.secondary} rounded-full text-[12px]`}>⚙️</button>
          <button 
            onClick={() => setShowPaywallModal(true)} 
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${isDeveloper ? 'bg-purple-600 text-white border-transparent' : isPro ? 'bg-green-500 text-black border-transparent' : isTrialActive ? 'bg-blue-600 text-white border-transparent' : 'bg-red-600 text-white border-transparent'}`}
          >
            {isDeveloper ? 'DEV VIP' : isPro ? 'VIP PRO' : isTrialActive ? `PRO (${trialDaysLeft}d gratis)` : 'SUSCRIBIRSE'}
          </button>
        </div>
      </header>

      {/* TABS NAVEGACIÓN */}
      <nav className={`${theme.bg} border-b ${theme.border} px-4 py-3 transition-colors duration-500`}>
        <div className="flex gap-2 max-w-md mx-auto p-1.5 bg-[#151515] border border-white/10 rounded-full shadow-inner">
          <button 
            onClick={() => setActiveTab('entreno')} 
            className={`flex-1 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-full ${
              activeTab === 'entreno' 
                ? 'bg-white text-black shadow-lg scale-[1.02]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Entreno
          </button>
          <button 
            onClick={() => setActiveTab('nutricion')} 
            className={`flex-1 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-full ${
              activeTab === 'nutricion' 
                ? 'bg-white text-black shadow-lg scale-[1.02]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Nutrición
          </button>
          <button 
            onClick={() => setActiveTab('seguimiento')} 
            className={`flex-1 py-3 font-black text-xs uppercase tracking-widest transition-all rounded-full ${
              activeTab === 'seguimiento' 
                ? 'bg-white text-black shadow-lg scale-[1.02]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Progreso
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-md mx-auto px-5 py-6 space-y-8 pb-32 overflow-y-auto">

        {/* ======================= MÓDULO ENTRENO ======================= */}
        {activeTab === 'entreno' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="space-y-4">
              <div className={`flex justify-between items-center text-[10px] ${theme.muted} font-bold uppercase tracking-widest`}>
                <span>Línea del tiempo</span>
                <button onClick={() => setSelectedWorldModal(currentWorldObj)} className={`${theme.text} flex items-center gap-1 hover:opacity-70 transition-opacity`}>Fase {currentWorldObj.id} <span>→</span></button>
              </div>
              <div className="w-full overflow-hidden">
                <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-none px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
                    const isRest = restDays[dayNum];
                    const isSelected = selectedDay === dayNum;
                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`flex-shrink-0 snap-center w-16 h-20 rounded-[1.5rem] flex flex-col items-center justify-center transition-all border ${
                          isSelected ? `${theme.primary} border-transparent scale-105 shadow-lg` : isRest ? `${theme.secondary} ${theme.border} opacity-80` : `${theme.card} ${theme.border} ${theme.muted} hover:opacity-80`
                        }`}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Día</span>
                        <span className="text-xl font-black">{dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPlanner(true)}
              className="w-full py-4 rounded-full text-xs font-black uppercase tracking-widest bg-[#222] border border-white/10 text-white hover:bg-white hover:text-black transition-all"
            >
              {workoutPlan.days.length > 0 ? 'Cambiar plan de entrenamiento' : 'Planificar entrenamiento'}
            </button>

            <div className={`${theme.card} border ${theme.border} rounded-2xl p-4 text-xs flex justify-between items-center`}>
              <div>
                <span className="font-bold">{workoutPlan.days.length} días/sem</span>
                <span className="ml-2 capitalize">{workoutPlan.focus}</span>
              </div>
              <div className="flex gap-2">
                {workoutPlan.days.map(d => (
                  <span key={d} className={`px-2 py-1 ${theme.secondary} rounded-full text-[9px] font-bold`}>D{d}</span>
                ))}
              </div>
            </div>

            <div className={`${theme.card} border ${theme.border} rounded-[2rem] p-6 flex justify-between items-center ${theme.shadow} transition-colors duration-500`}>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Enfoque de hoy</span>
                <h2 className="text-2xl font-black capitalize">
                  {isTrainingDay(selectedDay) ? (getDayExercises(selectedDay)[0]?.target || 'Entreno') : 'Descanso'}
                </h2>
              </div>
              {isTrainingDay(selectedDay) && (
                <span className={`text-xs ${theme.secondary} px-3 py-1 rounded-full border ${theme.border}`}>
                  {getDayExercises(selectedDay).length} ejercicios
                </span>
              )}
              <button onClick={() => toggleRestDay(selectedDay)} className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isRestDay ? theme.secondary : theme.primary}`}>
                {isRestDay ? 'Entrenar' : 'Descanso'}
              </button>
            </div>

            {isRestDay ? (
              <div className={`${theme.card} border ${theme.border} rounded-[2rem] p-10 text-center space-y-4 ${theme.shadow}`}>
                <h3 className="text-xl font-black uppercase tracking-wider">Recuperación Activa</h3>
                <p className={`text-sm ${theme.muted} font-light leading-relaxed`}>La recomposición corporal ocurre en la fase de descanso. Hidrátate y mantén la actividad ligera (NEAT).</p>
              </div>
            ) : currentExercises.length > 0 ? (
              currentExercises.map((ex) => {
                const logsToday = logs[`day_${selectedDay}_${ex.id}`] || [];
                const isReplacing = replacingExerciseId === ex.id;

                return (
                  <div key={ex.id} className={`${theme.card} border ${theme.border} rounded-[2rem] overflow-hidden space-y-5 pb-6 transition-colors duration-500 ${theme.shadow}`}>
                    <div className="relative h-56 w-full group">
                      <img src={ex.img} alt={ex.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#111]' : 'from-white'} via-transparent to-transparent p-6 flex flex-col justify-end`}>
                        <span className={`self-start text-[9px] ${theme.primary} px-3 py-1.5 rounded-full font-bold uppercase tracking-widest mb-3`}>{ex.target}</span>
                        <h3 className="text-2xl font-black leading-tight">{ex.name}</h3>
                      </div>
                    </div>

                    <div className="px-6 space-y-6">
                      <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
                        <div className="space-y-1">
                          <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block`}>Volumen</span>
                          <span className="text-sm font-bold">{ex.sets || '3-4'}</span>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block`}>Reps</span>
                          <span className="text-sm font-bold">{ex.reps || '8-12'}</span>
                        </div>
                      </div>

                      {logsToday.length > 0 && (
                        <div className="space-y-3">
                          <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block`}>Log</span>
                          <div className="grid grid-cols-2 gap-3">
                            {logsToday.map((log, idx) => (
                              <div key={idx} className={`${theme.secondary} px-4 py-3 rounded-2xl text-xs flex justify-between font-medium`}>
                                <span>Set {idx + 1}</span>
                                <span><strong className="font-bold">{log.weight}kg</strong> × {log.reps}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button onClick={() => handleLogSet(ex.id, 20, 5)} className={`flex-1 py-4 ${theme.primary} font-black rounded-full text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-transform`}>
                          Añadir Set
                        </button>
                        <button 
                          onClick={() => replaceExerciseWithAI(ex)} 
                          disabled={isReplacing}
                          className={`px-5 py-4 ${theme.secondary} border ${theme.border} rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-1.5`}
                        >
                          {isReplacing ? '...' : '🔄 Cambiar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`${theme.card} border ${theme.border} rounded-[2rem] p-10 text-center space-y-4 ${theme.shadow}`}>
                <h3 className="text-xl font-black uppercase tracking-wider">Sin ejercicios para hoy</h3>
                <p className={`text-sm ${theme.muted} font-light leading-relaxed`}>Planifica tu entrenamiento usando el botón de arriba.</p>
              </div>
            )}
          </div>
        )}

        {/* ======================= MÓDULO NUTRICIÓN ======================= */}
        {activeTab === 'nutricion' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className={`${theme.card} border ${isCalorieSurplus ? 'border-red-500/50 shadow-red-500/10' : theme.border} rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden ${theme.shadow} transition-all duration-500`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>Ciencia Nutricional</span>
                  <h2 className="text-xl font-black">Balance de Macros</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex ${theme.secondary} border ${theme.border} rounded-full p-1 text-[9px] font-bold uppercase tracking-widest`}>
                    <button 
                      onClick={() => setNutritionViewMode('daily')}
                      className={`px-3 py-1 rounded-full transition-all ${nutritionViewMode === 'daily' ? theme.primary : theme.muted}`}
                    >
                      Diario
                    </button>
                    <button 
                      onClick={() => setNutritionViewMode('weekly')}
                      className={`px-3 py-1 rounded-full transition-all ${nutritionViewMode === 'weekly' ? theme.primary : theme.muted}`}
                    >
                      Semanal
                    </button>
                  </div>

                  {currentMacros.cal > 0 && (
                    <button onClick={() => { if(window.confirm('¿Reiniciar macros?')) setDailyNutritionLogs(prev => ({...prev, [selectedDay]: {cal:0, protein:0, carbs:0, fat:0}})) }} className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest underline`}>Reset</button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className={isDark ? "text-[#222]" : "text-gray-200"} strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`${isCalorieSurplus ? "text-red-500" : isDark ? "text-white" : "text-black"} transition-all duration-1000`} strokeDasharray={`${calPercentage}, 100`} strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center flex flex-col items-center">
                    <span className={`text-3xl font-black leading-none ${isCalorieSurplus ? 'text-red-500' : theme.text}`}>{currentMacros.cal}</span>
                    <span className={`text-[9px] ${theme.muted} font-bold mt-2 uppercase tracking-widest`}>/ {targetMacros.cal} kcal</span>
                    {isCalorieSurplus && (
                      <span className="text-[8px] font-bold text-red-500 mt-1 uppercase tracking-widest animate-pulse">Exceso: +{calorieExcessVal}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 flex-1 text-[10px] font-bold">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-500 font-extrabold uppercase">Prot</span>
                      <span className={theme.text}>{currentMacros.protein}g <span className={theme.muted}>/ {targetMacros.protein}g</span></span>
                    </div>
                    <div className={`h-2 ${isDark ? 'bg-gray-900' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min(100, (currentMacros.protein / targetMacros.protein) * 100)}%` }}></div>
                    </div>
                    <div className="text-[8px] text-right font-semibold">
                      {targetMacros.protein - currentMacros.protein > 0 ? <span className="text-emerald-500">Quedan {targetMacros.protein - currentMacros.protein}g</span> : <span className="text-gray-400">Meta cumplida</span>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-500 font-extrabold uppercase">Carbs</span>
                      <span className={theme.text}>{currentMacros.carbs}g <span className={theme.muted}>/ {targetMacros.carbs}g</span></span>
                    </div>
                    <div className={`h-2 ${isDark ? 'bg-gray-900' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(100, (currentMacros.carbs / targetMacros.carbs) * 100)}%` }}></div>
                    </div>
                    <div className="text-[8px] text-right font-semibold">
                      {targetMacros.carbs - currentMacros.carbs > 0 ? <span className="text-blue-500">Quedan {targetMacros.carbs - currentMacros.carbs}g</span> : <span className="text-gray-400">Meta cumplida</span>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-500 font-extrabold uppercase">Fats</span>
                      <span className={theme.text}>{currentMacros.fat}g <span className={theme.muted}>/ {targetMacros.fat}g</span></span>
                    </div>
                    <div className={`h-2 ${isDark ? 'bg-gray-900' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min(100, (currentMacros.fat / targetMacros.fat) * 100)}%` }}></div>
                    </div>
                    <div className="text-[8px] text-right font-semibold">
                      {targetMacros.fat - currentMacros.fat > 0 ? <span className="text-amber-500">Quedan {targetMacros.fat - currentMacros.fat}g</span> : <span className="text-gray-400">Meta cumplida</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* REGISTRO INTELIGENTE */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <span className={`text-[10px] ${theme.muted} font-bold block uppercase tracking-widest`}>Registro Inteligente</span>
              
              <form onSubmit={handleTextFoodSubmit} className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Ej. Bowl de salmón y arroz..." value={textFoodInput} onChange={(e) => setTextFoodInput(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-3 pr-28 text-sm outline-none transition-colors font-medium`} />
                  <div className="absolute right-0 top-2 flex items-center gap-1.5">
                    <button 
                      type="button" 
                      onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording} 
                      title="Nota de voz" 
                      className={`p-1.5 rounded-full transition-all ${isRecordingAudio ? 'text-red-500 scale-125 animate-pulse' : theme.muted}`}
                    >
                      🎙️
                    </button>
                    <button type="button" onClick={() => mealCameraInputRef.current.click()} title="Tomar foto con la cámara" className={`p-1.5 ${theme.muted} hover:text-white transition-colors`}>📷</button>
                    <button type="button" onClick={() => mealFileInputRef.current.click()} title="Elegir foto de la galería" className={`p-1.5 ${theme.muted} hover:text-white transition-colors`}>🖼️</button>
                  </div>
                </div>

                {/* MODAL DE GRABACIÓN DE AUDIO ACTIVA */}
                {isRecordingAudio && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Escuchando voz...</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={stopAudioRecording}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                      Detener ⏹️
                    </button>
                  </div>
                )}

                {/* PANEL DE VISTA PREVIA Y CONTROL DE AUDIO GRABADO */}
                {audioBlob && !isRecordingAudio && (
                  <div className={`p-4 ${theme.secondary} border border-emerald-500/40 rounded-2xl space-y-3 animate-fadeIn`}>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span>🎙️</span> Nota de Voz Grabada
                      </span>
                      <button type="button" onClick={discardAudioRecording} className="text-gray-500 hover:text-red-500 text-xs font-bold">🗑️ Borrar</button>
                    </div>

                    <audio ref={audioPlayerRef} src={audioUrl} onEnded={() => setIsPlayingAudio(false)} className="hidden" />

                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => {
                          if (isPlayingAudio) {
                            audioPlayerRef.current.pause();
                            setIsPlayingAudio(false);
                          } else {
                            audioPlayerRef.current.play();
                            setIsPlayingAudio(true);
                          }
                        }}
                        className={`px-4 py-2 ${theme.primary} rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2`}
                      >
                        {isPlayingAudio ? '⏸️ Pausar' : '▶️ Reproducir'}
                      </button>

                      <button 
                        type="button" 
                        onClick={processAudioRecordingWithAI}
                        disabled={isScanning}
                        className="flex-1 py-2 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-md text-center"
                      >
                        Procesar con IA ✨
                      </button>
                    </div>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isScanning} 
                  className={`w-full py-4.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-xl border ${
                    !isScanning 
                      ? `${theme.primary} hover:scale-[1.02] border-transparent active:scale-95` 
                      : `${theme.secondary} border-white/10 opacity-50 cursor-not-allowed`
                  }`}
                >
                  {isScanning ? 'Analizando con IA...' : 'Procesar Comida'}
                </button>
              </form>
            </div>

            {/* TARJETA DE CONFIRMACIÓN CON SLIDERS, SUMATORIO TOTAL Y UNIDADES */}
            {scanResult && (
              <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-6 space-y-6 animate-fadeIn ${theme.shadow} relative overflow-hidden`}>
                <div className={`flex items-start justify-between border-b ${theme.border} pb-4`}>
                  <div className="flex-1 pr-4">
                    <span className={`text-[10px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'} uppercase tracking-widest block mb-1`}>✦ Detección completada</span>
                    <input 
                      type="text" 
                      value={scanResult.dishName} 
                      onChange={(e) => setScanResult({ ...scanResult, dishName: e.target.value })}
                      className={`text-xl font-black leading-tight bg-transparent border-b ${theme.border} ${theme.text} outline-none w-full focus:border-white`}
                    />
                  </div>
                  <span className="text-2xl">🥗</span>
                </div>

                {scanResult.img && (
                  <div className={`relative w-full h-40 rounded-2xl overflow-hidden border ${theme.border}`}>
                    <img src={scanResult.img} alt="Vista del plato" className="w-full h-full object-cover" />
                  </div>
                )}

                {scanResult.goalFeedback && (
                  <div className={`p-4 ${isDark ? 'bg-emerald-950/30 border-emerald-800/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} border rounded-2xl text-xs font-medium italic`}>
                    "{scanResult.goalFeedback}"
                  </div>
                )}

                {/* SUMATORIO TOTAL DE VALORES DEL PLATO */}
                <div className={`p-4 ${theme.secondary} rounded-2xl border ${theme.border} space-y-2`}>
                  <span className={`text-[9px] ${theme.muted} font-bold uppercase tracking-widest block border-b ${theme.border} pb-1`}>Sumatorio Total del Plato</span>
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className={theme.text}>🔥 {scanTotalCal} kcal</span>
                    <span className="text-emerald-500">🥩 {scanTotalProt}g P</span>
                    <span className="text-blue-500">🍞 {scanTotalCarbs}g C</span>
                    <span className="text-amber-500">🥑 {scanTotalFat}g F</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setShowMacroBreakdownChart(!showMacroBreakdownChart)}
                  className={`w-full py-3 px-4 ${theme.secondary} border ${theme.border} rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between hover:opacity-80 transition-opacity`}
                >
                  <span>📊 {showMacroBreakdownChart ? 'Ocultar Distribución' : 'Ver Distribución del Plato (%)'}</span>
                  <span>{showMacroBreakdownChart ? '▲' : '▼'}</span>
                </button>

                {showMacroBreakdownChart && (
                  <div className={`p-4 ${theme.secondary} rounded-2xl border ${theme.border} space-y-3 animate-fadeIn`}>
                    <span className={`text-[9px] ${theme.muted} font-bold uppercase tracking-widest block border-b ${theme.border} pb-2`}>Aporte (%) por ingrediente al total del plato</span>
                    {scanResult.foods.map((f, idx) => {
                      const calPercent = scanTotalCal > 0 ? Math.round((f.cal / scanTotalCal) * 100) : 0;
                      const protPercent = scanTotalProt > 0 ? Math.round((f.prot / scanTotalProt) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1.5 text-[10px]">
                          <div className="flex justify-between font-bold">
                            <span className="truncate max-w-[150px]">{f.name}</span>
                            <span className={theme.muted}>{f.cal} kcal ({calPercent}%) · {f.prot}g Prot ({protPercent}%)</span>
                          </div>
                          <div className={`h-1.5 w-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                            <div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} transition-all duration-300`} style={{ width: `${calPercent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest`}>Ajustar Cantidades con Barra</span>
                    <button 
                      type="button"
                      onClick={() => setShowCustomIngredientForm(!showCustomIngredientForm)} 
                      className={`text-[10px] font-bold ${theme.text} hover:opacity-70 flex items-center gap-1 transition-opacity`}
                    >
                      <span>+</span> {showCustomIngredientForm ? 'Cancelar' : 'Añadir ingrediente'}
                    </button>
                  </div>

                  {showCustomIngredientForm && (
                    <div className={`p-4 ${theme.secondary} rounded-2xl border border-blue-500/30 space-y-3 animate-fadeIn`}>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Consultar Ingrediente a la IA</span>
                      
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Ej. Aceite de oliva, Pan integral..." 
                          value={newIngredientName} 
                          onChange={(e) => setNewIngredientName(e.target.value)}
                          className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs font-bold ${theme.text} outline-none`}
                        />
                        
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 flex gap-2 items-center">
                            <input 
                              type="number" 
                              value={newIngredientQty} 
                              onChange={(e) => setNewIngredientQty(e.target.value)}
                              className={`w-16 bg-transparent border-b ${theme.border} py-1 text-xs font-black text-center ${theme.text}`}
                            />
                            <div className={`flex ${theme.card} rounded-lg p-0.5 border ${theme.border} text-[9px] font-bold`}>
                              <button 
                                type="button" 
                                onClick={() => setNewIngredientNameUnit('g')} 
                                className={`px-2 py-0.5 rounded ${newIngredientUnit === 'g' ? theme.primary : theme.muted}`}
                              >
                                g
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setNewIngredientNameUnit('ud')} 
                                className={`px-2 py-0.5 rounded ${newIngredientUnit === 'ud' ? theme.primary : theme.muted}`}
                              >
                                ud
                              </button>
                            </div>
                          </div>

                          <button 
                            type="button" 
                            onClick={calculateCustomIngredientWithGemini}
                            disabled={isCalculatingNewIngredient}
                            className={`px-4 py-2 ${theme.primary} font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-1`}
                          >
                            {isCalculatingNewIngredient ? 'Calculando...' : 'Calcular con IA ✨'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanResult.foods.map((f, i) => {
                    const isUnits = f.unitType === 'ud';
                    const maxSliderVal = isUnits ? 10 : 500;
                    const stepVal = isUnits ? 0.5 : 5;

                    return (
                      <div key={i} className={`space-y-3 ${theme.secondary} p-4 rounded-2xl border ${theme.border}`}>
                        <div className="flex items-center justify-between gap-2">
                          <input 
                            type="text" 
                            value={f.name} 
                            onChange={(e) => handleFoodNameChange(i, e.target.value)}
                            className={`font-bold text-sm bg-transparent border-b ${theme.border} ${theme.text} outline-none flex-1`}
                          />
                          
                          <div className={`flex ${theme.card} rounded-xl p-1 border ${theme.border} text-[9px] font-bold`}>
                            <button 
                              type="button"
                              onClick={() => handleUnitTypeToggle(i, 'g')}
                              className={`px-2.5 py-1 rounded-lg transition-all ${!isUnits ? theme.primary : theme.muted}`}
                            >
                              Gramos
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleUnitTypeToggle(i, 'ud')}
                              className={`px-2.5 py-1 rounded-lg transition-all ${isUnits ? theme.primary : theme.muted}`}
                            >
                              Unidades
                            </button>
                          </div>

                          <button onClick={() => handleRemoveFoodItem(i)} title="Eliminar ingrediente" className={`${theme.muted} hover:text-red-500 text-xs p-1 transition-colors`}>
                            🗑️
                          </button>
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest`}>Cantidad:</span>
                            <div className={`${theme.card} border ${theme.border} px-3 py-1 rounded-xl text-xs font-black ${theme.text}`}>
                              {f.grams} {isUnits ? 'ud' : 'g'}
                            </div>
                          </div>

                          <input 
                            type="range" 
                            min={isUnits ? "0.5" : "5"} 
                            max={maxSliderVal} 
                            step={stepVal}
                            value={f.grams} 
                            onChange={(e) => handleFoodQuantityChange(i, e.target.value)}
                            className={`w-full h-2 rounded-lg cursor-pointer ${isDark ? 'accent-white bg-gray-800' : 'accent-black bg-gray-200'}`}
                          />
                        </div>

                        <div className={`font-semibold uppercase tracking-wider text-[9px] flex justify-between pt-2 border-t ${theme.border}`}>
                          <span className={theme.text}>🔥 {f.cal} kcal</span>
                          <span className="text-emerald-500 font-bold">🥩 {f.prot}g P</span>
                          <span className="text-blue-500 font-bold">🍞 {f.carbs}g C</span>
                          <span className="text-amber-500 font-bold">🥑 {f.fat}g F</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleConfirmScan} className={`flex-1 py-4 ${theme.primary} font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform`}>
                    Añadir a mis Macros
                  </button>
                  <button onClick={() => setScanResult(null)} className={`px-5 py-4 bg-transparent border ${theme.border} ${theme.muted} font-black rounded-full text-[10px] uppercase tracking-widest hover:${theme.text} transition-colors`}>
                    Descartar
                  </button>
                </div>
              </div>
            )}

            {/* CHEF IA */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
                <div>
                  <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-1`}>Culinary AI</span>
                  <h2 className="text-xl font-black">Tu Plato Ideal</h2>
                </div>
                
                <button 
                  onClick={generatePersonalizedRecipe} 
                  disabled={isGeneratingRecipe} 
                  className={`px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md ${
                    !isGeneratingRecipe 
                      ? `${theme.primary} hover:scale-105 active:scale-95` 
                      : `${theme.secondary} opacity-50 cursor-not-allowed`
                  }`}
                >
                  {isGeneratingRecipe ? 'Diseñando...' : 'Generar IA ✨'}
                </button>
              </div>

              {recipeError && <div className="text-xs text-red-500 font-medium p-2">{recipeError}</div>}

              {personalizedRecipe ? (
                <div className={`border ${theme.border} rounded-[2rem] overflow-hidden space-y-6 pb-6 animate-fadeIn ${theme.secondary}`}>
                  <div className="relative h-64 w-full overflow-hidden group">
                    <img src={personalizedRecipe.img} alt={personalizedRecipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">⏱️ {personalizedRecipe.prepTime || '15 min'}</span>
                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">🔥 {personalizedRecipe.cal} KCAL</span>
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight">{personalizedRecipe.title}</h3>
                    </div>
                  </div>
                  
                  <div className="px-6 space-y-6">
                    <div className={`grid grid-cols-3 gap-2 text-center p-3 ${theme.card} rounded-2xl border ${theme.border}`}>
                      <div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase block`}>Proteína</span>
                        <span className="text-sm font-black text-emerald-500">{personalizedRecipe.prot}g</span>
                      </div>
                      <div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase block`}>Carbs</span>
                        <span className="text-sm font-black text-blue-500">{personalizedRecipe.carbs}g</span>
                      </div>
                      <div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase block`}>Grasas</span>
                        <span className="text-sm font-black text-amber-500">{personalizedRecipe.fat}g</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest mb-3 flex items-center gap-2`}>
                        <span>🥘</span> Ingredientes
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {personalizedRecipe.ingredients?.map((ing, i) => (
                          <div key={i} className={`text-xs font-medium p-3 ${theme.card} rounded-xl border ${theme.border} flex items-center gap-3`}>
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {ing}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest mb-3 flex items-center gap-2`}>
                        <span>👨‍🍳</span> Paso a Paso
                      </h4>
                      <div className="space-y-3">
                        {personalizedRecipe.steps ? (
                          personalizedRecipe.steps.map((step, i) => (
                            <div key={i} className={`p-4 ${theme.card} rounded-2xl border ${theme.border} space-y-1`}>
                              <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">PASO {i + 1}</span>
                              <p className="text-xs leading-relaxed font-medium">{step}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs leading-relaxed">{personalizedRecipe.instructions}</p>
                        )}
                      </div>
                    </div>

                    {personalizedRecipe.chefTip && (
                      <div className={`p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs flex gap-3 items-start`}>
                        <span className="text-base">🔬</span>
                        <div>
                          <strong className="block font-bold uppercase text-[9px] tracking-wider mb-1">Ciencia Aplicada</strong>
                          <p className="font-light italic">{personalizedRecipe.chefTip}</p>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        setDailyNutritionLogs(prev => ({
                          ...prev,
                          [selectedDay]: {
                            cal: (prev[selectedDay]?.cal || 0) + personalizedRecipe.cal,
                            protein: (prev[selectedDay]?.protein || 0) + personalizedRecipe.prot,
                            carbs: (prev[selectedDay]?.carbs || 0) + personalizedRecipe.carbs,
                            fat: (prev[selectedDay]?.fat || 0) + personalizedRecipe.fat
                          }
                        }));
                        alert('¡Añadida a tus macros!');
                      }} 
                      className={`w-full py-4 ${theme.primary} font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg`}
                    >
                      Añadir a mis macros
                    </button>
                  </div>
                </div>
              ) : (
                 <div className="text-center py-8 space-y-3">
                   <span className="text-4xl block">🔬</span>
                   <p className={`text-xs ${theme.muted} font-medium leading-relaxed max-w-xs mx-auto`}>
                     La IA calculará una receta usando la Ecuación de Mifflin-St Jeor para rellenar tus requerimientos de hoy.
                   </p>
                 </div>
              )}
            </div>

          </div>
        )}

        {/* ======================= MÓDULO SEGUIMIENTO ======================= */}
        {activeTab === 'seguimiento' && (
          <div className="space-y-8 animate-fadeIn pb-6">
            
            <button onClick={generateStrategyStudy} disabled={isAnalyzingStrategy} className={`w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest ${theme.primary} transition-transform hover:scale-[1.02] ${theme.shadow}`}>
              {isAnalyzingStrategy ? 'Analizando Datos...' : 'Generar Reporte Clínico'}
            </button>
            
            {/* SECCIÓN FOTOS */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-6 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <div className={`flex justify-between items-center border-b ${theme.border} pb-3`}>
                <div>
                  <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>Visual</span>
                  <h2 className="text-lg font-black">Día {selectedDay}</h2>
                </div>
                <button onClick={() => setShowManagePhotosModal(true)} className={`text-[10px] ${theme.secondary} px-4 py-2 rounded-full font-bold uppercase tracking-widest hover:opacity-80 transition-colors`}>
                  Galería
                </button>
              </div>

              <div className={`relative w-full aspect-[9/16] ${isDark ? 'bg-black' : 'bg-gray-100'} rounded-[2rem] overflow-hidden border ${theme.border} flex items-center justify-center`}>
                {userPhotos[selectedDay] ? (
                  <>
                    <img src={userPhotos[selectedDay]} className="w-full h-full object-cover" />
                    <button onClick={() => { if(window.confirm('¿Borrar foto?')){ const newP={...userPhotos}; delete newP[selectedDay]; setUserPhotos(newP);} }} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 text-white p-3 rounded-full text-xs backdrop-blur-md transition-colors border border-white/20">✕</button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <span className="text-4xl block opacity-20">📷</span>
                    <p className={`text-xs ${theme.muted} uppercase tracking-widest font-bold`}>Sin foto</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={startCamera} className={`py-4 ${theme.secondary} font-black rounded-full text-[10px] uppercase tracking-widest border ${theme.border}`}>Cámara</button>
                <button onClick={() => fileInputRef.current.click()} className={`py-4 ${theme.secondary} font-black rounded-full text-[10px] uppercase tracking-widest border ${theme.border}`}>Subir</button>
              </div>

              <button 
                onClick={() => { const available = Object.keys(userPhotos).map(Number).filter(d => d !== selectedDay); if (available.length > 0) setCompareDay(available[0]); setShowCompareModal(true); }} 
                disabled={!userPhotos[selectedDay] || Object.keys(userPhotos).length < 2}
                className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${userPhotos[selectedDay] && Object.keys(userPhotos).length >= 2 ? theme.primary : 'bg-transparent border border-gray-500 text-gray-500 cursor-not-allowed'}`}
              >
                Comparador de Capas
              </button>
            </div>

            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase border-b ${theme.border} pb-4`}>Métricas Físicas</span>
              
              <div className="grid grid-cols-4 gap-2 text-[10px]">
                {['weight', 'waist', 'chest', 'arm'].map((m) => (
                  <button key={m} onClick={() => setSelectedMetric(m)} className={`py-2 rounded-full font-bold uppercase tracking-widest transition-all border ${selectedMetric === m ? `${theme.primary} border-transparent` : `bg-transparent ${theme.muted} ${theme.border}`}`}>
                    {m === 'waist' ? 'Cintura' : m === 'weight' ? 'Peso' : m === 'chest' ? 'Pecho' : 'Brazo'}
                  </button>
                ))}
              </div>

              <div className={`h-40 ${theme.secondary} rounded-[2rem] border ${theme.border} p-5 flex items-end justify-between gap-3`}>
                {bodyLogs.length === 0 ? (
                  <p className={`w-full text-center text-xs ${theme.muted} font-bold uppercase tracking-widest my-auto`}>Sin datos</p>
                ) : (
                  bodyLogs.map((log, idx) => {
                    const val = log[selectedMetric] || 0;
                    const maxVal = Math.max(...bodyLogs.map(b => b[selectedMetric] || 0), 1);
                    const heightPct = Math.max((val / maxVal) * 100, 5); 
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative">
                        <div className="h-full w-full flex items-end">
                          <div className={`w-full ${isDark ? 'bg-[#333]' : 'bg-gray-300'} group-hover:${isDark ? 'bg-white' : 'bg-black'} rounded-t-lg transition-all duration-500`} style={{ height: `${heightPct}%` }}>
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-black/80 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                          </div>
                        </div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase`}>D{log.day}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
                <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase`}>Cargas Entrenamiento</span>
                <span className={`text-[10px] ${theme.secondary} border ${theme.border} px-3 py-1 rounded-full font-bold tracking-widest`}>
                  {EXERCISE_ANALYTICS[selectedAnalyticsEx]?.gain || '+0 kg'}
                </span>
              </div>
              <select value={selectedAnalyticsEx} onChange={(e) => setSelectedAnalyticsEx(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-3 text-sm font-bold outline-none`}>
                {Object.keys(EXERCISE_ANALYTICS).map(key => <option key={key} value={key} className={isDark ? "bg-black" : "bg-white"}>{EXERCISE_ANALYTICS[key].name}</option>)}
              </select>
              <div className={`h-32 ${theme.secondary} rounded-[2rem] border ${theme.border} p-4 flex items-end justify-between gap-3`}>
                {EXERCISE_ANALYTICS[selectedAnalyticsEx]?.history.map((val, idx) => {
                  const maxVal = Math.max(...EXERCISE_ANALYTICS[selectedAnalyticsEx].history, 1);
                  const heightPct = Math.max((val / maxVal) * 100, 5);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="h-full w-full flex items-end">
                        <div className={`w-full ${isDark ? 'bg-[#333]' : 'bg-gray-300'} group-hover:${isDark ? 'bg-white' : 'bg-black'} rounded-t-md transition-all duration-500`} style={{ height: `${heightPct}%` }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-black/80 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">{val}k</span>
                        </div>
                      </div>
                      <span className={`text-[8px] ${theme.muted} font-bold uppercase tracking-widest`}>S{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORMULARIO DE MEDIDAS FÍSICAS */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase border-b ${theme.border} pb-4`}>Registrar Evolución del Día {selectedDay}</span>
              <div className="space-y-5">
                <div>
                  <label className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Peso (kg)</label>
                  <input type="number" step="0.1" value={trackerWeight} onChange={(e) => setTrackerWeight(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-2 text-2xl font-black outline-none`} />
                </div>
                <div>
                  <label className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Cintura * (cm)</label>
                  <input type="number" required value={trackerWaist} onChange={(e) => setTrackerWaist(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-2 text-2xl font-black outline-none placeholder:${theme.muted}`} placeholder="Ej. 82.0" />
                </div>
                <div>
                  <label className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Pecho (cm)</label>
                  <input type="number" value={trackerChest} onChange={(e) => setTrackerChest(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-2 text-2xl font-black outline-none placeholder:${theme.muted}`} placeholder="Ej. 104.0" />
                </div>
                <div className="col-span-2">
                  <label className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Brazo (cm)</label>
                  <input type="number" step="0.1" value={trackerArm} onChange={(e) => setTrackerArm(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-2 text-2xl font-black outline-none placeholder:${theme.muted}`} placeholder="Ej. 36.5" />
                </div>
              </div>
              <button onClick={handleSavePhysicalTracking} className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.primary} transition-transform hover:scale-105 shadow-lg mt-4`}>
                Guardar Día {selectedDay}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer onClick={() => setShowHistoryModal(true)} className={`fixed bottom-0 left-0 right-0 ${theme.navBg} backdrop-blur-2xl border-t ${theme.border} px-6 py-5 z-30 cursor-pointer hover:opacity-90 transition-opacity duration-500`}>
        <div className="max-w-md mx-auto space-y-3">
          <div className={`flex justify-between items-center text-[10px] font-bold uppercase tracking-widest ${theme.muted}`}>
            <span>Timeline: <strong className={`${theme.text} ml-1`}>Día {realDay} / 60</strong></span>
            <span>Ver Histórico</span>
          </div>
          <div className={`h-1.5 w-full ${isDark ? 'bg-[#222]' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} transition-all duration-1000`} style={{ width: `${(realDay/60)*100}%` }}></div>
          </div>
        </div>
      </footer>

      {/* MODAL CÁMARA CON ENCUADRE 3:4 */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-between p-6 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-sm flex justify-between items-center py-2">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">CAPTURA PROGRESO</span>
            <div className="flex gap-2 items-center">
              <button onClick={toggleCameraLens} className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-bold uppercase tracking-wider hover:bg-white/40 transition-colors">
                📷 {cameraFacingMode === 'environment' ? 'Trasera' : 'Frontal'}
              </button>
              <button onClick={stopCamera} className="text-gray-500 font-bold text-xl p-2 hover:text-white transition-colors">✕</button>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-[2rem] overflow-hidden border border-white/20 flex items-center justify-center my-auto shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 transition-opacity" style={{ opacity: overlayOpacity }}>
              <svg viewBox="0 0 100 200" className="w-full h-full stroke-white/80 fill-none" strokeWidth="0.8" strokeDasharray="2 1">
                <ellipse cx="50" cy="24" rx="8" ry="10" />
                <path d="M 46 34 L 54 34 M 47 34 L 47 38 M 53 38 L 53 34" />
                <path d="M 32 44 C 32 38, 68 38, 68 44 L 62 90 L 38 90 Z" />
                <path d="M 31 44 C 26 60, 25 80, 26 105" />
                <path d="M 69 44 C 74 60, 75 80, 74 105" />
                <path d="M 38 90 C 35 120, 36 150, 42 185" />
                <path d="M 62 90 C 65 120, 64 150, 58 185" />
                <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="15" y1="90" x2="85" y2="90" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" strokeDasharray="1 1" />
              </svg>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-2 py-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Opacidad Silueta:</span><span className="text-white">{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input type="range" min="0.1" max="1" step="0.1" value={overlayOpacity} onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))} className="w-full accent-white" />
          </div>

          <button onClick={capturePhoto} className="w-full max-w-sm py-4 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg mb-4 hover:scale-105 transition-transform">
            DISPARAR FOTO
          </button>
        </div>
      )}

      {showCompareModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-between p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-sm flex justify-between items-center py-2">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Alineación de Capas</h3>
            <button onClick={() => setShowCompareModal(false)} className="text-gray-500 font-bold text-xl p-2 hover:text-white transition-colors">✕</button>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-between items-center bg-[#111] p-4 rounded-[1.5rem] border border-white/10 text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Comparar con:</span>
              <select value={compareDay} onChange={(e) => setCompareDay(Number(e.target.value))} className="bg-transparent text-white font-bold outline-none">
                {Object.keys(userPhotos).map(Number).filter(d => d !== selectedDay).map(d => <option key={d} value={d} className="bg-black">Día {d}</option>)}
              </select>
            </div>
            <div className="flex bg-[#111] p-1.5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
              <button onClick={() => setCompareMode('blend')} className={`flex-1 py-3 rounded-full transition-all ${compareMode === 'blend' ? 'bg-white text-black' : 'text-gray-500'}`}>Fusión</button>
              <button onClick={() => setCompareMode('slider')} className={`flex-1 py-3 rounded-full transition-all ${compareMode === 'slider' ? 'bg-white text-black' : 'text-gray-500'}`}>Cortinilla</button>
              <button onClick={() => setShowAnatomicalGuide(!showAnatomicalGuide)} className={`px-4 py-3 rounded-full transition-all ${showAnatomicalGuide ? 'bg-white text-black' : 'text-gray-500'}`}>Guía</button>
            </div>
          </div>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border border-white/20 my-4 shadow-2xl flex items-center justify-center">
            {userPhotos[compareDay] && (
              <img src={userPhotos[compareDay]} className="absolute inset-0 w-full h-full object-cover" style={{ transform: `scale(${baseScale}) translate(${baseX}px, ${baseY}px)` }} />
            )}
            {userPhotos[selectedDay] && (
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: compareMode === 'slider' ? `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` : 'none', opacity: compareMode === 'blend' ? blendOpacity : 1 }}>
                <img src={userPhotos[selectedDay]} className="w-full h-full object-cover" style={{ transform: `scale(${topScale}) translate(${topX}px, ${topY}px)` }} />
              </div>
            )}
            {compareMode === 'slider' && <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_black] z-10" style={{ left: `${sliderPos}%` }} />}
            
            {showAnatomicalGuide && (
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center p-4">
                <svg viewBox="0 0 100 200" className="w-full h-full stroke-white/50 fill-none" strokeWidth="0.8" strokeDasharray="2 1"><circle cx="50" cy="22" r="8" /><path d="M 40 38 L 60 38 M 42 75 L 58 75" /></svg>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm bg-[#111] p-6 rounded-[2rem] border border-white/10 space-y-6">
            <div className="flex bg-black/50 p-1.5 rounded-full border border-white/5 justify-between items-center text-[9px] uppercase tracking-widest font-bold">
              <span className="text-gray-500 px-4">EDITAR:</span>
              <div className="flex gap-1">
                <button onClick={() => setActiveLayer('base')} className={`px-5 py-2.5 rounded-full transition-all ${activeLayer === 'base' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}>BASE</button>
                <button onClick={() => setActiveLayer('top')} className={`px-5 py-2.5 rounded-full transition-all ${activeLayer === 'top' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}>CAPA</button>
              </div>
            </div>

            {compareMode === 'blend' ? (
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2"><span>Opacidad Sup:</span><span className="text-white">{Math.round(blendOpacity * 100)}%</span></div>
                <input type="range" min="0" max="1" step="0.05" value={blendOpacity} onChange={(e) => setBlendOpacity(parseFloat(e.target.value))} className="w-full accent-white" />
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2"><span>Línea:</span><span className="text-white">{sliderPos}%</span></div>
                <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))} className="w-full accent-white" />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-500 block mb-2">Zoom</label>
                <input type="range" min="0.8" max="1.4" step="0.01" value={activeLayer === 'top' ? topScale : baseScale} onChange={(e) => { const v = parseFloat(e.target.value); activeLayer==='top'?setTopScale(v):setBaseScale(v); }} className="w-full accent-white" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-500 block mb-2">X (Horiz)</label>
                <input type="range" min="-40" max="40" step="1" value={activeLayer === 'top' ? topX : baseX} onChange={(e) => { const v = parseInt(e.target.value, 10); activeLayer==='top'?setTopX(v):setBaseX(v); }} className="w-full accent-white" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-500 block mb-2">Y (Vert)</label>
                <input type="range" min="-40" max="40" step="1" value={activeLayer === 'top' ? topY : baseY} onChange={(e) => { const v = parseInt(e.target.value, 10); activeLayer==='top'?setTopY(v):setBaseY(v); }} className="w-full accent-white" />
              </div>
            </div>
            <button onClick={() => { setTopScale(1); setTopX(0); setTopY(0); setBaseScale(1); setBaseX(0); setBaseY(0); }} className="w-full py-4 bg-[#222] border border-white/10 text-white font-black rounded-full text-[10px] uppercase tracking-widest">
              REINICIAR ALINEACIÓN
            </button>
          </div>
        </div>
      )}

      {showManagePhotosModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 max-h-[85vh] flex flex-col shadow-2xl`}>
            <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
              <h3 className="text-xl font-black">Galería</h3>
              <button onClick={() => setShowManagePhotosModal(false)} className={`${theme.muted} font-bold text-xl hover:text-white transition-colors`}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {Object.keys(userPhotos).length === 0 ? (
                <p className={`text-center text-sm ${theme.muted} py-10`}>La galería está vacía.</p>
              ) : (
                Object.entries(userPhotos).map(([dayNum, photoUrl]) => (
                  <div key={dayNum} className={`${theme.secondary} p-3 rounded-[1.5rem] border ${theme.border} flex items-center justify-between gap-4`}>
                    <img src={photoUrl} className="w-16 h-24 object-cover rounded-2xl border border-white/10" />
                    <div className="flex-1">
                      <span className="text-sm font-black block">Día {dayNum}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setSelectedDay(Number(dayNum)); setShowManagePhotosModal(false); }} className={`px-5 py-2 ${theme.primary} text-[10px] font-black uppercase tracking-widest rounded-full`}>Ir</button>
                      <button onClick={() => { if(window.confirm('¿Borrar?')){ const newP={...userPhotos}; delete newP[dayNum]; setUserPhotos(newP);} }} className="px-5 py-2 bg-transparent text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:text-red-500 transition-colors">Borrar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedWorldModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl`}>
            <div className={`flex justify-between items-start border-b ${theme.border} pb-4`}>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>Fase Actual</span>
                <h3 className="text-xl font-black leading-tight">{selectedWorldModal.title}</h3>
              </div>
              <button onClick={() => setSelectedWorldModal(null)} className={`${theme.muted} font-bold text-xl`}>✕</button>
            </div>
            <div className="space-y-3">
              <span className={`text-[10px] ${theme.muted} font-bold block uppercase tracking-widest`}>Ítems</span>
              <div className="grid grid-cols-2 gap-3">
                {selectedWorldModal.items.map((item, idx) => (
                  <div key={idx} className={`${theme.secondary} p-3 rounded-2xl border ${theme.border} text-[10px] font-bold uppercase tracking-wide flex items-center`}>{item}</div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <span className={`text-[10px] ${theme.muted} font-bold block uppercase tracking-widest`}>Trofeos</span>
              <div className="grid grid-cols-2 gap-3">
                {selectedWorldModal.trophies.map((trophyId) => {
                  const trophy = TROPHY_DEFINITIONS[trophyId];
                  return (
                    <div key={trophyId} className={`p-4 ${theme.secondary} border ${theme.border} rounded-2xl flex flex-col items-center text-center gap-2`}>
                      <span className="text-2xl">{trophy.icon}</span>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">{trophy.title}</h4>
                        <p className={`text-[9px] ${theme.muted}`}>{trophy.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setSelectedWorldModal(null)} className={`w-full py-4 ${theme.primary} font-black uppercase tracking-widest rounded-full text-xs`}>CONTINUAR</button>
          </div>
        </div>
      )}

      {showStrategyModal && strategyReport && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-8 max-h-[85vh] overflow-y-auto shadow-2xl`}>
            <div className={`flex justify-between items-start border-b ${theme.border} pb-4`}>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>REPORTE CLÍNICO</span>
                <h3 className="text-3xl font-black leading-tight">Análisis.</h3>
              </div>
              <button onClick={() => setShowStrategyModal(false)} className={`${theme.muted} font-bold text-2xl transition-colors`}>✕</button>
            </div>
            
            <p className={`text-sm ${theme.muted} font-medium leading-relaxed`}>"{strategyReport.summary}"</p>
            
            <div className={`space-y-6 border-t ${theme.border} pt-6`}>
              <div>
                <span className={`text-[10px] text-blue-500 font-bold uppercase tracking-widest block mb-3`}>Puntos Fuertes</span>
                <ul className="space-y-2">{strategyReport.strengths.map((s, i) => <li key={i} className="text-sm font-medium flex gap-3"><span className="text-blue-500">•</span> {s}</li>)}</ul>
              </div>
              <div>
                <span className={`text-[10px] text-red-500 font-bold uppercase tracking-widest block mb-3`}>A Mejorar</span>
                <ul className="space-y-2">{strategyReport.weaknesses.map((w, i) => <li key={i} className={`text-sm ${theme.muted} font-medium flex gap-3`}><span>•</span> {w}</li>)}</ul>
              </div>
            </div>

            <div className={`${theme.secondary} border ${theme.border} rounded-[2rem] p-6 space-y-4`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest block border-b ${theme.border} pb-2`}>Ajuste Fisiológico</span>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider"><span className={theme.muted}>Calorías</span> <span>{strategyReport.macroAdjustment.cal}</span></div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider"><span className={theme.muted}>Proteína</span> <span>{strategyReport.macroAdjustment.protein}g</span></div>
              <p className={`text-[10px] ${theme.muted} mt-2 font-medium leading-relaxed`}>{strategyReport.macroAdjustment.reason}</p>
            </div>

            <button onClick={() => setShowStrategyModal(false)} className={`w-full py-4 ${theme.primary} font-black uppercase tracking-widest rounded-full text-[10px]`}>
              CERRAR REPORTE
            </button>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-6 max-w-sm w-full space-y-5 shadow-2xl`}>
            <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
              <h3 className="text-lg font-black">Histórico</h3>
              <button onClick={() => setShowHistoryModal(false)} className={`${theme.muted} font-bold text-xl`}>✕</button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {Array.from({ length: realDay }, (_, i) => i + 1).map((d) => {
                const nut = dailyNutritionLogs[d] || { cal: 0, protein: 0 };
                return (
                  <div key={d} className={`${theme.secondary} p-4 rounded-2xl border ${theme.border} flex justify-between items-center`}>
                    <div>
                      <span className="font-bold block text-sm">Día {d}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.muted}`}>{nut.cal} kcal | {nut.protein}g Prot</span>
                    </div>
                    <button onClick={() => { setSelectedDay(d); setShowHistoryModal(false); }} className={`px-4 py-2 ${theme.primary} text-[10px] uppercase tracking-widest font-bold rounded-full`}>Ver</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURACIÓN CON PROTECCIÓN CONTRA FALLOS NULOS */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl`}>
            <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
              <h3 className="text-xl font-black">Configuración</h3>
              <button onClick={() => setShowSettingsModal(false)} className={`${theme.muted} font-bold text-xl hover:text-white transition-colors`}>✕</button>
            </div>

            <div className={`p-5 rounded-3xl border border-blue-500/30 bg-blue-500/10 space-y-3`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Plan Actual</span>
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${isDeveloper ? 'bg-purple-500 text-white' : isPro ? 'bg-green-500 text-black' : isTrialActive ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                  {isDeveloper ? 'DEV VIP' : isPro ? 'PRO VIP' : isTrialActive ? `PRO (${trialDaysLeft}d prueba)` : 'EXPIRADO'}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {isPro || isDeveloper 
                  ? 'Tienes acceso ilimitado a todas las herramientas avanzadas de IA.' 
                  : isTrialActive 
                  ? `Estás en tu periodo de prueba ilimitado. Te quedan ${trialDaysLeft} días.` 
                  : 'Tu periodo de prueba de 7 días ha finalizado. Suscríbete para continuar.'}
              </p>
              {(!isPro && !isDeveloper) && (
                <button onClick={() => { setShowSettingsModal(false); setShowPaywallModal(true); }} className={`w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform`}>
                  ⭐ {isTrialActive ? 'Activar Suscripción STUDIO PRO' : 'Renovar STUDIO PRO'}
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfileSettings} className="space-y-4">
              <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block`}>Editar Objetivos y Datos</span>

              <div>
                <label className={`text-[10px] ${theme.muted} font-bold uppercase block mb-1`}>Nombre</label>
                <input 
                  type="text" 
                  value={editProfile?.name || ''} 
                  onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                  className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs font-bold outline-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] ${theme.muted} font-bold uppercase block mb-1`}>Peso (kg)</label>
                  <input 
                    type="number" step="0.1"
                    value={editProfile?.peso || ''} 
                    onChange={(e) => {
                      const newPeso = e.target.value;
                      const updated = { ...editProfile, peso: newPeso };
                      updated.customMacros = calculateScienceMacros(updated);
                      setEditProfile(updated);
                    }}
                    className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs font-bold outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] ${theme.muted} font-bold uppercase block mb-1`}>Altura (cm)</label>
                  <input 
                    type="number" 
                    value={editProfile?.altura || ''} 
                    onChange={(e) => {
                      const newAlt = e.target.value;
                      const updated = { ...editProfile, altura: newAlt };
                      updated.customMacros = calculateScienceMacros(updated);
                      setEditProfile(updated);
                    }}
                    className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs font-bold outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-[10px] ${theme.muted} font-bold uppercase block mb-1`}>Objetivo Principal</label>
                <select 
                  value={editProfile?.objetivo || 'Recomposición'} 
                  onChange={(e) => {
                    const newObj = e.target.value;
                    const updated = { ...editProfile, objetivo: newObj };
                    updated.customMacros = calculateScienceMacros(updated);
                    setEditProfile(updated);
                  }}
                  className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs font-bold outline-none`}
                >
                  <option value="Perder Grasa" className={isDark ? "bg-black" : "bg-white"}>Perder Grasa / Definición</option>
                  <option value="Recomposición" className={isDark ? "bg-black" : "bg-white"}>Recomposición Corporal</option>
                  <option value="Ganar Músculo" className={isDark ? "bg-black" : "bg-white"}>Ganar Músculo / Volumen</option>
                </select>
              </div>

              <div className={`p-4 ${theme.secondary} rounded-2xl border ${theme.border} space-y-3`}>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ajuste de Metas Diarias</span>
                  <button 
                    type="button" 
                    onClick={handleRecalculateMacrosClick}
                    className="text-[9px] font-bold text-blue-400 underline"
                  >
                    Auto-Calcular
                  </button>
                </div>

                {checkMacroContradictions(editProfile) && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[9px] text-amber-400 leading-relaxed font-medium">
                    {checkMacroContradictions(editProfile)}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className={`text-[9px] ${theme.muted} font-bold block mb-1 uppercase`}>Calorías (kcal)</label>
                    <input 
                      type="number" 
                      value={editProfile?.customMacros?.cal || calculateScienceMacros(editProfile).cal} 
                      onChange={(e) => setEditProfile({
                        ...editProfile, 
                        customMacros: { ...(editProfile.customMacros || calculateScienceMacros(editProfile)), cal: parseInt(e.target.value) || 0 }
                      })}
                      className={`w-full bg-transparent border-b ${theme.border} py-1 font-bold outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] text-emerald-500 font-bold block mb-1 uppercase`}>Proteína (g)</label>
                    <input 
                      type="number" 
                      value={editProfile?.customMacros?.protein || calculateScienceMacros(editProfile).protein} 
                      onChange={(e) => setEditProfile({
                        ...editProfile, 
                        customMacros: { ...(editProfile.customMacros || calculateScienceMacros(editProfile)), protein: parseInt(e.target.value) || 0 }
                      })}
                      className={`w-full bg-transparent border-b ${theme.border} py-1 font-bold outline-none`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-[10px] ${theme.muted} font-bold uppercase block mb-2`}>Equipamiento Disponible</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_EQUIPMENT_OPTIONS.map((equip) => {
                    const selectedList = editProfile?.equipamientoArray || ['mancuernas'];
                    const selected = Array.isArray(selectedList) && selectedList.includes(equip.id);
                    return (
                      <button
                        key={equip.id}
                        type="button"
                        onClick={() => handleEquipmentToggle(equip.id)}
                        className={`p-2.5 rounded-2xl border text-[10px] font-bold flex items-center justify-center transition-all ${
                          selected 
                            ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black' 
                            : `${theme.secondary} ${theme.border} ${theme.muted}`
                        }`}
                      >
                        <span className="truncate">{equip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className={`w-full py-3.5 ${theme.primary} text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg mt-2`}>
                Guardar Ajustes
              </button>
            </form>

            <button 
              type="button"
              onClick={() => {
                if (window.confirm("⚠️ ¿Estás seguro de que quieres BORRAR TODOS los datos y empezar el reto de 0 desde el Día 1?")) {
                  const adminProfile = userProfile ? { ...userProfile } : null;
                  localStorage.clear();
                  if (adminProfile) {
                    localStorage.setItem('active_user_profile', JSON.stringify(adminProfile));
                  }
                  window.location.reload();
                }
              }} 
              className="w-full py-3.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg hover:bg-red-700 transition-all active:scale-95"
            >
              💣 Reiniciar App de 0 (Admin)
            </button>

            <button onClick={() => { localStorage.removeItem('active_user_profile'); window.location.reload(); }} className="w-full py-3 bg-gray-500/20 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-500/40 hover:text-white transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE SUSCRIPCIÓN */}
      {showPaywallModal && !isPro && !isDeveloper && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-fadeIn backdrop-blur-xl">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-8 shadow-2xl relative overflow-hidden`}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className={`flex justify-between items-start pb-2 relative z-10`}>
              <div>
                <span className={`text-[10px] ${theme.primary} px-3 py-1 rounded-full font-bold tracking-widest block uppercase mb-3 inline-block`}>STUDIO PRO</span>
                <h3 className="text-3xl font-black leading-tight">
                  {isTrialActive ? 'Disfruta de tu\nPrueba Gratis.' : 'Tu prueba de\n7 días ha finalizado.'}
                </h3>
              </div>
              <button onClick={() => setShowPaywallModal(false)} className={`${theme.muted} font-bold text-2xl transition-colors`}>✕</button>
            </div>
            
            <p className={`text-sm ${theme.muted} font-medium leading-relaxed relative z-10`}>
              {isTrialActive 
                ? `Estás disfrutando de tus 7 días gratis. ¡Suscríbete ahora para asegurar tu precio promocional!`
                : 'Pásate a STUDIO PRO para seguir contando macros con cámara y voz, generar recetas exclusivas y crear rutinas adaptadas a ti.'}
            </p>
            
            <div className={`space-y-4 relative z-10`}>
              <div className="flex items-center gap-3 text-sm font-medium"><span className="text-blue-500 text-lg">✓</span> Escaneo de comidas por Foto y Voz con IA</div>
              <div className="flex items-center gap-3 text-sm font-medium"><span className="text-blue-500 text-lg">✓</span> Rutinas ilimitadas adaptadas a tu equipamiento</div>
              <div className="flex items-center gap-3 text-sm font-medium"><span className="text-blue-500 text-lg">✓</span> Recetas del Chef IA personalizadas</div>
              <div className="flex items-center gap-3 text-sm font-medium"><span className="text-blue-500 text-lg">✓</span> Análisis clínicos y comparador de capas</div>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-end justify-center gap-1 mb-6">
                <span className="text-4xl font-black">9.99€</span>
                <span className={`text-xs ${theme.muted} font-bold uppercase tracking-widest pb-1`}>/ mes</span>
              </div>
              <button onClick={() => { setIsPro(true); localStorage.setItem(`${userKey}_is_pro`, 'true'); setShowPaywallModal(false); alert('¡Pago simulado con éxito! Ahora tienes acceso STUDIO PRO activo.'); }} className={`w-full py-5 ${theme.primary} font-black uppercase tracking-widest rounded-[2rem] text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform`}>
                Activar Suscripción
              </button>
              <button onClick={() => setShowPaywallModal(false)} className={`w-full py-4 bg-transparent ${theme.muted} font-bold uppercase tracking-widest rounded-full text-[10px]`}>
                {isTrialActive ? 'Continuar con mi prueba gratis' : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL PLANIFICADOR ===== */}
      <WorkoutPlannerModal
        isOpen={showPlanner}
        onClose={() => setShowPlanner(false)}
        onPlanGenerated={handlePlanGenerated}
        currentPlan={workoutPlan}
      />

    </div>
  );
}