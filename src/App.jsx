import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Onboarding from './components/Onboarding';

// DICCIONARIO DE IMÁGENES GASTRANÓMICAS DE ALTA CALIDAD (FALLBACKS DINÁMICOS)
const RECIPE_IMAGES_DB = {
  pollo: [
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80'
  ],
  carne: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'
  ],
  pescado: [
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80'
  ],
  ensalada: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80'
  ],
  pasta: [
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
    'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80'
  ]
};

// Función para seleccionar la mejor imagen según los ingredientes o título
const selectRecipeImage = (title = '', ingredients = []) => {
  const text = (title + ' ' + ingredients.join(' ')).toLowerCase();
  
  if (text.includes('pollo') || text.includes('pavo') || text.includes('ave')) {
    return RECIPE_IMAGES_DB.pollo[Math.floor(Math.random() * RECIPE_IMAGES_DB.pollo.length)];
  }
  if (text.includes('carne') || text.includes('ternera') || text.includes('bistec') || text.includes('hamburguesa')) {
    return RECIPE_IMAGES_DB.carne[Math.floor(Math.random() * RECIPE_IMAGES_DB.carne.length)];
  }
  if (text.includes('salmon') || text.includes('salmón') || text.includes('atun') || text.includes('atún') || text.includes('pescado') || text.includes('merluza')) {
    return RECIPE_IMAGES_DB.pescado[Math.floor(Math.random() * RECIPE_IMAGES_DB.pescado.length)];
  }
  if (text.includes('ensalada') || text.includes('bowl') || text.includes('verde')) {
    return RECIPE_IMAGES_DB.ensalada[Math.floor(Math.random() * RECIPE_IMAGES_DB.ensalada.length)];
  }
  if (text.includes('pasta') || text.includes('macarrones') || text.includes('espagueti')) {
    return RECIPE_IMAGES_DB.pasta[Math.floor(Math.random() * RECIPE_IMAGES_DB.pasta.length)];
  }
  return RECIPE_IMAGES_DB.default[Math.floor(Math.random() * RECIPE_IMAGES_DB.default.length)];
};

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

const INITIAL_BODY_MEASUREMENTS = [];

const EXERCISE_ANALYTICS = {
  bench: { name: 'Press de Banca Plano', history: [60, 62.5, 65, 68, 70, 72.5], unit: 'kg', gain: '+12.5 kg' },
  squat: { name: 'Sentadilla con Barra', history: [70, 72.5, 75, 80, 82.5, 85], unit: 'kg', gain: '+15.0 kg' },
  row: { name: 'Remo Pendlay con Barra', history: [50, 52.5, 55, 60, 62.5, 65], unit: 'kg', gain: '+15.0 kg' },
  press: { name: 'Press Militar de Pie', history: [35, 37.5, 40, 42.5, 45, 47.5], unit: 'kg', gain: '+12.5 kg' }
};

