'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, CheckCircle2, User, Mail, Building, Briefcase, Globe, Phone } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ywtdjwkxgvtntaicksbk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dGRqd2t4Z3Z0bnRhaWNrc2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjIyNjYsImV4cCI6MjA2NTQzODI2Nn0.OlBckntHtKRGgVAaSpmUtrpxUm3wCMefqftXJd0j-kY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CPSAssessment = () => {
  const [currentStep, setCurrentStep] = useState('register');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const questions = [
    { id: 1, options: [
        { text: "Alerta", tooltip: "Estar atento y vigilante ante los detalles del problema", dimension: "Experiencia" },
        { text: "Equilibrado", tooltip: "Mantener estabilidad entre diferentes perspectivas", dimension: "Ideación" },
        { text: "Listo", tooltip: "Preparado mentalmente para abordar desafíos", dimension: "Pensamiento" },
        { text: "Ansioso", tooltip: "Sentir urgencia por resolver el problema rápidamente", dimension: "Evaluación" }
      ]
    },
    { id: 2, options: [
        { text: "Paciente", tooltip: "Tomarse el tiempo necesario para entender completamente", dimension: "Experiencia" },
        { text: "Diligente", tooltip: "Trabajar con cuidado y persistencia en los detalles", dimension: "Ideación" },
        { text: "Contundente", tooltip: "Ser claro y directo en las conclusiones", dimension: "Pensamiento" },
        { text: "Preparado", tooltip: "Tener todo listo antes de actuar", dimension: "Evaluación" }
      ]
    },
    { id: 3, options: [
        { text: "Activo", tooltip: "Preferir la acción directa y la experimentación", dimension: "Experiencia" },
        { text: "Ingenuo", tooltip: "Abordar problemas con mente abierta y sin prejuicios", dimension: "Ideación" },
        { text: "Observador", tooltip: "Analizar cuidadosamente antes de actuar", dimension: "Pensamiento" },
        { text: "Realista", tooltip: "Enfocarse en lo que es práctico y alcanzable", dimension: "Evaluación" }
      ]
    },
    { id: 4, options: [
        { text: "Experimental", tooltip: "Probar diferentes enfoques para ver qué funciona", dimension: "Experiencia" },
        { text: "Diverso", tooltip: "Explorar múltiples alternativas y posibilidades", dimension: "Ideación" },
        { text: "Reflexivo", tooltip: "Tomarse tiempo para reflexionar antes de decidir", dimension: "Pensamiento" },
        { text: "Organizador", tooltip: "Organizar y estructurar la información disponible", dimension: "Evaluación" }
      ]
    },
    { id: 5, options: [
        { text: "Reservado", tooltip: "Preferir trabajar de manera reflexiva y privada", dimension: "Experiencia" },
        { text: "Serio", tooltip: "Abordar problemas con formalidad y rigor", dimension: "Ideación" },
        { text: "Gozador", tooltip: "Disfrutar del proceso de resolver problemas", dimension: "Pensamiento" },
        { text: "Juguetón", tooltip: "Usar creatividad y humor en la resolución", dimension: "Evaluación" }
      ]
    },
    { id: 6, options: [
        { text: "Práctico", tooltip: "Aprender probando diferentes soluciones", dimension: "Experiencia" },
        { text: "Creativo", tooltip: "Generar múltiples opciones antes de elegir", dimension: "Ideación" },
        { text: "Analítico", tooltip: "Evaluar cuidadosamente pros y contras", dimension: "Pensamiento" },
        { text: "Evaluador", tooltip: "Juzgar sistemáticamente las opciones disponibles", dimension: "Evaluación" }
      ]
    },
    { id: 7, options: [
        { text: "Resolutivo", tooltip: "Poner en práctica las soluciones rápidamente", dimension: "Experiencia" },
        { text: "Divergente", tooltip: "Expandir las posibilidades y pensar 'fuera de la caja'", dimension: "Ideación" },
        { text: "Abstracto", tooltip: "Encontrar patrones y conceptos generales", dimension: "Pensamiento" },
        { text: "Convergente", tooltip: "Enfocar las ideas hacia una solución específica", dimension: "Evaluación" }
      ]
    },
    { id: 8, options: [
        { text: "Directo", tooltip: "Ir al grano sin rodeos innecesarios", dimension: "Experiencia" },
        { text: "Posibilidades", tooltip: "Explorar todo el potencial de las situaciones", dimension: "Ideación" },
        { text: "Conceptual", tooltip: "Trabajar con ideas y teorías abstractas", dimension: "Pensamiento" },
        { text: "Realidades", tooltip: "Mantenerse conectado con hechos concretos", dimension: "Evaluación" }
      ]
    },
    { id: 9, options: [
        { text: "Involucrado", tooltip: "Participar activamente en el proceso", dimension: "Experiencia" },
        { text: "Cambiar Perspectivas", tooltip: "Ver el problema desde diferentes ángulos", dimension: "Ideación" },
        { text: "Teórico", tooltip: "Aplicar marcos conceptuales y modelos", dimension: "Pensamiento" },
        { text: "Enfocado", tooltip: "Concentrarse intensamente en objetivos específicos", dimension: "Evaluación" }
      ]
    },
    { id: 10, options: [
        { text: "Silencioso", tooltip: "Reflexionar internamente antes de compartir", dimension: "Experiencia" },
        { text: "Confiable", tooltip: "Ser consistente y digno de confianza", dimension: "Ideación" },
        { text: "Responsable", tooltip: "Asumir el deber de encontrar soluciones", dimension: "Pensamiento" },
        { text: "Imaginativo", tooltip: "Usar creatividad para generar ideas originales", dimension: "Evaluación" }
      ]
    },
    { id: 11, options: [
        { text: "Implementador", tooltip: "Llevar las ideas a la práctica efectivamente", dimension: "Experiencia" },
        { text: "Visionario", tooltip: "Imaginar claramente las soluciones futuras", dimension: "Ideación" },
        { text: "Descriptivo", tooltip: "Explicar detalladamente los problemas y soluciones", dimension: "Pensamiento" },
        { text: "Selectivo", tooltip: "Elegir las mejores opciones disponibles", dimension: "Evaluación" }
      ]
    },
    { id: 12, options: [
        { text: "Ejecutivo", tooltip: "Realizar las acciones necesarias eficientemente", dimension: "Experiencia" },
        { text: "Futurista", tooltip: "Pensar en implicaciones y consecuencias a largo plazo", dimension: "Ideación" },
        { text: "Racional", tooltip: "Usar lógica y razonamiento sistemático", dimension: "Pensamiento" },
        { text: "Detallista", tooltip: "Prestar atención a aspectos específicos y minuciosos", dimension: "Evaluación" }
      ]
    }
  ];

  const countries = [
    'México', 'Estados Unidos', 'España', 'Colombia', 'Argentina', 'Chile', 'Perú', 'Venezuela', 
    'Ecuador', 'Guatemala', 'Uruguay', 'Bolivia', 'Paraguay', 'Honduras', 'El Salvador', 
    'Nicaragua', 'Costa Rica', 'Panamá', 'República Dominicana', 'Cuba', 'Puerto Rico', 'Otro'
  ];

  const profileDescriptions = {
    'Generador': {
      title: 'Generador (Concreto + Activo)',
      characteristics: ['Orientado a la acción y la experiencia directa', 'Aprende haciendo y experimentando', 'Busca oportunidades y nuevas experiencias', 'Prefiere la variedad y el cambio'],
      strengths: ['Excelente para iniciar proyectos', 'Detecta oportunidades que otros no ven', 'Actúa rápidamente ante los problemas', 'Aporta energía y entusiasmo'],
      tips: ['Canaliza tu energía hacia objetivos específicos', 'Busca feedback constante para ajustar tu rumbo', 'Colabora con tipos más reflexivos para equilibrar tu impulsividad', 'Documenta tus experiencias para aprender de ellas']
    },
    'Conceptualizador': {
      title: 'Conceptualizador (Abstracto + Reflexivo)',
      characteristics: ['Piensa en términos teóricos y conceptuales', 'Analiza patrones y relaciones complejas', 'Prefiere la reflexión profunda', 'Busca entender el "por qué" de las cosas'],
      strengths: ['Desarrolla marcos teóricos sólidos', 'Identifica patrones ocultos', 'Aporta perspectiva estratégica', 'Excelente para análisis profundo'],
      tips: ['Traduce tus ideas abstractas en términos prácticos', 'Busca datos concretos para validar tus teorías', 'Colabora con tipos más activos para implementar tus ideas', 'Establece plazos para evitar el "análisis paralítico"']
    },
    'Optimizador': {
      title: 'Optimizador (Abstracto + Activo)',
      characteristics: ['Enfocado en mejorar y perfeccionar', 'Busca eficiencia y resultados', 'Orientado a objetivos y resultados', 'Prefiere soluciones probadas y efectivas'],
      strengths: ['Excelente para implementar soluciones', 'Optimiza procesos y sistemas', 'Logra resultados consistentes', 'Aporta disciplina y estructura'],
      tips: ['Mantente abierto a enfoques innovadores', 'No te limites solo a soluciones conocidas', 'Balancea la eficiencia con la creatividad', 'Involucra a otros tipos para generar nuevas ideas']
    },
    'Implementador': {
      title: 'Implementador (Concreto + Reflexivo)',
      characteristics: ['Enfocado en la aplicación práctica', 'Evalúa cuidadosamente antes de actuar', 'Busca soluciones factibles y realistas', 'Prefiere la planificación detallada'],
      strengths: ['Excelente para ejecutar planes', 'Evalúa riesgos cuidadosamente', 'Aporta estabilidad y confiabilidad', 'Asegura que las ideas sean viables'],
      tips: ['No te paralices en la planificación excesiva', 'Acepta que no toda la información estará disponible', 'Colabora con generadores para acelerar el proceso', 'Experimenta con pequeños prototipos antes de la implementación completa']
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const isRegistrationComplete = () => {
    const required = ['nombre', 'email', 'empresa', 'cargo', 'pais', 'telefono'];
    const hasAllFields = required.every(field => userData[field] && userData[field].trim() !== '');
    const validEmail = isValidEmail(userData.email || '');
    const validPhone = isValidPhone(userData.telefono || '');
    return hasAllFields && validEmail && validPhone;
  };

  const startAssessment = async () => {
    if (!isRegistrationComplete()) return;
    setIsLoading(true);
    try {
      const userToSave = {
        nombre: userData.nombre.trim(),
        email: userData.email.trim().toLowerCase(),
        telefono: userData.telefono.trim(),
        empresa: userData.empresa.trim(),
        cargo: userData.cargo.trim(),
        pais: userData.pais,
        newsletter: userData.newsletter || false
      };
      const { data, error } = await supabase.from('usuarios').insert([userToSave]).select();
      if (error) throw error;
      setUserId(data[0].id);
      setCurrentStep('assessment');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(`Error al guardar datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (optionIndex, rating) => {
    const questionId = questions[currentQuestion].id;
    setResponses(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], [optionIndex]: rating }
    }));
  };

  const getCurrentQuestionRatings = () => {
    const questionId = questions[currentQuestion].id;
    return responses[questionId] || {};
  };

  const isQuestionComplete = () => {
    const ratings = getCurrentQuestionRatings();
    const values = Object.values(ratings);
    return values.length === 4 && new Set(values).size === 4 && values.every(v => v >= 1 && v <= 4);
  };

  const canGoNext = () => isQuestionComplete();

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (canGoNext()) {
      calculateResults();
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    const totals = { Experiencia: 0, Ideación: 0, Pensamiento: 0, Evaluación: 0 };
    questions.forEach(question => {
      const questionResponses = responses[question.id] || {};
      question.options.forEach((option, index) => {
        const rating = questionResponses[index] || 0;
        totals[option.dimension] += rating;
      });
    });

    const cuadrantes = {
      'Generador': totals.Experiencia + totals.Ideación,
      'Conceptualizador': totals.Ideación + totals.Pensamiento,
      'Optimizador': totals.Pensamiento + totals.Evaluación,
      'Implementador': totals.Evaluación + totals.Experiencia
    };

    const porcentajes = {};
    Object.keys(cuadrantes).forEach(cuadrante => {
      porcentajes[cuadrante] = ((cuadrantes[cuadrante] / 120) / 2) * 100;
    });

    const dominantStyle = Object.keys(porcentajes).find(
      key => porcentajes[key] === Math.max(...Object.values(porcentajes))
    );

    setIsLoading(true);
    try {
      const evaluationToSave = {
        usuario_id: userId,
        respuestas: responses,
        experiencia: totals.Experiencia,
        ideacion: totals.Ideación,
        pensamiento: totals.Pensamiento,
        evaluacion: totals.Evaluación,
        generador_pct: porcentajes.Generador,
        conceptualizador_pct: porcentajes.Conceptualizador,
        optimizador_pct: porcentajes.Optimizador,
        implementador_pct: porcentajes.Implementador,
        estilo_dominante: dominantStyle
      };
      const { data, error } = await supabase.from('evaluaciones').insert([evaluationToSave]).select();
      if (error) throw error;
      setShowResults({ totals, cuadrantes, porcentajes });
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      setShowResults({ totals, cuadrantes, porcentajes });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = async () => {
    const element = document.getElementById('results-container');
    if (element) {
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(element, {
          backgroundColor: '#1a1a1a',
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        const link = document.createElement('a');
        link.download = `perfil-innovador-${userData.nombre.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error al generar la imagen:', error);
        alert('Error al generar la imagen. Inténtalo de nuevo.');
      }
    }
  };

  const resetAssessment = () => {
    setCurrentStep('register');
    setCurrentQuestion(0);
    setResponses({});
    setUserData({});
    setUserId(null);
    setShowResults(false);
  };

  const SpiderChart = ({ data }) => {
    const size = 364;
    const center = size / 2;
    const maxRadius = 130;
    const levels = 5;
    const dataArray = Object.entries(data);
    const maxValue = Math.max(...Object.values(data));
    const angleStep = (2 * Math.PI) / 4;
    
    const polarToCartesian = (angle, radius) => {
      const x = center + radius * Math.cos(angle - Math.PI / 2);
      const y = center + radius * Math.sin(angle - Math.PI / 2);
      return { x, y };
    };
    
    const dataPoints = dataArray.map(([key, value], index) => {
      const angle = index * angleStep;
      const radius = (value / maxValue) * maxRadius;
      return polarToCartesian(angle, radius);
    });
    
    const axisLines = dataArray.map((_, index) => {
      const angle = index * angleStep;
      const end = polarToCartesian(angle, maxRadius);
      return `M ${center} ${center} L ${end.x} ${end.y}`;
    });
    
    const concentricCircles = Array.from({ length: levels }, (_, i) => {
      const radius = ((i + 1) / levels) * maxRadius;
      return radius;
    });
    
    const dataPath = dataPoints.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="overflow-visible">
            {concentricCircles.map((radius, index) => (
              <circle key={index} cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            ))}
            {axisLines.map((line, index) => (
              <path key={index} d={line} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            ))}
            <path d={dataPath} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" className="drop-shadow-lg" />
            {dataPoints.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r="4" fill="white" className="drop-shadow-md" />
            ))}
            {dataArray.map(([key, value], index) => {
              const angle = index * angleStep;
              const labelPosition = polarToCartesian(angle, maxRadius + 50);
              return (
                <g key={key}>
                  <text x={labelPosition.x} y={labelPosition.y} textAnchor="middle" dominantBaseline="middle" className="fill-white text-sm font-light" style={{ fontSize: '14px' }}>
                    {key}
                  </text>
                  <text x={labelPosition.x} y={labelPosition.y + 16} textAnchor="middle" dominantBaseline="middle" className="fill-white/70 text-xs font-light" style={{ fontSize: '12px' }}>
                    {value.toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
          {dataArray.map(([key, value], index) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div>
                <div className="text-white/90 text-sm font-light">{key}</div>
                <div className="text-white/60 text-xs">{value.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (showResults) {
    const maxPercentage = Math.max(...Object.values(showResults.porcentajes));
    const dominantStyle = Object.keys(showResults.porcentajes).find(
      key => showResults.porcentajes[key] === maxPercentage
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div id="results-container" className="max-w-4xl w-full bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Evaluación completada</h1>
            <p className="text-gray-400">Tu perfil innovador</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1">
              <SpiderChart data={showResults.porcentajes} />
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Perfil detallado</h2>
              
              {Object.entries(showResults.porcentajes).map(([cuadrante, porcentaje]) => (
                <div key={cuadrante} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-white font-medium">
                        {cuadrante}
                        {cuadrante === dominantStyle && <span className="ml-2">⭐</span>}
                      </span>
                    </div>
                    <span className="text-white font-bold">{porcentaje.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="mt-8 bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Estilo dominante</h3>
                <div className="text-2xl font-bold text-purple-400 mb-2">{dominantStyle}</div>
                <div className="text-gray-300 text-sm">
                  {(maxPercentage).toFixed(1)}% de preferencia hacia este perfil innovador
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="border-l-4 border-purple-400 pl-4">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      {profileDescriptions[dominantStyle]?.title}
                    </h4>
                    
                    <div className="mb-4">
                      <h5 className="text-purple-300 font-medium mb-2">Características:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {profileDescriptions[dominantStyle]?.characteristics.map((char, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-green-300 font-medium mb-2">Fortalezas:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {profileDescriptions[dominantStyle]?.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-yellow-300 font-medium mb-2">Consejos:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {profileDescriptions[dominantStyle]?.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadResults}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar mis resultados
            </button>
            <button
              onClick={resetAssessment}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Realizar nueva evaluación
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'register') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 border
// AGREGAR ESTO AL FINAL DE TU ARCHIVO DESPUÉS DE LA LÍNEA QUE TERMINA CON "border"

 border-white/5 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-white/5 rotate-45"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 border border-white/5 rotate-12"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto p-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-thin text-white mb-4 tracking-wide">Perfil innovador</h1>
              <p className="text-white/70 text-lg font-light">Descubre tu estilo único de resolución de problemas</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-light mb-2">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={userData.nombre || ''}
                    onChange={(e) => handleUserDataChange('nombre', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-light mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={userData.email || ''}
                    onChange={(e) => handleUserDataChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 backdrop-blur-sm bg-white/5 border rounded-2xl text-white placeholder-white/40 focus:outline-none transition-colors ${
                      userData.email && !isValidEmail(userData.email) 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'border-white/20 focus:border-white/40'
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {userData.email && !isValidEmail(userData.email) && (
                  <p className="text-red-400 text-xs mt-1">Por favor ingresa un email válido</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-light mb-2">Teléfono móvil *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    value={userData.telefono || ''}
                    onChange={(e) => handleUserDataChange('telefono', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 backdrop-blur-sm bg-white/5 border rounded-2xl text-white placeholder-white/40 focus:outline-none transition-colors ${
                      userData.telefono && !isValidPhone(userData.telefono) 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'border-white/20 focus:border-white/40'
                    }`}
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                {userData.telefono && !isValidPhone(userData.telefono) && (
                  <p className="text-red-400 text-xs mt-1">Por favor ingresa un teléfono válido (8-15 dígitos)</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-light mb-2">Empresa/Organización *</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={userData.empresa || ''}
                    onChange={(e) => handleUserDataChange('empresa', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-light mb-2">Cargo/Puesto *</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={userData.cargo || ''}
                    onChange={(e) => handleUserDataChange('cargo', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="Tu puesto actual"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-light mb-2">País *</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <select
                    value={userData.pais || ''}
                    onChange={(e) => handleUserDataChange('pais', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white focus:border-white/40 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black">Selecciona tu país</option>
                    {countries.map(country => (
                      <option key={country} value={country} className="bg-black">{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={userData.newsletter || false}
                    onChange={(e) => handleUserDataChange('newsletter', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-white/20"
                  />
                  <div className="flex-1">
                    <label htmlFor="newsletter" className="text-white/90 font-light cursor-pointer">
                      Sí, quiero suscribirme a <strong className="font-normal">#Cápsula</strong>
                    </label>
                    <p className="text-white/60 text-sm mt-1 font-light">
                      Nuestro newsletter quincenal con la mejor curaduría de temas alrededor de creatividad, innovación, diseño, negocios y futuros.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={startAssessment}
                disabled={!isRegistrationComplete() || isLoading}
                className="px-12 py-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light text-lg tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-xl"
              >
                {isLoading ? 'Guardando...' : 'Comenzar evaluación'}
              </button>
              <p className="text-white/50 text-xs mt-4 font-light">
                * Campos obligatorios
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/5 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/5 rotate-45"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 border border-white/5 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 border border-white/5 rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-thin text-white tracking-wide">Perfil innovador</h1>
              <span className="text-white/60 font-light tracking-wide">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-gradient-to-r from-white to-white/70 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-8">
              <p className="text-white/90 text-lg leading-relaxed font-light">
                Responde honestamente el adjetivo que describa mejor a cómo reaccionas a la hora de resolver problemas. 
                Por cada fila debes enumerar del <strong className="font-normal text-white">1 al 4</strong>, siendo 
                <strong className="font-normal text-white"> 4 el mayor puntaje</strong> y 
                <strong className="font-normal text-white"> 1 el menor</strong>. 
                Cada número solo se puede usar una vez por fila.
              </p>
              <p className="text-white/70 text-base mt-4 font-light flex items-center gap-2">
                <Info className="w-4 h-4" />
                Si tienes dudas sobre el significado de algún concepto, pasa el mouse sobre el símbolo de información.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-thin text-white mb-8 tracking-wide">
              Pregunta {questions[currentQuestion].id}
            </h2>

            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="group relative">
                <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-light text-white tracking-wide">{option.text}</span>
                      <button
                        onMouseEnter={() => setHoveredTooltip(`${currentQuestion}-${index}`)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors duration-200"
                      >
                        <Info className="w-3 h-3 text-white/60" />
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      {[1, 2, 3, 4].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(index, rating)}
                          className={`w-12 h-12 rounded-xl border font-light text-lg tracking-wide transition-all duration-200 ${
                            getCurrentQuestionRatings()[index] === rating
                              ? 'bg-white text-black border-white shadow-lg transform scale-105'
                              : 'border-white/30 hover:border-white/50 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {hoveredTooltip === `${currentQuestion}-${index}` && (
                  <div className="absolute left-0 top-full mt-2 z-20 backdrop-blur-xl bg-black/80 border border-white/20 rounded-xl px-4 py-3 max-w-xs shadow-2xl">
                    <p className="text-white/90 text-sm font-light">{option.tooltip}</p>
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-black/80 border-l border-t border-white/20 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}

            {!isQuestionComplete() && (
              <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-6">
                <p className="text-white/80 font-light">
                  💡 Recuerda: Debes usar cada número (1, 2, 3, 4) exactamente una vez en esta pregunta.
                </p>
              </div>
            )}
          </div>

          <div className={`flex mt-12 ${currentQuestion === 0 ? 'justify-end' : 'justify-between'}`}>
            {currentQuestion > 0 && (
              <button
                onClick={goBack}
                className="flex items-center gap-3 px-8 py-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-2xl text-white/80 hover:text-white transition-all duration-200 font-light tracking-wide"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>
            )}

            <button
              onClick={goNext}
              disabled={!canGoNext() || isLoading}
              className="flex items-center gap-3 px-12 py-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-xl"
            >
              {isLoading ? 'Guardando...' : currentQuestion === questions.length - 1 ? 'Ver resultados' : 'Siguiente'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPSAssessment;
