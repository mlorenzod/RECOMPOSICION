import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';

// RUTINAS BASE REPETIBLES (ENTRENO)
const BASE_WORKOUTS = {
  torso: [
    { id: 'bench', name: 'Press de Banca Plano', target: 'Pectoral / Tríceps', defaultPR: 68, sets: '4 x 5-6', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alts: ['Press Inclinado', 'Flexiones Lastradas'] },
    { id: 'row', name: 'Remo Pendlay con Barra', target: 'Espalda / Dorsal', defaultPR: 60, sets: '4 x 8', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80', alts: ['Remo Mancuerna', 'Dominadas'] },
    { id: 'press', name: 'Press Militar de Pie', target: 'Hombros', defaultPR: 45, sets: '3 x 8-10', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', alts: ['Press Arnold', 'Elevaciones Laterales'] }
  ],
  pierna: [
    { id: 'squat', name: 'Sentadilla con Barra', target: 'Cuádriceps / Glúteo', defaultPR: 80, sets: '4 x 6-8', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', alts: ['Sentadilla Búlgara', 'Prensa'] },
    { id: 'dl', name: 'Peso Muerto Rumano', target: 'Isquios / Glúteo', defaultPR: 85, sets: '3 x 8-10', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80', alts: ['Hip Thrust', 'Curl Femoral'] }
  ]
};

// HISTÓRICO DE MUNDOS ESTILO MARIO (CADA 10 DÍAS) CON TROFEOS Y AZUCARILLOS
const MARIO_WORLDS = [
  { id: 1, range: 'Días 1 - 10', title: 'Mundo 1: Templo de la Iniciación 🍄', items: ['🍄 Champiñón Fuerza', '🪙 150 Monedas XP'], calories: '21,000 kcal', prot: '1,650g', muscleSets: { Pecho: 16, Espalda: 16, Pierna: 12, Hombro: 10 }, trophies: ['first_log', 'world_1'] },
  { id: 2, range: 'Días 11 - 20', title: 'Mundo 2: Valle de Hipertrofia 🌟', items: ['🌟 Estrella Adherencia', '🔥 Flor de Fuego'], calories: '42,000 kcal', prot: '3,300g', muscleSets: { Pecho: 32, Espalda: 32, Pierna: 24, Hombro: 20 }, trophies: ['bench_68', 'streak_7'] },
  { id: 3, range: 'Días 21 - 30', title: 'Mundo 3: Fortaleza del Hábito 🏰', items: ['🛡️ Escudo Anti-Caprichos', '👑 Corona Temporal'], calories: '63,000 kcal', prot: '4,950g', muscleSets: { Pecho: 48, Espalda: 48, Pierna: 36, Hombro: 30 }, trophies: ['squat_100'] },
  { id: 4, range: 'Días 31 - 40', title: 'Mundo 4: Desierto del Déficit 🏜️', items: ['🧪 Poción Recuperación', '🪙 500 Monedas XP'], calories: '84,000 kcal', prot: '6,600g', muscleSets: { Pecho: 64, Espalda: 64, Pierna: 48, Hombro: 40 }, trophies: ['world_3'] },
  { id: 5, range: 'Días 41 - 50', title: 'Mundo 5: Cumbre de Sobrecarga 🏔️', items: ['⚡ Rayo Fuerza +10kg', '🏆 Trofeo Plata'], calories: '105,000 kcal', prot: '8,250g', muscleSets: { Pecho: 80, Espalda: 80, Pierna: 60, Hombro: 50 }, trophies: ['macro_master'] },
  { id: 6, range: 'Días 51 - 60', title: 'Mundo 6: Castillo Recomposición 👑', items: ['👑 Corona Absoluta', '💎 Cristal Transformación'], calories: '126,000 kcal', prot: '9,900g', muscleSets: { Pecho: 96, Espalda: 96, Pierna: 72, Hombro: 60 }, trophies: ['legend_60'] }
];

const TROPHY_DEFINITIONS = {
  first_log: { title: 'Bautismo de Hierro', desc: 'Registra tu primera serie real', icon: '⚡' },
  bench_68: { title: 'Club de los 68kg', desc: 'Supera la barrera en press de banca', icon: '🏋️‍♂️' },
  streak_7: { title: 'Constancia de Acero', desc: 'Completa 7 días seguidos de nutrición', icon: '🔥' },
  world_1: { title: 'Superador Mundo 1', desc: 'Completa los primeros 10 días', icon: '🍄' },
  squat_100: { title: 'Rey de la Sentadilla', desc: 'Alcanza los 100kg de carga', icon: '👑' },
  world_3: { title: 'Señor del Hábito', desc: 'Llega al día 30 del reto', icon: '🏰' },
  macro_master: { title: 'Scanner IA Master', desc: 'Escanea 15 platos con la cámara', icon: '📷' },
  legend_60: { title: 'Leyenda Recomposición', desc: 'Finaliza los 60 días completos', icon: '🏆' }
};

// HISTÓRICO DE MEDIDAS Y PESO PARA GRÁFICOS EN SEGUIMIENTO
const INITIAL_BODY_MEASUREMENTS = [
  { day: 1, weight: 75.5, waist: 84.0, chest: 104, arm: 36.0 },
  { day: 4, weight: 75.0, waist: 83.5, chest: 104, arm: 36.2 },
  { day: 8, weight: 74.6, waist: 82.8, chest: 104.5, arm: 36.5 },
  { day: 12, weight: 74.0, waist: 82.0, chest: 105, arm: 36.8 }
];

// EVOLUCIÓN POR EJERCICIO (SOBRECARGA PROGRESIVA)
const EXERCISE_ANALYTICS = {
  bench: { name: 'Press de Banca Plano', history: [60, 62.5, 65, 68, 70, 72.5], unit: 'kg', gain: '+12.5 kg' },
  squat: { name: 'Sentadilla con Barra', history: [70, 72.5, 75, 80, 82.5, 85], unit: 'kg', gain: '+15.0 kg' },
  row: { name: 'Remo Pendlay con Barra', history: [50, 52.5, 55, 60, 62.5, 65], unit: 'kg', gain: '+15.0 kg' },
  press: { name: 'Press Militar de Pie', history: [35, 37.5, 40, 42.5, 45, 47.5], unit: 'kg', gain: '+12.5 kg' }
};

const RECIPE_POOL = [
  { id: 1, title: 'Poke Bowl de Salmón y Aguacate', cal: 520, prot: 38, carbs: 45, fat: 18, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
  { id: 2, title: 'Fajitas de Pollo Marinado y Vegetales', cal: 510, prot: 42, carbs: 48, fat: 12, img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80' },
  { id: 3, title: 'Pancakes Proteicos con Frutos Rojos', cal: 480, prot: 40, carbs: 50, fat: 9, img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&q=80' }
];

export default function App() {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [authStep, setAuthStep] = useState(userProfile ? 'app' : 'login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  // CÁLCULO DE DÍAS REALES DEL RETO
  const [startDate] = useState(() => {
    const saved = localStorage.getItem('reto_start_date');
    if (saved) return new Date(saved);
    const now = new Date();
    localStorage.setItem('reto_start_date', now.toISOString());
    return now;
  });

  const calculateRealDay = () => {
    const diffTime = Math.abs(new Date() - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(60, Math.max(1, diffDays));
  };

  const realDay = calculateRealDay();
  const [selectedDay, setSelectedDay] = useState(realDay);

  // NAVEGACIÓN Y ARCHIVADORES
  const [activeTab, setActiveTab] = useState('entreno');
  const [restDays, setRestDays] = useState({ 3: true, 7: true, 12: true });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // MODALES
  const [selectedWorldModal, setSelectedWorldModal] = useState(null);
  const [vetoTarget, setVetoTarget] = useState(null);

  // VETOS Y PREFERENCIAS
  const [bannedFoodsList, setBannedFoodsList] = useState(() => userProfile?.bannedFoods ? userProfile.bannedFoods.split(',').map(s => s.trim()) : ['Brócoli', 'Lactosa']);
  const [bannedExercisesList, setBannedExercisesList] = useState([]);

  // FREEMIUM & CREDITS
  const [dailyCredits, setDailyCredits] = useState(3);
  const [isPro, setIsPro] = useState(false);

  // NUTRICIÓN REGISTROS DIARIOS HISTÓRICOS (EMPIEZA DE CERO SI NO HAY REGISTRO EN EL DÍA)
  const [dailyNutritionLogs, setDailyNutritionLogs] = useState({
    1: { cal: 2050, protein: 160, carbs: 200, fat: 52 },
    2: { cal: 1980, protein: 165, carbs: 190, fat: 50 },
    3: { cal: 2100, protein: 155, carbs: 210, fat: 55 },
    12: { cal: 1420, protein: 115, carbs: 140, fat: 42 }
  });

  const [nutritionView, setNutritionView] = useState('diaria');
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [customFoodInput, setCustomFoodInput] = useState('');
  const [customFoodGrams, setCustomFoodGrams] = useState(150);

  // SEGUIMIENTO: DATOS Y MEDIDAS
  const [bodyLogs, setBodyLogs] = useState(INITIAL_BODY_MEASUREMENTS);
  const [selectedMetric, setSelectedMetric] = useState('waist'); // 'waist', 'weight', 'chest', 'arm'
  const [selectedAnalyticsEx, setSelectedAnalyticsEx] = useState('bench');
  const [trackerWeight, setTrackerWeight] = useState(74.0);
  const [trackerWaist, setTrackerWaist] = useState('');
  const [trackerChest, setTrackerChest] = useState('');
  const [trackerArm, setTrackerArm] = useState('');

  // MACROS OBJETIVO Y REGISTROS EN TIEMPO REAL
  const targetMacros = { cal: 2100, protein: 165, carbs: 210, fat: 55 };
  const currentMacros = dailyNutritionLogs[selectedDay] || { cal: 0, protein: 0, carbs: 0, fat: 0 };
  const calPercentage = Math.min(100, Math.round((currentMacros.cal / targetMacros.cal) * 100));

  const [logs, setLogs] = useState({});
  const [userXP, setUserXP] = useState(420);
  const [swappingId, setSwappingId] = useState(null);

  const challengeProgress = Math.round((selectedDay / 60) * 100);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    setAuthStep('onboarding');
  };

  const useCredit = () => {
    if (isPro) return true;
    if (dailyCredits <= 0) {
      alert('🔒 Agotaste tus 3 Créditos Gratuitos de hoy.');
      return false;
    }
    setDailyCredits(prev => prev - 1);
    return true;
  };

  const toggleRestDay = (dayNum) => {
    setRestDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleLogSet = (exId, weight, reps) => {
    const logKey = `day_${selectedDay}_${exId}`;
    setLogs(prev => ({
      ...prev,
      [logKey]: [...(prev[logKey] || []), { weight, reps, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
    }));
    setUserXP(prev => prev + 25);
  };

  const handleApplyVeto = (permanently) => {
    if (!vetoTarget) return;

    if (vetoTarget.type === 'exercise') {
      if (permanently) {
        setBannedExercisesList([...bannedExercisesList, vetoTarget.item.name]);
        alert(`⛔ "${vetoTarget.item.name}" añadido a tu lista negra de ejercicios.`);
      } else {
        alert(`🚫 "${vetoTarget.item.name}" omitido únicamente para la sesión de hoy.`);
      }
      setSwappingId(null);
    } else if (vetoTarget.type === 'food') {
      if (permanently) {
        setBannedFoodsList([...bannedFoodsList, vetoTarget.item.title || vetoTarget.item]);
        alert(`⛔ "${vetoTarget.item.title || vetoTarget.item}" vetado permanentemente.`);
      } else {
        alert(`🚫 Receta omitida por hoy. Buscando alternativa...`);
      }
      setCurrentRecipeIndex((prev) => (prev + 1) % RECIPE_POOL.length);
    }
    setVetoTarget(null);
  };

  const handleSimulateScan = () => {
    if (!useCredit()) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        dishName: 'Pollo a la plancha con Arroz y Aguacate',
        img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
        foods: [
          { name: 'Pechuga de pollo', grams: 200, cal: 330, prot: 44 },
          { name: 'Arroz blanco cocido', grams: 150, cal: 195, prot: 4 },
          { name: 'Aguacate', grams: 50, cal: 80, prot: 1 }
        ]
      });
    }, 1200);
  };

  const handleConfirmScan = () => {
    if (!scanResult) return;
    const addedCal = scanResult.foods.reduce((acc, f) => acc + f.cal, 0);
    const addedProt = scanResult.foods.reduce((acc, f) => acc + f.prot, 0);

    setDailyNutritionLogs(prev => ({
      ...prev,
      [selectedDay]: {
        cal: (prev[selectedDay]?.cal || 0) + addedCal,
        protein: (prev[selectedDay]?.protein || 0) + addedProt,
        carbs: (prev[selectedDay]?.carbs || 0) + 30,
        fat: (prev[selectedDay]?.fat || 0) + 10
      }
    }));

    setScanResult(null);
    setUserXP(prev => prev + 50);
  };

  const handleInjectCustomFood = (e) => {
    e.preventDefault();
    if (!customFoodInput) return;
    if (!useCredit()) return;

    const estCal = Math.round(customFoodGrams * 2.2);
    const estProt = Math.round(customFoodGrams * 0.18);

    setDailyNutritionLogs(prev => ({
      ...prev,
      [selectedDay]: {
        cal: (prev[selectedDay]?.cal || 0) + estCal,
        protein: (prev[selectedDay]?.protein || 0) + estProt,
        carbs: (prev[selectedDay]?.carbs || 0) + 20,
        fat: (prev[selectedDay]?.fat || 0) + 8
      }
    }));

    alert(`✅ ¡Añadido ${customFoodInput} (${customFoodGrams}g)! Macros del Día ${selectedDay} reajustados.`);
    setCustomFoodInput('');
  };

  const handleSavePhysicalTracking = () => {
    if (!trackerWaist) {
      alert('🚫 ¡Error! La medida de CINTURA (*) es obligatoria.');
      return;
    }
    const newEntry = {
      day: selectedDay,
      weight: parseFloat(trackerWeight) || 74.0,
      waist: parseFloat(trackerWaist),
      chest: parseFloat(trackerChest) || 104,
      arm: parseFloat(trackerArm) || 36.5
    };

    setBodyLogs([...bodyLogs.filter(b => b.day !== selectedDay), newEntry]);
    alert(`✅ Registro guardado para el Día ${selectedDay}. +50 XP`);
    setUserXP(prev => prev + 50);
    setTrackerWaist(''); setTrackerChest(''); setTrackerArm('');
  };

  if (authStep === 'login') {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#141417] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#E10600] uppercase block">RECOMPOSICIÓN 60 DÍAS</span>
            <h1 className="text-2xl font-black text-white tracking-tight">PERFORMANCE PRO</h1>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 font-bold block mb-1">Nombre Completo</label>
              <input type="text" required placeholder="Ej. Alex García" value={loginName} onChange={(e) => setLoginName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#E10600]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-bold block mb-1">Correo Electrónico</label>
              <input type="email" required placeholder="alex@ejemplo.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#E10600]" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#E10600] text-white font-black rounded-xl text-xs tracking-wider shadow-lg">CREAR CUENTA GRATUITA →</button>
          </form>
        </div>
      </div>
    );
  }

  if (authStep === 'onboarding') {
    return <Onboarding onComplete={(data) => {
      const fullProfile = { ...data, email: loginEmail, name: loginName || 'Atleta' };
      localStorage.setItem('user_profile', JSON.stringify(fullProfile));
      setUserProfile(fullProfile);
      setAuthStep('app');
    }} />;
  }

  const isRestDay = restDays[selectedDay];
  const currentWorkoutType = selectedDay % 2 !== 0 ? 'torso' : 'pierna';
  const currentExercises = BASE_WORKOUTS[currentWorkoutType].filter(ex => !bannedExercisesList.includes(ex.name));
  const currentRecipe = RECIPE_POOL[currentRecipeIndex];
  const currentWorldIndex = Math.floor((selectedDay - 1) / 10);
  const currentWorldObj = MARIO_WORLDS[currentWorldIndex] || MARIO_WORLDS[0];
  const analyticsData = EXERCISE_ANALYTICS[selectedAnalyticsEx];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 flex flex-col justify-between select-none relative">
      
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-[#141417]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 safe-padding-top flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block">ATLETA: {userProfile.name}</span>
          <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
            PERFORMANCE <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">DÍA {selectedDay}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-300">⚙️</button>
          <button onClick={() => setIsPro(!isPro)} className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${isPro ? 'bg-amber-400 text-black' : 'bg-white/5 text-gray-300'}`}>
            {isPro ? '👑 PRO' : `⚡ ${dailyCredits}/3`}
          </button>
        </div>
      </header>

      {/* ARCHIVADORES SUPERIORES */}
      <nav className="bg-[#141417] border-b border-white/10 px-3 pt-2">
        <div className="flex gap-1.5 max-w-md mx-auto">
          <button onClick={() => setActiveTab('entreno')} className={`flex-1 py-3 px-2 rounded-t-2xl font-black text-xs border-t border-x ${activeTab === 'entreno' ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-black/40 text-gray-400 border-white/10'}`}>🏋️‍♂️ ENTRENO</button>
          <button onClick={() => setActiveTab('nutricion')} className={`flex-1 py-3 px-2 rounded-t-2xl font-black text-xs border-t border-x ${activeTab === 'nutricion' ? 'bg-[#10B981] text-black border-[#10B981]' : 'bg-black/40 text-gray-400 border-white/10'}`}>🥗 NUTRICIÓN</button>
          <button onClick={() => setActiveTab('seguimiento')} className={`flex-1 py-3 px-2 rounded-t-2xl font-black text-xs border-t border-x ${activeTab === 'seguimiento' ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'bg-black/40 text-gray-400 border-white/10'}`}>📈 SEGUIMIENTO</button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 overflow-y-auto">

        {/* 01. MÓDULO ENTRENO */}
        {activeTab === 'entreno' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* TIMELINE DE DÍAS Y HITOS DE MUNDOS MARIO */}
            <div className="space-y-1.5 overflow-hidden">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono font-bold">
                <span>PLANIFICACIÓN (60 DÍAS)</span>
                <button 
                  onClick={() => setSelectedWorldModal(currentWorldObj)}
                  className="text-amber-400 font-extrabold flex items-center gap-1 hover:underline"
                >
                  🍄 VER MUNDO {currentWorldObj.id} DE TROFEOS →
                </button>
              </div>

              <div className="w-full overflow-x-auto touch-pan-x pb-2 scrollbar-none relative">
                <div className="flex gap-2 min-w-max">
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
                    const isRest = restDays[dayNum];
                    const isSelected = selectedDay === dayNum;
                    const isWorldMilestone = dayNum % 10 === 0;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`w-13 h-14 rounded-xl border flex flex-col items-center justify-center font-mono transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#E10600] border-[#E10600] text-white font-black scale-105 shadow-lg shadow-red-900/50'
                            : isRest 
                              ? 'bg-blue-950/40 border-blue-500/30 text-blue-400' 
                              : 'bg-[#141417] border-white/10 text-gray-400'
                        }`}
                      >
                        {isWorldMilestone && (
                          <span className="absolute -top-1 -right-1 text-[10px] bg-amber-400 text-black rounded-full px-1 font-bold shadow-md animate-bounce z-10">
                            🍄
                          </span>
                        )}
                        <span className="text-[8px] opacity-80">DÍA</span>
                        <span className="text-sm font-black">{dayNum}</span>
                        <span className="text-[7px] font-sans font-bold">
                          {isRest ? 'Rest' : (dayNum % 2 !== 0 ? 'Torso' : 'Pierna')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ESTADO HOY */}
            <div className="bg-[#141417] border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-xl">
              <div>
                <span className="text-[10px] text-[#E10600] font-mono font-bold uppercase block">ENFOQUE DE HOY</span>
                <h2 className="text-sm font-black text-white capitalize">
                  {isRestDay ? '😴 Recuperación Activa' : `🏋️‍♂️ ${currentWorkoutType.toUpperCase()}`}
                </h2>
              </div>
              
              <button 
                onClick={() => toggleRestDay(selectedDay)}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                  isRestDay 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}
              >
                {isRestDay ? 'A ENTRENO' : 'REST DAY'}
              </button>
            </div>

            {/* LISTA DE EJERCICIOS */}
            {isRestDay ? (
              <div className="bg-[#141417] border border-white/10 rounded-2xl p-6 text-center space-y-2">
                <span className="text-3xl block">🧘‍♂️</span>
                <h3 className="text-sm font-black text-white">Día de Recuperación Muscular</h3>
                <p className="text-xs text-gray-400">Descansa, camina o estira. Tus macros se ajustan para mantener el déficit.</p>
              </div>
            ) : (
              currentExercises.map((ex) => {
                const logKey = `day_${selectedDay}_${ex.id}`;
                const exerciseLogs = logs[logKey] || [];

                return (
                  <div key={ex.id} className="bg-[#141417] border border-white/10 rounded-2xl overflow-hidden shadow-xl space-y-3">
                    <div className="relative h-36 w-full">
                      <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-black/40 p-3 flex flex-col justify-between">
                        <span className="self-start text-[9px] bg-black/70 text-gray-200 px-2 py-0.5 rounded-full font-mono">
                          {ex.target}
                        </span>
                        <h3 className="text-base font-black text-white drop-shadow-md">{ex.name}</h3>
                      </div>
                    </div>

                    <div className="px-4 pb-4 space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono bg-black/50 p-2 rounded-xl border border-white/5">
                        <span className="text-gray-400">Pauta: <strong className="text-white">{ex.sets}</strong></span>
                        <span className="text-[#E10600] font-bold">PR: {ex.defaultPR} kg</span>
                      </div>

                      {exerciseLogs.length > 0 && (
                        <div className="bg-black/60 p-2 rounded-xl border border-white/5 space-y-1 font-mono text-xs">
                          <span className="text-[9px] text-gray-400 font-bold block">SERIES HOY:</span>
                          <div className="grid grid-cols-2 gap-1">
                            {exerciseLogs.map((log, idx) => (
                              <div key={idx} className="bg-white/5 px-2 py-0.5 rounded text-[10px] flex justify-between text-gray-300">
                                <span>S{idx + 1}: <strong>{log.weight}kg</strong> × {log.reps}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleLogSet(ex.id, ex.defaultPR, 5)}
                          className="flex-1 py-3 bg-[#E10600] active:scale-95 text-white font-black rounded-xl text-xs shadow-lg shadow-red-900/30"
                        >
                          ➕ REGISTRAR SERIE (+25 XP)
                        </button>
                        <button 
                          onClick={() => setSwappingId(swappingId === ex.id ? null : ex.id)}
                          className="px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300"
                        >
                          🔄
                        </button>
                      </div>

                      {swappingId === ex.id && (
                        <div className="p-3 bg-black/90 rounded-xl border border-[#E10600]/40 space-y-2 animate-fadeIn">
                          <span className="text-[9px] text-gray-400 font-bold block">OPCIONES DE VETO / SUSTITUCIÓN:</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => setVetoTarget({ type: 'exercise', item: ex })}
                              className="py-2 bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg"
                            >
                              🚫 VETAR ESTE EJERCICIO
                            </button>
                            <button 
                              onClick={() => setSwappingId(null)}
                              className="py-2 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold rounded-lg"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}

          </div>
        )}

        {/* 02. MÓDULO NUTRICIÓN */}
        {activeTab === 'nutricion' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div className="flex bg-[#141417] p-1 rounded-xl border border-white/10 font-mono text-xs">
              <button 
                onClick={() => setNutritionView('diaria')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${nutritionView === 'diaria' ? 'bg-[#10B981] text-black shadow-md' : 'text-gray-400'}`}
              >
                DIARIO & QUESITO 📊
              </button>
              <button 
                onClick={() => setNutritionView('recetas')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${nutritionView === 'recetas' ? 'bg-[#10B981] text-black shadow-md' : 'text-gray-400'}`}
              >
                RECETAS IA 🥗
              </button>
            </div>

            {nutritionView === 'diaria' ? (
              <div className="space-y-4">
                
                {/* DONUT QUESITO Y BATERÍAS */}
                <div className="bg-[#141417] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div>
                      <span className="text-[10px] text-[#10B981] font-mono font-bold tracking-widest block">TELEMETRÍA NUTRICIONAL</span>
                      <h2 className="text-base font-black text-white">Día {selectedDay} - Porcentajes Real</h2>
                    </div>
                    <span className="text-xs bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2.5 py-1 rounded-full font-bold font-mono">
                      {calPercentage}% INGERIDO
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-white/5 gap-4">
                    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-800" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path 
                          className="text-[#10B981] transition-all duration-1000" 
                          strokeDasharray={`${calPercentage}, 100`} 
                          strokeWidth="3.8" 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-base font-black text-white font-mono block leading-none">{currentMacros.cal}</span>
                        <span className="text-[8px] text-gray-400 font-bold block mt-0.5">de {targetMacros.cal} kcal</span>
                        <span className="text-[9px] text-[#10B981] font-extrabold font-mono">{calPercentage}%</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1 font-mono text-xs">
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5 font-bold">
                          <span className="text-gray-300">Proteína ({Math.round((currentMacros.protein/targetMacros.protein)*100)}%)</span>
                          <span className="text-[#10B981]">{currentMacros.protein}g / {targetMacros.protein}g</span>
                        </div>
                        <div className="h-2 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${(currentMacros.protein / targetMacros.protein) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5 font-bold">
                          <span className="text-gray-300">Carbs ({Math.round((currentMacros.carbs/targetMacros.carbs)*100)}%)</span>
                          <span className="text-amber-400">{currentMacros.carbs}g / {targetMacros.carbs}g</span>
                        </div>
                        <div className="h-2 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(currentMacros.carbs / targetMacros.carbs) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5 font-bold">
                          <span className="text-gray-300">Grasas ({Math.round((currentMacros.fat/targetMacros.fat)*100)}%)</span>
                          <span className="text-rose-400">{currentMacros.fat}g / {targetMacros.fat}g</span>
                        </div>
                        <div className="h-2 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(currentMacros.fat / targetMacros.fat) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ESCÁNER PLATO CON FOTO Y CÁMARA */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group cursor-pointer" onClick={handleSimulateScan}>
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" 
                      alt="Escaneo Plato" 
                      className="w-full h-28 object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end items-center text-center space-y-1">
                      <span className="text-xs font-black text-white uppercase tracking-wider">📷 ESCANEAR PLATO CON CÁMARA E IA</span>
                      <span className="text-[10px] text-[#10B981] font-mono font-bold">Haz foto a tu plato para verificar macros automáticamente</span>
                    </div>
                  </div>

                </div>

                {/* MODAL / RESULTADO DEL ESCANEO CON FOTO */}
                {scanResult && (
                  <div className="bg-[#141417] border border-[#10B981]/40 rounded-2xl p-4 space-y-3 shadow-2xl animate-fadeIn">
                    <div className="relative h-28 w-full rounded-xl overflow-hidden">
                      <img src={scanResult.img} alt={scanResult.dishName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 flex items-end">
                        <h3 className="text-xs font-black text-white">{scanResult.dishName}</h3>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] text-gray-400 font-mono font-bold block">CONFIRMA ALIMENTOS DETECTADOS:</span>
                      {scanResult.foods.map((food, i) => (
                        <div key={i} className="bg-black/50 p-2 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white block">{food.name}</span>
                            <span className="text-[9px] text-emerald-400 font-mono">{food.cal} kcal | {food.prot}g prot</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 font-mono">
                            <input 
                              type="number" 
                              value={food.grams} 
                              onChange={(e) => {
                                const newGrams = Number(e.target.value);
                                const updated = [...scanResult.foods];
                                updated[i].grams = newGrams;
                                setScanResult({ ...scanResult, foods: updated });
                              }}
                              className="w-10 bg-transparent text-right font-bold text-white outline-none text-xs" 
                            />
                            <span className="text-gray-400 text-[9px]">g</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleConfirmScan} className="flex-1 py-2.5 bg-[#10B981] text-black font-black rounded-xl text-xs">
                        ✓ CONFIRMAR Y SUMAR AL DIARIO
                      </button>
                      <button onClick={() => setScanResult(null)} className="px-3 py-2.5 bg-white/5 text-gray-400 font-bold rounded-xl text-xs">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* NEGOCIADOR DE ANTOJOS */}
                <div className="bg-[#141417] border border-white/10 rounded-2xl p-4 space-y-2 shadow-2xl">
                  <span className="text-[10px] text-amber-400 font-mono font-bold block">NEGOCIADOR DE ANTOJOS</span>
                  <form onSubmit={handleInjectCustomFood} className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ej: Pizza, Hamburguesa, Chocolate..." 
                        value={customFoodInput}
                        onChange={(e) => setCustomFoodInput(e.target.value)}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                      <input 
                        type="number" 
                        value={customFoodGrams}
                        onChange={(e) => setCustomFoodGrams(Number(e.target.value))}
                        className="w-14 bg-black/50 border border-white/10 rounded-xl px-1 py-2 text-xs text-white text-center font-mono outline-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 font-black rounded-xl text-xs">
                      ⚡ ENCAJAR EN MIS MACROS (-1 ⚡)
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              /* RECETAS */
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-[#141417] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-3">
                  <div className="relative h-44 w-full">
                    <img src={currentRecipe.img} alt={currentRecipe.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-black/40 p-3 flex flex-col justify-between">
                      <span className="self-start text-[9px] bg-black/70 text-gray-200 px-2.5 py-1 rounded-full font-mono border border-white/10">
                        Sugerencia IA
                      </span>
                      <div>
                        <span className="text-[10px] text-[#10B981] font-mono font-bold block">{currentRecipe.cal} kcal | {currentRecipe.prot}g Proteína</span>
                        <h3 className="text-base font-black text-white drop-shadow-md">{currentRecipe.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 space-y-2">
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-[#10B981] text-black font-black rounded-xl text-xs">
                        ✓ COCINAR ESTA RECETA
                      </button>
                      <button 
                        onClick={() => setVetoTarget({ type: 'food', item: currentRecipe })}
                        className="px-3 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl text-xs"
                      >
                        🚫 VETAR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 03. MÓDULO SEGUIMIENTO */}
        {activeTab === 'seguimiento' && (
          <div className="space-y-5 animate-fadeIn pb-6">
            
            {/* GRÁFICO ANIMADO DE MEDIDAS CORPORALES */}
            <div className="bg-[#141417] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div>
                  <span className="text-[10px] text-[#0066FF] font-mono font-bold tracking-widest block uppercase">EVOLUCIÓN CORPORAL</span>
                  <h2 className="text-base font-black text-white">Tendencia de Medidas</h2>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                {['waist', 'weight', 'chest', 'arm'].map((m) => (
                  <button key={m} onClick={() => setSelectedMetric(m)} className={`py-2 rounded-lg font-bold uppercase transition-all ${selectedMetric === m ? 'bg-[#0066FF] text-white shadow-md' : 'bg-black/40 text-gray-400'}`}>
                    {m === 'waist' ? 'Cintura' : m === 'weight' ? 'Peso' : m === 'chest' ? 'Pecho' : 'Brazo'}
                  </button>
                ))}
              </div>

              <div className="h-36 bg-black/60 rounded-2xl border border-white/5 p-4 flex items-end justify-between gap-3">
                {bodyLogs.map((log, idx) => {
                  const val = log[selectedMetric] || 0;
                  const maxVal = Math.max(...bodyLogs.map(b => b[selectedMetric] || 1));
                  const heightPct = (val / maxVal) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                      <div className="h-full w-full flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-900 to-[#0066FF] rounded-t-lg transition-all duration-700 ease-out relative group-hover:scale-105 shadow-[0_0_10px_rgba(0,102,255,0.4)]"
                          style={{ height: `${heightPct}%` }}
                        >
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-white bg-black/80 px-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            {val}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-gray-400">Día {log.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GRÁFICO ANIMADO DE SOBRECARGA PROGRESIVA DE FUERZA POR EJERCICIO */}
            <div className="bg-[#141417] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div>
                  <span className="text-[10px] text-[#0066FF] font-mono font-bold tracking-widest block uppercase">TELEMETRÍA DE CARGA</span>
                  <h2 className="text-base font-black text-white">Evolución por Ejercicio</h2>
                </div>
                <span className="text-xs bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30 px-2 py-0.5 rounded font-mono font-bold">
                  {analyticsData.gain}
                </span>
              </div>

              <select 
                value={selectedAnalyticsEx}
                onChange={(e) => setSelectedAnalyticsEx(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-[#0066FF]"
              >
                {Object.keys(EXERCISE_ANALYTICS).map(key => (
                  <option key={key} value={key}>{EXERCISE_ANALYTICS[key].name}</option>
                ))}
              </select>

              <div className="h-32 bg-black/60 rounded-xl border border-white/5 p-3 flex items-end justify-between gap-2">
                {analyticsData.history.map((val, idx) => {
                  const maxVal = Math.max(...analyticsData.history);
                  const heightPct = (val / maxVal) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="h-full w-full flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-900 to-[#0066FF] rounded-t transition-all duration-700 ease-out relative group-hover:scale-105"
                          style={{ height: `${heightPct}%` }}
                        >
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">{val}k</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-gray-400">Sem {idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORMULARIO REGISTRO FÍSICO */}
            <div className="bg-[#141417] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
              <span className="text-[10px] text-[#0066FF] font-mono font-bold block uppercase">REGISTRAR NUEVA MEDIDA - DÍA {selectedDay}</span>
              
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="col-span-2 bg-black/40 p-3 rounded-xl border border-white/5">
                  <label className="text-[10px] text-gray-400 font-bold block">PESO ACTUAL (KG)</label>
                  <input type="number" step="0.1" value={trackerWeight} onChange={(e) => setTrackerWeight(e.target.value)} className="w-full bg-transparent text-white text-2xl font-black outline-none" />
                </div>

                <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/40">
                  <label className="text-[10px] text-red-400 font-bold block">CINTURA * (CM)</label>
                  <input type="number" required value={trackerWaist} onChange={(e) => setTrackerWaist(e.target.value)} className="w-full bg-transparent text-red-100 text-xl font-black outline-none placeholder:text-red-800" placeholder="82.0" />
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <label className="text-[10px] text-gray-400 font-bold block">PECHO (CM)</label>
                  <input type="number" value={trackerChest} onChange={(e) => setTrackerChest(e.target.value)} className="w-full bg-transparent text-white text-xl font-black outline-none" placeholder="104.0" />
                </div>
              </div>

              <button onClick={handleSavePhysicalTracking} disabled={!trackerWaist} className={`w-full py-4 rounded-xl text-xs font-black tracking-wider ${trackerWaist ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-900/40' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                {trackerWaist ? '💾 GUARDAR MEDIDAS (+50 XP)' : '🔒 Rellena CINTURA (*) para guardar'}
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER FIXED: MUESTRA DÍAS REALES Y AL TOCAR ABRE EL HISTÓRICO GLOBAL */}
      <footer 
        onClick={() => setShowHistoryModal(true)}
        className="fixed bottom-0 left-0 right-0 bg-[#141417]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 safe-padding-bottom z-30 shadow-[0_-5px_25px_rgba(0,0,0,0.8)] cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="max-w-md mx-auto space-y-1.5 font-mono">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-gray-300 font-bold flex items-center gap-1">
              ⏱️ RETO DÍAS REALES: <strong className="text-white">DÍA {realDay} DE 60</strong>
            </span>
            <span className="text-amber-400 font-extrabold flex items-center gap-1">
              📊 HISTÓRICO DÍAS (TOCAR) →
            </span>
          </div>

          <div className="h-2 w-full bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div className="h-full bg-gradient-to-r from-red-600 via-emerald-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${(realDay/60)*100}%` }}></div>
          </div>
        </div>
      </footer>

      {/* MODAL MUNDO MARIO BROSS (TROFEOS, AZUCARILLOS & TELEMETRÍA) */}
      {selectedWorldModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141417] border border-amber-500/50 rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-2">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest block uppercase">MUNDO CONQUISTADO</span>
                <h3 className="text-base font-black text-white">{selectedWorldModal.title}</h3>
              </div>
              <button onClick={() => setSelectedWorldModal(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            {/* ITĒMS Y POWER-UPS MARIO */}
            <div className="space-y-2">
              <span className="text-[10px] text-amber-400 font-mono font-bold block">🎁 AZUCARILLOS & POWER-UPS:</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedWorldModal.items.map((item, idx) => (
                  <div key={idx} className="bg-black/60 p-2.5 rounded-xl border border-amber-500/30 text-xs font-bold text-white flex items-center gap-1.5">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* TROFEOS DE ESTE MUNDO */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#0066FF] font-mono font-bold block">🏆 TROFEOS Y MEDALLAS:</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedWorldModal.trophies.map((trophyId) => {
                  const trophy = TROPHY_DEFINITIONS[trophyId];
                  return (
                    <div key={trophyId} className="p-2.5 bg-gradient-to-br from-[#141417] to-amber-950/30 border border-amber-500/40 rounded-xl flex items-center gap-2">
                      <span className="text-xl">{trophy.icon}</span>
                      <div>
                        <h4 className="text-[10px] font-bold text-white">{trophy.title}</h4>
                        <p className="text-[8px] text-gray-400">{trophy.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TELEMETRÍA POR GRUPO MUSCULAR */}
            <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-2xl space-y-1 font-mono text-xs">
              <span className="text-[10px] text-red-400 font-bold block">🏋️‍♂️ SERIES COMPLETADAS POR MÚSCULO</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {Object.entries(selectedWorldModal.muscleSets).map(([group, sets], idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span>{group}:</span> <strong className="text-white">{sets} series</strong>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSelectedWorldModal(null)} className="w-full py-3 bg-amber-400 text-black font-black rounded-xl text-xs">¡CONTINUAR RETO! 🚀</button>
          </div>
        </div>
      )}

      {/* MODAL HISTÓRICO GLOBAL (SE ABRE DESDE EL FOOTER) */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">📊 Histórico Global por Días</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 font-mono text-xs">
              {Array.from({ length: realDay }, (_, i) => i + 1).map((d) => {
                const nut = dailyNutritionLogs[d] || { cal: 0, protein: 0 };
                return (
                  <div key={d} className="bg-black/50 p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white block">Día {d}</span>
                      <span className="text-[9px] text-emerald-400">{nut.cal} kcal | {nut.protein}g Proteína</span>
                    </div>
                    <button onClick={() => { setSelectedDay(d); setShowHistoryModal(false); }} className="px-2 py-1 bg-white/10 text-gray-200 text-[10px] rounded font-bold">Ver Día</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DIÁLOGO MODAL DE VETO ("HOY" VS "SIEMPRE") */}
      {vetoTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-3xl p-5 max-w-xs w-full space-y-4 text-center">
            <span className="text-3xl block">🚫</span>
            <div>
              <h3 className="text-base font-black text-white">
                Vetar {vetoTarget.item.name || vetoTarget.item.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                ¿Cómo quieres gestionar este descarte?
              </p>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => handleApplyVeto(false)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/10"
              >
                🗓️ Omitir SOLO POR HOY
              </button>
              <button 
                onClick={() => handleApplyVeto(true)}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-black rounded-xl text-xs border border-red-500/30"
              >
                ⛔ Vetar PARA SIEMPRE
              </button>
            </div>

            <button 
              onClick={() => setVetoTarget(null)}
              className="text-xs text-gray-500 hover:text-white font-mono pt-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* PANEL AJUSTES Y CUENTA */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141417] border border-white/10 rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">⚙️ Ajustes & Cuenta</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="bg-black/50 p-3 rounded-2xl border border-white/5 space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-[#0066FF] font-bold block uppercase">DATOS DE REGISTRO</span>
              <div className="flex justify-between"><span className="text-gray-400">Atleta:</span> <span className="text-white font-bold">{userProfile.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Email:</span> <span className="text-white font-bold">{userProfile.email}</span></div>
            </div>

            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-3 bg-red-500/10 text-red-400 text-xs font-black rounded-xl border border-red-500/30">🚪 CERRAR SESIÓN Y RESETEAR</button>
          </div>
        </div>
      )}

    </div>
  );
}