export default function App() {
  // 1. Carga de Tipografía
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }, []);

  // 2. Sistema de Tema (Modo Claro / Oscuro)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('app_theme_dark');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('app_theme_dark', isDark);
  }, [isDark]);

  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#F9F9F9]',
    card: isDark ? 'bg-[#111111]' : 'bg-white',
    border: isDark ? 'border-white/10' : 'border-black/5',
    text: isDark ? 'text-white' : 'text-black',
    muted: isDark ? 'text-gray-500' : 'text-gray-400',
    primary: isDark ? 'bg-white text-black' : 'bg-black text-white',
    secondary: isDark ? 'bg-[#222] text-white' : 'bg-gray-100 text-black',
    navBg: isDark ? 'bg-[#050505]/95' : 'bg-[#F9F9F9]/95',
    shadow: isDark ? 'shadow-2xl shadow-white/5' : 'shadow-2xl shadow-black/5',
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('active_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [authStep, setAuthStep] = useState(userProfile ? 'app' : 'login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  const userKey = userProfile?.email ? `user_${userProfile.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'guest';

  // ==========================================
  // CONFIGURACIÓN DE DESARROLLADOR Y PAYWALL
  // ==========================================
  const DEV_EMAIL = 'mlorenzod@gmail.com'; // <--- CAMBIA ESTO POR TU CORREO REAL
  const isDeveloper = userProfile?.email === DEV_EMAIL;

  const [lastResetDate, setLastResetDate] = useState(() => localStorage.getItem(`${userKey}_last_reset`) || new Date().toISOString().split('T')[0]);
  
  const [startDate] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_reto_start_date`);
    if (saved) return new Date(saved);
    const now = new Date();
    localStorage.setItem(`${userKey}_reto_start_date`, now.toISOString());
    return now;
  });

  const calculateRealDay = () => {
    const diffTime = Math.abs(new Date() - new Date(startDate));
    return Math.min(60, Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));
  };

  const realDay = calculateRealDay();
  const [selectedDay, setSelectedDay] = useState(realDay);
  
  // Ahora el límite es de 10 tokens por día
  const [dailyCredits, setDailyCredits] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_daily_credits`);
    return saved !== null ? Number(saved) : 10;
  });

  // isPro verifica si el usuario pagó o si es el desarrollador
  const [isPro, setIsPro] = useState(() => isDeveloper || localStorage.getItem(`${userKey}_is_pro`) === 'true');
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const [bodyLogs, setBodyLogs] = useState(() => {
    const saved = localStorage.getItem(`${userKey}_body_logs`);
    return saved ? JSON.parse(saved) : INITIAL_BODY_MEASUREMENTS;
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

  useEffect(() => {
    const checkMidnightReset = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (todayStr !== lastResetDate) {
        setDailyCredits(10); // Reseteo a 10
        setLastResetDate(todayStr);
        localStorage.setItem(`${userKey}_daily_credits`, '10');
        localStorage.setItem(`${userKey}_last_reset`, todayStr);
      }
    };
    checkMidnightReset();
    const interval = setInterval(checkMidnightReset, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate, userKey]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(`${userKey}_body_logs`, JSON.stringify(bodyLogs));
      localStorage.setItem(`${userKey}_nutrition_logs`, JSON.stringify(dailyNutritionLogs));
      localStorage.setItem(`${userKey}_workout_logs`, JSON.stringify(logs));
      localStorage.setItem(`${userKey}_xp`, userXP.toString());
      localStorage.setItem(`${userKey}_photos`, JSON.stringify(userPhotos));
      localStorage.setItem(`${userKey}_daily_credits`, dailyCredits.toString());
      localStorage.setItem(`${userKey}_is_pro`, isPro.toString());
    }
  }, [bodyLogs, dailyNutritionLogs, logs, userXP, userPhotos, dailyCredits, isPro, userKey, userProfile]);

  // Estados Seguimiento Visual
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showManagePhotosModal, setShowManagePhotosModal] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const savedDaysWithPhotos = Object.keys(userPhotos).map(Number).sort((a,b) => a-b);
  const [compareDay, setCompareDay] = useState(savedDaysWithPhotos[0] || 1);
  const [compareMode, setCompareMode] = useState('blend'); 
  const [blendOpacity, setBlendOpacity] = useState(0.5);
  const [sliderPos, setSliderPos] = useState(50);

  const [activeLayer, setActiveLayer] = useState('top');
  const [baseScale, setBaseScale] = useState(1);
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(0);
  const [topScale, setTopScale] = useState(1);
  const [topX, setTopX] = useState(0);
  const [topY, setTopY] = useState(0);

  const fileInputRef = useRef(null);
  const mealFileInputRef = useRef(null);
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState('entreno');
  const [restDays, setRestDays] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedWorldModal, setSelectedWorldModal] = useState(null);
  const [bannedExercisesList, setBannedExercisesList] = useState([]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [textFoodInput, setTextFoodInput] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [selectedMetric, setSelectedMetric] = useState('waist');
  const [selectedAnalyticsEx, setSelectedAnalyticsEx] = useState('bench');
  const [trackerWeight, setTrackerWeight] = useState(74.0);
  const [trackerWaist, setTrackerWaist] = useState('');
  const [trackerChest, setTrackerChest] = useState('');
  const [swappingId, setSwappingId] = useState(null);

  const targetMacros = { cal: 2100, protein: 165, carbs: 210, fat: 55 };
  const currentMacros = dailyNutritionLogs[selectedDay] || { cal: 0, protein: 0, carbs: 0, fat: 0 };
  const calPercentage = Math.min(100, Math.round((currentMacros.cal / targetMacros.cal) * 100));

  // Función Central de Consumo de Tokens
  const useCredit = () => {
    if (isPro || isDeveloper) return true; // Ilimitado
    if (dailyCredits <= 0) {
      setShowPaywallModal(true); // Activa el muro de pago
      return false;
    }
    setDailyCredits(prev => prev - 1);
    return true;
  };

  // IA PARSER DE COMIDA BLINDADO
  const processFoodWithGemini = async (promptContent) => {
    if (!useCredit()) return;
    setIsScanning(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) { alert("Falta API Key de Gemini."); setIsScanning(false); return; }
      
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Analiza esta comida para un programa de recomposición. Devuelve SOLO un JSON estricto. Formato:
      {"dishName": "Nombre plato", "foods": [{"name": "Ingrediente", "grams": 150, "cal": 220, "prot": 25, "carbs": 20, "fat": 8}], "goalFeedback": "Feedback breve."}`;

      const contents = Array.isArray(promptContent) ? [...promptContent, systemInstruction] : [promptContent, systemInstruction];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });

      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      const data = JSON.parse(jsonMatch[0]);

      setScanResult({
        dishName: data.dishName,
        img: (typeof promptContent === 'object' && promptContent.inlineData && promptContent.inlineData.mimeType.startsWith('image')) ? `data:${promptContent.inlineData.mimeType};base64,${promptContent.inlineData.data}` : null,
        foods: data.foods,
        goalFeedback: data.goalFeedback
      });
      setUserXP(prev => prev + 50);
    } catch (error) {
      alert("Error procesando los datos. Por favor, intenta de nuevo.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleTextFoodSubmit = (e) => { e.preventDefault(); if (textFoodInput.trim()) { processFoodWithGemini(`Procesa: "${textFoodInput}"`); setTextFoodInput(''); } };

  const handleToggleAudioRecording = async () => {
    if (isRecordingAudio) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            processFoodWithGemini({ inlineData: { mimeType: mediaRecorder.mimeType.split(';')[0] || 'audio/webm', data: base64Audio } });
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        setIsRecordingAudio(true);
      } catch (err) { alert("No se pudo acceder al micrófono."); }
    }
  };

  const handleMealImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => processFoodWithGemini({ inlineData: { mimeType: file.type || 'image/jpeg', data: event.target.result.replace(/^data:image\/\w+;base64,/, '') } });
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // GENERADOR DE RECETAS VISUALES CON IA
  const generatePersonalizedRecipe = async () => {
    if (!useCredit()) return;
    setIsGeneratingRecipe(true); 
    setRecipeError(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API KEY faltante");
      const ai = new GoogleGenAI({ apiKey });
      
      const neededCal = Math.max(300, targetMacros.cal - currentMacros.cal);
      const neededProt = Math.max(20, targetMacros.protein - currentMacros.protein);

      const prompt = `Actúa como Chef Fitness Pro. Genera 1 receta deliciosa y fácil para un objetivo de ${userProfile?.objetivo || 'Recomposición'}.
      Faltan ${neededCal} kcal y ${neededProt}g de proteína hoy.
      Restricciones del atleta: ${userProfile?.restricciones || 'ninguna'}.

      Devuelve ÚNICAMENTE un JSON estricto con esta estructura exacta:
      {
        "title": "Nombre del Plato",
        "prepTime": "15 min",
        "cal": ${neededCal},
        "prot": ${neededProt},
        "carbs": 35,
        "fat": 12,
        "ingredients": ["150g Pechuga de Pollo", "1/2 Aguacate", "100g Arroz blanco cooked"],
        "steps": [
          "Corta el pollo en dados y sazona con pimienta.",
          "Cocina a fuego vivo durante 6 minutos hasta dorar.",
          "Monta el bowl colocando la base de arroz, el pollo y aguacate en láminas."
        ],
        "chefTip": "Añade un chorrito de limón para mejorar la absorción del hierro."
      }`;

      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{ text: prompt }] });
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Format error");
      
      const recipeData = JSON.parse(jsonMatch[0]);
      
      // Asignar imagen HD dinámica basada en el título e ingredientes
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
    if (!useCredit()) return;
    setIsAnalyzingStrategy(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const prompt = `Actúa como coach. Devuelve SOLO JSON.
      {"summary": "Resumen", "strengths": ["..."], "weaknesses": ["..."], "macroAdjustment": { "cal": 2100, "protein": 170, "carbs": 200, "fat": 60, "reason": "..." }, "trainingAdjustment": "...", "nutritionTip": "...", "mindsetTip": "..."}`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{ text: prompt }] });
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      setStrategyReport(JSON.parse(jsonMatch[0]));
      setShowStrategyModal(true);
    } catch (err) { alert('Error al generar estudio.'); } finally { setIsAnalyzingStrategy(false); }
  };

  const processAndAlignImage = (sourceImage, targetWidth = 1080) => {
    const targetHeight = (targetWidth * 16) / 9;
    const canvas = document.createElement('canvas'); canvas.width = targetWidth; canvas.height = targetHeight;
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
      try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", aspectRatio: 9/16 } }); if (videoRef.current) videoRef.current.srcObject = stream; } 
      catch (err) { alert("No se pudo acceder a la cámara."); setShowCameraModal(false); }
    }, 300);
  };
  const stopCamera = () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); setShowCameraModal(false); };
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas'); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const img = new Image();
      img.onload = () => { setUserPhotos(prev => ({ ...prev, [selectedDay]: processAndAlignImage(img) })); stopCamera(); };
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
    if (!trackerWaist) return alert('Cintura requerida.');
    setBodyLogs([...bodyLogs.filter(b => b.day !== selectedDay), { day: selectedDay, weight: parseFloat(trackerWeight) || 0, waist: parseFloat(trackerWaist), chest: parseFloat(trackerChest) || 0 }]);
    setUserXP(prev => prev + 50);
    setTrackerWaist(''); setTrackerChest('');
  };

  const rootStyle = { fontFamily: "'Montserrat', sans-serif" };

  if (authStep === 'login') {
    return (
      <div style={rootStyle} className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-6 transition-colors duration-500`}>
        <div className={`w-full max-w-sm ${theme.card} border ${theme.border} rounded-[2.5rem] p-10 shadow-2xl space-y-8`}>
          <div className="text-center space-y-2">
            <span className={`text-[10px] font-bold tracking-widest ${theme.muted} uppercase block`}>Recomposición 60 Días</span>
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

  if (authStep === 'onboarding') return <Onboarding onComplete={(data) => {
    const fullProfile = { ...data, email: loginEmail, name: loginName || data.name };
    localStorage.setItem('active_user_profile', JSON.stringify(fullProfile));
    setUserProfile(fullProfile); setAuthStep('app');
  }} />;

  const isRestDay = restDays[selectedDay];
  const currentWorkoutType = selectedDay % 2 !== 0 ? 'torso' : 'pierna';
  const currentExercises = BASE_WORKOUTS[currentWorkoutType].filter(ex => !bannedExercisesList.includes(ex.name));
  const currentWorldIndex = Math.floor((selectedDay - 1) / 10);
  const currentWorldObj = MARIO_WORLDS[currentWorldIndex] || MARIO_WORLDS[0];
  const analyticsData = EXERCISE_ANALYTICS[selectedAnalyticsEx];

  return (
    <div style={rootStyle} className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col justify-between select-none relative transition-colors duration-500`}>
      <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleMultipleFileUpload} />
      <input type="file" ref={mealFileInputRef} accept="image/*" className="hidden" onChange={handleMealImageUpload} />

      {/* HEADER */}
      <header className={`sticky top-0 z-40 ${theme.navBg} backdrop-blur-xl border-b ${theme.border} px-6 py-4 flex justify-between items-center transition-colors duration-500`}>
        <div>
          <span className={`text-[9px] font-bold tracking-[0.2em] ${theme.muted} uppercase block mb-1`}>ATLETA: {userProfile.name}</span>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            STUDIO <span className={`text-[10px] px-3 py-1 rounded-full border ${theme.border} ${theme.muted} font-bold uppercase tracking-widest`}>DÍA {selectedDay}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDark(!isDark)} className={`p-2.5 ${theme.secondary} rounded-full text-[12px]`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => setShowSettingsModal(true)} className={`p-2.5 ${theme.secondary} rounded-full text-[12px]`}>⚙️</button>
          
          {/* BOTÓN HEADER ACTUALIZADO PARA PAYWALL Y DEV */}
          <button 
            onClick={() => !isPro && !isDeveloper && setShowPaywallModal(true)} 
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${isPro || isDeveloper ? theme.primary + ' border-transparent' : 'bg-transparent ' + theme.border + ' ' + theme.muted}`}
          >
            {isDeveloper ? 'DEV MODE ♾️' : isPro ? 'VIP ♾️' : `${dailyCredits} TOKENS`}
          </button>
        </div>
      </header>

      {/* TABS NAVEGACIÓN */}
      <nav className={`${theme.bg} border-b ${theme.border} px-4 pt-4 pb-0 transition-colors duration-500`}>
        <div className="flex gap-4 max-w-md mx-auto">
          <button onClick={() => setActiveTab('entreno')} className={`pb-3 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'entreno' ? `${theme.text} ${isDark ? 'border-white' : 'border-black'}` : `${theme.muted} border-transparent`}`}>Entreno</button>
          <button onClick={() => setActiveTab('nutricion')} className={`pb-3 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'nutricion' ? `${theme.text} ${isDark ? 'border-white' : 'border-black'}` : `${theme.muted} border-transparent`}`}>Nutrición</button>
          <button onClick={() => setActiveTab('seguimiento')} className={`pb-3 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'seguimiento' ? `${theme.text} ${isDark ? 'border-white' : 'border-black'}` : `${theme.muted} border-transparent`}`}>Progreso</button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-md mx-auto px-5 py-6 space-y-8 pb-32 overflow-y-auto">

        {/* ======================= MÓDULO ENTRENO ======================= */}
        {activeTab === 'entreno' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Scroll Horizontal de Días */}
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

            {/* Cabecera Enfoque */}
            <div className={`${theme.card} border ${theme.border} rounded-[2rem] p-6 flex justify-between items-center ${theme.shadow} transition-colors duration-500`}>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-2`}>Enfoque de hoy</span>
                <h2 className="text-2xl font-black capitalize">{isRestDay ? 'Recuperación' : currentWorkoutType}</h2>
              </div>
              <button onClick={() => toggleRestDay(selectedDay)} className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isRestDay ? theme.secondary : theme.primary}`}>
                {isRestDay ? 'Entrenar' : 'Descanso'}
              </button>
            </div>

            {/* Ejercicios */}
            {isRestDay ? (
              <div className={`${theme.card} border ${theme.border} rounded-[2rem] p-10 text-center space-y-4 ${theme.shadow}`}>
                <h3 className="text-xl font-black uppercase tracking-wider">Recuperación Activa</h3>
                <p className={`text-sm ${theme.muted} font-light leading-relaxed`}>Deja que tus músculos asimilen el trabajo. Camina, estira, hidrátate. El progreso se construye en el descanso.</p>
              </div>
            ) : (
              currentExercises.map((ex) => {
                const logsToday = logs[`day_${selectedDay}_${ex.id}`] || [];
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
                          <span className="text-sm font-bold">{ex.sets}</span>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block`}>PR Meta</span>
                          <span className="text-sm font-bold">{ex.defaultPR} kg</span>
                        </div>
                      </div>

                      {logsToday.length > 0 && (
                        <div className="space-y-3">
                          <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block`}>Registro</span>
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
                        <button onClick={() => handleLogSet(ex.id, ex.defaultPR, 5)} className={`flex-1 py-4 ${theme.primary} font-black rounded-full text-[10px] uppercase tracking-widest`}>
                          Registrar Set
                        </button>
                        <button onClick={() => setSwappingId(swappingId === ex.id ? null : ex.id)} className={`px-6 py-4 ${theme.secondary} border ${theme.border} rounded-full text-xs`}>🔄</button>
                      </div>

                      {swappingId === ex.id && (
                        <div className={`p-4 ${theme.secondary} rounded-[1.5rem] space-y-3 animate-fadeIn`}>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => { setBannedExercisesList([...bannedExercisesList, ex.name]); setSwappingId(null); }} className="py-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Vetar Ejercicio</button>
                            <button onClick={() => setSwappingId(null)} className={`py-3 bg-transparent border ${theme.border} text-[10px] font-bold uppercase tracking-widest rounded-full`}>Cancelar</button>
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

        {/* ======================= MÓDULO NUTRICIÓN UNIFICADO Y ULTRA VISUAL ======================= */}
        {activeTab === 'nutricion' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 1. Cuadro de Balance (Donut) */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden ${theme.shadow} transition-colors duration-500`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>Métricas</span>
                  <h2 className="text-xl font-black">Balance Diario</h2>
                </div>
                {currentMacros.cal > 0 && (
                  <button onClick={() => { if(window.confirm('¿Reiniciar macros?')) setDailyNutritionLogs(prev => ({...prev, [selectedDay]: {cal:0, protein:0, carbs:0, fat:0}})) }} className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest underline`}>Reset</button>
                )}
              </div>

              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className={isDark ? "text-[#222]" : "text-gray-200"} strokeWidth="2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`${isDark ? "text-white" : "text-black"} transition-all duration-1000`} strokeDasharray={`${calPercentage}, 100`} strokeWidth="2" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center flex flex-col items-center">
                    <span className="text-3xl font-black leading-none">{currentMacros.cal}</span>
                    <span className={`text-[9px] ${theme.muted} font-bold mt-2 uppercase tracking-widest`}>/ {targetMacros.cal} kcal</span>
                  </div>
                </div>

                <div className={`space-y-4 flex-1 text-[10px] font-bold uppercase tracking-wider`}>
                  <div>
                    <div className="flex justify-between mb-2"><span className={theme.muted}>Prot</span><span>{currentMacros.protein}g</span></div>
                    <div className={`h-1 ${isDark ? 'bg-[#222]' : 'bg-gray-200'} rounded-full overflow-hidden`}><div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} transition-all`} style={{ width: `${(currentMacros.protein / targetMacros.protein) * 100}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className={theme.muted}>Carbs</span><span>{currentMacros.carbs}g</span></div>
                    <div className={`h-1 ${isDark ? 'bg-[#222]' : 'bg-gray-200'} rounded-full overflow-hidden`}><div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} transition-all`} style={{ width: `${(currentMacros.carbs / targetMacros.carbs) * 100}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className={theme.muted}>Fats</span><span>{currentMacros.fat}g</span></div>
                    <div className={`h-1 ${isDark ? 'bg-[#222]' : 'bg-gray-200'} rounded-full overflow-hidden`}><div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} transition-all`} style={{ width: `${(currentMacros.fat / targetMacros.fat) * 100}%` }}></div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Añadir Comida */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <span className={`text-[10px] ${theme.muted} font-bold block uppercase tracking-widest`}>Registrar Comida</span>
              <form onSubmit={handleTextFoodSubmit} className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Ej. Bowl de salmón y arroz..." value={textFoodInput} onChange={(e) => setTextFoodInput(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-3 pr-20 text-sm outline-none transition-colors font-medium`} />
                  <div className="absolute right-0 top-2 flex gap-2">
                    <button type="button" onClick={handleToggleAudioRecording} className={`p-1.5 rounded-full transition-colors ${isRecordingAudio ? 'text-red-500 animate-pulse' : theme.muted}`}>🎙️</button>
                    <button type="button" onClick={() => mealFileInputRef.current.click()} className={`p-1.5 ${theme.muted}`}>📷</button>
                  </div>
                </div>
                <button type="submit" disabled={isScanning || !textFoodInput.trim()} className={`w-full py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${textFoodInput.trim() ? theme.primary : theme.secondary + ' opacity-50 cursor-not-allowed'}`}>
                  {isScanning ? 'Procesando...' : 'Analizar Plato'}
                </button>
              </form>
            </div>

            {/* 3. Resultado IA Escaneo */}
            {scanResult && (
              <div className={`${theme.secondary} border border-gray-400/30 rounded-[2.5rem] p-8 space-y-6 animate-fadeIn ${theme.shadow}`}>
                <div className="space-y-4">
                  <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block border-b ${theme.border} pb-3`}>
                    Detectado: <span className={theme.text}>{scanResult.dishName}</span>
                  </span>
                  {scanResult.foods.map((f, i) => (
                    <div key={i} className={`flex justify-between items-center text-sm ${theme.card} p-4 rounded-2xl border ${theme.border}`}>
                      <div>
                        <span className="font-bold block mb-1">{f.name}</span>
                        <span className={`text-[10px] ${theme.muted} font-medium tracking-wide uppercase`}>{f.cal} kcal | {f.prot}g prot</span>
                      </div>
                      <div className={`font-bold ${theme.secondary} px-4 py-2 rounded-xl border ${theme.border}`}>{f.grams}g</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleConfirmScan} className={`flex-1 py-4 ${theme.primary} font-black rounded-full text-[10px] uppercase tracking-widest`}>Añadir</button>
                  <button onClick={() => setScanResult(null)} className={`px-6 py-4 bg-transparent border ${theme.border} font-black rounded-full text-[10px] uppercase tracking-widest`}>Cancelar</button>
                </div>
              </div>
            )}

            {/* 4. CHEF IA - MÓDULO VISUAL MEJORADO */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
                <div>
                  <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-1`}>Chef Inteligente</span>
                  <h2 className="text-xl font-black">Receta Personalizada</h2>
                </div>
                <button onClick={generatePersonalizedRecipe} disabled={isGeneratingRecipe} className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.secondary} border ${theme.border} hover:scale-105 transition-transform`}>
                  {isGeneratingRecipe ? 'Cocinando...' : 'Generar IA ✨'}
                </button>
              </div>

              {recipeError && <div className="text-xs text-red-500 font-medium p-2">{recipeError}</div>}

              {personalizedRecipe ? (
                <div className={`border ${theme.border} rounded-[2rem] overflow-hidden space-y-6 pb-6 animate-fadeIn ${theme.secondary}`}>
                  
                  {/* FOTO HERO GASTRONÓMICA HD */}
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
                    {/* MACROS TARGET */}
                    <div className={`grid grid-cols-3 gap-2 text-center p-3 ${theme.card} rounded-2xl border ${theme.border}`}>
                      <div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase block`}>Proteína</span>
                        <span className="text-sm font-black text-green-500">{personalizedRecipe.prot}g</span>
                      </div>
                      <div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase block`}>Carbs</span>
                        <span className="text-sm font-black">{personalizedRecipe.carbs}g</span>
                      </div>
                      <div>
                        <span className={`text-[9px] ${theme.muted} font-bold uppercase block`}>Grasas</span>
                        <span className="text-sm font-black">{personalizedRecipe.fat}g</span>
                      </div>
                    </div>
                    
                    {/* INGREDIENTES */}
                    <div>
                      <h4 className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest mb-3 flex items-center gap-2`}>
                        <span>🥘</span> Ingredientes Requeridos
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {personalizedRecipe.ingredients?.map((ing, i) => (
                          <div key={i} className={`text-xs font-medium p-3 ${theme.card} rounded-xl border ${theme.border} flex items-center gap-3`}>
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {ing}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* PASOS DE PREPARACIÓN PASO A PASO */}
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

                    {/* TIP CHEF */}
                    {personalizedRecipe.chefTip && (
                      <div className={`p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs flex gap-3 items-start`}>
                        <span className="text-base">💡</span>
                        <div>
                          <strong className="block font-bold uppercase text-[9px] tracking-wider mb-1">Tip Nutricional</strong>
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
                        alert('¡Receta añadida a tus macros diarios!');
                      }} 
                      className={`w-full py-4 ${theme.primary} font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg`}
                    >
                      Añadir esta comida a mis macros
                    </button>

                  </div>
                </div>
              ) : (
                 <div className="text-center py-8 space-y-3">
                   <span className="text-4xl block">🥗</span>
                   <p className={`text-xs ${theme.muted} font-medium leading-relaxed max-w-xs mx-auto`}>
                     Pulsa "Generar IA" para obtener una receta personalizada con fotografía en HD adaptada a tus macros faltantes de hoy.
                   </p>
                 </div>
              )}
            </div>

          </div>
        )}

        {/* ======================= MÓDULO SEGUIMIENTO (PROGRESS) ======================= */}
        {activeTab === 'seguimiento' && (
          <div className="space-y-8 animate-fadeIn pb-6">
            
            <button onClick={generateStrategyStudy} disabled={isAnalyzingStrategy} className={`w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest ${theme.primary} transition-transform hover:scale-[1.02] ${theme.shadow}`}>
              {isAnalyzingStrategy ? 'Analizando Datos...' : 'Generar Reporte IA'}
            </button>
            
            {/* SECCIÓN FOTOS */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-6 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <div className={`flex justify-between items-center border-b ${theme.border} pb-3`}>
                <div>
                  <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>Visual</span>
                  <h2 className="text-lg font-black">Día {selectedDay}</h2>
                </div>
                <button onClick={() => setShowManagePhotosModal(true)} className={`text-[10px] ${theme.secondary} px-4 py-2 rounded-full font-bold uppercase tracking-widest`}>
                  Galería
                </button>
              </div>

              <div className={`relative w-full aspect-[9/16] ${isDark ? 'bg-black' : 'bg-gray-100'} rounded-[2rem] overflow-hidden border ${theme.border} flex items-center justify-center`}>
                {userPhotos[selectedDay] ? (
                  <>
                    <img src={userPhotos[selectedDay]} className="w-full h-full object-cover" />
                    <button onClick={() => { if(window.confirm('¿Borrar foto?')){ const newP={...userPhotos}; delete newP[selectedDay]; setUserPhotos(newP);} }} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 text-white p-3 rounded-full text-xs backdrop-blur-md">✕</button>
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

            {/* GRÁFICO CORPORAL */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase border-b ${theme.border} pb-4`}>Métricas Físicas</span>
              
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                {['weight', 'waist', 'chest'].map((m) => (
                  <button key={m} onClick={() => setSelectedMetric(m)} className={`py-2.5 rounded-full font-bold uppercase tracking-widest transition-all border ${selectedMetric === m ? `${theme.primary} border-transparent` : `bg-transparent ${theme.muted} ${theme.border}`}`}>
                    {m === 'waist' ? 'Cintura' : m === 'weight' ? 'Peso' : 'Pecho'}
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

            {/* GRÁFICO ENTRENAMIENTO */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
                <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase`}>Cargas Entrenamiento</span>
                <span className={`text-[10px] ${theme.secondary} border ${theme.border} px-3 py-1 rounded-full font-bold tracking-widest`}>{analyticsData.gain}</span>
              </div>
              <select value={selectedAnalyticsEx} onChange={(e) => setSelectedAnalyticsEx(e.target.value)} className={`w-full bg-transparent border-b ${theme.border} py-3 text-sm font-bold outline-none`}>
                {Object.keys(EXERCISE_ANALYTICS).map(key => <option key={key} value={key} className={isDark ? "bg-black" : "bg-white"}>{EXERCISE_ANALYTICS[key].name}</option>)}
              </select>
              <div className={`h-32 ${theme.secondary} rounded-[2rem] border ${theme.border} p-4 flex items-end justify-between gap-3`}>
                {analyticsData.history.map((val, idx) => {
                  const maxVal = Math.max(...analyticsData.history, 1);
                  const heightPct = Math.max((val / maxVal) * 100, 5);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="h-full w-full flex items-end">
                        <div className={`w-full ${isDark ? 'bg-[#333]' : 'bg-gray-300'} group-hover:${isDark ? 'bg-white' : 'bg-black'} rounded-t-md transition-all duration-500`} style={{ height: `${heightPct}%` }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/80 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">{val}k</span>
                        </div>
                      </div>
                      <span className={`text-[8px] ${theme.muted} font-bold uppercase tracking-widest`}>S{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORMULARIO SEGUIMIENTO FISICO */}
            <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 space-y-6 ${theme.shadow} transition-colors duration-500`}>
              <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase border-b ${theme.border} pb-4`}>Registrar Medida</span>
              
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
              </div>
              
              <button onClick={handleSavePhysicalTracking} className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.secondary} border ${theme.border} mt-4`}>
                Guardar Día {selectedDay}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER BARRA INFERIOR FIJA */}
      <footer onClick={() => setShowHistoryModal(true)} className={`fixed bottom-0 left-0 right-0 ${theme.navBg} backdrop-blur-2xl border-t ${theme.border} px-6 py-5 z-30 cursor-pointer transition-colors duration-500`}>
        <div className="max-w-md mx-auto space-y-3">
          <div className={`flex justify-between items-center text-[10px] font-bold uppercase tracking-widest ${theme.muted}`}>
            <span>Línea temporal: <strong className={`${theme.text} ml-1`}>Día {realDay} / 60</strong></span>
            <span>Histórico</span>
          </div>
          <div className={`h-1.5 w-full ${isDark ? 'bg-[#222]' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} transition-all duration-1000`} style={{ width: `${(realDay/60)*100}%` }}></div>
          </div>
        </div>
      </footer>

      {/* ===================== MODALES ===================== */}
      
      {/* CÁMARA 9:16 */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-between p-6 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-sm flex justify-between items-center py-2">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">CÁMARA 9:16</span>
            <button onClick={stopCamera} className="text-gray-500 font-bold text-xl p-2 hover:text-white transition-colors">✕</button>
          </div>
          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border border-white/20 flex items-center justify-center my-auto shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 transition-opacity" style={{ opacity: overlayOpacity }}>
              <svg viewBox="0 0 100 200" className="w-full h-full stroke-white/80 fill-none" strokeWidth="1" strokeDasharray="2 1">
                <circle cx="50" cy="22" r="8" />
                <path d="M 40 38 L 60 38 M 42 75 L 58 75 M 45 95 L 55 95" />
                <line x1="20" y1="22" x2="80" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="20" y1="75" x2="80" y2="75" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-2 py-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Opacidad Guía:</span><span className="text-white">{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input type="range" min="0.1" max="1" step="0.1" value={overlayOpacity} onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))} className="w-full accent-white" />
          </div>
          <button onClick={capturePhoto} className="w-full max-w-sm py-4 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg mb-4">
            DISPARAR FOTO
          </button>
        </div>
      )}

      {/* COMPARADOR DE CAPAS */}
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

      {/* GALERÍA */}
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
                    <img src={photoUrl} className="w-16 h-24 object-cover rounded-2xl" />
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

      {/* MODAL MUNDOS (MARIO) */}
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

      {/* MODAL ESTUDIO ESTRATÉGICO IA */}
      {showStrategyModal && strategyReport && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-8 max-h-[85vh] overflow-y-auto shadow-2xl`}>
            <div className={`flex justify-between items-start border-b ${theme.border} pb-4`}>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold tracking-widest block uppercase mb-1`}>REPORTE IA</span>
                <h3 className="text-3xl font-black leading-tight">Análisis.</h3>
              </div>
              <button onClick={() => setShowStrategyModal(false)} className={`${theme.muted} font-bold text-2xl transition-colors`}>✕</button>
            </div>
            
            <p className={`text-sm ${theme.muted} font-medium leading-relaxed`}>"{strategyReport.summary}"</p>
            
            <div className={`space-y-6 border-t ${theme.border} pt-6`}>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-3`}>Puntos Fuertes</span>
                <ul className="space-y-2">{strategyReport.strengths.map((s, i) => <li key={i} className="text-sm font-medium flex gap-3"><span className={theme.muted}>•</span> {s}</li>)}</ul>
              </div>
              <div>
                <span className={`text-[10px] ${theme.muted} font-bold uppercase tracking-widest block mb-3`}>A Mejorar</span>
                <ul className="space-y-2">{strategyReport.weaknesses.map((w, i) => <li key={i} className={`text-sm ${theme.muted} font-medium flex gap-3`}><span>•</span> {w}</li>)}</ul>
              </div>
            </div>

            <div className={`${theme.secondary} border ${theme.border} rounded-[2rem] p-6 space-y-4`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest block border-b ${theme.border} pb-2`}>Ajuste Recomendado</span>
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

      {/* MODAL HISTORICO */}
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

      {/* MODAL SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl`}>
            <div className={`flex justify-between items-center border-b ${theme.border} pb-4`}>
              <h3 className="text-xl font-black">Ajustes</h3>
              <button onClick={() => setShowSettingsModal(false)} className={`${theme.muted} font-bold text-xl`}>✕</button>
            </div>
            <div className={`${theme.secondary} p-5 rounded-3xl border ${theme.border} space-y-3 text-xs`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2`}>PERFIL</span>
              <div className="flex justify-between"><span className={`${theme.muted} font-bold uppercase`}>Atleta:</span> <span className="font-bold">{userProfile.name}</span></div>
              <div className="flex justify-between"><span className={`${theme.muted} font-bold uppercase`}>Email:</span> <span className="font-bold">{userProfile.email}</span></div>
              <div className="flex justify-between"><span className={`${theme.muted} font-bold uppercase`}>Objetivo:</span> <span className="font-bold">{userProfile.objetivo || 'No definido'}</span></div>
            </div>
            <button onClick={() => { localStorage.removeItem('active_user_profile'); window.location.reload(); }} className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">CERRAR SESIÓN</button>
          </div>
        </div>
      )}

      {/* MODAL DE SUSCRIPCIÓN (PAYWALL) */}
      {showPaywallModal && !isPro && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-fadeIn backdrop-blur-xl">
          <div className={`${theme.card} border ${theme.border} rounded-[2.5rem] p-8 max-w-sm w-full space-y-8 shadow-2xl relative overflow-hidden`}>
            
            {/* Elemento de diseño de fondo */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className={`flex justify-between items-start pb-2 relative z-10`}>
              <div>
                <span className={`text-[10px] ${theme.primary} px-3 py-1 rounded-full font-bold tracking-widest block uppercase mb-3 inline-block`}>STUDIO PRO</span>
                <h3 className="text-3xl font-black leading-tight">Desbloquea<br/>tu potencial.</h3>
              </div>
              <button onClick={() => setShowPaywallModal(false)} className={`${theme.muted} font-bold text-2xl transition-colors`}>✕</button>
            </div>
            
            <p className={`text-sm ${theme.muted} font-medium leading-relaxed relative z-10`}>
              Has agotado tus 10 tokens gratuitos de hoy. Únete a PRO para escanear comidas ilimitadas y generar recetas sin frenos.
            </p>
            
            <div className={`space-y-4 relative z-10`}>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-green-500 text-lg">✓</span> Escaneo de IA ilimitado
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-green-500 text-lg">✓</span> Recetas del Chef IA ilimitadas
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-green-500 text-lg">✓</span> Análisis estratégico avanzado
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-green-500 text-lg">✓</span> Soporte prioritario
              </div>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-end justify-center gap-1 mb-6">
                <span className="text-4xl font-black">9.99€</span>
                <span className={`text-xs ${theme.muted} font-bold uppercase tracking-widest pb-1`}>/ mes</span>
              </div>

              {/* Botón de Pago (Simulación de éxito) */}
              <button 
                onClick={() => {
                  setIsPro(true);
                  localStorage.setItem(`${userKey}_is_pro`, 'true');
                  setShowPaywallModal(false);
                  alert('¡Pago simulado con éxito! Ahora eres usuario PRO.');
                }} 
                className={`w-full py-5 ${theme.primary} font-black uppercase tracking-widest rounded-[2rem] text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform`}
              >
                Suscribirse Ahora
              </button>
              
              <button onClick={() => setShowPaywallModal(false)} className={`w-full py-4 bg-transparent ${theme.muted} font-bold uppercase tracking-widest rounded-full text-[10px]`}>
                Quizás más tarde
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}